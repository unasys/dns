import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, SelectColumnFilter } from './Table';

function WreckTable() {
  const [isVisible, setIsVisible] = useState(false);
  const [{ wrecks }, dispatch] = useStateValue();
  const data = useMemo(() => [...wrecks.values()], [wrecks])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Name',
      id: 'Name',
      accessor: 'name',
      footer: "count"
    }, {
      Header: 'Wreck Type',
      id: 'Wreck Type',
      accessor: 'Wreck Type',
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes'
    }, {
      Header: 'Sounding',
      id: 'Sounding',
      accessor: 'Sounding',
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

  const onVisibleRowsChange = (wrecksVisible) => {
    dispatch({ type: "wrecksVisible", wrecksVisible: wrecksVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} location={location} type="Wreck" onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default WreckTable;