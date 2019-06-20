import React, { Component } from 'react';
import ProductionUnitTiles from '../../../../tiles/ProductionUnitTiles';
import SystemTiles from '../../../../tiles/SystemTiles';
import DocumentTiles from '../../../../tiles/DocumentTiles';
import BreadcrumbPanel from '../../../../tiles/BreadcrumbPanel';
import RenderDocumentTypeTileCrumb from '../../../../tiles/renderers/breadcrumbs/DocumentTypeCrumbRenderer';

const defaultScreenIndex = 1;

class Router extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbs: [{ object: this.props.documentType, renderer: RenderDocumentTypeTileCrumb, returnToIndex: -1, returnToScreenDataDependencies: null, nextBreadcrumb: {name: 'Production Unit'} }],
            currentScreen: defaultScreenIndex,
            screenDataDependencies: null,
            previewCrumbContent: null,
            dataRoomScreens: [
                {
                    index: 1, getComponent: () => {
                        return (
                            <ProductionUnitTiles
                                projectId={this.props.projectId}
                                screenDataDependencies={this.state.screenDataDependencies}
                                addToBreadcrumbs={this.addToBreadcrumbs}
                                nextBreadcrumb= {{name: 'System'}}
                                setPreviewCrumbContent={this.setPreviewCrumbContent}
                                onClick={this.onClick}>
                            </ProductionUnitTiles>
                        )
                    }
                },
                {
                    index: 2, getComponent: () => {
                        return (
                            <SystemTiles
                                projectId={this.props.projectId}
                                returnToIndex={2}
                                onEntityClick={this.props.onEntityClick}
                                screenDataDependencies={this.state.screenDataDependencies}
                                addToBreadcrumbs={this.addToBreadcrumbs}
                                nextBreadcrumb= {{name: 'Documents'}}
                                setPreviewCrumbContent={this.setPreviewCrumbContent}
                                onClick={this.onClick}>
                            </SystemTiles>
                        )
                    }
                },
                {
                    index: 3, getComponent: () => {
                        return (
                            <DocumentTiles
                                projectId={this.props.projectId}
                                screenDataDependencies={this.state.screenDataDependencies}
                                replaceBreadcrumb={this.replaceBreadcrumb}
                                addToBreadcrumbs={this.addToBreadcrumbs}
                                documentOnClick={this.props.documentOnClick}
                                onClick={this.onClick}>
                            </DocumentTiles>
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
            this.props.documentTypeSelected(null);
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

export default Router 