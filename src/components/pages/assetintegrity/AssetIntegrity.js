import React from 'react';
import AssetPanel from './AssetPanel';

class AssetIntegrity extends React.Component {
    constructor(props) {
        super(props);
        this.addToBreadcrumbs = this.addToBreadcrumbs.bind(this);
        this.removeBreadcrumbsAfterIndex = this.removeBreadcrumbsAfterIndex.bind(this);
        this.updateBreadcrumbName = this.updateBreadcrumbName.bind(this);

        this.state = {
            breadcrumbs: []
        }
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
            <AssetPanel
                breadcrumbs={this.state.breadcrumbs}
                addToBreadcrumbs={this.addToBreadcrumbs}
                removeBreadcrumbsAfter={this.removeBreadcrumbsAfterIndex}
                updateBreadcrumbName={this.updateBreadcrumbName}
                projectId={this.props.match.params.currentProjectId}>
            </AssetPanel>
        );
    }
}

export default AssetIntegrity;
