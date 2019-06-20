import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { fetchDocumentsCall } from '../../../../api/Documents';
import axios from 'axios';
import { fetchDocumentType } from "../../../../api/DocumentTypes";
import update from 'react-addons-update';

const CancelToken = axios.CancelToken;

class DocumentsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = ({
      data: [],
      pages: null,
      loading: true,
      currentDocument: null
    })
    this.source = CancelToken.source();
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillUnmount() {
    this.source.cancel()
  }

  requestData(pageSize, page) {
    return fetchDocumentsCall(this.props.projectId, this.source.token, null, pageSize * page, pageSize)
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
        row["documentTypeName"] = ""
      })
      res.rows.forEach((row, i) => {
        if (row.documentTypeId) {
          fetchDocumentType(this.props.projectId, row.documentTypeId, this.source.token).then(
            documentType => {
              this.setState({
                data: update(this.state.data, { [i]: { documentTypeName: { $set: documentType.data.name } } })
              })
            }
          ).catch(e => // cancelled promises
            console.error('Axios Request Cancelled', e)
          )
        }
      })
    })
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
                    Header: "FileName",
                    accessor: "name"
                  },
                  {
                    Header: "Detail",
                    accessor: "detail"
                  },
                  {
                    Header: "Labels",
                    id: "labels",
                    accessor: d => {
                      return JSON.stringify(d.labels)
                    }
                  },
                  {
                    Header: "Current Revision",
                    accessor: "currentRevision.revision"
                  },
                  {
                    Header: "Uploaded On",
                    id: "Uploaded On",
                    accessor: d => new Date(d.currentRevision.uploadedOn).toLocaleString("en-GB", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })
                  },
                  {
                    Header: "DocumentType",
                    accessor: "documentTypeName"
                  }
                ]
              }
            ]}
            getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: (e, handleOriginal) => {
                  if (!rowInfo) return;
                  this.props.selectDocument(rowInfo.original);
                  this.setState({
                    currentDocument: rowInfo.original
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
              let isSelected = rowInfo && (rowInfo.row._original.id === (this.state.currentDocument && this.state.currentDocument.id));
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
        <h4 className="subtitle is-4">{'Total Documents: ' + this.state.total}</h4>
      </div>
    );
  }
}

export default DocumentsTable;