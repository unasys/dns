import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from 'axios';
import { fetchTags } from "../../../../api/Tags";
import { fetchSubsystemCall } from "../../../../api/Subsystems";
import update from 'react-addons-update';
import { fetchEquipmentTypeCall } from "../../../../api/EquipmentTypes";

const CancelToken = axios.CancelToken;

class TagsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = ({
      data: [],
      pages: null,
      loading: true,
      currentTag: null
    })
    this.source = CancelToken.source();
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillUnmount() {
    this.source.cancel()
  }

  requestData(pageSize, page) {
    return fetchTags(this.props.projectId, this.source.token, pageSize * page, pageSize)
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
        row["subsystemName"] = ""
        row["equipmentTypeName"] = ""
      })
      res.rows.forEach((row, i) => {
        if (row.subsystemId) {
          fetchSubsystemCall(this.props.projectId, row.subsystemId, this.source.token).then(
            subsystem => {
              this.setState({
                data: update(this.state.data, { [i]: { subsystemName: { $set: subsystem.data.name + ' - ' + subsystem.data.detail } } })
              })
            }
          ).catch(e => // cancelled promises
            console.error('Axios Request Cancelled', e)
          )
        }
        if (row.equipmentTypeId) {
          fetchEquipmentTypeCall(this.props.projectId, row.equipmentTypeId, this.source.token).then(
            equipmentType => {
              this.setState({
                data: update(this.state.data, { [i]: { equipmentTypeName: { $set: equipmentType.data.name } } })
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
                    Header: "Detail",
                    accessor: "detail"
                  },
                  {
                    Header: "Subsystem",
                    accessor: "subsystemName"
                  },
                  {
                    Header: "Risk",
                    id: "risk",
                    accessor: t => <span className={("tag Tag" + t.risk)}>{t.risk}</span>

                  },
                  {
                    Header: "Status",
                    accessor: "status"
                  },
                  {
                    Header: "Condition",
                    id: "condition",
                    accessor: t => t.condition ? <span className={("tag Tag" + t.condition)}>{t.condition}</span> : <span></span>
                  },
                  {
                    Header: "Criticality",
                    accessor: "criticality"
                  },
                  {
                    Header: "EquipmentType",
                    accessor: "equipmentTypeName",
                  }
                ]
              }
            ]}
            getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: (e, handleOriginal) => {
                  this.props.selectTag(rowInfo.original);
                  this.setState({
                    currentTag: rowInfo.original
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
              let isSelected = rowInfo && (rowInfo.row._original.id === (this.state.currentTag && this.state.currentTag.id));
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
        <h4 className="subtitle is-4">{'Total Tags: ' + this.state.total}</h4>
      </div>
    );
  }
}

export default TagsTable;