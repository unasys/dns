import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './TableStyles.scss';
import history from '../../../history';
import { fetchWindfarms } from '../../../api/Installations.js';
import axios from 'axios';
import { connect } from 'react-redux';
import { changeWindfarmFilterType,  setCesiumWindfarms } from '../../../actions/installationActions';

const CancelToken = axios.CancelToken;

class WindfarmTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shownColumns: ['Name'],
      expandedLevel: 0,
      rows: [],
      currentDataLength: 0
    }
    this.reactTable = React.createRef();
    this.addToShownColumns = this.addToShownColumns.bind(this);
    this.removeFromShownColumns = this.removeFromShownColumns.bind(this);
    this.expandColumns = this.expandColumns.bind(this);
    this.fetchWindfarms = this.fetchWindfarms.bind(this);
    this.onTableViewChange = this.onTableViewChange.bind(this);
    this.source = CancelToken.source();
  }
  
  componentWillUnmount() {
    this.source.cancel()
    }

  componentDidMount() {
      this.fetchWindfarms();
  }

  fetchWindfarms() {
    fetchWindfarms(this.source.token)
          .then(payload => {

              this.setState({
                  rows: payload.data,
                  currentDataLength: payload.data.length,
              });
                          
              
              if (payload.status === 401 && !this.attemptedRetry) {
                  this.attemptedRetry = true;
                  new Promise(resolve => setTimeout(resolve, 3000)).then(res => {
                      this.fetchWindfarms();
                  });
              }
          })
          .catch((e) => {
              console.error('something went wrong when fetching decom yards', e);
          })
  }

  addToShownColumns(additionalColumn) {
    let shownColumns = this.state.shownColumns;
    this.setState({
      shownColumns: shownColumns.concat(additionalColumn)
    })
  }

  removeFromShownColumns(columnToRemove) {
    let shownColumns = this.state.shownColumns;
    var index = shownColumns.indexOf(columnToRemove);
    if (index !== -1) shownColumns.splice(index, 1);
    this.setState({
      shownColumns: shownColumns
    })
  }

  expandColumns() {
    if (this.state.shownColumns.length === 1) {
        this.addToShownColumns(['Lat/Long']);
      }
  }

  collapseColumns() {
    if (this.state.shownColumns.length === 2) {
        this.removeFromShownColumns('Lat/Long')
      }
  }

  onTableViewChange() {
    if (this.reactTable.current) {
      let currentRows = this.reactTable.current.getResolvedState().sortedData
        let mappedRows = currentRows.map(row => {
        return row._original;
      })
      this.props.setCesiumWindfarms(mappedRows);
    }
  }

  render() {
      console.log(this.state.rows);
    const columns = [
      {
        Header: 'Name',
        id: 'Name',
        accessor: row => {
          if (row.NAME) {
            return row.NAME.toLowerCase()
          }
        },
        Cell: row => (
          <>
            <div className="table-installation-title">
              <p>
                {row.value.toLowerCase()}
              </p>
            </div>
          </>
        ),
        Footer: (row) => {
          let total = row.data.length;
          return (<span>
            Totals:  {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>)
        },
        style: { color: '#fff', fontSize: '15px' },
        show: this.state.shownColumns.includes('Name'),
        minWidth: 300
      },
      {
        Header: 'MW Cap',
        accessor: 'MW CAP'
      },
      {
        Header: 'Turbines',
        accessor: 'TURBINES'
      },
      {
        Header: 'Capacity Factor',
        accessor: 'CAPACITY FACTOR'
      },
      {
        Header: 'Depth (M)',
        accessor: 'DEPTH'
      },
      {
        Header: 'Status',
        accessor: 'STATUS'
      },
      {
        Header: 'DEPTH (M)',
        accessor: 'DEPTH'
      },
      {
        Header: 'First Power',
        accessor: 'First Power'
      },
      {
        Header: 'Area (km2)',
        accessor: 'Area (km2)'
      },
    ]

    return (
      <>
        <div className="ReactTable-container">
          <ReactTable
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}
            data={this.state.rows}
            ref={this.reactTable}
            columns={columns}
            showPagination={false}
            minRows={0}
            pageSize={this.state.rows.length}
            onFilteredChange={this.onTableViewChange}
          />
          <div className="button-bar">
              <i className="fas fa-arrow-left backbutton" onClick={() => history.push("/")}></i>
                <div className="outward-handle" onClick={() => this.expandColumns()}>
                  <i className="fas fa-caret-right"></i>
                </div>
                <div className="outward-handle" onClick={() => this.collapseColumns()}>
                  <i className="fas fa-caret-left"></i>
                </div>
          </div>
        </div>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeWindfarmFilterType: (filterType, propertyName, filterOn) => {
          dispatch(changeWindfarmFilterType(filterType, propertyName, filterOn))
      },
      setCesiumWindfarms: (rows) => {
        dispatch(setCesiumWindfarms(rows))
    }
  }
}
export default connect(null, mapDispatchToProps)(WindfarmTable)
