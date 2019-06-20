import React from 'react';
import axios from 'axios';
import DefinitionNew from './new/DefinitionNew';

const CancelToken = axios.CancelToken;

class DefinitionAndStatus extends React.Component {
    constructor(props) {
        super(props);
        this.addToBreadcrumbs = this.addToBreadcrumbs.bind(this);
        this.removeBreadcrumbsAfterIndex = this.removeBreadcrumbsAfterIndex.bind(this);
        this.updateBreadcrumbName = this.updateBreadcrumbName.bind(this);

        this.state = {
            breadcrumbs: [],
            projectConfig: null,
            isLoading: true
        }
        this.source = CancelToken.source();
    }

    componentDidMount() {
        this.fetchProjectConfig(this.props.match.params.currentProjectId);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    fetchProjectConfig(projectId) {
        if (projectId === null || projectId === '') return;
        axios.get(`/projects/${projectId}/config`, {
            cancelToken: this.source.token
        })
            .then(payload => {
                this.setState({
                    isLoading: false,
                    projectConfig: payload.data
                })
                return payload;
            })
            .catch((e) => {
                if (!axios.isCancel(e)) {
                    console.error('something went wrong when fetching installations in definitionandstatus.js', e);
                }
            })
    }

    addToBreadcrumbs(crumb) {
        this.setState({
            breadcrumbs: this.state.breadcrumbs.concat(crumb)
        })
    }

    updateBreadcrumbName(oldName, newName) {
        let newBreadcrumbs = this.state.breadcrumbs.map(breadcrumb => {
            if (breadcrumb.name === oldName) {
                breadcrumb.name = newName;
            }
            return breadcrumb;
        });
        this.setState({
            breadcrumbs: newBreadcrumbs
        })
    }

    removeBreadcrumbsAfterIndex(index) {
        let breadcrumbs = this.state.breadcrumbs.slice(0, index + 1)
        breadcrumbs[index].name = ''
        this.setState({
            breadcrumbs: breadcrumbs
        })
    }

    render() {
        return (
            // <DefinitionPanel
            //     breadcrumbs={this.state.breadcrumbs}
            //     addToBreadcrumbs={this.addToBreadcrumbs}
            //     removeBreadcrumbsAfter={this.removeBreadcrumbsAfterIndex}
            //     updateBreadcrumbName={this.updateBreadcrumbName}
            //     projectId={this.props.match.params.currentProjectId}
            //     projectConfig={this.state.projectConfig}>
            // </DefinitionPanel>
            <DefinitionNew projectId={this.props.match.params.currentProjectId}></DefinitionNew>
        );
    }
}

export default DefinitionAndStatus;
