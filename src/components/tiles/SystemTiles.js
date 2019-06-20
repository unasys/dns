import React, { Component } from 'react';
import Tiles from './Tiles';
import './DocumentTypeTile.scss';
import SystemSelector from '../selectors/tile-selectors/SystemSelector';
import RenderSystemTile from './renderers/SystemTileRenderer';
import RenderSystemCrumbRenderer from './renderers/breadcrumbs/SystemCrumbRenderer';

class SystemTiles extends Component {

    constructor(props) {
        super(props);
        this.onTileClick = this.onTileClick.bind(this);
        this.onActivityClick = this.onActivityClick.bind(this);
        this.onChevronClick = this.onChevronClick.bind(this);
        this.state = {
            showActivityBox: false,
            isBarOpen: false,
            openBarFor: null,
            isCardFlipped: false,
            flippedFor: null
        }
        this.hideHardcode = this.hideHardcode.bind(this);
        this.onHover = this.onHover.bind(this);
        this.flipCard = this.flipCard.bind(this);
    }

    onTileClick(system) {
        this.props.addToBreadcrumbs({ object: system, renderer: RenderSystemCrumbRenderer, returnToIndex: this.props.returnToIndex, returnToScreenDataDependencies: this.props.screenDataDependencies, nextBreadcrumb:this.props.nextBreadcrumb });
        this.props.onClick({ references: system.id });
        this.props.onEntityClick(system.id);
        this.props.setPreviewCrumbContent(null)
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

    onHover(system) {
        this.props.setPreviewCrumbContent(system)
    }

    flipCard(e, system) {
        e.stopPropagation();
        this.setState({
            isCardFlipped: !this.state.isCardFlipped,
            flippedFor: system.id
        })
    }

    render() {
        let urlParams = this.props.screenDataDependencies;

        let hardcodedActivityBox = (
            <div className="hardcoded-activity-box" onClick={this.hideHardcode}>
                <img src={require('../../assets/DecomProcedure.png')} alt="decom-proc"></img>
            </div >
        )

        let tiles = (
            <Tiles>
                <SystemSelector
                    projectId={this.props.projectId}
                    urlParams={urlParams}
                    docCount={true}
                    onRender={(systems) => {
                        return systems.map(system => {
                            let barOpen =
                                (this.state.isBarOpen &&
                                    this.state.openBarFor === system.id)
                            let isFlipped = 
                                (this.state.isCardFlipped && 
                                    this.state.flippedFor === system.id)
                            return RenderSystemTile(system, this.onTileClick, this.onActivityClick, this.onChevronClick, barOpen, this.onHover, this.flipCard, isFlipped)
                        })
                    }}>
                </SystemSelector>
            </Tiles>
        )
        return <>
            {this.state.showActivityBox && hardcodedActivityBox}
            {tiles}
        </>
    }
}

export default SystemTiles