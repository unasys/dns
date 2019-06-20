import React from 'react';
import SlidingPanel from '../../sliding-panels/SlidingPanel';
import OperatorPanel from './operator/OperatorPanel';
import InstallationTypePanel from './installationtype/InstallationTypePanel';
import AreaPanel from './areaofnorthsea/AreaPanel';
import MannedPanel from './mannedunmanned/MannedPanel';
import Breadcrumbs from '../../breadcrumbs/Breadcrumbs';
import history from '../../../history';
import { connect } from 'react-redux';
import { changeCurrentInstallation } from '../../../actions/installationActions';
import HardcodedNorthSeaDetailsPanel from '../../sliding-panels/panels/details-panel/installation-details-panel/HardcodedNorthSeaDetailsPanel';
import InstallationDetailsPanel from '../../sliding-panels/panels/details-panel/installation-details-panel/InstallationDetailsPanel';

class InstallationPanel extends React.Component {
    constructor(props) {
        super(props);

        this.onFilterClick = this.onFilterClick.bind(this);
        this.clearFilterType = this.clearFilterType.bind(this);

        this.state = {
            filterTypeSelected: ''
        }
        this.props.addToBreadcrumbs({
            name: 'Home', onClick: () => {
                this.clearFilterType()
                this.props.changeCurrentInstallation(null)
            }
        });
        this.onInstallationClick = this.onInstallationClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        // cleared currently selected installation 
        if (prevProps.pathname.includes('projects') && this.props.pathname === '/') {
            this.setState({
                filterTypeSelected: '',
            })
            this.props.removeBreadcrumbsAfter(0);
        }
    }

    onInstallationClick(installation) {
        this.props.changeCurrentInstallation(installation);
        if (installation.ProjectId) {
            history.push(`/projects/${installation.ProjectId}`);
        }
        this.props.changeMainContent(0);
    }

    getFilterTypeComponent(filterType) {
        switch (filterType) {
            case 'Operator':
                return <OperatorPanel
                    installations={this.props.installations}
                    addToBreadcrumbs={this.props.addToBreadcrumbs}
                    onInstallationClick={this.onInstallationClick}
                    setCesiumInstallations={this.props.setCesiumInstallations}>
                </OperatorPanel>;
            case 'Installation Type':
                return <InstallationTypePanel
                    installations={this.props.installations}
                    addToBreadcrumbs={this.props.addToBreadcrumbs}
                    onInstallationClick={this.onInstallationClick}
                    setCesiumInstallations={this.props.setCesiumInstallations}>
                </InstallationTypePanel>;
            case 'Area of the North Sea':
                return <AreaPanel
                    installations={this.props.installations}
                    addToBreadcrumbs={this.props.addToBreadcrumbs}
                    onInstallationClick={this.onInstallationClick}
                    setCesiumInstallations={this.props.setCesiumInstallations}>
                </AreaPanel>;
            case 'Manned/Unmanned':
                return <MannedPanel
                    installations={this.props.installations}
                    addToBreadcrumbs={this.props.addToBreadcrumbs}
                    onInstallationClick={this.onInstallationClick}
                    setCesiumInstallations={this.props.setCesiumInstallations}>
                </MannedPanel>
            default:
                return <div>Could not filter on unsupported property</div>;
        }
    }

    onFilterClick(filter) {
        this.setState({
            filterTypeSelected: filter
        })
    }

    clearFilterType() {
        this.setState({
            filterTypeSelected: ''
        })
    }

    render() {
        let content;
        if (this.props.currentInstallation) {
            content = <InstallationDetailsPanel
                installationDetails={this.props.currentInstallation}
                projectId={this.props.projectId}>
            </InstallationDetailsPanel>
        } else if (this.state.filterTypeSelected) {
            content = this.getFilterTypeComponent(this.state.filterTypeSelected)
        } else {
            content = <HardcodedNorthSeaDetailsPanel
                onInstallationFilterClick={this.onFilterClick}>
            </HardcodedNorthSeaDetailsPanel>
        }

        let wrappedContent =
            <Breadcrumbs
                crumbs={this.props.breadcrumbs}
                removeCrumbs={this.props.removeBreadcrumbsAfter}>
                {content}
            </Breadcrumbs>

        return (
            <div>
                <SlidingPanel content={wrappedContent} isSmallWidth={true}></SlidingPanel>
            </div>
        );
    }
}

function parsePathName(pathname) {
    let parts = pathname.split('/');
    if (parts.length >= 3) {
        return parts[2];
    }
    return null;
}

function mapDispatchToProps(dispatch) {
    return {
        changeCurrentInstallation: (currentInstallation) => {
            dispatch(changeCurrentInstallation(currentInstallation))
        }
    }
}

function mapStateToProps(state) {
    let pathname = state.router.location.pathname;
    let projectId = parsePathName(pathname);
    if (projectId) {

    }
    return {
        pathname: pathname,
        projectId: projectId,
        currentInstallation: state.InstallationReducer.currentInstallation,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InstallationPanel)

