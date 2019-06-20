import React, { Component } from 'react';
import ModuleTiles from '../../../../tiles/ModuleTiles';
import DocumentTiles from '../../../../tiles/DocumentTiles';
import BreadcrumbPanel from '../../../../tiles/BreadcrumbPanel';
import AreaTiles from '../../../../tiles/AreaTiles';
import RenderDocumentTypeTileCrumb from '../../../../tiles/renderers/breadcrumbs/DocumentTypeCrumbRenderer';

const defaultScreenIndex = 1;

class StructuralDrawingRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbs: [
                { 
                  object: this.props.documentType,
                  renderer: RenderDocumentTypeTileCrumb,
                  returnToIndex: -1,
                  returnToScreenDataDependencies: null,
                  nextBreadcrumb: {name: 'Module'} 
                }
            ],
            currentScreen: defaultScreenIndex,
            screenDataDependencies: null,
            previewCrumbContent: null,
            dataRoomScreens: [
                {
                    index: 1, getComponent: () => {
                        return (
                            <ModuleTiles
                                projectId={this.props.projectId}
                                docCount={true}
                                returnToIndex={1}
                                addToBreadcrumbs={this.addToBreadcrumbs}
                                nextBreadcrumb={{name:'Area'}}
                                setPreviewCrumbContent={this.setPreviewCrumbContent}
                                onEntityClick={this.props.onEntityClick}
                                onClick={this.onClick}>
                            </ModuleTiles>
                        )
                    }
                },
                {
                    index: 2, getComponent: () => {
                        return <AreaTiles
                            projectId={this.props.projectId}
                            docCount={true}
                            screenDataDependencies={this.state.screenDataDependencies}
                            addToBreadcrumbs={this.addToBreadcrumbs}
                            nextBreadcrumb={{name:'Documents'}}
                            setPreviewCrumbContent={this.setPreviewCrumbContent}
                            onEntityClick={this.props.onEntityClick}
                            onClick={this.onClick}>
                        </AreaTiles>
                    }
                },
                {
                    index: 3, getComponent: () => {
                        return <DocumentTiles
                            projectId={this.props.projectId}
                            screenDataDependencies={this.state.screenDataDependencies}
                            addToBreadcrumbs={this.addToBreadcrumbs}
                            documentOnClick={this.props.documentOnClick}
                            onClick={this.onClick}>
                        </DocumentTiles>
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

    onBreadcrumbClick(breadcrumb) {
        if (breadcrumb.returnToIndex === -1) { // go up a level.
            this.props.documentTypeSelected(null);
        } else {
            this.setState({
                breadcrumbs: this.state.breadcrumbs.slice(0, breadcrumb.returnToIndex),
                currentScreen: breadcrumb.returnToIndex,
                screenDataDependencies: breadcrumb.returnToScreenDataDependencies
            })
        }
    }

    setPreviewCrumbContent(previewContent) {
        this.setState({
            previewCrumbContent: previewContent
        })
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

export default StructuralDrawingRouter 