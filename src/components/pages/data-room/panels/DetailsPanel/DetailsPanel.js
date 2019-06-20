import React, { Component } from 'react';
import './DetailsPanel.scss';
import FileDetails from './FileDetails';

class DetailsPanel extends Component {
    render() {
        return (
            <div className="details-panel-container">

                <div className="selected">{`Selected (${this.props.selectedDocuments.length})`}</div>
                {this.props.selectedDocuments.length === 1 && <FileDetails selectedDocument={this.props.selectedDocuments[0]} />}
            </div>
        )
    }
}

export default DetailsPanel;