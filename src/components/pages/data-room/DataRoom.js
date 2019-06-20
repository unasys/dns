import React, { Component } from 'react';
import './DataRoom.scss';
import SlidingPanel from '../../sliding-panels/SlidingPanel';
import { fetchDocumentsCall, getUnAuthedContentFromBlob } from '../../../api/Documents';
import axios from 'axios';
import FileViewer from 'react-file-viewer';
import { connect } from 'react-redux';
import EntityNavigationPanel from './panels/EntityNavigationPanel/EntityNavigationPanel';

const CancelToken = axios.CancelToken;

class DataRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rawDocuments: [],
            documents: [],
            selectedItems: [],
            fileTextContent: null,
            externalFileContent: null,
            filePath: null,
            type: null,
            isWideWidth: false
        }
        this.source = CancelToken.source();
        this.onDisplayFileViewer = this.onDisplayFileViewer.bind(this);
        this.closeFileViewer = this.closeFileViewer.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.externalFileFrame = React.createRef();
        this.handleSelectionFinish = this.handleSelectionFinish.bind(this);
        this.makeWideWidth = this.makeWideWidth.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.closeFileViewer);
        let projectId = this.props.match.params.currentProjectId;
        fetchDocumentsCall(projectId, this.source.token).then(results => {
            let documents = results.data._embedded.items
            this.setState({
                rawDocuments: documents,
                documents: [{ heading: 'Documents (' + results.data.total + ')', items: documents }]
            });
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.labelFilters !== prevProps.labelFilters) {
            let projectId = this.props.match.params.currentProjectId;
            fetchDocumentsCall(projectId, this.source.token, this.props.labelFilters).then(results => {
                let documents = results.data._embedded.items
                this.setState({
                    rawDocuments: documents,
                    documents: [{ heading: 'Documents (' + results.data.total + ')', items: documents }]
                });
            })
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.closeFileViewer);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    makeWideWidth() {
        this.setState({
            isWideWidth: true
        })
    }

    handleSelectionFinish = selectedItems => {
        this.setState({
            selectedItems
        })
    }

    onDisplayFileViewer(filePath, fileType) {
        if (fileType === "plain") {
            getUnAuthedContentFromBlob(filePath, this.source.token).then(res => {
                this.setState({
                    fileTextContent: res.data
                })
            });
        } else if (fileType === null) {
            this.setState({
                externalFileContent: filePath
            });
        } else {
            this.setState({
                filePath: filePath,
                fileType: fileType
            })
        }
    }

    closeFileViewer(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({
                filePath: null,
                fileType: null,
                fileTextContent: null,
                externalFileContent: null
            })
        }
    }

    onError(e) {
        console.error('whoops something went wrong.', e);
    }

    render() {
        let fileViewerContent;
        if (this.state.externalFileContent === null) {
            if (this.state.fileTextContent === null) {
                fileViewerContent = <FileViewer
                    fileType={this.state.fileType}
                    filePath={this.state.filePath}
                    onError={this.onError} />
            } else {
                fileViewerContent = <div className="text-preview">{this.state.fileTextContent}</div>
            }
        }

        let fileViewer = (
            <div className="file-viewer-container">
                <div className="file-viewer" ref={this.setWrapperRef}>
                    <div className="image">
                        {fileViewerContent}
                    </div>
                </div>
            </div>)


        let content =
            <EntityNavigationPanel
                projectId={this.props.match.params.currentProjectId}
                makeWideWidth={this.makeWideWidth}
                onDocSelect={this.handleSelectionFinish}
                onDisplayFileViewer={this.onDisplayFileViewer}
                selectedDocuments={this.state.selectedItems}>
            </EntityNavigationPanel>


        return (<>
            <div>

                {((this.state.filePath || this.state.fileTextContent) && !this.state.externalFileContent) && fileViewer}

                <SlidingPanel
                    content={content}
                    isSmallWidth={this.state.selectedItems.length === 0 || !this.state.isWideWidth}>
                </SlidingPanel>
            </div>

        </>)
    }
}

function mapStateToProps(state) {
    return {
        labelFilters: state.DataRoomReducer.filters
    }
}

export default connect(mapStateToProps)(DataRoom);