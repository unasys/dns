import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import Circle01 from '../../assets/installationTable/circle01.js';
import { useHistory, useLocation } from 'react-router-dom';
import Table, { NumberRangeColumnFilter, ButtonBar } from './Table';

function InstallationTable() {
  const [isVisible, setIsVisible] = useState(true);
  const [{installationFilters}, dispatch] = useStateValue();
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: "Name",
        Cell: ({ cell: { value }, row: { original } }) => (
          <>
            <div className="table-installation-title">
              <div className="table-installation-image">
                {original.ImageID ? <img src={`https://assets.digitalnorthsea.com/images/installations/${original.ImageID}`} alt="overview-thumbnail" ></img> : <img src={`https://assets.digitalnorthsea.com/images/installations/-1.jpg`} alt="overview-thumbnail" ></img>}
              </div>
              <div className="table-installation-name">
                {value}
                {original.ePMID && <img style={{ width: '25px', cursor: 'pointer', marginLeft: '5px' }} src="https://epm.unasys.com/icon.svg" alt="epm" onClick={() => window.open(`https://epm.unasys.com/projects/${original.ePMID}/`, "_blank")} />}
              </div>
            </div>
          </>
        ),
        filter: 'contains',
        minWidth: 300
      }, {
        Header: 'Age',
        id: "Age",
        accessor: row => parseInt(row.Age),
        Cell: ({ cell: { value } }) => (value ? value : "-"),
        Filter: NumberRangeColumnFilter,
        filter: "between",
        width: 60,
        show: isVisible
      }, {
        Header: 'Status',
        accessor: 'Status',
        show: isVisible
      }, {
        Header: 'Field Type',
        id: 'Field Type',
        accessor: "FieldType",
        Cell: ({ cell: { value } }) => (<Circle01 size='30px' text={value} />),
        filter: 'contains',
        width: 80,
        show: isVisible
      }, {
        Header: 'Operator',
        accessor: 'Operator',
        filter: 'contains',
        width: 185,
        show: isVisible
      }, {
        Header: 'Producing',
        id: 'Producing',
        accessor: row => {
          return row.Status.toLowerCase() === 'active' ? 'Y' : 'N'
        },
        Cell: ({ cell: { value } }) => (<Circle01 size='30px' text={value} />),
        filter: 'contains',
        width: 90,
        show: isVisible
      }, {
        Header: 'Planned COP',
        id: 'PlannedCOP',
        accessor: row => (row.PlannedCOP ? new Date(row.PlannedCOP) : null),
        Cell: ({ cell: { value } }) => {
          if (value) {
            return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`
          } else {
            return "-"
          }
        },
        
        filter: "contains",
        width: 120,
        show: isVisible
      }, {
        Header: 'Topside Weight (t)',
        id: 'Topside Weight',
        accessor: row => {
          return parseInt(row.TopsideWeight);
        },
        Cell: ({ cell: { value } }) => (value ? value.toLocaleString() : "-"),
        Filter: NumberRangeColumnFilter,
        filter: "between",
        show: isVisible
      }, {
        Header: 'Substructure Weight (t)',
        id: 'Substructure Weight',
        accessor: row => {
          return parseInt(row.SubStructureWeight);
        },
        Cell: ({ cell: { value } }) => (value ? value.toLocaleString() : "-"),
        Filter: NumberRangeColumnFilter,
        filter: "between",
        width: 180,
        show: isVisible
      }, {
        Header: 'Type',
        accessor: 'Type',
        filter: 'contains',
        width: 80,
        show: isVisible
      }, {
        Header: 'Area',
        accessor: 'Area',
        filter: 'contains',
        width: 60,
        show: isVisible
      }, {
        Header: 'Block',
        accessor: 'Block',
        filter: 'contains',
        width: 80,
        show: isVisible
      }
    ],
    [isVisible]
  )
  const [{ installations },] = useStateValue();
  const data = useMemo(() => [...installations.values()], [installations])
  const expand = () => {
    setIsVisible(true);
  }
  const collapse = () => {
    setIsVisible(false);
  }

  const back = () => {
    history.push({ pathname: "/", search: `?${search.toString()}` })
  }

  const onFiltersChange = (filters) => {
    dispatch({type:"installationFiltersChange", filters:filters});
  }

  const onVisibleRowsChange = (installationsVisible) => {
    dispatch({type:"installationsVisible", installationsVisible:installationsVisible});
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history}  location={location} filters={installationFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default InstallationTable;