import React, { Component } from 'react';
import { getLabels, getLabelsByDocumentGroup } from '../../api/Labels';
import axios from 'axios';
import DropdownTab from '../tabs/DropdownTab';
import history from '../../history'

const CancelToken = axios.CancelToken;

class DataroomDropdowns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentGroups: [],
            documentTypes: [],
            isActive: false
        }
        this.source = CancelToken.source();
        this.fetchDocGroups = this.fetchDocGroups.bind(this);
        this.fetchDocumentTypes = this.fetchDocumentTypes.bind(this);
    }

    clearDocumentTypes() {
        this.setState({
            documentTypes: []
        })
    }

    dropdownClicked(docGroup) {
        this.clearDocumentTypes();
        this.fetchDocumentTypes(docGroup);
    }

    //doc gorup
    fetchDocGroups() {
        getLabels(this.props.projectId, null, this.source.token).then(res => {
            let documentGroups = res.data._embedded.items.find(group => group.key === "Document Group");
            if (documentGroups) {
                this.setState({
                    documentGroups: documentGroups.values
                })
            }
        })
    }
    
    //doc type
    fetchDocumentTypes(docGroup) {
        getLabelsByDocumentGroup(this.props.projectId, docGroup, this.source.token).then(res => {
            let documentTypes = res.data._embedded.items.find(group => group.key === "Document Type");
            if (documentTypes) {
                this.setState({
                    documentTypes: documentTypes.values.map(value => (
                        { name: value, onClick:() => history.push(`/projects/${this.props.projectId}/data-room`)}
                    )
                )
                });
            }
        })
    }

    componentDidMount() {
        this.fetchDocGroups();
    }

    render() {
        let dropdowns = 
            this.state.documentGroups.map(docGroup => {
                return (
                    { 
                        name: docGroup,
                        onClick:() => this.dropdownClicked(docGroup),
                        isSecondLevelDropdown:true,
                        dropdowns:this.state.documentTypes
                    }
                )
            })
        return (
            <DropdownTab
                initialName={"Data Room"}
                dropdowns={dropdowns}
                isActive={false}
                key={"Data Room"}
                onMainClick={() => {}}
                changeNameOnDropdownClick={false}>
            </DropdownTab>
        )
    }
}

export default DataroomDropdowns;