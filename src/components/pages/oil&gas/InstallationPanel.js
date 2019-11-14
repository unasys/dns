import React from 'react';
import SlidingPanel from '../../sliding-panels/SlidingPanel';
import history from '../../../history';
import { connect } from 'react-redux';
import { changeCurrentEntity } from '../../../actions/installationActions';
import HardcodedNorthSeaDetailsPanel from '../../sliding-panels/panels/details-panel/installation-details-panel/HardcodedNorthSeaDetailsPanel';
import InstallationKeaneScreen from '../../sliding-panels/panels/details-panel/installation-details-panel/InstallationKeaneScreen';
import AreaKeaneScreen from '../../sliding-panels/panels/details-panel/area-details-panel/AreaKeaneScreen';
import PipelineKeaneScreen from '../../sliding-panels/panels/pipeline-details-panel/PipelineKeaneScreen';
import WindfarmKeaneScreen from '../../sliding-panels/panels/windfarm-details-panel/WindfarmKeaneScreen';


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
                this.props.changeCurrentEntity(null)
            },
            currentRightKeaneScreen: <></>
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

    componentWillUpdate(nextProps) {
        if (this.props.currentEntity !== nextProps.currentEntity && nextProps.currentEntity) {      
            let entityType = nextProps.currentEntity.type;
            switch (entityType) {
                case "Installation": 
                    let keaneScreenContent = (
                        <InstallationKeaneScreen
                            installationDetails={nextProps.currentEntity.entity}
                            projectId={nextProps.projectId}>
                        </InstallationKeaneScreen>
                    )      
                    this.setState({
                        currentRightKeaneScreen: <SlidingPanel content={keaneScreenContent} pullRight={true}></SlidingPanel>
                    })
                    return;
                case "Windfarm":
                        this.setState({
                            currentRightKeaneScreen: <SlidingPanel content={<WindfarmKeaneScreen
                                windfarmDetails={nextProps.currentEntity.entity}
                                projectId={nextProps.projectId}>
                            ></WindfarmKeaneScreen>} pullRight={true}></SlidingPanel>
                        })
                    return;
                case "Pipeline":
                        this.setState({
                            currentRightKeaneScreen: <SlidingPanel content={<PipelineKeaneScreen
                                pipelineDetails={nextProps.currentEntity.entity}
                                projectId={nextProps.projectId}>
                            ></PipelineKeaneScreen>} pullRight={true}></SlidingPanel>
                        })
                    return;
                default: 
                    return;
            }
        } else {
            if ((!this.state.currentRightKeaneScreen || this.props.currentArea !== nextProps.currentArea) && this.props.allInstallations.length !== 0) { 
                this.setState({
                    currentRightKeaneScreen: <SlidingPanel content={<AreaKeaneScreen
                        areaDetails={nextProps.currentArea.details}
                        allInstallations={nextProps.allInstallations}
                        projectId={nextProps.projectId}>
                    ></AreaKeaneScreen>} pullRight={true}></SlidingPanel>
                })
            }
        }
    }

    onInstallationClick(installation) {
        this.props.changeCurrentEntity({entity: installation, type: "Installation"});
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

        return (
            <div>
                <SlidingPanel content={wrappedContent} isSmallWidth={true} pullRight={false}></SlidingPanel>
                {this.state.currentRightKeaneScreen}            
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
        changeCurrentEntity: (currentInstallation) => {
            dispatch(changeCurrentEntity({ entity: currentInstallation, type: "Installation"})) // change type to enum.
        }
    }
}

function mapStateToProps(state) {
    let pathname = state.router.location.pathname;
    let projectId = parsePathName(pathname);
    return {
        pathname: pathname,
        projectId: projectId,
        currentEntity: state.InstallationReducer.currentEntity,
        currentArea: state.AreaReducer.currentArea
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InstallationPanel)

