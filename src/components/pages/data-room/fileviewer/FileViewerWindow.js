import React, { Component } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import './FileViewerWindow.scss'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class FileViewerWindow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            numPages: null,
            pageNumber: 1,
            showDocument: true
        }
        this.clearDocument = this.clearDocument.bind(this);
        this.moveToPreviousPage = this.moveToPreviousPage.bind(this);
        this.moveToNextPage = this.moveToNextPage.bind(this);
    }

    clearDocument() {
        this.setState({
            showDocument: false,
            pageNumber: 1
        })
    }

    moveToPreviousPage() {
        if (this.state.pageNumber === 1) return;

        this.setState({
            pageNumber: this.state.pageNumber - 1
        })
    }

    moveToNextPage() {
        if (this.state.numPages === this.state.pageNumber) return;
        this.setState({
            pageNumber: this.state.pageNumber + 1
        })
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    componentDidUpdate(nextProps) {
        if (this.props.document !== nextProps.document) {
            this.setState({
                showDocument: true
            })
        }
    }

    render() {
        return (
            this.props.document !== null &&
            this.state.showDocument &&
            <>
                <div className="file-viewer-window">
                    <div className="action-bar">
                        <i className="fas fa-times close-button" onClick={this.clearDocument}></i>
                    </div>
                    <Document
                        file={this.props.document.filePath}
                        onLoadSuccess={this.onDocumentLoadSuccess}>
                        <Page width={600} pageNumber={this.state.pageNumber} />
                    </Document>
                    <div className="page-controls">
                        <i className="fas fa-chevron-left" onClick={this.moveToPreviousPage}></i><p>Page {this.state.pageNumber} of {this.state.numPages}</p>
                        <i className="fas fa-chevron-right" onClick={this.moveToNextPage}></i>
                    </div>
                </div>
            </>
        )
    }
}

export default FileViewerWindow;