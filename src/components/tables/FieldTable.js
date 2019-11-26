import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, NumberRangeColumnFilter } from './Table';

function FieldTable() {
  const [isVisible, setIsVisible] = useState(true);
  const [{ fieldFilters, fields }, dispatch] = useStateValue();
  const data = useMemo(() => [...fields.values()], [fields])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Field Name',
      accessor: 'Field Name',
      Cell: ({ cell: { value } }) => (
        <div className="table-installation-title">
          {value}
        </div>
      ),
      minWidth: 300
    }, {
      Header: 'Field Type',
      accessor: 'Field Type',
      show: isVisible
    }, {
      Header: 'Field Status',
      accessor: "Field Status",
      show: isVisible,
      minWidth: 180
    }, {
      Header: 'Current Operator',
      accessor: 'Current Operator',
      show: isVisible,
      minWidth: 260
    }, {
      Header: 'Depth (m)',
      id: 'Depth (m)',
      accessor: row => {
        if (row["Depth (m)"]) {
          return (row["Depth (m)"] || 0).toFixed(0);
        }
      },
      filterMethod: (filter, row) => {
        let startValue = filter.value[0]
        let endValue = filter.value[1]
        let length = row._original["Depth (m)"] ? row._original["Depth (m)"] : 0
        return length <= endValue && length >= startValue
      },
      show: isVisible,
      Filter: NumberRangeColumnFilter,
      filter: "between",
    }, {
      Header: 'Hydrocarbon Type',
      accessor: 'Hydrocarbon Type',
      show: isVisible
    }, {
      Header: 'Current Licence',
      accessor: 'Current Licence',
      show: isVisible
    }, {
      Header: 'Discovery Date',
      accessor: row => (row["Discovery Date"] ? new Date(row["Discovery Date"]) : null),
      id: 'Discovery Date',
      Cell: ({ cell: { value } }) => {
        if (value) {
          return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`
        } else {
          return "-"
        }
      },
      show: isVisible
    }, {
      Header: 'Production Start Date',
      accessor: row => (row["Production Start Date"] ? new Date(row["Production Start Date"]) : null),
      id: 'Production Start Date',
      Cell: ({ cell: { value } }) => {
        if (value) {
          return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`
        } else {
          return "-"
        }
      },
      show: isVisible,
    }, {
      Header: 'Discovery Well Name',
      accessor: 'Discovery Well Name',
      show: isVisible
    }, {
      Header: 'Determination Status',
      accessor: 'Determination Status',
      show: isVisible
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
        <Table columns={columns} data={data} history={history} location={location} filters={fieldFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default FieldTable;