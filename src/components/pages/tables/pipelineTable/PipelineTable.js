import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../TableStyles.scss';
import history from '../../../../history';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import { fetchPipelines } from '../../../../api/Installations.js';
import { connect } from 'react-redux';
import { changePipelineFilterType, setCesiumPipelines } from '../../../../actions/installationActions';

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class PipelineTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shownColumns: ['Name'],
      expandedLevel: 0,
      rows: [],
      currentRowLength: 0,
      minStartDateInData: new Date(-8640000000000000),
      maxStartDateInData: new Date(8640000000000000),
      minEndDateInData: new Date(-8640000000000000),
      maxEndDateInData: new Date(8640000000000000),
      maxLengthInData: 0,
      minDiameterInData: 0,
      maxDiameterInData: 0,
    }
    this.reactTable = React.createRef();
    this.addToShownColumns = this.addToShownColumns.bind(this);
    this.removeFromShownColumns = this.removeFromShownColumns.bind(this);
    this.expandColumns = this.expandColumns.bind(this);
    this.fetchRows = this.fetchRows.bind(this);
    this.onTableViewChange = this.onTableViewChange.bind(this);
  }

  componentWillUnmount() {
    this.source.cancel()
}

  componentDidMount() {
      this.fetchRows();
  }

  fetchRows() {
    fetchPipelines(this.source.token)
          .then(payload => {
              
              let startDatesAsEpoch = (
                payload.data.filter(pipeline => {
                  if (!pipeline["Start Date"]) return false
                  let date = new Date(pipeline["Start Date"])
                  return date !== "Invalid Date"                
                }).map(pipeline => {
                  let epochTime = Math.round(((new Date(pipeline["Start Date"])).getTime()) / 1000) // seconds since epoch.
                  return epochTime
                }
                )
              );
              
              let maxStartTime = Math.max(...startDatesAsEpoch);
              let minStartTime = Math.min(...startDatesAsEpoch);
            
              let maxDateStart = new Date(maxStartTime * 1000);
              let minDateStart = new Date(minStartTime * 1000);

              let endDatesAsEpoch = (
                payload.data.filter(pipeline => {
                  if (!pipeline["End Date"]) return false
                  let date = new Date(pipeline["Start Date"])
                  return date !== "Invalid Date"                
                }).map(pipeline => {
                  let epochTime = Math.round(((new Date(pipeline["End Date"])).getTime()) / 1000) // seconds since epoch.
                  return epochTime
                }
                )
              );
              
              let maxEndTime = Math.max(...endDatesAsEpoch);
              let minEndTime = Math.min(...endDatesAsEpoch);
            
              let maxDateEnd = new Date(maxEndTime * 1000);
              let minDateEnd = new Date(minEndTime * 1000);

              let diameters = payload.data.map(pipeline => {
                if (pipeline["Diameter Unit"] === "inch") {
                  return (parseInt(pipeline["Diameter"]) * 25.4) || 0;
                } else {
                  return parseInt(pipeline["Diameter"]) || 0;
                }
              });

              let minDiameter = parseInt(Math.min(...diameters).toFixed(0));

              let maxDiameter = parseInt(Math.max(...diameters).toFixed(0));
              this.setState({
                  rows: payload.data,
                  currentRowLength: payload.data.length,
                  maxStartDateInData: maxDateStart,
                  minStartDateInData: minDateStart,
                  maxEndDateInData : maxDateEnd,
                  minEndDateInData: minDateEnd,
                  maxLengthInData: Math.max(...payload.data.map(pipeline => parseInt(pipeline["Length [m]"]) || 0)),
                  minDiameterInData: minDiameter,
                  maxDiameterInData:maxDiameter
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
      this.addToShownColumns(['Pipeline DTI No', 'Fluid Conveyed', 'Status', 'Length [m]', 'Inst Type']);
    }
    if (this.state.shownColumns.length === 6) {
      this.addToShownColumns(['Operator', 'Diameter', 'Start Date', 'End Date', 'Untrenched Flag'])
    }
  }

  collapseColumns() {
    if (this.state.shownColumns.length === 11) {
      this.removeFromShownColumns('Operator')
      this.removeFromShownColumns('Diameter')
      this.removeFromShownColumns('Start Date')
      this.removeFromShownColumns('End Date')
      this.removeFromShownColumns('Untrenched Flag')
    } else if (this.state.shownColumns.length === 6) {
      this.removeFromShownColumns('Pipeline DTI No')
      this.removeFromShownColumns('Fluid Conveyed')
      this.removeFromShownColumns('Length [m]')
      this.removeFromShownColumns('Inst Type')
      this.removeFromShownColumns('Status')
    }
  }


  onTableViewChange() {
    if (this.reactTable.current) {
      let currentPipelines = this.reactTable.current.getResolvedState().sortedData
        let mappedPipelines = currentPipelines.map(pipeline => {
        return pipeline._original;
      })
      this.props.setCesiumPipelines(mappedPipelines);
    }
  }

  render() {
    const columns = [
      {
        Header: 'Name',
        id: 'Name',
        accessor: "Pipeline Name",
        Cell: row => (
          <>
            <div className="table-installation-title">
              {row.value.toLowerCase()}
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
        Header: 'Pipeline DTI No',
        accessor: 'Pipeline DTI No',
        id: 'Pipeline DTI No',
        show: this.state.shownColumns.includes('Pipeline DTI No')
      },
      {
        Header: 'Status',
        id: 'Status',
        accessor: "Status",
        Cell: row => row.value.toLowerCase(),
        show: this.state.shownColumns.includes('Status'),
        minWidth: 150
      },
      {
        Header: 'Fluid Conveyed',
        id: 'Fluid Conveyed',
        accessor: "Fluid Conveyed",
        show: this.state.shownColumns.includes('Fluid Conveyed'),
        minWidth: 180
      },
      {
        Header: 'Operator',
        id: 'Operator',
        accessor: row => { if (row["Operator"]) { return row["Operator"].toLowerCase() } },
        Cell: row => row.value.toLowerCase(),
        show: this.state.shownColumns.includes('Operator')
      },
      {
        Header: 'Inst Type',
        id: 'Inst Type',
        accessor: "Inst Type",
        Cell: row => row.value.toLowerCase(),
        show: this.state.shownColumns.includes('Inst Type')
      },
      {
        Header: 'Diameter (mm)',
        id: 'Diameter',
        accessor: row => { 
          if (row.Diameter) {
            if(row["Diameter Units"] === "inch"){
              return ((row.Diameter ||0)* 25.4).toFixed(0);
            }
            else{
              return (row.Diameter||0).toFixed(0);
            }
          } 
        },
        filterMethod: (filter, row) => {
          let startValue = filter.value[0]
          let endValue = filter.value[1] 
          let length = row._original["Diameter"] ? row._original["Diameter"] : 0
          if(row["Diameter Units"] === "inch")
          {
            length = length*25.4;
          }
          return length <= endValue && length >= startValue
        },
        show: this.state.shownColumns.includes('Diameter'),
        Cell: row => (
          <>
              {row.value}
          </>
        ),
        Filter: ({ filter, onChange }) => {
          return (<div>
            <Range 
              allowCross={false} 
              min={this.state.minDiameterInData} 
              max={this.state.maxDiameterInData} 
              defaultValue={[this.state.minDiameterInData, this.state.maxDiameterInData]}
              onChange={onChange} />
          </div>)
        }
      },
      {
        Header: 'Untrenched Flag',
        id: 'Untrenched Flag',
        accessor: row => { if (row["Untrenched Flag"]) { return row["Untrenched Flag"].toLowerCase() } else {return "?"} },
        show: this.state.shownColumns.includes('Untrenched Flag')
      },
      {
        Header: 'Start Date',
        accessor: row => {
          return row["Start Date"] || "-"
        },
        id: 'Start Date',
        show: this.state.shownColumns.includes('Start Date'),
        filterMethod: (filter, row) => {
          let startDate = row["Start Date"] && new Date(row["Start Date"]);
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
              min={this.state.minStartDateInData.getTime()} 
              max={this.state.maxStartDateInData.getTime()} 
              defaultValue={[this.state.minStartDateInData.getTime(), this.state.maxStartDateInData.getTime()]}
              onChange={onChange}
              tipFormatter={value => {
                let date = new Date(value);
                return `${date.toLocaleDateString()}`
              }} />
          </div>)
        }
      },
      {
        Header: 'End Date',
        accessor: row => {
          return row["End Date"] || "-"
        },
        id: 'End Data',
        show: this.state.shownColumns.includes('End Date'),
        filterMethod: (filter, row) => {
          let endDate = row["End Date"] && new Date(row["End Date"]);
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
              min={this.state.minEndDateInData.getTime()} 
              max={this.state.maxEndDateInData.getTime()} 
              defaultValue={[this.state.minEndDateInData.getTime(), this.state.maxEndDateInData.getTime()]}
              onChange={onChange}
              tipFormatter={value => {
                let date = new Date(value);
                return `${date.toLocaleDateString()}`
              }} />
          </div>)
        }
      },
      {
        Header: 'Length [m]',
        id: 'Length [m]',
        accessor: row => {
          let lengthValue = row["Length [m]"] ? row["Length [m]"]  : 0
          let length = parseInt(lengthValue);
          return length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        sortMethod: (a, b) => {
          return parseInt(a.replace(',', '')) >= parseInt(b.replace(',', '')) ? 1 : -1;
        },
        Footer: (row) => {
          let total = row.data.reduce((acc, pipeline) => {
            let lengthToAdd = parseInt(pipeline._original["Length [m]"]) || 0
            return acc + lengthToAdd}, 0)
          return (<span>
            {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>)
        },
        show: this.state.shownColumns.includes('Length [m]'),
        filterMethod: (filter, row) => {
          let startValue = filter.value[0]
          let endValue = filter.value[1] 
          let length = row._original["Length [m]"] ? row._original["Length [m]"] : 0
          return length <= endValue && length >= startValue
        },
        Filter: ({ filter, onChange }) =>
          <div onMouseUp={this.filterMouseUp}>
            <Range 
              allowCross={false} 
              min={0} 
              max={this.state.maxLengthInData} 
              defaultValue={[0, (this.state.maxLengthInData)]} 
              onChange={onChange} 
              tipFormatter={value => {
                return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
              }}/>
          </div>
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
            getTrProps={(state, rowInfo) => {
              if (rowInfo && rowInfo.row) {
                return {
                  onClick: (e) => {
                    this.props.setSelectedPipeline(rowInfo.row);
                  }
                }
              }else{
                return {}
              }
            }}
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
      changePipelineFilterType: (filterType, propertyName, filterOn) => {
          dispatch(changePipelineFilterType(filterType, propertyName, filterOn))
      },
      setCesiumPipelines: (pipelines) => {
        dispatch(setCesiumPipelines(pipelines))
    }
  }
}
export default connect(null, mapDispatchToProps)(PipelineTable)
