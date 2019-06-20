import React from 'react';
import './FilterPanel.scss';
import SystemFilter from './filters/system/SystemFilter'

class FilterPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filterOptions: [{ name: "System", onClick: (() => this.props.filterBySystem) }],
            filterOptionSelected: null
        }
        this.clearFilterOption = this.clearFilterOption.bind(this);
    }

    getFilterPanel(selectedFilterOption) {
        switch (selectedFilterOption) {
            case "System":
                return <SystemFilter projectId={this.props.projectId} onSystemFilter={this.props.onSystemFilter} clearFilterOption={this.clearFilterOption}></SystemFilter>
            default:
                return <div>Unrecognised Filter.</div>
        }
    }

    selectedFilterOption(option) {
        this.setState({
            filterOptionSelected: option
        })
    }

    clearFilterOption() {
        this.setState({
            filterOptionSelected: null
        })
    }

    render() {
        let content;

        // filter option not selected yet. Display list of filter options. 
        if (this.state.filterOptionSelected === null) {
            let filterOptions = []
            this.state.filterOptions.forEach(option => {
                filterOptions.push(
                    <ul className="menu-list" key={option.name}>
                        <li onClick={() => this.selectedFilterOption(option.name)}><a href='# '>{option.name}</a></li>
                    </ul>)
            });
            content = (
                <>
                    <p className="menu-label">
                        Filter By:
                    </p>
                    {filterOptions}
                </>)
        } else {
            content = this.getFilterPanel(this.state.filterOptionSelected);
        }

        return (
            <div className="filter-panel-container margin-top-left">
                <aside className="menu">
                    {content}
                </aside>
            </div>
        );
    }
}

export default FilterPanel;