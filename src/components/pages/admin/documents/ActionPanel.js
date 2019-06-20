import React, { Component } from "react";
import AddDocument from "./AddDocument";
import Modal from "../modals/Modal";
import UpdateDocumentsType from "./UpdateDocumentsType";
import UpdateDocument from "./UpdateDocument";

class ActionPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createModelOpen: false,
            updateTypeOpen: false,
            updateDocumentOpen: false
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal(modalName) {
        this.setState({
            [modalName + 'Open']: true
        })
    }

    closeModal(modalName) {
        this.setState({
            [modalName + 'Open']: false
        })
    }

    render() {
        return (
            <div className="action-panel">
                <div className="margin-top-left">
                    <button type="button" onClick={this.openModal.bind(this, 'createModel')} className="button is-success">{'Create ' + this.props.entity}</button>
                    <hr />
                    <div className="selected-system-title">
                        <p className="menu-label">Document</p>
                        {this.props.selectedDocument ? this.props.selectedDocument.name : "Select a Document"}
                    </div>
                    {this.props.selectedDocument && <button type="button" onClick={this.openModal.bind(this, 'updateDocument')} className="button is-primary">{'Update Document'}</button>}
                    {this.props.selectedDocument && <button type="button" onClick={this.openModal.bind(this, 'updateType')} className="button is-primary">{'Assign new Document Type'}</button>}
                </div>

                {this.state.createModelOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <AddDocument
                                projectId={this.props.projectId}
                                close={this.closeModal.bind(this, 'createModel')}>
                            </AddDocument>}
                        close={this.closeModal.bind(this, 'createModel')}>
                    </Modal>}

                {this.state.updateTypeOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateDocumentsType
                                projectId={this.props.projectId}
                                document={this.props.selectedDocument}
                                close={this.closeModal.bind(this, 'updateType')}>
                            </UpdateDocumentsType>}
                        close={this.closeModal.bind(this, 'updateType')}>
                    </Modal>}

                {this.state.updateDocumentOpen &&
                    <Modal
                        entity={this.props.entity}
                        content={
                            <UpdateDocument
                                projectId={this.props.projectId}
                                document={this.props.selectedDocument}
                                close={this.closeModal.bind(this, 'updateDocument')}>
                            </UpdateDocument>}
                        close={this.closeModal.bind(this, 'updateDocument')}>
                    </Modal>}

            </div>
        )
    }
}

export default ActionPanel;