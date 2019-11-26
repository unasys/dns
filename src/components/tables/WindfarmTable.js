import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar } from './Table';

function WindfarmTable() {
  const [isVisible, setIsVisible] = useState(true);
  const [{ windfarmFilters, windfarms }, dispatch] = useStateValue();
  const data = useMemo(() => [...windfarms.values()], [windfarms])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Name',
      accessor: 'NAME',
      minWidth: 300
    }, {
      Header: 'MW Cap',
      accessor: 'MW CAP',
      show: isVisible,
    }, {
      Header: 'Turbines',
      accessor: 'TURBINES',
      show: isVisible,
      width: 250,
      Cell: ({ cell: { value } }) => (
        <div style={{ overflowX: 'scroll' }}>
          <p>
            {value.toLowerCase()}
          </p>
        </div>
      ),
    }, {
      Header: 'Capacity Factor',
      accessor: 'CAPACITY FACTOR',
      show: isVisible,
    }, {
      Header: 'Status',
      accessor: 'STATUS',
      show: isVisible,
      width: 200,
      Cell: ({ cell: { value } }) => (
        <div style={{ overflowX: 'scroll' }}>
          <p>
            {value.toLowerCase()}
          </p>
        </div>
      ),
    }, {
      Header: 'Depth (M)',
      accessor: 'DEPTH',
      show: isVisible,
    }, {
      Header: 'KM to shore',
      accessor: 'KM TO SHORE',
      show: isVisible,
    }, {
      Header: 'First Power',
      accessor: 'First Power',
      show: isVisible,
    }, {
      Header: <div>Area (km<sup>2</sup>)</div>,
      accessor: 'Area (km2)',
      show: isVisible,
    },],
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
    dispatch({ type: "windfarmFiltersChange", filters: filters });
  }

  const onVisibleRowsChange = (windfarmsVisible) => {
    dispatch({ type: "windfarmsVisible", windfarmsVisible: windfarmsVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} type="Windfarm" keyField="Name" location={location} filters={windfarmFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default WindfarmTable;
