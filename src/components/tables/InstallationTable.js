import React, { useMemo } from 'react'
import { useTable, useBlockLayout } from 'react-table'
import { FixedSizeList } from 'react-window'
import { useStateValue } from '../../utils/state'
import './InstallationTableStyles.scss';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Circle01 from '../../assets/installationTable/circle01.js';
import Circle02 from '../../assets/installationTable/circle02.js';
import { Range } from 'rc-slider';


function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout
  )

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map(cell => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render('Cell')}
              </div>
            )
          })}
        </div>
      )
    },
    [prepareRow, rows]
  )

  // Render the UI for your table
  return (
    <div {...getTableProps()} className="table">
      <div>
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps()} className="th">
                {column.render('Header')}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div {...getTableBodyProps()}>
        <FixedSizeList
          height={400}
          itemCount={rows.length}
          itemSize={35}
          width={totalColumnsWidth}
        >
          {RenderRow}
        </FixedSizeList>
      </div>
    </div>
  )
}

function InstallationTable() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        id: 'Name',
        accessor: row => {
          if (row.Name) {
            return row.Name.toLowerCase()
          }
        },
        Cell: row => (          
          <>
            <div className="table-installation-title">
              <div className="table-installation-image">
                {row.row.original.ImageID ? <img src={`https://assets.digitalnorthsea.com/images/installations/${row.row.original.ImageID}`} alt="overview-thumbnail" ></img> : <img src={`https://assets.digitalnorthsea.com/images/installations/-1.jpg`} alt="overview-thumbnail" ></img>}
              </div>
              <p>
                <div>
                  <>
                    {row.value}
                    {row.row.original.ePMID && <img style={{ width: '25px', cursor: 'pointer', marginLeft: '5px' }} src="https://epm.unasys.com/icon.svg" alt="epm" onClick={() => window.open(`https://epm.unasys.com/projects/${row.row.original.ePMID}/`, "_blank")} />}
                  </>
                </div>
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
        minWidth: 300
      },
      {
        Header: 'Age',
        accessor: row => {
          return row.Age || "-"
        },
        id: 'Age',
        sortMethod: (a, b) => {
          let formattedA = a;
          let formattedB = b;
          // eslint-disable-next-line
          if (a == "-") formattedA = -1
          // eslint-disable-next-line
          if (b == "-") formattedB = -1
          return parseInt(formattedA) >= parseInt(formattedB) ? 1 : -1;
        },
        filterMethod: (filter, row) => {
          let startValue = filter.value[0]
          let endValue = filter.value[1]
          return row.Age <= endValue && row.Age >= startValue
        },
        Filter: ({ filter, onChange }) => {
          return (<div>
            {/* <Range style={{ zIndex: 5 }} allowCross={false} min={0} max={this.state.maxAgeInData} defaultValue={[0, (this.state.maxAgeInData)]} onChange={onChange} /> */}
          </div>)
        }
      },
      {
        Header: 'Status',
        id: 'Status',
        accessor: row => {
          return row["Status"].toLowerCase()
        },
        minWidth: 150
      },
      {
        Header: 'Field Type',
        id: 'Field Type',
        accessor: row => { return <Circle01 size='30px' text={row["FieldType"]}></Circle01> },
        filterMethod: (filter, row) => {
          return row._original["FieldType"] ? row._original["FieldType"].toLowerCase().includes(filter.value.toLowerCase()) : false;
        },
      },
      {
        Header: 'Operator',
        id: 'Operator',
        accessor: row => { if (row["Operator"]) { return row["Operator"].toLowerCase() } },
        width: 185
      },
      {
        Header: 'Producing',
        id: 'Producing',
        accessor: row => {
          return row["Status"].toLowerCase() === 'active' ? <Circle01 size='30px' text={'Y'}></Circle01> : <Circle02 size='30px' text={'N'}></Circle02>
        },
        filterMethod: (filter, row) => {
          let isProducing = row["Status"].toLowerCase() === 'active' ? 'yes' : 'no'
          return isProducing.includes(filter.value.toLowerCase())
        }
      },
      {
        Header: 'Planned COP',
        accessor: row => {
          return row.PlannedCOP || "-"
        },
        id: 'PlannedCOP',

        filterMethod: (filter, row) => {
          let plannedCOP = row.PlannedCOP && new Date(row.PlannedCOP);
          if (!plannedCOP) return false;
          let startValue = filter.value[0]
          let endValue = filter.value[1]
          let msSinceEpoch = plannedCOP;
          return msSinceEpoch <= endValue && msSinceEpoch >= startValue
        },
        sortMethod: (a, b) => {
          let formattedA = a;
          let formattedB = b;
          let aDate = new Date(formattedA);
          let bDate = new Date(formattedB)
          // eslint-disable-next-line
          if (aDate == "Invalid Date") aDate = new Date(-8640000000000000)
          // eslint-disable-next-line
          if (bDate == "Invalid Date") bDate = new Date(-8640000000000000)
          return aDate >= bDate ? 1 : -1;
        },
        // Filter: ({ filter, onChange }) => {

        //   let plannedCOPstarttime = null;
        //   let plannedCOPendtime = null;
        //   if (this.props.plannedCOPStart) {
        //     let date = new Date();
        //     date.setFullYear(this.props.plannedCOPStart)
        //     plannedCOPstarttime = date.getTime();
        //   }
        //   if (this.props.plannedCOPEnd) {
        //     let date = new Date();
        //     date.setFullYear(this.props.plannedCOPEnd)
        //     plannedCOPendtime = date.getTime();
        //   }
        //   return (<div>
        //     <Range
        //       allowCross={false}
        //       min={this.state.minCOPInData.getTime()}
        //       max={this.state.maxCOPInData.getTime()}
        //       defaultValue={[plannedCOPstarttime ? plannedCOPstarttime : this.state.minCOPInData.getTime(), plannedCOPendtime ? plannedCOPendtime : this.state.maxCOPInData.getTime()]}
        //       onChange={onChange}
        //       tipFormatter={value => {
        //         let date = new Date(value);
        //         return `${date.toLocaleDateString()}`
        //       }} />
        //   </div>)
        // }
      },
      {
        Header: 'Topside Weight (t)',
        id: 'Topside Weight',
        accessor: row => {
          let topsideWeight = row.TopsideWeight ? row.TopsideWeight : 0
          let totalWeight = parseInt(topsideWeight);
          return totalWeight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        sortMethod: (a, b) => {
          return parseInt(a.replace(',', '')) >= parseInt(b.replace(',', '')) ? 1 : -1;
        },
        Footer: (row) => {
          let total = row.data.reduce((acc, installation) => {
            let weightToAdd = parseInt(installation._original["TopsideWeight"]) || 0
            return acc + weightToAdd
          }, 0)
          return (<span>
            {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>)
        },
        filterMethod: (filter, row) => {
          let startValue = filter.value[0]
          let endValue = filter.value[1]
          let topsideWeight = row._original.TopsideWeight ? row._original.TopsideWeight : 0
          return topsideWeight <= endValue && topsideWeight >= startValue
        }
        ,
        // Filter: ({ filter, onChange }) =>
        //   <div onMouseUp={this.filterMouseUp}>
        //     <Range
        //       allowCross={false}
        //       min={0}
        //       max={this.state.maxTopsideWeightInData}
        //       defaultValue={[0, (this.state.maxTopsideWeightInData)]}
        //       onChange={onChange}
        //       tipFormatter={value => {
        //         return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}t`
        //       }} />
        //   </div>
      },
      {
        Header: 'Substructure Weight (t)',
        id: 'Substructure Weight',
        accessor: row => {
          let substructureWeight = row["SubStructureWeight"] ? row["SubStructureWeight"] : "-"
          let totalWeight = substructureWeight;
          return totalWeight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        Footer: (row) => {
          let total = row.data.reduce((acc, installation) => {
            let weightToAdd = parseInt(installation._original["SubStructureWeight"]) || 0;
            return acc + weightToAdd
          }, 0)
          return (<span>
            {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>)
        },
        sortMethod: (a, b) => {
          let formattedA = a
          if (a === "N/A") formattedA = "-2"
          if (a === "-") formattedA = "-1"

          let formattedB = b
          if (b === "N/A") formattedB = "-2"
          if (b === "-") formattedB = "-1"

          return parseInt(formattedA.replace(',', '')) >= parseInt(formattedB.replace(',', '')) ? 1 : -1;
        },
        filterMethod: (filter, row) => {
          let startValue = filter.value[0]
          let endValue = filter.value[1]
          let substructureWeight = row._original["SubStructureWeight"] ? row._original["SubStructureWeight"] : 0
          if (substructureWeight === "N/A" || substructureWeight === "-") substructureWeight = 0
          return substructureWeight <= endValue && substructureWeight >= startValue
        },
        // Filter: ({ filter, onChange }) =>
        //   <div>
        //     <Range
        //       allowCross={false}
        //       min={0}
        //       max={this.state.maxSubstructureWeightInData}
        //       defaultValue={[0, (this.state.maxSubstructureWeightInData)]}
        //       onChange={onChange}
        //       tipFormatter={value => {
        //         return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}t`
        //       }} />
        //   </div>
      },
      {
        Header: 'Type',
        id: 'Type',
        accessor: row => { if (row.Type) { return row.Type } }
      },
      {
        Header: 'Area',
        id: 'Area',
        accessor: row => { if (row.Area) { return row.Area } }
      },
      {
        Header: 'Lat/Long',
        id: 'Lat/Long',
        accessor: row => (parseFloat(Math.round(row["X Long"] * 100) / 100).toFixed(2) + "/" + parseFloat(Math.round(row["Y Lat"] * 100) / 100).toFixed(2))
      },
      {
        Header: 'Discovery Well',
        accessor: 'Discovery Well'
      },
      {
        Header: 'Water Depth',
        id: 'Water Depth',
        accessor: row => { if (row["Water Depth"]) { return row["Water Depth"] + 'm' } }
      },
      {
        Header: 'Block',
        accessor: 'Block'
      }
    ],
    []
  )
  const [{ installations },] = useStateValue();
  const data = useMemo(() => [...installations.values()],[installations])

  return (
    <Table columns={columns} data={data} />
  )
}

export default InstallationTable;

// import React, { Component } from 'react';
// import ReactTable from 'react-table';
// import 'react-table/react-table.css';
// import './InstallationTableStyles.scss';
// import history from '../../../../history';
// import 'rc-slider/assets/index.css';
// import 'rc-tooltip/assets/bootstrap.css';
// import Circle01 from '../../../../assets/installationTable/circle01.js';
// import Circle02 from '../../../../assets/installationTable/circle02.js';
// import { fetchInstallations } from '../../../../api/Installations.js';
// import { connect } from 'react-redux';
// import { changeInstallationFilterType, INSTALLATION_FILTER_TYPES, setCesiumInstallations } from '../../../../actions/installationActions';

// const Slider = require('rc-slider');
// const createSliderWithTooltip = Slider.createSliderWithTooltip;
// const Range = createSliderWithTooltip(Slider.Range);

// class InstallationTable extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       shownColumns: ['Name'],
//       expandedLevel: 0,
//       installations: [],
//       currentInstallationLength: 0,
//       maxAgeInData: 0,
//       minCOPInData: new Date(-8640000000000000),
//       maxCOPInData: new Date(8640000000000000),
//       maxTopsideWeightInData: 0,
//       maxSubstructureWeightInData: 0
//     }
//     this.reactTable = React.createRef();
//     this.addToShownColumns = this.addToShownColumns.bind(this);
//     this.removeFromShownColumns = this.removeFromShownColumns.bind(this);
//     this.expandColumns = this.expandColumns.bind(this);
//     this.fetchInstallations = this.fetchInstallations.bind(this);
//     this.onTableViewChange = this.onTableViewChange.bind(this);
//   }


//   componentDidMount() {
//       this.fetchInstallations();
//   }

//   fetchInstallations() {
//       fetchInstallations()
//           .then(payload => {

//               let datesAsEpoch = (
//                 payload.filter(installation => {
//                   if (!installation.PlannedCOP) return false
//                   let date = new Date(installation.PlannedCOP)
//                   return date !== "Invalid Date"                
//                 }).map(installation => {
//                   let epochTime = Math.round(((new Date(installation.PlannedCOP)).getTime()) / 1000) // seconds since epoch.
//                   return epochTime
//                 }
//                 )
//               )

//               let maxDateTime = Math.max(...datesAsEpoch);
//               let minDateTime = Math.min(...datesAsEpoch);

//               let maxDateCOP = new Date(maxDateTime * 1000)
//               let minDateCOP = new Date(minDateTime * 1000)

//               this.setState({
//                   installations: payload,
//                   currentInstallationLength: payload.length,
//                   maxAgeInData: Math.max(...payload.map(installation => parseInt(installation.Age) || 0)),
//                   maxCOPInData: maxDateCOP,
//                   minCOPInData: minDateCOP,
//                   maxTopsideWeightInData: Math.max(...payload.map(installation => parseInt(installation.TopsideWeight) || 0)),
//                   maxSubstructureWeightInData: Math.max(...payload.map(installation => parseInt(installation.SubStructureWeight) || 0)),
//               });


//           })
//           .catch((e) => {
//               console.error('something went wrong when fetching installations in installationsTables.js', e);
//           })
//   }

//   addToShownColumns(additionalColumn) {
//     let shownColumns = this.state.shownColumns;
//     this.setState({
//       shownColumns: shownColumns.concat(additionalColumn)
//     })
//   }

//   removeFromShownColumns(columnToRemove) {
//     let shownColumns = this.state.shownColumns;
//     var index = shownColumns.indexOf(columnToRemove);
//     if (index !== -1) shownColumns.splice(index, 1);
//     this.setState({
//       shownColumns: shownColumns
//     })
//   }

//   expandColumns() {
//     if (this.state.shownColumns.length === 1) {
//       this.addToShownColumns(['Age', 'Field Type', 'Status', 'Area', 'Type']);
//     }
//     if (this.state.shownColumns.length === 6) {
//       this.addToShownColumns(['Operator', 'Producing', 'Planned COP', 'SubStructureWeight', 'TopsideWeight'])
//     }
//   }

//   collapseColumns() {
//     if (this.state.shownColumns.length === 11) {
//       this.removeFromShownColumns('Operator')
//       this.removeFromShownColumns('Producing')
//       this.removeFromShownColumns('Planned COP')
//       this.removeFromShownColumns('SubStructureWeight')
//       this.removeFromShownColumns('TopsideWeight')
//     } else if (this.state.shownColumns.length === 6) {
//       this.removeFromShownColumns('Age')
//       this.removeFromShownColumns('Area')
//       this.removeFromShownColumns('Field Type')
//       this.removeFromShownColumns('Type')
//       this.removeFromShownColumns('Status')
//     }
//   }


//   onTableViewChange() {
//     if (this.reactTable.current) {
//       let currentInstallations = this.reactTable.current.getResolvedState().sortedData
//         let mappedInstallations = currentInstallations.map(installation => {
//         return installation._original;
//       })
//       this.props.setCesiumInstallations(mappedInstallations);
//     }
//   }

//   render() {
//     const columns = [
//       {
//         Header: 'Name',
//         id: 'Name',
//         accessor: row => {
//           if (row.Name) {
//             return row.Name.toLowerCase()
//           }
//         },
//         Cell: row => (
//           <>
//             <div className="table-installation-title">
//               <div className="table-installation-image">
//                 {row.original.ImageID ? <img src={`https://assets.digitalnorthsea.com/images/installations/${row.original.ImageID}`} alt="overview-thumbnail" ></img> : <img src={`https://assets.digitalnorthsea.com/images/installations/-1.jpg`} alt="overview-thumbnail" ></img>}
//               </div>
//               <p>
//                 <div>
//                   <>
//                     {row.value.toLowerCase()}
//                     {row.original.ePMID && <img style={{width:'25px', cursor:'pointer', marginLeft:'5px'}} src="https://epm.unasys.com/icon.svg" alt="epm" onClick={()=> window.open(`https://epm.unasys.com/projects/${row.row._original.ePMID}/`, "_blank")}/>}
//                   </>
//                 </div>
//               </p>
//             </div>
//           </>
//         ),
//         Footer: (row) => {
//           let total = row.data.length;
//           return (<span>
//             Totals:  {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
//           </span>)
//         },
//         style: { color: '#fff', fontSize: '15px' },
//         show: this.state.shownColumns.includes('Name'),
//         minWidth: 300
//       },
//       {
//         Header: 'Age',
//         accessor: row => {
//           return row.Age || "-"
//         },
//         id: 'Age',
//         show: this.state.shownColumns.includes('Age'),
//         sortMethod: (a, b) => {
//           let formattedA = a;
//           let formattedB = b;
//           // eslint-disable-next-line
//           if (a == "-") formattedA = -1
//           // eslint-disable-next-line
//           if (b == "-") formattedB = -1
//           return parseInt(formattedA) >= parseInt(formattedB) ? 1 : -1;
//         },
//         filterMethod: (filter, row) => {
//           let startValue = filter.value[0]
//           let endValue = filter.value[1]
//           return row.Age <= endValue && row.Age >= startValue
//         },
//         Filter: ({ filter, onChange }) => {
//           return (<div>
//             <Range style={{zIndex: 5}} allowCross={false} min={0} max={this.state.maxAgeInData} defaultValue={[0, (this.state.maxAgeInData)]} onChange={onChange}/>
//           </div>)
//         }
//       },
//       {
//         Header: 'Status',
//         id: 'Status',
//         accessor: row => {
//           return row["Status"].toLowerCase()
//         },
//         show: this.state.shownColumns.includes('Status'),
//         minWidth: 150
//       },
//       {
//         Header: 'Field Type',
//         id: 'Field Type',
//         accessor: row => { return <Circle01 size='30px' text={row["FieldType"]}></Circle01> },
//         show: this.state.shownColumns.includes('Field Type'),
//         filterMethod: (filter, row) => {
//           let filterType;
//           if (filter.value.toLowerCase() === "o")  {
//             filterType = "Oil";
//           } else if (filter.value.toLowerCase() === "c") {
//             filterType = "Condensate"
//           }else if (filter.value.toLowerCase() === "g") {
//             filterType = "Gas"
//           }
//           if (filterType) this.props.changeInstallationFilterType(INSTALLATION_FILTER_TYPES.Property, "FieldType", filterType);
//           return row._original["FieldType"] ? row._original["FieldType"].toLowerCase().includes(filter.value.toLowerCase()) : false;
//         },
//       },
//       {
//         Header: 'Operator',
//         id: 'Operator',
//         accessor: row => { if (row["Operator"]) { return row["Operator"].toLowerCase() } },
//         show: this.state.shownColumns.includes('Operator'),
//         width: 185
//       },
//       {
//         Header: 'Producing',
//         id: 'Producing',
//         accessor: row => {
//           return row["Status"].toLowerCase() === 'active' ? <Circle01 size='30px' text={'Y'}></Circle01> : <Circle02 size='30px' text={'N'}></Circle02>
//         },
//         filterMethod: (filter, row) => {
//           let isProducing = row["Status"].toLowerCase() === 'active' ? 'yes' : 'no'
//           return isProducing.includes(filter.value.toLowerCase())
//         },
//         show: this.state.shownColumns.includes('Producing')
//       },
//       {
//         Header: 'Planned COP',
//         accessor: row => {
//           return row.PlannedCOP || "-"
//         },
//         id: 'PlannedCOP',
//         show: this.state.shownColumns.includes('Planned COP'),
//         filterMethod: (filter, row) => {
//           let plannedCOP = row.PlannedCOP && new Date(row.PlannedCOP);
//           if (!plannedCOP) return false;
//           let startValue = filter.value[0]
//           let endValue = filter.value[1]
//           let msSinceEpoch = plannedCOP;
//           return msSinceEpoch <= endValue && msSinceEpoch >= startValue
//         },
//         sortMethod: (a, b) => {
//           let formattedA = a;
//           let formattedB = b;
//           let aDate = new Date(formattedA);
//           let bDate = new Date(formattedB)
//           // eslint-disable-next-line
//           if (aDate == "Invalid Date") aDate = new Date(-8640000000000000)
//           // eslint-disable-next-line
//           if (bDate == "Invalid Date") bDate = new Date(-8640000000000000)
//           return aDate >= bDate ? 1 : -1;
//         },
//         Filter: ({ filter, onChange }) => {
//           console.log(this.props.plannedCOPStart);
//           let plannedCOPstarttime = null;
//           let plannedCOPendtime = null;
//           if (this.props.plannedCOPStart) {
//             let date = new Date();
//             date.setFullYear(this.props.plannedCOPStart)
//             plannedCOPstarttime = date.getTime();
//           }
//           if (this.props.plannedCOPEnd) {
//             let date = new Date();
//             date.setFullYear(this.props.plannedCOPEnd)
//             plannedCOPendtime = date.getTime();
//           }
//           return (<div>
//             <Range 
//               allowCross={false} 
//               min={this.state.minCOPInData.getTime()} 
//               max={this.state.maxCOPInData.getTime()} 
//               defaultValue={[plannedCOPstarttime ? plannedCOPstarttime : this.state.minCOPInData.getTime(), plannedCOPendtime ? plannedCOPendtime : this.state.maxCOPInData.getTime()]}
//               onChange={onChange}
//               tipFormatter={value => {
//                 let date = new Date(value);
//                 return `${date.toLocaleDateString()}`
//               }} />
//           </div>)
//         }
//       },
//       {
//         Header: 'Topside Weight (t)',
//         id: 'Topside Weight',
//         accessor: row => {
//           let topsideWeight = row.TopsideWeight ? row.TopsideWeight : 0
//           let totalWeight = parseInt(topsideWeight);
//           return totalWeight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//         },
//         sortMethod: (a, b) => {
//           return parseInt(a.replace(',', '')) >= parseInt(b.replace(',', '')) ? 1 : -1;
//         },
//         Footer: (row) => {
//           let total = row.data.reduce((acc, installation) => {
//             let weightToAdd = parseInt(installation._original["TopsideWeight"]) || 0
//             return acc + weightToAdd}, 0)
//           return (<span>
//             {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
//           </span>)
//         },
//         show: this.state.shownColumns.includes('TopsideWeight'),
//         filterMethod: (filter, row) => {
//           let startValue = filter.value[0]
//           let endValue = filter.value[1] 
//           let topsideWeight = row._original.TopsideWeight ? row._original.TopsideWeight : 0
//           return topsideWeight <= endValue && topsideWeight >= startValue
//         },
//         Filter: ({ filter, onChange }) =>
//           <div onMouseUp={this.filterMouseUp}>
//             <Range 
//               allowCross={false} 
//               min={0} 
//               max={this.state.maxTopsideWeightInData} 
//               defaultValue={[0, (this.state.maxTopsideWeightInData)]} 
//               onChange={onChange} 
//               tipFormatter={value => {
//                 return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}t`
//               }}/>
//           </div>
//       },
//       {
//         Header: 'Substructure Weight (t)',
//         id: 'Substructure Weight',
//         accessor: row => {
//           let substructureWeight = row["SubStructureWeight"] ? row["SubStructureWeight"] : "-"
//           let totalWeight = substructureWeight;
//           return totalWeight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//         },
//         Footer: (row) => {
//           let total = row.data.reduce((acc, installation) => {
//             let weightToAdd = parseInt(installation._original["SubStructureWeight"]) || 0;
//             return acc + weightToAdd}, 0)
//           return (<span>
//             {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
//           </span>)
//         },
//         sortMethod: (a, b) => {
//           let formattedA = a
//           if (a === "N/A") formattedA = "-2"
//           if (a === "-") formattedA = "-1"

//           let formattedB = b
//           if (b === "N/A") formattedB = "-2"
//           if (b === "-") formattedB = "-1"

//           return parseInt(formattedA.replace(',', '')) >= parseInt(formattedB.replace(',', '')) ? 1 : -1;
//         },
//         show: this.state.shownColumns.includes('SubStructureWeight'),
//         filterMethod: (filter, row) => {
//           let startValue = filter.value[0]
//           let endValue = filter.value[1]
//           let substructureWeight = row._original["SubStructureWeight"] ? row._original["SubStructureWeight"] : 0
//           if (substructureWeight === "N/A" || substructureWeight === "-") substructureWeight = 0
//           return substructureWeight <= endValue && substructureWeight >= startValue
//         },
//         Filter: ({ filter, onChange }) =>
//           <div>
//         <Range 
//               allowCross={false} 
//               min={0} 
//               max={this.state.maxSubstructureWeightInData} 
//               defaultValue={[0, (this.state.maxSubstructureWeightInData)]} 
//               onChange={onChange} 
//               tipFormatter={value => {
//                 return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}t`
//               }}/>
//           </div>         
//       },
//       {
//         Header: 'Type',
//         id: 'Type',
//         accessor: row => { if (row.Type) { return row.Type } },
//         show: this.state.shownColumns.includes('Type')
//       },
//       {
//         Header: 'Area',
//         id: 'Area',
//         accessor: row => { if (row.Area) { return row.Area } },
//         show: this.state.shownColumns.includes('Area')
//       },
//       {
//         Header: 'Lat/Long',
//         id: 'Lat/Long',
//         accessor: row => (parseFloat(Math.round(row["X Long"] * 100) / 100).toFixed(2) + "/" + parseFloat(Math.round(row["Y Lat"] * 100) / 100).toFixed(2)),
//         show: this.state.shownColumns.includes('Lat/Long')
//       },
//       {
//         Header: 'Discovery Well',
//         accessor: 'Discovery Well',
//         show: this.state.shownColumns.includes('Discovery Well')
//       },
//       {
//         Header: 'Water Depth',
//         id: 'Water Depth',
//         accessor: row => { if (row["Water Depth"]) { return row["Water Depth"] + 'm' } },
//         show: this.state.shownColumns.includes('Water Depth')
//       },
//       {
//         Header: 'Block',
//         accessor: 'Block',
//         show: this.state.shownColumns.includes('Block #')
//       },
//     ]

//     return (
//       <>
//         <div className="ReactTable-container">
//           <ReactTable
//             filterable
//             defaultFilterMethod={(filter, row) =>
//               String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}
//             data={this.state.installations}
//             ref={this.reactTable}
//             columns={columns}
//             showPagination={false}
//             minRows={0}
//             pageSize={this.state.installations.length}
//             onFilteredChange={this.onTableViewChange}
//             getTrProps={(state, rowInfo) => {
//               if (rowInfo && rowInfo.row) {
//                 return {
//                   onClick: (e) => {
//                     this.props.setSelectedInstallation(rowInfo.row);
//                   }
//                 }
//               }else{
//                 return {}
//               }
//             }}
//           />
//           <div className="button-bar">
//               <i className="fas fa-arrow-left backbutton" onClick={() => history.push("/")}></i>
//                 <div className="outward-handle" onClick={() => this.expandColumns()}>
//                   <i className="fas fa-caret-right"></i>
//                 </div>
//                 <div className="outward-handle" onClick={() => this.collapseColumns()}>
//                   <i className="fas fa-caret-left"></i>
//                 </div>
//           </div>
//         </div>
//       </>
//     );
//   }
// }

// function mapDispatchToProps(dispatch) {
//   return {
//       changeInstallationFilterType: (filterType, propertyName, filterOn) => {
//           dispatch(changeInstallationFilterType(filterType, propertyName, filterOn))
//       },
//       setCesiumInstallations: (installations) => {
//         dispatch(setCesiumInstallations(installations))
//     }
//   }
// }

// function mapStateToProps(state) {
//   let search = new URLSearchParams(state.router.location.search);

//   let plannedCOPStart = search.get("plannedCOPStart");
//   let plannedCOPEnd = search.get("plannedCOPEnd");
//   return {
//     plannedCOPStart: plannedCOPStart,
//     plannedCOPEnd: plannedCOPEnd
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(InstallationTable)
