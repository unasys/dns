import React, { Component } from 'react';
import FilterSelector from './FilterSelector';
import Breadcrumbs from '../../../../breadcrumbs/Breadcrumbs';
import LabelSelector from './LabelSelector';

class FilterPanel extends Component {

    constructor(props) {
        super(props)
        this.onFilterSelected = this.onFilterSelected.bind(this);
        this.clearFilterSelected = this.clearFilterSelected.bind(this);
        this.state = {
            breadcrumbs: [{ name: 'Filter By', onClick: this.clearFilterSelected }],
            filterSelected: null
        }
        this.addToBreadcrumbs = this.addToBreadcrumbs.bind(this);
        this.removeBreadcrumbsAfterIndex = this.removeBreadcrumbsAfterIndex.bind(this);
    }

    addToBreadcrumbs(crumb) {
        this.setState({
            breadcrumbs: this.state.breadcrumbs.concat(crumb)
        })
    }

    removeBreadcrumbsAfterIndex(index) {
        this.setState({
            breadcrumbs: this.state.breadcrumbs.slice(0, index + 1)
        })
    }

    onFilterSelected(filter) {
        this.setState({
            filterSelected: filter
        })
    }

    clearFilterSelected() {
        this.setState({
            filterSelected: null
        })
    }

    getSecondLevelPanel(filter) {
        switch (filter) {
            case "Labels":
                return <LabelSelector
                    projectId={this.props.projectId}
                    addToBreadcrumbs={this.addToBreadcrumbs}>
                </LabelSelector>
            default:
                return <div>Error. Cannot find panel.</div>
        }
    }

    render() {
        return (
            <Breadcrumbs crumbs={this.state.breadcrumbs} removeCrumbs={this.removeBreadcrumbsAfterIndex}>

                {this.state.filterSelected === null ?
                    <FilterSelector
                        onFilterClick={this.onFilterSelected}
                    ></FilterSelector> :
                    this.getSecondLevelPanel(this.state.filterSelected)}
            </Breadcrumbs>
        )
    }
}

export default FilterPanel