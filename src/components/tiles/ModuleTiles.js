import React, { Component } from 'react';
import Tiles from './Tiles';
import './DocumentTypeTile.scss';
import ModuleSelector from '../selectors/tile-selectors/ModuleSelector';
import RenderModule from './renderers/ModuleTileRenderer';
import RenderModuleCrumb from './renderers/breadcrumbs/ModuleCrumbRenderer';


class ModuleTiles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isBarOpen: false,
            openBarFor: null
        }
        this.onTileClick = this.onTileClick.bind(this);
        this.onChevronClick = this.onChevronClick.bind(this);
        this.onHover = this.onHover.bind(this);
    }

    onTileClick(moduleObject) {
        this.props.addToBreadcrumbs({ object: moduleObject, renderer: RenderModuleCrumb, returnToIndex: this.props.returnToIndex, returnToScreenDataDependencies: this.props.screenDataDependencies, nextBreadcrumb: this.props.nextBreadcrumb });
        this.props.onClick({ moduleId: moduleObject.id });
        this.props.onEntityClick(moduleObject.id);
        this.props.setPreviewCrumbContent(null)
    }

    onChevronClick(e, moduleObject) {
        e.stopPropagation();
        this.setState({
            isBarOpen: !this.state.isBarOpen,
            openBarFor: moduleObject.id
        })
    }

    onHover(moduleObject) {
        this.props.setPreviewCrumbContent(moduleObject)
    }

    render() {
        let tiles = (
            <Tiles>
                <ModuleSelector
                    projectId={this.props.projectId}
                    docCount={this.props.docCount}
                    tagCount={this.props.tagCount}
                    urlParams={this.props.screenDataDependencies}
                    onRender={(modules) => {
                        return modules.map(moduleObject => {
                            let barOpen =
                                (this.state.isBarOpen &&
                                    this.state.openBarFor === moduleObject.id)
                            return RenderModule(moduleObject, this.onTileClick, this.onChevronClick, barOpen, this.onHover);
                        })
                    }}>
                </ModuleSelector>
            </Tiles>
        )
        return tiles
    }
}

export default ModuleTiles