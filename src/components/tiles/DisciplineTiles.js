import React, { Component } from 'react';
import Tiles from './Tiles';
import './DocumentTypeTile.scss';
import RenderDiscipline from './renderers/DisciplineTileRenderer';
import DisciplineSelector from '../selectors/tile-selectors/DisciplineSelector';
import RenderDisciplineCrumb from './renderers/breadcrumbs/DisciplineCrumbRenderer';

class DisciplineTiles extends Component {

    constructor(props) {
        super(props);
        this.onTileClick = this.onTileClick.bind(this);
        this.onChevronClick = this.onChevronClick.bind(this);
        this.onHover = this.onHover.bind(this);
        this.state = {
            firstClick: true,
            isBarOpen: false,
            openBarFor: null,
        }
    }

    onTileClick(facility) {
        this.props.addToBreadcrumbs(
            { 
                object: facility, 
                renderer: RenderDisciplineCrumb, 
                returnToIndex: 1, 
                returnToScreenDataDependencies: this.props.screenDataDependencies, 
                nextBreadcrumb:this.props.nextBreadcrumb, 
            });
        this.props.onClick({ facilityId: facility.id });
        this.props.setPreviewCrumbContent(null)
    }

    onChevronClick(e, facility) {
        e.stopPropagation();
        this.setState({
            isBarOpen: !this.state.isBarOpen,
            openBarFor: facility
        })
    }

    onHover(discipline) {
        this.props.setPreviewCrumbContent(discipline)
    }

    render() {
        let tiles = (
            <Tiles>
                <DisciplineSelector
                    projectId={this.props.projectId}
                    onRender={(facilities) => {
                        return facilities.map(facility => {
                            let barOpen =
                                (this.state.isBarOpen &&
                                    this.state.openBarFor === facility.id)
                            return RenderDiscipline(facility, this.onTileClick, this.onChevronClick, barOpen, this.onHover);
                        })
                    }}>
                </DisciplineSelector>
            </Tiles>
        )
        return tiles
    }
}

export default DisciplineTiles