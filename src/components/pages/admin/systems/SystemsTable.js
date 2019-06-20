import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { fetchSystemsCall } from '../../../../api/Systems';
import { fetchProductionUnit } from '../../../../api/ProductionUnits';
import axios from 'axios';
import update from 'react-addons-update';

const CancelToken = axios.CancelToken;

class SystemsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = ({
      data: [],
      pages: null,
      loading: true,
      currentSystem: null
    })
    this.source = CancelToken.source();
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillUnmount() {
    this.source.cancel()
  }

  requestData(pageSize, page) {
    return fetchSystemsCall(this.props.projectId, this.source.token, pageSize * page, pageSize)
      .then(payload => {
        this.setState({
          total: payload.data.total
        })
        return {
          rows: payload.data._embedded.items,
          pages: Math.ceil(payload.data.total / pageSize)
        };
      })
  }

  fetchData(state, instance) {
    this.setState({ loading: true });

    this.requestData(
      state.pageSize,
      state.page
    ).then(res => {
      this.setState({
        data: res.rows,
        pages: res.pages,
        loading: false
      })
      return res
    }).then(res => {
      res.rows.forEach(row => {
        row["productionUnitName"] = ""
      })
      res.rows.forEach((row, i) => {
        if (row.productionUnitId) {
          fetchProductionUnit(this.props.projectId, row.productionUnitId, this.source.token).then(
            productionUnit => {
              this.setState({
                data: update(this.state.data, { [i]: { productionUnitName: { $set: productionUnit.data.name } } })
              })
            }
          ).catch(e => // cancelled promises
            console.error('Axios Request Cancelled', e)
          )
        }
      })
    }).catch(e =>
      console.error('Axios Request Cancelled', e)
    ) // cancelled promises
  }

  render() {
    return (
      <div className="margin-top-left">
        <div className="table">
          <ReactTable
            columns={[
              {
                columns: [
                  {
                    Header: "Name",
                    accessor: "name"
                  },
                  {
                    Header: "Detail",
                    accessor: "detail"
                  },
                  {
                    Header: "Status",
                    accessor: "status"
                  },
                  {
                    Header: "Production Unit",
                    accessor: "productionUnitName"
                  }
                ]
              }
            ]}
            getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: (e, handleOriginal) => {
                  if (!rowInfo) return;
                  this.props.selectSystem(rowInfo.original);
                  this.setState({
                    currentSystem: rowInfo.original
                  })

                  // IMPORTANT! React-Table uses onClick internally to trigger
                  // events like expanding SubComponents and pivots.
                  // By default a custom 'onClick' handler will override this functionality.
                  // If you want to fire the original onClick handler, call the
                  // 'handleOriginal' function.
                  if (handleOriginal) {
                    handleOriginal();
                  }
                }
              }
            }}
            getTrGroupProps={(state, rowInfo, column, instance) => {
              let isSelected = rowInfo && (rowInfo.row._original.id === (this.state.currentSystem && this.state.currentSystem.id));
              return {
                style: {
                  background: isSelected ? "#44D1B2" : "",
                  color: isSelected ? "#fff" : ""
                }
              }
            }}
            manual
            data={this.state.data}
            pages={this.state.pages}
            loading={this.state.loading}
            onFetchData={this.fetchData}
            pageSizeOptions={[5, 15, 25, 50]}
            defaultPageSize={15}
            sortable={false}
            className="-striped -highlight"
          />
          <br />
        </div>
        <h4 className="subtitle is-4">{'Total Systems: ' + this.state.total}</h4>
      </div>
    );
  }
}

export default SystemsTable;