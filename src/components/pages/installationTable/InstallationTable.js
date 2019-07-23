import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './TableStyles.scss';
import history from '../../../history';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Circle01 from '../../../assets/installationTable/circle01.js';
import Circle02 from '../../../assets/installationTable/circle02.js';
import { fetchInstallations } from '../../../api/Installations.js';
import axios from 'axios';

const CancelToken = axios.CancelToken;

class InstallationTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shownColumns: ['Name'],
      expandedLevel: 0,
      installations: []
    }
    this.addToShownColumns = this.addToShownColumns.bind(this);
    this.removeFromShownColumns = this.removeFromShownColumns.bind(this);
    this.expandColumns = this.expandColumns.bind(this);
    this.fetchInstallations = this.fetchInstallations.bind(this);
    this.source = CancelToken.source();
  }
  

  componentWillUnmount() {
    this.source.cancel()
}

  componentDidMount() {
      this.fetchInstallations();
  }

  fetchInstallations() {
      fetchInstallations(this.source.token)
          .then(payload => {
              //Here we need to assign a type to OilAndGas if it doesn't exists in the response. This is to further help the other components to filter the data.
              this.setState({
                  installations: payload.data
              });
              
              if (payload.status === 401 && !this.attemptedRetry) {
                  this.attemptedRetry = true;
                  new Promise(resolve => setTimeout(resolve, 3000)).then(res => {
                      this.fetchInstallations();
                  });
              }
          })
          .catch((e) => {
              console.error('something went wrong when fetching installations in installationsTables.js', e);
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
      this.addToShownColumns(['Age', 'Field Type', 'Status']);
    }
    if (this.state.shownColumns.length === 4) {
      this.addToShownColumns(['Operator', 'Producing', 'Planned COP', 'Weight'])
    }
  }

  collapseColumns() {
    if (this.state.shownColumns.length === 8) {
      this.removeFromShownColumns('Operator')
      this.removeFromShownColumns('Producing')
      this.removeFromShownColumns('Planned COP')
      this.removeFromShownColumns('Weight')
    } else if (this.state.shownColumns.length === 4) {
      this.removeFromShownColumns('Age')
      this.removeFromShownColumns('Field Type')
      this.removeFromShownColumns('Status')
    }
  }

  render() {
    console.log(this.state.installations);
    console.log(this.state.installations.length);
    const columns = [
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
                {row.original.ImageID ? <img src={`https://epmdata.blob.core.windows.net/assets/imagesv1/${row.original.ImageID}`} alt="overview-thumbnail" ></img> : <img src={`https://epmdata.blob.core.windows.net/assets/imagesv1/-1.jpg`} alt="overview-thumbnail" ></img>}
              </div>
              <p>
                {row.original.ePMID ? (<div style={{cursor:'pointer'}} onClick={()=> window.open(`https://epm.unasys.com/projects/${row.row._original.ePMID}/`, "_blank")}>{row.value.toLowerCase()}</div>) : row.value.toLowerCase()}
              </p>
              <i className="fas fa-chevron-down icon"></i>
            </div>
          </>
        ),
        style: { color: '#fff', fontSize: '15px' },
        show: this.state.shownColumns.includes('Name'),
        minWidth: 300
      },
      {
        Header: 'Age',
        accessor: 'Age',
        show: this.state.shownColumns.includes('Age'),
        filterMethod: (filter, row) => {
          let startValue = filter.value[0]
          let endValue = filter.value[1]
          return row.Age < endValue && row.Age > startValue
        },
        Filter: ({ filter, onChange }) =>
          <div>
            <Range allowCross={false} defaultValue={[0, 100]} onChange={onChange} />
          </div>
      },
      {
        Header: 'Status',
        id: 'Status',
        accessor: row => {
          return row["Status"].toLowerCase()
        },
        show: this.state.shownColumns.includes('Status')
      },
      {
        Header: 'Field Type',
        id: 'Field Type',
        accessor: row => { return <Circle01 size='30px' text={row["FieldType"]}></Circle01> },
        show: this.state.shownColumns.includes('Field Type'),
        filterMethod: (filter, row) => {
          return row._original["FieldType"].toLowerCase().includes(filter.value.toLowerCase())
        },
      },
      {
        Header: 'Operator',
        id: 'Operator',
        accessor: row => { if (row["Operator"]) { return row["Operator"].toLowerCase() } },
        show: this.state.shownColumns.includes('Operator'),
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
        },
        show: this.state.shownColumns.includes('Producing')
      },
      {
        Header: 'Planned COP',
        accessor: 'PlannedCOP',
        show: this.state.shownColumns.includes('Planned COP'),
        filterMethod: (filter, row) => {
          let plannedCOP = row.PlannedCOP && new Date(row.PlannedCOP);
          if (!plannedCOP) return false;
          let startValue = filter.value[0]
          let endValue = filter.value[1]
          let year = plannedCOP.getFullYear();
          return year < endValue && year > startValue
        },
        Filter: ({ filter, onChange }) =>
          <div>
            <Range allowCross={false} min={2000} max={2100} defaultValue={[2000, 2100]} onChange={onChange} />
          </div>
      },
      {
        Header: 'Weight',
        id: 'Weight',
        accessor: row => {
          let topsideWeight = row.TopsideWeight ? row.TopsideWeight : 0
          let substructureWeight = row["SubStructureWeight"] ? row["SubStructureWeight"] : 0
          if (substructureWeight === "N/A") substructureWeight = 0
          let totalWeight = parseInt(topsideWeight) + parseInt(substructureWeight);
          return totalWeight + 't'
        },
        sortMethod: (a, b) => {
          return parseInt(a.substring(0, a.length - 1)) >= parseInt(b.substring(0, b.length - 1)) ? 1 : -1;
        },
        show: this.state.shownColumns.includes('Weight'),
        filterMethod: (filter, row) => {
          let startValue = filter.value[0]
          let endValue = filter.value[1]
          let topsideWeight = row._original.TopsideWeight ? row._original.TopsideWeight : 0
          let substructureWeight = row._original["SubStructureWeight"] ? row._original["SubStructureWeight"] : 0
          if (substructureWeight === "N/A") substructureWeight = 0
          let totalWeight = parseInt(topsideWeight) + parseInt(substructureWeight);
          return totalWeight < endValue && totalWeight >= startValue
        },
        Filter: ({ filter, onChange }) =>
          <div>
            <Range allowCross={false} min={0} max={600000} defaultValue={[0, 600000]} onChange={onChange} />
          </div>
      },
      {
        Header: 'Type',
        id: 'Type',
        accessor: row => { if (row.Type) { return row.Type.toLowerCase() } },
        show: this.state.shownColumns.includes('Type')
      },
      {
        Header: 'Lat/Long',
        id: 'Lat/Long',
        accessor: row => (parseFloat(Math.round(row["X Long"] * 100) / 100).toFixed(2) + "/" + parseFloat(Math.round(row["Y Lat"] * 100) / 100).toFixed(2)),
        show: this.state.shownColumns.includes('Lat/Long')
      },
      {
        Header: 'Discovery Well',
        accessor: 'Discovery Well',
        show: this.state.shownColumns.includes('Discovery Well')
      },
      {
        Header: 'Water Depth',
        id: 'Water Depth',
        accessor: row => { if (row["Water Depth"]) { return row["Water Depth"] + 'm' } },
        show: this.state.shownColumns.includes('Water Depth')
      },
      {
        Header: 'Block',
        accessor: 'Block',
        show: this.state.shownColumns.includes('Block #')
      },
    ]

    return (
      <>
        <div className="ReactTable-container">
          <ReactTable
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}
            data={this.state.installations}
            columns={columns}
            showPagination={false}
            pageSize={this.state.installations.length}
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

export default InstallationTable; 