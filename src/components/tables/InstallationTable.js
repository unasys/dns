import React, { useMemo, useState } from 'react'
import { useTable, useBlockLayout, useFilters, useSortBy } from 'react-table'
import { FixedSizeList } from 'react-window'
import { useStateValue } from '../../utils/state'
import './TableStyles.scss';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Circle01 from '../../assets/installationTable/circle01.js';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import AutoSizer from "react-virtualized-auto-sizer";
import { useHistory, useLocation } from 'react-router-dom';
import Tooltip from 'rc-tooltip';
import Handle from '../sliding-panels/handle/Handle';

function DefaultColumnFilter({
  column: { filterValue, setFilter },
}) {
  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
    />
  )
}
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const RangeHandle = Range.Handle;
const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <RangeHandle value={value} {...restProps} />
    </Tooltip>
  );
};

function NumberRangeColumnFilter({
  column: { preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      if (row.values[id]) {
        min = Math.min(row.values[id], min);
        max = Math.max(row.values[id], max);
      }
    })
    return [min, max];
  }, [id, preFilteredRows])

  const onChange = (e) => {
    if (e[0] === min && e[1] === max) {
      setFilter([]);
    } else {
      setFilter(e);
    }
  }

  if (min !== max) {
    return <Range pushable={true} allowCross={false} min={min} max={max} defaultValue={[min, max]} onChange={onChange} handle={handle} tipFormatter={value => value.toLocaleString()} />
  } else {
    return <></>
  }
}

function DateRangeColumnFilter({
  column: { preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    const time = new Date().getTime();
    let min = time;
    let max = time;
    preFilteredRows.forEach(row => {
      if (row.values[id] && row.values[id] > 0) {
        min = Math.min(row.values[id], min);
        max = Math.max(row.values[id], max);
      }
    })
    return [min, max];
  }, [id, preFilteredRows])

  const onChange = (e) => {
    if (e[0] === min && e[1] === max) {
      setFilter([]);
    } else {
      setFilter(e);
    }
  }

  if (min !== max) {
    return <Range pushable={true} allowCross={false} min={min} max={max} defaultValue={[min, max]} onChange={onChange} handle={handle} tipFormatter={value => {
      const date = new Date(value);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }} />
  } else {
    return <></>
  }
}

function Table({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout,
    useFilters,
    useSortBy
  );

  const history = useHistory();
  const location = useLocation();

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      const search = new URLSearchParams(location.search);
      const rowClick = () => {
        search.set("etype", "Installation");
        search.set("eid", row.original.Name);
        history.push({ pathname: location.pathname, search: `?${search.toString()}` });
      }
      prepareRow(row)
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className={"tr" + (row.original.Name === search.get("eid") ? " highlighted" : "")}
          onClick={rowClick} >
          {row.cells.map(cell => {
            return (
              <div {...cell.getCellProps()} className="td" >
                {cell.render('Cell')}
              </div>
            )
          })}
        </div>
      )
    },
    [prepareRow, rows, history, location]
  )
  // Render the UI for your table
  return (
    <div {...getTableProps()} className="table">
      <div className="thead">
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
                <div className="filter">{column.canFilter ? column.render('Filter') : null}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="tbody" {...getTableBodyProps()}>
        <AutoSizer>
          {({ height }) => (
            <FixedSizeList
              height={height}
              itemCount={rows.length}
              itemSize={40}
              width={totalColumnsWidth}
            >
              {RenderRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

const ButtonBar = (props) => {
  return (
    <div className="button-bar">
      <i className="fas fa-arrow-left backbutton" onClick={() => props.back()}></i>
      <div className="outward-handle" onClick={() => props.expand()}>
        <i className="fas fa-caret-right"></i>
      </div>
      <div className="outward-handle" onClick={() => props.collapse()}>
        <i className="fas fa-caret-left"></i>
      </div>
    </div>)
}

function InstallationTable() {
  const [isVisible, setIsVisible] = useState(true);
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: "Name",
        Cell: ({ cell: { value }, row: { original } }) => (
          <>
            <div className="table-installation-title">
              <div className="table-installation-image">
                {original.ImageID ? <img src={`https://assets.digitalnorthsea.com/images/installations/${original.ImageID}`} alt="overview-thumbnail" ></img> : <img src={`https://assets.digitalnorthsea.com/images/installations/-1.jpg`} alt="overview-thumbnail" ></img>}
              </div>
              <div className="table-installation-name">
                {value}
                {original.ePMID && <img style={{ width: '25px', cursor: 'pointer', marginLeft: '5px' }} src="https://epm.unasys.com/icon.svg" alt="epm" onClick={() => window.open(`https://epm.unasys.com/projects/${original.ePMID}/`, "_blank")} />}
              </div>
            </div>
          </>
        ),
        filter: 'contains',
        minWidth: 300
      }, {
        Header: 'Age',
        id: "Age",
        accessor: row => parseInt(row.Age),
        Cell: ({ cell: { value } }) => (value ? value : "-"),
        Filter: NumberRangeColumnFilter,
        filter: "between",
        width: 60,
        show:isVisible
      }, {
        Header: 'Status',
        accessor: 'Status',
        show:isVisible
      }, {
        Header: 'Field Type',
        id: 'Field Type',
        accessor: "FieldType",
        Cell: ({ cell: { value } }) => (<Circle01 size='30px' text={value} />),
        filter: 'contains',
        width: 80,
        show:isVisible
      }, {
        Header: 'Operator',
        accessor: 'Operator',
        filter: 'contains',
        width: 185,
        show:isVisible
      }, {
        Header: 'Producing',
        id: 'Producing',
        accessor: row => {
          return row.Status.toLowerCase() === 'active' ? 'Y' : 'N'
        },
        Cell: ({ cell: { value } }) => (<Circle01 size='30px' text={value} />),
        filter: 'contains',
        width: 90,
        show:isVisible
      }, {
        Header: 'Planned COP',
        id: 'PlannedCOP',
        accessor: row => (row.PlannedCOP ? new Date(row.PlannedCOP) : null),
        Cell: ({ cell: { value } }) => {
          if (value) {
            return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`
          } else {
            return "-"
          }
        },
        Filter: DateRangeColumnFilter,
        filter: "between",
        width: 120,
        show:isVisible
      }, {
        Header: 'Topside Weight (t)',
        id: 'Topside Weight',
        accessor: row => {
          return parseInt(row.TopsideWeight);
        },
        Cell: ({ cell: { value } }) => (value ? value.toLocaleString() : "-"),
        Filter: NumberRangeColumnFilter,
        filter: "between",
        show:isVisible
      }, {
        Header: 'Substructure Weight (t)',
        id: 'Substructure Weight',
        accessor: row => {
          return parseInt(row.SubStructureWeight);
        },
        Cell: ({ cell: { value } }) => (value ? value.toLocaleString() : "-"),
        Filter: NumberRangeColumnFilter,
        filter: "between",
        width: 180,
        show:isVisible
      }, {
        Header: 'Type',
        accessor: 'Type',
        filter: 'contains',
        width: 80,
        show:isVisible
      }, {
        Header: 'Area',
        accessor: 'Area',
        filter: 'contains',
        width: 60,
        show:isVisible
      }, {
        Header: 'Block',
        accessor: 'Block',
        filter: 'contains',
        width: 80,
        show:isVisible
      }
    ],
    [isVisible]
  )
  const [{ installations },] = useStateValue();
  const data = useMemo(() => [...installations.values()], [installations])
  const expand = () => {
    setIsVisible(true);
  }
  const collapse = () => {
    setIsVisible(false);
  }
  
  const back = () =>{
    history.push({pathname:"/", search:`?${search.toString()}`})
  }

  return (
    <div className="dns-panel">
    <div className="dns-content-table">
      <Table columns={columns} data={data} />
    </div>
      <ButtonBar expand={expand} collapse={collapse} back={back} />
    </div>
  )
}

export default InstallationTable;