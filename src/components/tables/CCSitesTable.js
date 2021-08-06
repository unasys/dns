import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, SelectColumnFilter } from './Table';

function CCSitesTable({isCC}) {
  const [isVisible, setIsVisible] = useState(false);
  const [{ ccsites }, dispatch] = useStateValue();

  const data = useMemo(() => [...ccsites.values()], [ccsites])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const localFilters = React.useMemo(() => {
    const filters = [];

    return filters;
  }, []);
  
  const columns = React.useMemo(
    () => [{
      Header: 'Site Name',
      id: 'Site Name',
      accessor: 'Site Name',
      footer: "count",
      minWidth: 260
    }, {
      Header: 'Operator',
      accessor: 'Operator',
      id: 'Operator',
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'exact',
      minWidth: 260
    }, {
      Header: 'Sector',
      id: "Sector",
      accessor: "Sector",
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'exact',
      minWidth: 260
    },
    {
      Header: 'Region',
      id: "Region",
      accessor: "Region",
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'exact',
      minWidth: 260
    },
    {
      Header: 'Cluster',
      id: "Cluster",
      accessor: "Cluster",
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'exact',
      minWidth: 260
    }
    , {
      Header: 'Local Authority',
      id: 'Local Authority',
      accessor: 'Local Authority',
      isVisible: isVisible,
      minWidth: 260
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

  const onVisibleRowsChange = (ccsitesVisible) => {
    dispatch({ type: "ccsitesVisible", ccsitesVisible: ccsitesVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} filters={localFilters} location={location} type="Field" onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default CCSitesTable;