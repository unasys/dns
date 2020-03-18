import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, SelectColumnFilter } from './Table';

function SubsurfaceTable() {
  const [isVisible, setIsVisible] = useState(false);
  const [{ subsurfaces }, dispatch] = useStateValue();
  const data = useMemo(() => [...subsurfaces.values()], [subsurfaces])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Name',
      id: 'Name',
      accessor: 'name',
      minWidth:350,
      footer:"count"
    }, {
      Header: 'Description',
      id: 'Description',
      accessor: 'description',
      isVisible: isVisible,
      minWidth:350
    }, {
      Header: 'Type',
      id: 'Type',
      accessor: "type",
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes',
    }, {
      Header: 'Status',
      id: 'Status',
      accessor: 'status',
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes',
    }, {
      Header: 'Operator',
      id: 'Operator',
      accessor: 'operator',
      isVisible: isVisible
    }, {
      Header: 'Lat/Long',
      id: 'Lat/Long',
      isVisible: isVisible,
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

  const onVisibleRowsChange = (subsurfacesVisible) => {
    dispatch({ type: "subsurfacesVisible", subsurfacesVisible: subsurfacesVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} location={location} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default SubsurfaceTable;