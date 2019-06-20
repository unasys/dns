import React, { Component } from 'react';
import Tiles from './Tiles';
import './DocumentTypeTile.scss';
import SubsystemSelector from '../selectors/tile-selectors/SubsystemSelector';
import RenderSubsystem from './renderers/SubsystemTileRenderer';
import RenderSubsystemCrumbRenderer from './renderers/breadcrumbs/SubsystemCrumbRenderer';

class SubsystemTiles extends Component {

    constructor(props) {
        super(props);
        this.onTileClick = this.onTileClick.bind(this);
        this.onActivityClick = this.onActivityClick.bind(this);
        this.onChevronClick = this.onChevronClick.bind(this);
        this.state = {
            showActivityBox: false,
            isBarOpen: false,
            openBarFor: null
        }
        this.hideHardcode = this.hideHardcode.bind(this);
        this.onHover = this.onHover.bind(this);
    }

    onTileClick(system) {
        this.props.addToBreadcrumbs({ object: system, renderer: RenderSubsystemCrumbRenderer, returnToIndex: 2, returnToScreenDataDependencies: this.props.screenDataDependencies, nextBreadcrumb: this.props.nextBreadcrumb });
        this.props.onClick({ references: system.id });
        this.props.onEntityClick(system.id);
    }

    onActivityClick(e) {
        e.stopPropagation();
        this.setState({
            showActivityBox: !this.state.showActivityBox
        })
    }

    hideHardcode() {
        this.setState({
            showActivityBox: false
        })
    }

    onChevronClick(e, document) {
        e.stopPropagation();
        this.setState({
            isBarOpen: !this.state.isBarOpen,
            openBarFor: document
        })
    }

    onHover(subsystem) {
        this.props.setPreviewCrumbContent(subsystem)
    }

    render() {
        let urlParams = this.props.screenDataDependencies

        let hardcodedActivityBox = (
            <div className="hardcoded-activity-box" onClick={this.hideHardcode}>
                <img src={require('../../assets/DecomProcedure.png')} alt="decom-proc"></img>
            </div >
        )

        let tiles = (
            <Tiles>
                <SubsystemSelector
                    projectId={this.props.projectId}
                    urlParams={urlParams}
                    docCount={true}
                    onRender={(systems) => {
                        return systems.map(system => {
                            let barOpen =
                                (this.state.isBarOpen &&
                                    this.state.openBarFor === system.id)
                            return RenderSubsystem(system, this.onTileClick, this.onActivityClick, this.onChevronClick, barOpen, this.onHover)
                        })
                    }}>
                </SubsystemSelector>
            </Tiles>
        )
        return <>
            {this.state.showActivityBox && hardcodedActivityBox}
            {tiles}
        </>
    }
}

export default SubsystemTiles