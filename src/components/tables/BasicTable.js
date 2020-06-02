import React, { useMemo, useState } from 'react'
import { useStateValue } from '../../utils/state'
import { useHistory, useLocation } from 'react-router-dom';
import Table, { ButtonBar } from './Table';

function BasicTable({ type, rowVisible, data }) {
    const [, dispatch] = useStateValue();
    const tableData = useMemo(() => [...data.values()], [data])
    const history = useHistory();
    const location = useLocation();
    const search = new URLSearchParams(location.search);

    const columns = React.useMemo(
        () => [{
            Header: 'Name',
            id: 'Name',
            accessor: 'Name',
            width:350,
            footer: "count"
        }],
        []
    )

    const back = () => {
        history.push({ pathname: "/", search: `?${search.toString()}` })
    }

    const onVisibleRowsChange = (visible) => {
        let msg = { type: rowVisible };
        msg[rowVisible] = visible;
        dispatch(msg);
    }

    return (
        <div className="dns-panel">
            <div className="dns-content-table">
                <Table columns={columns} data={tableData} history={history} location={location} type={type} onVisibleRowsChange={onVisibleRowsChange} />
            </div>
            <ButtonBar back={back} />
        </div>
    )
}

export default BasicTable;