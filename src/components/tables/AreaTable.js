import React, { useMemo } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar } from './Table';

function AreaTable() {
  const [{ areaFilters, areas }, dispatch] = useStateValue();
  const data = useMemo(() => [...areas.values()], [areas])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Area Name',
      accessor: 'Area Name',
      minWidth: 260
    }],
    []
  )

  const back = () => {
    history.push({ pathname: "/", search: `?${search.toString()}` })
  }

  const onFiltersChange = (filters) => {
    dispatch({ type: "areaFiltersChange", filters: filters });
  }

  const onVisibleRowsChange = (areasVisible) => {
    dispatch({ type: "areasVisible", fieldsVisible: areasVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} location={location} type="Area" filters={areaFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar back={back} />
    </div>
  )
}

export default AreaTable;