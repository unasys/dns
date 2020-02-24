import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, NumberRangeColumnFilter, DateCell, NumberCell, SelectColumnFilter } from './Table';

function FieldTable() {
  const [isVisible, setIsVisible] = useState(false);
  const [{ fieldFilters, fields }, dispatch] = useStateValue();
  const data = useMemo(() => [...fields.values()], [fields])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Field Name',
      id: 'Field Name',
      accessor: 'Field Name',
    }, {
      Header: 'Field Type',
      accessor: 'Field Type',
      id: 'Field Type',
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes'
    }, {
      Header: 'Field Status',
      id: "Field Status",
      accessor: "Field Status",
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes'
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
      filter: 'includes'
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
    }],
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

  const onFiltersChange = (filters) => {
    dispatch({ type: "fieldFiltersChange", filters: filters });
  }

  const onVisibleRowsChange = (fieldsVisible) => {
    dispatch({ type: "fieldsVisible", fieldsVisible: fieldsVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} location={location} type="Field" filters={fieldFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default FieldTable;