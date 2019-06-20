import React, { Component } from 'react';
import './DetailsPanel.scss';
import ResultItem from '../../../../result-item/ResultItem';


class FileDetails extends Component {
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-GB')
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    render() {
        let document = this.props.selectedDocument;
        let uploadDate = document.currentRevision.uploadedOn;
        let lastModified = document.lastModified;

        let uploadDateFormatted = this.formatDate(uploadDate);
        let uploadTimeFormatted = this.formatTime(uploadDate);

        let lastModifiedDateFormatted = this.formatDate(lastModified);
        let lastModifiedTimeFormatted = this.formatTime(lastModified);

        return (<div className="file-details-container">
            <ResultItem content={'Name: ' + document.name} contentOnClick={function () { }} noChevron={true}></ResultItem>
            <ResultItem content={'Detail: ' + document.detail} contentOnClick={function () { }} noChevron={true}></ResultItem>
            {document.currentRevision.fileType && <ResultItem content={'File Type: ' + document.currentRevision.fileType} contentOnClick={function () { }} noChevron={true}></ResultItem>}
            <ResultItem content={'Revision: ' + document.currentRevision.revision} contentOnClick={function () { }} noChevron={true}></ResultItem>
            <ResultItem content={'Uploaded On: ' + uploadDateFormatted + ' - ' + uploadTimeFormatted} contentOnClick={function () { }} noChevron={true}></ResultItem>
            <ResultItem content={'Last Modified: ' + lastModifiedDateFormatted + ' - ' + lastModifiedTimeFormatted} contentOnClick={function () { }} noChevron={true}></ResultItem>
            <ResultItem content={'Labels: ' + document.labels} contentOnClick={function () { }} noChevron={true}></ResultItem>
        </div>
        )
    }
}

export default FileDetails;