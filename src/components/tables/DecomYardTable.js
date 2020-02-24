import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar } from './Table';

function DecomYardTable() {
  const [isVisible, setIsVisible] = useState(false);
  const [{ decomYardFilters, decomYards }, dispatch] = useStateValue();
  const data = useMemo(() => [...decomYards.values()], [decomYards])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Name',
      id: 'Name',
      accessor: 'Name',
      minWidth: 300
    }, {
      Header: 'Lat/Long',
      id: 'Lat/Long',
      accessor: row => (parseFloat(Math.round(row["Lat"] * 100) / 100).toFixed(2) + "/" + parseFloat(Math.round(row["Long"] * 100) / 100).toFixed(2)),
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
    dispatch({ type: "decomYardFiltersChange", filters: filters });
  }

  const onVisibleRowsChange = (decomYardsVisible) => {
    dispatch({ type: "decomYardsVisible", decomYardsVisible: decomYardsVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} type="DecomYard" history={history} location={location} filters={decomYardFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default DecomYardTable;