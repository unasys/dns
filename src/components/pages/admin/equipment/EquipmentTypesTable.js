import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from 'axios';
import update from 'react-addons-update';
import { fetchDiscipline } from "../../../../api/Disciplines";
import { fetchEquipmentTypes } from "../../../../api/EquipmentTypes";

const CancelToken = axios.CancelToken;

class EquipmentTypesTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = ({
      data: [],
      pages: null,
      loading: true,
      currentEquipmentType: null
    })
    this.source = CancelToken.source();
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillUnmount() {
    this.source.cancel()
  }

  requestData(pageSize, page) {
    return fetchEquipmentTypes(this.props.projectId, this.source.token, pageSize * page, pageSize)
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
      return res;
    }).then(res => {
      res.rows.forEach(row => {
        row["disciplineName"] = ""
      })
      res.rows.forEach((row, i) => {
        if (row.disciplineId) {
          fetchDiscipline(this.props.projectId, row.disciplineId, this.source.token).then(
            discipline => {
              this.setState({
                data: update(this.state.data, { [i]: { disciplineName: { $set: discipline.data.name } } })
              })
            }
          ).catch(e => // cancelled promises
            console.error('Axios Request Cancelled', e)
          )
        }
      })
    }
    )
  }

  render() {
    return (
      <div className="margin-top-left" >
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
                    Header: "Discipline",
                    accessor: "disciplineName"
                  }
                ]
              }
            ]}
            getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: (e, handleOriginal) => {
                  this.props.selectEquipmentType(rowInfo.original);
                  this.setState({
                    currentEquipmentType: rowInfo.original
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
              let isSelected = rowInfo && (rowInfo.row._original.id === (this.state.currentEquipmentType && this.state.currentEquipmentType.id));
              return {
                style: {
                  background: isSelected ? "#44D1B2" : "",
                  color: isSelected ? "#fff" : ""
                }
              }
            }}
            manual
            minRows={5}
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
        <h4 className="subtitle is-4">{'Total Equipment Types: ' + this.state.total}</h4>
      </div>
    );
  }
}

export default EquipmentTypesTable;