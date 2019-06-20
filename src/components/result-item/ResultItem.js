import React from 'react';
import './ResultItem.scss';
import StatusOperational from './status-icons/status-operational.js';
import StatusDecommissioned from './status-icons/status-decommissioned';
import StatusPassive from './status-icons/status-passive';
import StatusRedundant from './status-icons/status-redundant';
import StatusRemoved from './status-icons/status-removed';
import StatusShutdown from './status-icons/status-shutdown';
import { getContentForDocument } from '../../api/Documents';

class ResultItem extends React.Component {

    constructor(props) {
        super(props);
        this.openExternalLink = this.openExternalLink.bind(this);
        this.downloadOnClick = this.downloadOnClick.bind(this);
    }

    getStatusIcon(status) {
        switch (status.toLowerCase()) {
            case "operational":
                return <StatusOperational condition={this.props.condition} />;
            case "decommissioned":
                return <StatusDecommissioned />;
            case "passive":
                return <StatusPassive />;
            case "redundant":
                return <StatusRedundant />;
            case "removed":
                return <StatusRemoved />;
            case "shutdown":
                return <StatusShutdown />;
            default:
                return <span></span>;
        }
    }

    getStatus() {
        if (this.props.status !== undefined) {
            return this.getStatusIcon(this.props.status);
        }
    }

    openExternalLink(e) {
        e.stopPropagation()
        var newWindow = window.open();
        getContentForDocument(this.props.externalLinkSrc).then(res => {
            newWindow.location = res.data;
        })
    }

    downloadOnClick(e) {
        e.stopPropagation()
        this.props.downloadOnClick();
    }

    render() {
        return (
            <div className={"result-item-container" + (this.props.selected ? ' selected' : '')}>
                <div className={this.props.largeResultItem ? "result-item large" : "result-item"} onClick={this.props.contentOnClick}>
                    <div className="result-item-content">
                        <div className="text" title={this.props.content}>
                            {this.props.content}
                        </div>
                        <div className="properties-container">
                            {this.getStatus()}
                            <div className="count">{this.props.count}</div>
                            {!this.props.noChevron && (this.props.isExternalLink ? <i className="fas fa-external-link-alt small-icon xs-padding-right" onClick={this.openExternalLink}></i> : <i className="fas fa-chevron-right"></i>)}
                            {!this.props.noChevron && (this.props.isDownload && <i className="fas fa-download small-icon" onClick={this.downloadOnClick}></i>)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ResultItem;
