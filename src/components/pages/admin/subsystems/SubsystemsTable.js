import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { fetchSubsystemsCall } from '../../../../api/Subsystems';
import axios from 'axios';
import { fetchSystemCall } from "../../../../api/Systems";
import { fetchSubsystemsBySystemCall } from "../../../../api/Subsystems";
import update from 'react-addons-update';

const CancelToken = axios.CancelToken;
const initialPageSize = 15;

class SubsystemsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = ({
      data: [],
      pages: -1,
      loading: true,
      page: 0,
      pageSize: initialPageSize,
      currentSubsystem: null
    })
    this.source = CancelToken.source();
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillUnmount() {
    this.source.cancel()
    this.source = axios.CancelToken.source()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.systemFilter !== this.props.systemFilter) {
      this.setState({
        page: 0
      })
      this.fetchData(this.state);
    }
  }

  requestData(pageSize, page) {
    let promise;
    if (this.props.systemFilter !== null) {
      promise = fetchSubsystemsBySystemCall(this.props.projectId, this.props.systemFilter.id, this.source.token, pageSize * page, pageSize)
    } else {
      promise = fetchSubsystemsCall(this.props.projectId, this.source.token, pageSize * page, pageSize)
    }
    return promise
      .then(payload => {
        this.setState({
          total: payload.data.total
        })
        return {
          rows: payload.data._embedded.items,
          pages: Math.ceil(payload.data.total / pageSize)
        };
      }).catch(e => console.error('Axios Request Cancelled in request data', e))
  }

  fetchData(state) {
    this.source.cancel()
    this.source = axios.CancelToken.source()
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
        row["systemDetail"] = ""
        row["systemName"] = ""
      })
      res.rows.forEach((row, i) => {
        if (row.systemId) {
          fetchSystemCall(this.props.projectId, row.systemId, this.source.token).then(
            system => {
              this.setState({
                data: update(this.state.data, { [i]: { systemDetail: { $set: system.data.name + ' (' + system.data.detail + ')' }, systemName: { $set: system.data.name } } })
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
                    Header: 'System',
                    accessor: "systemDetail",
                  }
                ]
              }
            ]}
            getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: (e, handleOriginal) => {
                  this.props.selectSubsystem(rowInfo.original);
                  this.setState({
                    currentSubsystem: rowInfo.original
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
              let isSelected = rowInfo && (rowInfo.row._original.id === (this.state.currentSubsystem && this.state.currentSubsystem.id));
              return {
                style: {
                  background: isSelected ? "#44D1B2" : "",
                  color: isSelected ? "#fff" : ""
                }
              }
            }}
            data={this.state.data}
            pages={this.state.pages}
            page={this.state.page}
            loading={this.state.loading}
            onFetchData={this.fetchData}
            manual
            onPageSizeChange={(pageSize, pageIndex) => {
              this.setState({
                pageSize: pageSize,
                page: 0  // Resetting the current page to 0 every time the page size is changed, due to an overflow bug if set to pageIndex.
              })
            }}
            onPageChange={(pageIndex) => this.setState({
              page: pageIndex
            })}
            pageSizeOptions={[5, 15, 25, 50]}
            defaultPageSize={initialPageSize}
            sortable={false}
            className="-striped -highlight"
          />
          <br />
        </div>
        <h4 className="subtitle is-4">{'Total Subsystems: ' + this.state.total}</h4>
      </div>
    );
  }
}

export default SubsystemsTable;