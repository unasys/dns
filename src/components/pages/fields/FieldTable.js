import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './TableStyles.scss';
import history from '../../../history';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import { fetchFields } from '../../../api/Installations.js';
import axios from 'axios';
import { connect } from 'react-redux';
import { changeFieldFilterType, setCesiumFields } from '../../../actions/installationActions';

const CancelToken = axios.CancelToken;
const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class FieldTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shownColumns: ['Field Name'],
      expandedLevel: 0,
      rows: [],
      currentRowLength: 0,
      minDiscoveryDateInData: new Date(-8640000000000000),
      maxDiscoveryDateInData: new Date(8640000000000000),
      minProductionStartDateInData: new Date(-8640000000000000),
      maxProductionStartDateInData: new Date(8640000000000000),
      maxLengthInData: 0
    }
    this.reactTable = React.createRef();
    this.addToShownColumns = this.addToShownColumns.bind(this);
    this.removeFromShownColumns = this.removeFromShownColumns.bind(this);
    this.expandColumns = this.expandColumns.bind(this);
    this.fetchRows = this.fetchRows.bind(this);
    this.onTableViewChange = this.onTableViewChange.bind(this);
    this.source = CancelToken.source();
  }

  componentWillUnmount() {
    this.source.cancel()
}

  componentDidMount() {
      this.fetchRows();
  }

  fetchRows() {
    fetchFields(this.source.token)
          .then(payload => {
              
              let discoveryDateAsEpoch = (
                payload.data.filter(field => {
                  if (!field["Discovery Date"]) return false
                  let date = new Date(field["Discovery Date"])
                  return date !== "Invalid Date"                
                }).map(field => {
                  let epochTime = Math.round(((new Date(field["Discovery Date"])).getTime()) / 1000) // seconds since epoch.
                  return epochTime
                }
                )
              );
              
              let maxDiscovery = Math.max(...discoveryDateAsEpoch);
              let minDiscovery = Math.min(...discoveryDateAsEpoch);
            
              let maxDiscoveryDate = new Date(maxDiscovery * 1000);
              let minDiscoveryDate = new Date(minDiscovery * 1000);

              let productionDateAsEpoch = (
                payload.data.filter(field => {
                  if (!field["Production Start Date"]) return false
                  let date = new Date(field["Production Start Date"])
                  return date !== "Invalid Date"                
                }).map(field => {
                  let epochTime = Math.round(((new Date(field["Production Start Date"])).getTime()) / 1000) // seconds since epoch.
                  return epochTime
                }
                )
              );
              
              let maxProduction = Math.max(...productionDateAsEpoch);
              let minProduction = Math.min(...productionDateAsEpoch);
            
              let maxProductionDate = new Date(maxProduction * 1000);
              let minProductionDate = new Date(minProduction * 1000);

              this.setState({
                  rows: payload.data,
                  currentRowLength: payload.data.length,
                  maxDiscoveryDateInData: maxDiscoveryDate,
                  minDiscoveryDateInData: minDiscoveryDate,
                  minProductionStartDateInData:minProductionDate,
                  maxProductionStartDateInData:maxProductionDate,
                  maxLengthInData: Math.max(...payload.data.map(field => parseInt(field["Depth (m)"]) || 0))
              });
                          
              
              if (payload.status === 401 && !this.attemptedRetry) {
                  this.attemptedRetry = true;
                  new Promise(resolve => setTimeout(resolve, 3000)).then(res => {
                      this.fetchRows();
                  });
              }
          })
          .catch((e) => {
              console.error('something went wrong when fetching pipelines', e);
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
      this.addToShownColumns(['Field Type', 'Field Status', 'Current Operator', 'Depth (m)', 'Hydrocarbon Type']);
    }
    if (this.state.shownColumns.length === 6) {
      this.addToShownColumns(['Current Licence', 'Discovery Date', 'Production Start Date', 'Discovery Well Name', 'Determination Status'])
    }
  }

  collapseColumns() {
    if (this.state.shownColumns.length === 11) {
      this.removeFromShownColumns('Current Licence')
      this.removeFromShownColumns('Discovery Date')
      this.removeFromShownColumns('Production Start Date')
      this.removeFromShownColumns('Discovery Well Name')
      this.removeFromShownColumns('Determination Status')
    } else if (this.state.shownColumns.length === 6) {
      this.removeFromShownColumns('Field Type')
      this.removeFromShownColumns('Field Status')
      this.removeFromShownColumns('Current Operator')
      this.removeFromShownColumns('Depth (m)')
      this.removeFromShownColumns('Hydrocarbon Type')
    }
  }

  onTableViewChange() {
    if (this.reactTable.current) {
      let currentFields = this.reactTable.current.getResolvedState().sortedData
        let mappedFields = currentFields.map(field => {
        return field._original;
      })
      this.props.setCesiumFields(mappedFields);
    }
  }

  render() {
    const columns = [
      {
        Header: 'Field Name',
        id: 'Field Name',
        accessor: row => {
          if (row["Field Name"]) {
            return row["Field Name"];
          }
        },
        Cell: row => (
          <>
            <div className="table-installation-title">
              {row.value}
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
        show: this.state.shownColumns.includes('Field Name'),
        minWidth: 300
      },
      {
        Header: 'Field Type',
        accessor: row => {
          return row['Field Type']
        },
        id: 'Field Type',
        show: this.state.shownColumns.includes('Field Type')
      },
      {
        Header: 'Field Status',
        accessor: row => {
          return row['Field Status']
        },
        id: 'Field Status',
        show: this.state.shownColumns.includes('Field Status'),
        minWidth: 180
      },
      {
        Header: 'Current Operator',
        id: 'Current Operator',
        accessor: row => {
          return row["Current Operator"]
        },
        show: this.state.shownColumns.includes('Current Operator'),
        minWidth: 260
      },
      {
        Header: 'Depth (m)',
        id: 'Depth (m)',
        accessor: row => { 
          if (row["Depth (m)"]) {
              return (row["Depth (m)"]||0).toFixed(0);
          } 
        },
        filterMethod: (filter, row) => {
          let startValue = filter.value[0]
          let endValue = filter.value[1] 
          let length = row._original["Depth (m)"] ? row._original["Depth (m)"] : 0
          return length <= endValue && length >= startValue
        },
        show: this.state.shownColumns.includes('Depth (m)'),
        Cell: row => (
          <>
              {row.value}
          </>
        ),
        Filter: ({ filter, onChange }) => {
          return (<div>
            <Range 
              allowCross={false} 
              min={0} 
              max={this.state.maxLengthInData} 
              defaultValue={[0, this.state.maxLengthInData]}
              onChange={onChange} />
          </div>)
        }
      },
      {
        Header: 'Hydrocarbon Type',
        id: 'Hydrocarbon Type',
        accessor: row => { if (row["Hydrocarbon Type"]) { return row["Hydrocarbon Type"].toLowerCase() } },
        show: this.state.shownColumns.includes('Hydrocarbon Type')
      },
      {
        Header: 'Current Licence',
        id: 'Current Licence',
        accessor: row => { if (row["Current Licence"]) { return row["Current Licence"] } },
        show: this.state.shownColumns.includes('Current Licence')
      },

      {
        Header: 'Discovery Date',
        accessor: row => {
          return row["Discovery Date"] || "-"
        },
        id: 'Discovery Date',
        show: this.state.shownColumns.includes('Discovery Date'),
        filterMethod: (filter, row) => {
          let startDate = row["Discovery Date"] && new Date(row["Discovery Date"]);
          if (!startDate) return false;
          let startValue = filter.value[0]
          let endValue = filter.value[1]
          let msSinceEpoch = startDate;
          return msSinceEpoch <= endValue && msSinceEpoch >= startValue
        },
        sortMethod: (a, b) => {
          let formattedA = a;
          let formattedB = b;
          let aDate = new Date(formattedA);
          let bDate = new Date(formattedB)
          if (aDate === "Invalid Date") aDate = new Date(-8640000000000000)
          if (bDate === "Invalid Date") bDate = new Date(-8640000000000000)
          return aDate >= bDate ? 1 : -1;
        },
        Filter: ({ filter, onChange }) => {
          return (<div>
            <Range 
              allowCross={false} 
              min={this.state.minDiscoveryDateInData.getTime()} 
              max={this.state.maxDiscoveryDateInData.getTime()} 
              defaultValue={[this.state.minDiscoveryDateInData.getTime(), this.state.maxDiscoveryDateInData.getTime()]}
              onChange={onChange}
              tipFormatter={value => {
                let date = new Date(value);
                return `${date.toLocaleDateString()}`
              }} />
          </div>)
        }
      },
      {
        Header: 'Production Start Date',
        accessor: row => {
          return row["Production Start Date"] || "-"
        },
        id: 'Production Start Date',
        show: this.state.shownColumns.includes('Production Start Date'),
        filterMethod: (filter, row) => {
          let endDate = row["Production Start Date"] && new Date(row["Production Start Date"]);
          if (!endDate) return false;
          let startValue = filter.value[0]
          let endValue = filter.value[1]
          let msSinceEpoch = endDate;
          return msSinceEpoch <= endValue && msSinceEpoch >= startValue
        },
        sortMethod: (a, b) => {
          let formattedA = a;
          let formattedB = b;
          let aDate = new Date(formattedA);
          let bDate = new Date(formattedB)
          if (aDate === "Invalid Date") aDate = new Date(-8640000000000000)
          if (bDate === "Invalid Date") bDate = new Date(-8640000000000000)
          return aDate >= bDate ? 1 : -1;
        },
        Filter: ({ filter, onChange }) => {
          return (<div>
            <Range 
              allowCross={false} 
              min={this.state.minProductionStartDateInData.getTime()} 
              max={this.state.maxProductionStartDateInData.getTime()} 
              defaultValue={[this.state.minProductionStartDateInData.getTime(), this.state.maxProductionStartDateInData.getTime()]}
              onChange={onChange}
              tipFormatter={value => {
                let date = new Date(value);
                return `${date.toLocaleDateString()}`
              }} />
          </div>)
        }
      },
      {
        Header: 'Discovery Well Name',
        id: 'Discovery Well Name',
        accessor: row => { if (row["Discovery Well Name"]) { return row["Discovery Well Name"] } },
        show: this.state.shownColumns.includes('Discovery Well Name')
      },{
        Header: 'Determination Status',
        id: 'Determination Status',
        accessor: row => { if (row["Determination Status"]) { return row["Determination Status"] } },
        show: this.state.shownColumns.includes('Determination Status')
      }
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
      changeFieldFilterType: (filterType, propertyName, filterOn) => {
          dispatch(changeFieldFilterType(filterType, propertyName, filterOn))
      },
      setCesiumFields: (fields) => {
        dispatch(setCesiumFields(fields))
    }
  }
}
export default connect(null, mapDispatchToProps)(FieldTable)
