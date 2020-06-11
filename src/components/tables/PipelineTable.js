import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, NumberRangeColumnFilter, NumberCell, DateCell, SelectColumnFilter } from './Table';

function PipelineTable() {
  const [isVisible, setIsVisible] = useState(false);
  const [{ pipelines }, dispatch] = useStateValue();
  const data = useMemo(() => [...pipelines.values()], [pipelines]);
  
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const areaIdFilter = search.get("areaId");
  const basinIdFilter = search.get("basinId");
  const instType = search.get("instType");
  const workingGroupIdFilter = search.get("workingGroupId");
  const localFilters = React.useMemo(() => {
    const filters = [];

    if (areaIdFilter) { filters.push({ id: "areaIds", value: parseInt(areaIdFilter) }); }
    if (basinIdFilter) { filters.push({ id: "basinIds", value: parseInt(basinIdFilter) }); }
    if (workingGroupIdFilter) { filters.push({ id: "workingGroupId", value: parseInt(workingGroupIdFilter) }); }
    if (instType) { filters.push({ id: "Inst Type", value: instType }); }
    return filters;
  }, [areaIdFilter, basinIdFilter, instType,workingGroupIdFilter]);
  const columns = React.useMemo(
    () => [{
      Header: 'Pipeline Name',
      id: 'Pipeline Name',
      accessor: 'pipeline_name',
      width:300,
      footer:"count"
    }, {
      Header: 'Pipeline DTI No',
      id: 'Pipeline DTI No',
      accessor: 'dti_no',
      isVisible: isVisible,
    }, {
      Header: 'Status',
      id: 'Status',
      accessor: "status",
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes',
      minWidth: 150
    }, {
      Header: 'Fluid Conveyed',
      id: 'Fluid Conveyed',
      accessor: "fluid_conveyed",
      isVisible: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes',
      minWidth: 190
    }, {
      Header: 'Operator',
      id: 'Operator',
      accessor: 'op',
      isVisible: isVisible
    }, {
      Header: 'Inst Type',
      id: 'Inst Type',
      accessor: "inst_type",
      Filter: SelectColumnFilter,
      filter: 'exact',
      isVisible: isVisible
    }, {
      Header: 'Diameter (mm)',
      id: 'Diameter',
      accessor: row => (row.diameter_value || 0).toFixed(0),
      Cell: NumberCell,
      isVisible: isVisible,
      Filter: NumberRangeColumnFilter,
      filter: "between",
      width: 110
    }, {
      Header: 'Length [m]',
      id: 'Length [m]',
      accessor: row => {
        let lengthValue = row["length_m"] ? row["length_m"] : 0
        return parseInt(lengthValue);
      },
      Cell: NumberCell,
      isVisible: isVisible,
      Filter: NumberRangeColumnFilter,
      filter: "between",
      footer:"sum"
    }, {
      Header: 'Start Date',
      id: 'Start Date',
      accessor: row => (row["start_date"] ? new Date(row["start_date"]) : null),
      Cell: DateCell,
      isVisible: isVisible,
      filter: "contains"
    }, {
      Header: 'From',
      accessor: 'Pipeline From',
      id: 'from_name',
      isVisible: isVisible,
      minWidth: 200
    }, {
      Header: 'To',
      accessor: 'Pipeline To',
      id: 'to_name',
      isVisible: isVisible,
      minWidth: 200
    }, {
      accessor: 'areaIds',
      id: 'areaIds',
      isVisible: false,
      filter: 'includes',
    }, {
      accessor: 'basinIds',
      id: 'basinIds',
      isVisible: false,
      filter: 'includes',
    }, {
      accessor: 'workingGroupId',
      id: 'workingGroupId',
      isVisible: false,
      filter: 'exact',
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

  const onVisibleRowsChange = (pipelinesVisible) => {
    dispatch({ type: "pipelinesVisible", pipelinesVisible: pipelinesVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} type="Pipeline" filters={localFilters} location={location} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default PipelineTable;