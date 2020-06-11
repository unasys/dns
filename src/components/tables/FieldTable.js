import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, NumberRangeColumnFilter, DateCell, NumberCell, SelectColumnFilter } from './Table';

function FieldTable({isCC}) {
  const [isVisible, setIsVisible] = useState(false);
  const [{ fields, ccfields }, dispatch] = useStateValue();
  const dataToUse = isCC?ccfields:fields;
  const data = useMemo(() => [...dataToUse.values()], [dataToUse])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const areaIdFilter = search.get("areaId");
  const basinIdFilter = search.get("basinId");
  const fieldStatus = search.get("fieldStatus");
  const workingGroupIdFilter = search.get("workingGroupId");
  const localFilters = React.useMemo(() => {
    const filters = [];

    if (areaIdFilter) { filters.push({ id: "areaId", value: parseInt(areaIdFilter) }); }
    if (basinIdFilter) { filters.push({ id: "basinId", value: parseInt(basinIdFilter) }); }
    if (workingGroupIdFilter) { filters.push({ id: "workingGroupId", value: parseInt(workingGroupIdFilter) }); }
    if (fieldStatus) { filters.push({ id: "Field Status", value: fieldStatus }); }
    return filters;
  }, [areaIdFilter, basinIdFilter, fieldStatus,workingGroupIdFilter]);
  
  const columns = React.useMemo(
    () => [{
      Header: 'Field Name',
      id: 'Field Name',
      accessor: 'Field Name',
      footer: "count"
    }, {
      Header: 'Field Type',
      accessor: 'Field Type',
      id: 'Field Type',
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'exact'
    }, {
      Header: 'Field Status',
      id: "Field Status",
      accessor: "Field Status",
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'exact'
    }, {
      Header: 'Current Operator',
      id: 'Current Operator',
      accessor: 'Current Operator',
      isVisible: isVisible,
      minWidth: 260
    }, {
      Header: 'Depth (m)',
      id: 'Depth (m)',
      accessor: row => (row["Depth (m)"] || 0).toFixed(0),
      Cell: NumberCell,
      isVisible: isVisible,
      Filter: NumberRangeColumnFilter,
      filter: "between",
    }, {
      Header: 'Hydrocarbon Type',
      id: 'Hydrocarbon Type',
      accessor: 'Hydrocarbon Type',
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'exact'
    }, {
      Header: 'Current Licence',
      id: 'Current Licence',
      accessor: 'Current Licence',
      isVisible: isVisible
    }, {
      Header: 'Discovery Date',
      accessor: row => (row["Discovery Date"] ? new Date(row["Discovery Date"]) : null),
      id: 'Discovery Date',
      Cell: DateCell,
      isVisible: isVisible
    }, {
      Header: 'Production Start Date',
      accessor: row => (row["Production Start Date"] ? new Date(row["Production Start Date"]) : null),
      id: 'Production Start Date',
      Cell: DateCell,
      isVisible: isVisible,
    }, {
      Header: 'Discovery Well Name',
      id: 'Discovery Well Name',
      accessor: 'Discovery Well Name',
      isVisible: isVisible
    }, {
      Header: 'Determination Status',
      id: 'Determination Status',
      accessor: 'Determination Status',
      isVisible: isVisible
    },    {
      Header: 'CO2 Storage Capacity',
      id: 'CO2 Storage_capacity',
      accessor: 'CO2 Storage_capacity',
      isVisible: isCC && isVisible
    },    {
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
    }],
    [isVisible, isCC]
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

  const onVisibleRowsChange = (fieldsVisible) => {
    dispatch({ type: "fieldsVisible", fieldsVisible: fieldsVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} filters={localFilters} location={location} type="Field" onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default FieldTable;