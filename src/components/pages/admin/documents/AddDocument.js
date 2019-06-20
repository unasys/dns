import React, { Component } from "react";
import './styles/AddDocument.scss';
import Created from "../../../visuals/user-feedback/Created";
import { createNewDocumentCall } from "../../../../api/Documents";
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import update from 'react-addons-update';
import axios from 'axios';

const CancelToken = axios.CancelToken;

class AddDocument extends Component {

    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.state = {
            name: '',
            nameError: '',
            documents: [],
            documentError: '',
            detail: '',
            labels: [{ key: null, value: null }],
            created: false,
            keyValueLabelsNum: 1
        }
        this.uploadDocument = this.uploadDocument.bind(this);
        this.addLabelInput = this.addLabelInput.bind(this);
        this.onLabelChange = this.onLabelChange.bind(this);
    }

    addLabelInput() {
        this.setState({
            keyValueLabelsNum: this.state.keyValueLabelsNum + 1,
            labels: this.state.labels.concat({ key: null, value: null })
        })
    }

    // on form change - reset error text. 
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, [`${e.target.name}Error`]: '' })
    }

    onLabelChange = (e, index, type) => {
        let value = e.target.value;

        this.setState({
            labels: update(this.state.labels, { [index]: { [type]: { $set: value } } })
        })
    }

    clientSideValidation() {
        let passed = true;
        if (this.state.name.length === 0 && this.state.documents.length < 2) {
            this.setState({
                nameError: 'Name is required!'
            })
            passed = false;
        }
        if (this.state.documents === null || this.state.documents.length === 0) {
            this.setState({
                documentError: 'Upload a document first!'
            })
            passed = false;
        }
        return passed;
    }

    documentUploaded(acceptedFiles) {
        this.setState({
            documents: acceptedFiles,
            documentError: ''
        })
    }

    clearDocumentUploaded(e) {
        this.setState({
            documentError: ''
        })
    }

    resetCreatedState() {
        this.setState({
            created: false
        })
    }

    onDrop = (acceptedFiles, rejectedFiles) => {
        // Do something with files
        this.documentUploaded(acceptedFiles);
    }

    // merges an array of javascript objects into a single object.
    mergeObject(array) {
        return array.reduce(function (result, currentObject) {
            for (var key in currentObject) {
                if (currentObject.hasOwnProperty(key)) {
                    result[key] = currentObject[key];
                }
            }
            return result;
        }, {});
    }


    uploadDocument(e) {
        e.preventDefault();
        e.target.className += ' was-validated';


        if (!this.clientSideValidation()) {
            return;
        }

        let labelArray = this.state.labels.map(label => {
            let labelKey = label.key
            let labelValue = label.value
            return { [labelKey]: labelValue }
        })

        let labels = this.mergeObject(labelArray);

        let documentsLength = this.state.documents.length;

        this.state.documents.forEach((document, i) => {
            let stateDocuments = this.state.documents
            let nameUIEntry = this.state.name
            let detail = this.state.detail
            let projectId = this.props.projectId
            let token = this.source.token
            let self = this
            setTimeout(function () {
                let body = new FormData()
                body.append('file', document)
                let fileName = (stateDocuments.length === 1 ? nameUIEntry : document.name)

                body.append('metadata', new Blob([JSON.stringify({
                    name: fileName,
                    detail: detail,
                    labels: labels,
                    revision: 0
                })], { type: "application/json" }));

                createNewDocumentCall(projectId, body, token)
                    .then(payload => {
                        // Server side validation.
                        if (payload.status === 201) {
                            // success 
                            if (documentsLength > 1) {
                                self.setState({
                                    massUploadMessage: 'Uploading document ' + (i + 1) + ' of ' + documentsLength
                                })
                                if ((i + 1) === documentsLength) {
                                    setTimeout(function () {
                                        self.setState({
                                            massUploadMessage: 'Done!'
                                        })
                                    }, 1000)
                                }
                            } else {
                                self.setState({
                                    created: true
                                })
                            }
                        } else {
                            //error
                            switch (payload.data.Case) {
                                default:
                                    return; // currently silently erroring
                            }
                        }
                    }
                    ).catch((e) => {
                        console.error('something went wrong when fetching installations in addsubsystems.js', e);
                    })
            }, 1000 * i)
        })
    }

    render() {
        let content;
        if (this.state.created) {
            content = <Created entityName="Document"></Created>
            new Promise(resolve => setTimeout(resolve, 1500)).then(res => {
                this.resetCreatedState();
            });
        } else {
            let labelInputs = []
            for (let i = 0; i < this.state.keyValueLabelsNum; i++) {
                labelInputs.push(
                    <div className="labels-container" key={i}>
                        <input type="text" name={`key${i}`} onBlur={e => this.onLabelChange(e, i, "key")} className={"input"} placeholder="Key" />
                        <input type="text" name={`value${i}`} onBlur={e => this.onLabelChange(e, i, "value")} className={"input"} placeholder="Value" />
                    </div>);
            }

            content = (
                <div className="add-document-container">
                    <h1 className="title">
                        Create Document
                    </h1>
                    <form onSubmit={this.uploadDocument}>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input type="text" name="name" onBlur={e => this.onChange(e)} className={"input" + (this.state.nameError.length > 0 ? ' is-danger' : '')} placeholder="Enter Name" disabled={this.state.documents.length > 1} />
                                <p className="help is-danger">
                                    {this.state.nameError}
                                </p>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Detail</label>
                            <div className="control">
                                <input type="text" name="detail" onBlur={e => this.onChange(e)} className={"input"} placeholder="Enter Detail" />
                            </div>
                        </div>
                        <div className="react-tags">
                            <label className="label">Labels</label>
                            {/* eslint-disable-next-line */}
                            <a class="button is-primary" onClick={this.addLabelInput}>
                                <span className="icon">
                                    <i className="fas fa-plus"></i>
                                </span>
                            </a>
                            {labelInputs}
                        </div>
                        <br />
                        <Dropzone onDrop={this.onDrop} disableClick>
                            {({ getRootProps, getInputProps, isDragActive, open }) => {
                                return (
                                    <div {...getRootProps()} className={classNames('dropzone', { 'dropzone--isActive': isDragActive })}>
                                        <input className={"input" + (this.state.documentError.length > 0 ? ' is-danger' : '')} {...getInputProps()} />
                                        <p className="help is-danger">
                                            {this.state.documentError}
                                        </p>
                                        {
                                            <div>
                                                {isDragActive ?

                                                    <div className="drop-zone">
                                                        <i className="fas fa-file-upload file-icon"></i> Drop file to upload.
                                            </div> :
                                                    <div className="drop-zone">
                                                        {this.state.documents[0] ?
                                                            (this.state.documents.length > 1 ? `Mass Upload - (${this.state.documents.length})` : this.state.documents[0].name) :
                                                            <span>
                                                                <div className="drop-file-text">Drop file here...</div>
                                                                <button className="button is-primary" onClick={() => open()}>
                                                                    Or select from your computer.
                                                                </button>
                                                            </span>}
                                                    </div>}
                                            </div>
                                        }
                                        {this.state.massUploadMessage && <div>{this.state.massUploadMessage}</div>}
                                    </div>
                                )
                            }}
                        </Dropzone>
                        <button type="submit" className="button is-link">Submit</button>
                    </form>
                </div>
            )
        }
        return (
            <div className="add-document-container border rounded">
                <div className="close-button-container"><i className="fas fa-times close-button" onClick={this.props.close}></i></div>
                {content}
            </div>
        )
    }
}

export default AddDocument;