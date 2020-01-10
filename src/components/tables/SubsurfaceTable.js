import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, SelectColumnFilter } from './Table';

function SubsurfaceTable() {
  const [isVisible, setIsVisible] = useState(true);
  const [{ subsurfaceFilters, subsurfaces }, dispatch] = useStateValue();
  const data = useMemo(() => [...subsurfaces.values()], [subsurfaces])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Name',
      accessor: 'name',
      minWidth:350,
      footer:"count"
    }, {
      Header: 'Description',
      accessor: 'description',
      show: isVisible,
      minWidth:350
    }, {
      Header: 'Type',
      accessor: "type",
      show: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes',
    }, {
      Header: 'Status',
      accessor: 'status',
      show: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes',
    }, {
      Header: 'Operator',
      accessor: 'operator',
      show: isVisible
    }, {
      Header: 'Lat/Long',
      show: isVisible,
      accessor: row => {
        if (row.coordinates?.length === 2) {
          return `${row.coordinates[0].toFixed(2)}/${row.coordinates[1].toFixed(2)}`;
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
    dispatch({ type: "subsurfaceFiltersChange", filters: filters });
  }

  const onVisibleRowsChange = (subsurfacesVisible) => {
    dispatch({ type: "subsurfacesVisible", subsurfacesVisible: subsurfacesVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} location={location} type="Subsurface" filters={subsurfaceFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default SubsurfaceTable;