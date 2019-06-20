import React, { Component } from 'react';
import FacilityTiles from '../../../../tiles/FacilityTiles';
import ModuleTiles from '../../../../tiles/ModuleTiles';
import AreaTiles from '../../../../tiles/AreaTiles';
import TagTiles from '../../../../tiles/TagTiles';
import LocationTiles from '../../../../tiles/LocationTiles';
import EquipmentTiles from '../../../../tiles/EquipmentTiles';
import BreadcrumbPanel from '../../../../tiles/BreadcrumbPanel';
import RenderRenderInitialSelectionCrumb from '../../../../tiles/renderers/breadcrumbs/InitialSelectionCrumb';

const defaultScreenIndex = 1;

class FacilityRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbs: [{ object: this.props.initialPath, renderer: RenderRenderInitialSelectionCrumb, returnToIndex: -1, returnToScreenDataDependencies: null, nextBreadcrumb: {name: 'Facility'} }],
            currentScreen: defaultScreenIndex,
            screenDataDependencies: null,
            previewCrumbContent: null, 
            dataRoomScreens: [
                {
                    index: 1, getComponent: () => {
                        return (
                            <FacilityTiles
                                projectId={this.props.projectId}
                                returnToIndex={1}
                                addToBreadcrumbs={this.addToBreadcrumbs}
                                nextBreadcrumb={{name:'Module'}}
                                setPreviewCrumbContent={this.setPreviewCrumbContent}
                                tagCount={true}
                                onClick={this.onClick}>
                            </FacilityTiles>
                        )
                    }
                },
                {
                    index: 2, getComponent: () => {
                        return (
                            <ModuleTiles
                                projectId={this.props.projectId}
                                tagCount={true}
                                returnToIndex={2}
                                screenDataDependencies={this.state.screenDataDependencies}
                                replaceBreadcrumb={this.replaceBreadcrumb}
                                addToBreadcrumbs={this.addToBreadcrumbs}
                                documentOnClick={this.props.documentOnClick}
                                setPreviewCrumbContent={this.setPreviewCrumbContent}
                                nextBreadcrumb={{name:'Area'}}
                                onClick={this.onClick}
                                onEntityClick={this.props.onEntityClick}>
                            </ModuleTiles>
                        )
                    }
                },
                {
                    index: 3, getComponent: () => {
                        return (
                            <AreaTiles
                                projectId={this.props.projectId}
                                tagCount={true}
                                screenDataDependencies={this.state.screenDataDependencies}
                                replaceBreadcrumb={this.replaceBreadcrumb}
                                addToBreadcrumbs={this.addToBreadcrumbs}
                                documentOnClick={this.props.documentOnClick}
                                setPreviewCrumbContent={this.setPreviewCrumbContent}
                                nextBreadcrumb={{name:'Location'}}
                                onClick={this.onClick}
                                onEntityClick={this.props.onEntityClick}>
                            </AreaTiles>
                        )
                    }
                },
                {
                    index: 4, getComponent: () => {
                        return (
                            <LocationTiles
                                projectId={this.props.projectId}
                                screenDataDependencies={this.state.screenDataDependencies}
                                replaceBreadcrumb={this.replaceBreadcrumb}
                                tagCount={true}
                                addToBreadcrumbs={this.addToBreadcrumbs}
                                documentOnClick={this.props.documentOnClick}
                                setPreviewCrumbContent={this.setPreviewCrumbContent}
                                nextBreadcrumb={{name:'Equipment Type'}}
                                onClick={this.onClick}
                                onEntityClick={this.props.onEntityClick}>
                            </LocationTiles>
                        )
                    }
                },
                {
                    index: 5, getComponent: () => {
                        return (
                            <EquipmentTiles
                                projectId={this.props.projectId}
                                screenDataDependencies={this.state.screenDataDependencies}
                                tagCount={true}
                                replaceBreadcrumb={this.replaceBreadcrumb}
                                addToBreadcrumbs={this.addToBreadcrumbs}
                                documentOnClick={this.props.documentOnClick}
                                setPreviewCrumbContent={this.setPreviewCrumbContent}
                                nextBreadcrumb={{name:'Tags'}}
                                onClick={this.onClick}
                                onEntityClick={this.props.onEntityClick}>
                            </EquipmentTiles>
                        )
                    }
                },
                {
                    index: 6, getComponent: () => {
                        return (
                            <TagTiles
                                projectId={this.props.projectId}
                                screenDataDependencies={this.state.screenDataDependencies}
                                replaceBreadcrumb={this.replaceBreadcrumb}
                                addToBreadcrumbs={this.addToBreadcrumbs}
                                documentOnClick={this.props.documentOnClick}
                                onClick={this.onClick}
                                onEntityClick={this.props.onEntityClick}>
                            </TagTiles>
                        )
                    }
                }
            ]
        }
        this.onClick = this.onClick.bind(this);
        this.addToBreadcrumbs = this.addToBreadcrumbs.bind(this);
        this.onBreadcrumbClick = this.onBreadcrumbClick.bind(this);
        this.getScreenComponent = this.getScreenComponent.bind(this);
        this.setPreviewCrumbContent = this.setPreviewCrumbContent.bind(this);
    }

    addToBreadcrumbs(breadcrumb) {
        this.setState({
            breadcrumbs: this.state.breadcrumbs.concat(breadcrumb)
        })
    }

    setPreviewCrumbContent(previewContent) {
        this.setState({
            previewCrumbContent: previewContent
        })
    }

    onBreadcrumbClick(breadcrumb) {
        if (breadcrumb.returnToIndex === -1) { // go up a level.
            this.props.initialPathSelected(null);
        } else {
            this.setState({
                breadcrumbs: this.state.breadcrumbs.slice(0, breadcrumb.returnToIndex),
                currentScreen: breadcrumb.returnToIndex,
                screenDataDependencies: breadcrumb.returnToScreenDataDependencies
            })
        }
    }

    getScreenComponent(index) {
        let screenData = this.state.dataRoomScreens.find(screen => screen.index === index);
        return screenData.getComponent();
    }

    onClick(screenDataDependencies) {
        this.setState({
            currentScreen: (this.state.currentScreen + 1),
            screenDataDependencies: screenDataDependencies
        })
    }

    render() {
        let breadcrumbs = (
            <BreadcrumbPanel
                breadcrumbs={this.state.breadcrumbs}
                onBreadcrumbClick={this.onBreadcrumbClick}
                previewCrumbContent={this.state.previewCrumbContent}>
            </BreadcrumbPanel>)

        return (<>
            {breadcrumbs}
            {this.getScreenComponent(this.state.currentScreen)}
        </>);
    }
}

export default FacilityRouter 