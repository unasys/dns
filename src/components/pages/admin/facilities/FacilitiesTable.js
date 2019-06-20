import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { fetchFacilities } from '../../../../api/Facilities';
import axios from 'axios';

const CancelToken = axios.CancelToken;

class FacilitiesTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = ({
      data: [],
      pages: null,
      loading: true
    })
    this.source = CancelToken.source();
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillUnmount() {
    this.source.cancel()
  }

  requestData(pageSize, page) {
    return fetchFacilities(this.props.projectId, this.source.token, pageSize * page, pageSize)
      .then(payload => {
        console.log(payload.data);
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
                    Header: "Name",
                    accessor: "name"
                  }
                ]
              }
            ]}
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
        <h4 className="subtitle is-4">{'Total Facilities: ' + this.state.total}</h4>
      </div>
    );
  }
}

export default FacilitiesTable;