import React, { useMemo } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar} from './Table';

function BasinTable() {
  const [{ basinFilters, basins }, dispatch] = useStateValue();
  const data = useMemo(() => [...basins.values()], [basins])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Basin Name',
      accessor: 'Basin Name',
      minWidth: 260
    },
    {
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
    dispatch({ type: "basinFiltersChange", filters: filters });
  }

  const onVisibleRowsChange = (basinsVisible) => {
    dispatch({ type: "basinsVisible", basinsVisible: basinsVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} location={location} type="Basin" filters={basinFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar  back={back} />
    </div>
  )
}

export default BasinTable;