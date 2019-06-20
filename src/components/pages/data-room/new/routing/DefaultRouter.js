import React, { Component } from 'react';
import DocumentTypeTiles from '../../../../tiles/DocumentTypeTiles';
import DocumentTiles from '../../../../tiles/DocumentTiles';
import BreadcrumbPanel from '../../../../tiles/BreadcrumbPanel';

const defaultScreenIndex = 0;

class DefaultRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbs: [],
            currentScreen: defaultScreenIndex,
            screenDataDependencies: null,
            dataRoomScreens: [
                {
                    index: 0, getComponent: () => {
                        return (
                            <DocumentTypeTiles
                                projectId={this.props.projectId}
                                documentTypeSelected={this.props.documentTypeSelected}
                                addToBreadcrumbs={this.addToBreadcrumbs}
                                nextBreadcrumb={{ name: "Documents" }}
                                onClick={this.onClick}>
                            </DocumentTypeTiles>
                        )
                    }
                },
                {
                    index: 1, getComponent: () => {
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
        this.replaceBreadcrumb = this.replaceBreadcrumb.bind(this);
        this.onBreadcrumbClick = this.onBreadcrumbClick.bind(this);
        this.getScreenComponent = this.getScreenComponent.bind(this);
    }

    addToBreadcrumbs(breadcrumb) {
        this.setState({
            breadcrumbs: this.state.breadcrumbs.concat(breadcrumb)
        })
    }

    replaceBreadcrumb(breadcrumb) {
        this.setState({
            breadcrumbs: this.state.breadcrumbs.slice(0, this.state.breadcrumbs.length - 1).concat(breadcrumb)
        })
    }

    onBreadcrumbClick(breadcrumb) {
        this.setState({
            breadcrumbs: this.state.breadcrumbs.slice(0, breadcrumb.returnToIndex),
            currentScreen: breadcrumb.returnToIndex,
            screenDataDependencies: breadcrumb.returnToScreenDataDependencies
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
                onBreadcrumbClick={this.onBreadcrumbClick}>
            </BreadcrumbPanel>)

        return (<>
            {breadcrumbs}
            {this.getScreenComponent(this.state.currentScreen)}
        </>);
    }
}

export default DefaultRouter 