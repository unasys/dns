import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, SelectColumnFilter } from './Table';

function WreckTable() {
  const [isVisible, setIsVisible] = useState(true);
  const [{ wreckFilters, wrecks }, dispatch] = useStateValue();
  const data = useMemo(() => [...wrecks.values()], [wrecks])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Name',
      accessor: 'name',
      footer: "count"
    }, {
      Header: 'Wreck Type',
      accessor: 'Wreck Type',
      show: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes'
    }, {
      Header: 'Sounding',
      accessor: 'Sounding',
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
    dispatch({ type: "wreckFiltersChange", filters: filters });
  }

  const onVisibleRowsChange = (wrecksVisible) => {
    dispatch({ type: "wrecksVisible", wrecksVisible: wrecksVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} location={location} type="Wreck" filters={wreckFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default WreckTable;