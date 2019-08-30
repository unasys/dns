import React from 'react';
import SlidingPanel from '../../sliding-panels/SlidingPanel';
import Breadcrumbs from '../../breadcrumbs/Breadcrumbs';
import history from '../../../history';
import { connect } from 'react-redux';
import { changeCurrentInstallation } from '../../../actions/installationActions';
import HardcodedNorthSeaDetailsPanel from '../../sliding-panels/panels/details-panel/installation-details-panel/HardcodedNorthSeaDetailsPanel';
import KeaneScreen from '../../sliding-panels/panels/details-panel/installation-details-panel/KeaneScreen';

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
        if (this.state.filterTypeSelected) {
            content = this.getFilterTypeComponent(this.state.filterTypeSelected)
        } else {
            content = <HardcodedNorthSeaDetailsPanel
                onInstallationFilterClick={this.onFilterClick}>
            </HardcodedNorthSeaDetailsPanel>
        }

        let wrappedContent = content

        let keaneScreenContent = (
            <KeaneScreen
                installationDetails={this.props.currentInstallation}
                projectId={this.props.projectId}>
            </KeaneScreen>
        )

        return (
            <div>
                <SlidingPanel content={wrappedContent} isSmallWidth={true} pullRight={false}></SlidingPanel>
                {this.props.currentInstallation &&
                    <SlidingPanel content={keaneScreenContent} pullRight={true}></SlidingPanel>}
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

