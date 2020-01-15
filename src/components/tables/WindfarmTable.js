import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, SelectColumnFilter } from './Table';

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
      accessor: 'Name',
      minWidth: 300
    }, {
      Header: 'Description',
      accessor: 'Description',
      show: isVisible
    }, {
      Header: 'Type',
      accessor: 'Type',
      show: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes'
    },
    {
      Header: 'Lease Type',
      accessor: 'Lease Type',
      show: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes'
    }, {
      Header: 'Round',
      accessor: 'Round',
      show: isVisible
    }, {
      Header: 'Status',
      accessor: 'Status',
      show: isVisible,
      width: 200,
      Cell: ({ cell: { value } }) => (
        <div className="scroll-cell">
          <p>
            {value.toLowerCase()}
          </p>
        </div>
      ),
      Filter: SelectColumnFilter,
      filter: 'includes'
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
    dispatch({ type: "windfarmFiltersChange", filters: filters });
  }

  const onVisibleRowsChange = (windfarmsVisible) => {
    dispatch({ type: "windfarmsVisible", windfarmsVisible: windfarmsVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} type="Windfarm" location={location} filters={windfarmFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default WindfarmTable;
