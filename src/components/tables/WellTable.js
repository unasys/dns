import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, SelectColumnFilter, DateCell, NumberCell, NumberRangeColumnFilter } from './Table';
import Circle01 from '../../assets/installationTable/circle01';

function WellTable() {
  const [isVisible, setIsVisible] = useState(false);
  const [{ wellFilters, wells }, dispatch] = useStateValue();
  const data = useMemo(() => [...wells.values()], [wells])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Well Name',
      accessor: 'name',
      footer: "count"
    }, {
      Header: 'Parent Well',
      accessor: 'Parent Well',
      show: isVisible,
    }, {
      Header: 'Field',
      accessor: 'Field',
      show: isVisible,
    }, {
      Header: 'Quad',
      accessor: "Quad",
      show: isVisible,
      width: 90,
      Filter: NumberRangeColumnFilter,
      filter: "between"
    }, {
      Header: 'Block',
      accessor: "Block",
      show: isVisible,
      width: 90,
      Filter: NumberRangeColumnFilter,
      filter: "between"
    }, {
      Header: 'Water Depth (m)',
      accessor: "Water Depth m",
      show: isVisible,
      Cell: NumberCell,
      Filter: NumberRangeColumnFilter,
      filter: "between"
    }, {
      Header: 'Operator',
      accessor: "Current Owner",
      show: isVisible,
    }, {
      Header: 'Platform',
      accessor: "Platform",
      show: isVisible,
    }, {
      Header: 'Well Status',
      accessor: 'Well Status',
      show: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes',
    }, {
      Header: 'Suspended',
      accessor: 'Suspended',
      Cell: ({ cell: { value } }) => (<Circle01 size='30px' text={value} />),
      width: 90,
      show: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes'
    }, {
      Header: 'Spud Date',
      id: 'Spud Date',
      accessor: row => (row["Spud Date"] ? new Date(row["Spud Date"]) : null),
      Cell: DateCell,
      show: isVisible,
      filter: "contains"
    }, {
      Header: 'Lat/Long',
      show: isVisible,
      accessor: row => {
        if (row.Lat && row.Long) {
          return `${row.Lat.toFixed(2)}/${row.Long.toFixed(2)}`;
        }

        return "-";
      }
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
    dispatch({ type: "wellFiltersChange", filters: filters });
  }

  const onVisibleRowsChange = (wellsVisible) => {
    dispatch({ type: "wellsVisible", wellsVisible: wellsVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} location={location} type="Well" filters={wellFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default WellTable;