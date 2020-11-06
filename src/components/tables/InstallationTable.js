import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import Circle01 from '../../assets/installationTable/circle01.js';
import { useHistory, useLocation } from 'react-router-dom';
import Table, { NumberRangeColumnFilter, ButtonBar, SelectColumnFilter, NumberCell } from './Table';

function InstallationTable() {
  const [isVisible, setIsVisible] = useState(false);
  const [{ installations }, dispatch] = useStateValue();
  const data = useMemo(() => [...installations.values()], [installations])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const areaIdFilter = search.get("areaId");
  const basinIdFilter = search.get("basinId");
  const workingGroupIdFilter = search.get("workingGroupId");
  const typeIdFilter = search.get("type");
  const localFilters = React.useMemo(() => {
    const filters = [];

    if (areaIdFilter) { filters.push({ id: "areaId", value: parseInt(areaIdFilter) }); }
    if (basinIdFilter) { filters.push({ id: "basinId", value: parseInt(basinIdFilter) }); }
    if (workingGroupIdFilter) { filters.push({ id: "workingGroupId", value: parseInt(workingGroupIdFilter) }); }
    if (typeIdFilter) { filters.push({ id: "Type", value: typeIdFilter }); }
    return filters;
  }, [areaIdFilter, basinIdFilter, typeIdFilter,workingGroupIdFilter]);


  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        id: 'Name',
        accessor: "Name",
        Cell: ({ cell: { value }, row: { original } }) => (
          <div className="table-installation-title">
            <div className="table-installation-image">
              {original.ImageID ? <img src={`https://assets.digitalnorthsea.com/images/installations/${original.ImageID}`} alt="overview-thumbnail" ></img> : <img src={`https://assets.digitalnorthsea.com/images/installations/-1.jpg`} alt="overview-thumbnail" ></img>}
            </div>
            <div className="table-installation-name">
              {value}
            </div>
          </div>
        ),
        filter: 'contains',
        minWidth: 300,
        footer: "count"
      }, {
        Header: 'Age',
        id: "Age",
        accessor: row => parseInt(row.Age),
        Cell: NumberCell,
        Filter: NumberRangeColumnFilter,
        filter: "between",
        width: 60,
        isVisible: isVisible
      }, {
        Header: 'Status',
        accessor: 'Status',
        id: 'Status',
        isVisible: isVisible,
        Filter: SelectColumnFilter,
        filter: 'includes',
      }, {
        Header: 'Producing',
        id: 'Producing',
        accessor: row => {
          return row.Status.toLowerCase() === 'active' ? 'Y' : 'N'
        },
        Cell: ({ cell: { value } }) => (<Circle01 size='30px' text={value} />),
        width: 90,
        isVisible: isVisible,
        Filter: SelectColumnFilter,
        filter: 'exact'
      }, {
        Header: 'Field Type',
        id: 'Field Type',
        accessor: "Field Type",
        Cell: ({ cell: { value } }) => { return (<Circle01 size='30px' text={value ?? "?"} />) },
        width: 110,
        isVisible: isVisible,
        Filter: SelectColumnFilter,
        filter: 'exact'
      }, {
        Header: 'Operator',
        accessor: 'Operator',
        id: 'Operator',
        filter: 'contains',
        width: 185,
        isVisible: isVisible
      }, {
        Header: 'Planned COP',
        id: 'PlannedCOP',
        accessor: row => (row.PlannedCOP ? new Date(row.PlannedCOP) : null),
        Cell: ({ cell: { value }, row: { original } }) => {
          if (value && original.ICOP) {
            return (<a href={original.ICOP} alt="ICOP" target="_blank" rel="noopener noreferrer">{value.getFullYear()}-{value.getMonth() + 1}-{value.getDate()} <i className="fas fa-external-link-alt"></i></a>)
          } else if (value) {
            return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`
          } else {
            return "-"
          }
        },
        filter: "contains",
        width: 120,
        isVisible: isVisible
      },
      {
        Header: 'Removal Date',
        id: 'Removal Date',
        accessor: row => (row["End Date"] ? new Date(row["End Date"] ) : null),
        Cell: ({ cell: { value }, row: { original } }) => {
          if (value) {
            return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`
          } else {
            return "-"
          }
        },
        filter: "contains",
        width: 120,
        isVisible: isVisible
      },
      {
        Header: 'Topside Weight (t)',
        id: 'Topside Weight',
        accessor: row => {
          return parseInt(row.TopsideWeight);
        },
        Cell: NumberCell,
        Filter: NumberRangeColumnFilter,
        filter: "between",
        isVisible: isVisible,
        footer: "sum"
      }, {
        Header: 'Substructure Weight (t)',
        id: 'Substructure Weight',
        accessor: row => {
          return parseInt(row.SubStructureWeight);
        },
        Cell: NumberCell,
        Filter: NumberRangeColumnFilter,
        filter: "between",
        width: 180,
        isVisible: isVisible,
        footer: "sum"
      }, {
        Header: 'Type',
        accessor: 'Type',
        id: 'Type',
        width: 100,
        isVisible: isVisible,
        Filter: SelectColumnFilter,
        filter: 'exact'
      },  {
        Header: 'Block',
        id: 'Block',
        accessor: 'Block',
        filter: 'contains',
        width: 80,
        isVisible: isVisible
      }, {
        accessor: 'areaId',
        id: 'areaId',
        isVisible: false,
        filter: 'exact',
      }, {
        accessor: 'basinId',
        id: 'basinId',
        isVisible: false,
        filter: 'exact',
      }, {
        accessor: 'workingGroupId',
        id: 'workingGroupId',
        isVisible: false,
        filter: 'exact',
      }
    ],
    [isVisible]
  )

  const expand = () => {
    setIsVisible(true);
  }
  const collapse = () => {
    setIsVisible(false);
  }

  const back = () => {
    history.push({ pathname: "/", search: `?${search.toString()}` })
  }

  const onVisibleRowsChange = (installationsVisible) => {
    dispatch({ type: "installationsVisible", installationsVisible: installationsVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} type="Installation" location={location} filters={localFilters} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default InstallationTable;