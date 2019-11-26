import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar, NumberRangeColumnFilter } from './Table';

function PipelineTable() {
  const [isVisible, setIsVisible] = useState(true);
  const [{ pipelineFilters, pipelines }, dispatch] = useStateValue();
  const data = useMemo(() => [...pipelines.values()], [pipelines])
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [{
      Header: 'Name',
      accessor: 'Name',
      Cell: ({ cell: { value } }) => (
        <div className="table-installation-title">
          {value.toLowerCase()}
        </div>
      ),
      minWidth: 300
    }, {
      Header: 'Pipeline DTI No',
      accessor: 'Pipeline DTI No',
      show: isVisible
    }, {
      Header: 'Status',
      accessor: "Status",
      show: isVisible,
      minWidth: 150
    }, {
      Header: 'Fluid Conveyed',
      accessor: "Fluid Conveyed",
      show: isVisible,
      minWidth: 180
    }, {
      Header: 'Operator',
      accessor: 'Operator',
      show: isVisible
    }, {
      Header: 'From',
      accessor: 'From',
      show: isVisible
    }, {
      Header: 'To',
      accessor: 'To',
      show: isVisible
    }, {
      Header: 'Inst Type',
      accessor: "Inst Type",
      show: isVisible
    }, {
      Header: 'Diameter (mm)',
      id: 'Diameter',
      accessor: row => (row.Diameter || 0).toFixed(0),
      show: isVisible,
      Filter: NumberRangeColumnFilter,
      filter: "between",
    }, {
      Header: 'Untrenched Flag',
      accessor: 'Untrenched Flag',
      Cell: ({ cell: { value } }) => value ? value : "?",
      show: isVisible
    }, {
      Header: 'Start Date',
      id: 'Start Date',
      accessor: row => (row["Start Date"] ? new Date(row["Start Date"]) : null),
      show: isVisible,
      filter: "contains"
    }, {
      Header: 'End Date',
      id: 'End Data',
      accessor: row => (row["End Date"] ? new Date(row["End Date"]) : null),
      show: isVisible,
      filter: "contains"
    }, {
      Header: 'Length [m]',
      id: 'Length [m]',
      accessor: row => {
        let lengthValue = row["Length [m]"] ? row["Length [m]"] : 0
        return parseInt(lengthValue);
      },
      show: isVisible,
      Filter: NumberRangeColumnFilter,
      filter: "between",
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
        <Table columns={columns} data={data} history={history} location={location} filters={pipelineFilters} onFiltersChange={onFiltersChange} onVisibleRowsChange={onVisibleRowsChange} />
      </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default PipelineTable;