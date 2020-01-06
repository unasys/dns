import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, NumberRangeColumnFilter, NumberCell, DateCell, SelectColumnFilter } from './Table';

function PipelineTable() {
  const [isVisible, setIsVisible] = useState(true);
  const [{ pipelineFilters, pipelines }, dispatch] = useStateValue();
  const data = useMemo(() => [...pipelines.values()], [pipelines])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Pipeline Name',
      accessor: 'Pipeline Name',
      width:300,
      footer:"count"
    }, {
      Header: 'Pipeline DTI No',
      accessor: 'Pipeline DTI No',
      show: isVisible,
    }, {
      Header: 'Status',
      accessor: "Status",
      show: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes',
      minWidth: 150
    }, {
      Header: 'Fluid Conveyed',
      accessor: "Fluid Conveyed",
      show: isVisible,
      Filter: SelectColumnFilter,
      filter: 'includes',
      minWidth: 190
    }, {
      Header: 'Operator',
      accessor: 'Operator',
      show: isVisible
    }, {
      Header: 'Inst Type',
      accessor: "Inst Type",
      Filter: SelectColumnFilter,
      filter: 'includes',
      show: isVisible
    }, {
      Header: 'Diameter (mm)',
      id: 'Diameter',
      accessor: row => (row.Diameter || 0).toFixed(0),
      Cell: NumberCell,
      show: isVisible,
      Filter: NumberRangeColumnFilter,
      filter: "between",
      width: 110
    }, {
      Header: 'Length [m]',
      id: 'Length [m]',
      accessor: row => {
        let lengthValue = row["Length [m]"] ? row["Length [m]"] : 0
        return parseInt(lengthValue);
      },
      Cell: NumberCell,
      show: isVisible,
      Filter: NumberRangeColumnFilter,
      filter: "between",
      footer:"sum"
    }, {
      Header: 'Start Date',
      id: 'Start Date',
      accessor: row => (row["Start Date"] ? new Date(row["Start Date"]) : null),
      Cell: DateCell,
      show: isVisible,
      filter: "contains"
    }, {
      Header: 'From',
      accessor: 'Pipeline From',
      show: isVisible,
      minWidth: 200
    }, {
      Header: 'To',
      accessor: 'Pipeline To',
      show: isVisible,
      minWidth: 200
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
    dispatch({ type: "pipelineFiltersChange", filters: filters });
  }

  const onVisibleRowsChange = (pipelinesVisible) => {
    dispatch({ type: "pipelinesVisible", pipelinesVisible: pipelinesVisible });
  }

  return (
    <div className="dns-panel">
      <div className="dns-content-table">
        <Table columns={columns} data={data} history={history} type="Pipeline" location={location} filters={pipelineFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default PipelineTable;