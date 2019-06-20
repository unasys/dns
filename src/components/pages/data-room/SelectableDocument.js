import React from 'react';
import { createSelectable } from 'react-selectable-fast';
import './DataRoom.scss';
import DocumentLabel from './DocumentLabel';


function getIcon(type) {
    switch (type) {
        case "image/jpeg":
            return <i className="fas fa-file-image"></i>;
        case "image/png":
            return <i className="fas fa-file-image"></i>;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return <i className="fas fa-file-word"></i>
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            return <i className="fas fa-file-excel"></i>
        case "application/vnd.ms-excel":
            return <i className="fas fa-file-csv"></i>
        case "text/plain":
            return <i className="fas fa-file-alt" ></i>
        case "application/pdf":
            return <i className="fas fa-file-pdf"></i>
        default:
            return <i className="fas fa-file"></i>
    }
}

const SelectableDocument = ({ selectableRef, selected, selecting, document }) => {
    return (
        <div
            ref={selectableRef}
            className={"document-card " + (selected ? 'selected ' : '') + (selecting ? 'selecting' : '')}>
            {getIcon(document.currentRevision.fileType)}
            <div className="document-card-name">
                {document.name}
                <div className="last-updated">
                    {/* {new Date(document.currentRevision.uploadedOn).toLocaleDateString('en-GB')} - {new Date(document.currentRevision.uploadedOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <br /> */}
                    {document.labels.map((label, i) => <DocumentLabel key={i} label={label}></DocumentLabel>)}
                </div>
            </div>
        </div>
    )
}

export default createSelectable(SelectableDocument);

