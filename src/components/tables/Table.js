import React, { useEffect } from 'react'
import { useTable, useBlockLayout, useFilters, useSortBy } from 'react-table'
import { FixedSizeList } from 'react-window'
import AutoSizer from "react-virtualized-auto-sizer";
import './TableStyles.scss';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip';

export function DefaultColumnFilter({
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

export function NumberRangeColumnFilter({
    column: { filterValue = [], preFilteredRows, setFilter, id },
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

    const defaultValue = filterValue.length === 0 ? [min, max] : filterValue;
    if (min !== max) {
        return <Range pushable={true} allowCross={false} min={min} max={max} defaultValue={defaultValue} onChange={onChange} handle={handle} tipFormatter={value => value.toLocaleString()} />
    } else {
        return <></>
    }
}

export function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()].sort();
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}


export default function Table({ columns, data, history, location, filters, type, onFiltersChange, onVisibleRowsChange, keyField }) {
    const defaultColumn = React.useMemo(
        () => ({
            width: 150,
            Filter: DefaultColumnFilter,
            Cell: ({ cell: { value } }) => value ? value : "-",
        }),
        []
    );

    if (!filters) {
        filters = [];
    }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        state,
        rows,
        totalColumnsWidth,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            initialState: { filters: filters },
        },
        useBlockLayout,
        useFilters,
        useSortBy
    );

    useEffect(() => {
        onFiltersChange(state.filters);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.filters]);

    useEffect(() => {
        const ids = rows.map(row => row.original[keyField]);
        onVisibleRowsChange(ids);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows, keyField]);


    const RenderRow = React.useCallback(
        ({ index, style }) => {
            const row = rows[index];
            const search = new URLSearchParams(location.search);
            const rowClick = () => {
                search.set("etype", type);
                search.set("eid", row.original[keyField]);
                history.push({ pathname: location.pathname, search: `?${search.toString()}` });
            }
            prepareRow(row)

            return (
                <div
                    {...row.getRowProps({
                        style,
                    })}
                    className={"tr" + (row.original[keyField].toString() === search.get("eid") ? " highlighted" : "")}
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
        [prepareRow, rows, history, location, type, keyField]
    )

    const RenderFooter = React.useCallback(
        (column) => {

            switch (column.footer) {
                case "sum": {
                    const sum = column.filteredRows.map(row => row.values[column.id]).filter(value => Number.isInteger(value)).reduce((a, b) => a + b, 0);
                    return sum.toLocaleString();
                }
                case "count": {
                    const count = column.filteredRows.length;
                    return count.toLocaleString();
                }
                default: return "";
            }
        },
        []
    );
    const hasFooter = !headerGroups.every(headerGroup => headerGroup.headers.every(column => column.footer === undefined));
    // Render the UI for your table
    return (
        <div {...getTableProps()} className="table">
            <div className="thead">
                {headerGroups.map(headerGroup => (
                    <div {...headerGroup.getHeaderGroupProps()} className="tr">
                        {headerGroup.headers.map((column, i) => (
                            <div key={i} className="th">
                                <div {...column.getHeaderProps(column.getSortByToggleProps())} >
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                </div>
                                <div className="filter">{column.canFilter ? column.render('Filter') : null}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {hasFooter && <div className="tfoot">
                {headerGroups.map(headerGroup => (
                    <div {...headerGroup.getHeaderGroupProps()} className="tr">
                        {headerGroup.headers.map((column, i) => (
                            <div key={i} className="td">
                                <div {...column.getHeaderProps()} >
                                    {RenderFooter(column)}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>}
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
};

export const ButtonBar = (props) => {
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
};

export const DateCell = ({ cell: { value } }) => {
    if (value) {
        return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`
    } else {
        return "-"
    }
};

export const NumberCell = ({ cell: { value } }) => (value ? value.toLocaleString() : "-");