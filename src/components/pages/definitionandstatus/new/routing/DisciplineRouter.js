import React, { Component } from 'react';
import TagTiles from '../../../../tiles/TagTiles';
import DisciplineTiles from '../../../../tiles/DisciplineTiles';
import EquipmentTiles from '../../../../tiles/EquipmentTiles';
import BreadcrumbPanel from '../../../../tiles/BreadcrumbPanel';
import RenderRenderInitialSelectionCrumb from '../../../../tiles/renderers/breadcrumbs/InitialSelectionCrumb';

const defaultScreenIndex = 0;

class DisciplineRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbs: [{ object: this.props.initialPath, renderer: RenderRenderInitialSelectionCrumb, returnToIndex: -1, returnToScreenDataDependencies: null, nextBreadcrumb: {name: 'Discipline'} }],
            currentScreen: defaultScreenIndex,
            screenDataDependencies: null,
            previewCrumbContent: null,
            dataRoomScreens: [
                {
                    index: 0, getComponent: () => {
                        return (
                            <DisciplineTiles
                                projectId={this.props.projectId}
                                documentTypeSelected={this.props.documentTypeSelected}
                                nextBreadcrumb={{name:'Equipment Type'}}
                                addToBreadcrumbs={this.addToBreadcrumbs}
                                setPreviewCrumbContent={this.setPreviewCrumbContent}
                                onClick={this.onClick}>
                            </DisciplineTiles>
                        )
                    }
                },
                {
                    index: 1, getComponent: () => {
                        return (
                            <EquipmentTiles
                                projectId={this.props.projectId}
                                screenDataDependencies={this.state.screenDataDependencies}
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
                    index: 2, getComponent: () => {
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
        if (breadcrumb.returnToIndex === -1) {
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

export default DisciplineRouter 