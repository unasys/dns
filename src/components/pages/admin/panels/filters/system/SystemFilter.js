import React from 'react';
import './SystemFilter.scss';
import SystemSelector from '../../selectors/SystemSelector';

class SystemFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            systems: [],
            isLoading: true,
            searchPhrase: '',
            selectedSystem: null
        }
        this.clearSystemSelected = this.clearSystemSelected.bind(this);
        this.onSystemFilter = this.onSystemFilter.bind(this);
    }

    clearSystemSelected() {
        this.setState({
            selectedSystem: null
        })
        this.props.onSystemFilter(null)
    }

    clearSystemAndGoBack(e) {
        this.clearSystemSelected(e);
        this.props.clearFilterOption();
    }

    onSystemFilter(system) {
        this.setState({
            selectedSystem: system
        })
        this.props.onSystemFilter(system);
    }

    render() {
        return (
            <>
                <p className="menu-label"><i className="fas fa-chevron-left" onClick={evt => this.clearSystemAndGoBack(evt)}></i>System</p>
                <SystemSelector
                    projectId={this.props.projectId}
                    selectedSystem={this.state.selectedSystem}
                    onSystemFilter={this.onSystemFilter}
                    clearSystemSelected={this.clearSystemSelected}
                ></SystemSelector>
            </>
        );
    }
}

export default SystemFilter;
