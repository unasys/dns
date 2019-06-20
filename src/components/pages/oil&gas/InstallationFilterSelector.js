import React from 'react';
import ResultItem from '../../result-item/ResultItem';

class InstallationFilterSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            installationFilters: 
                ['Operator',
                'Installation Type',
                'Area of the North Sea',
                'Manned/Unmanned']
        }
    }
    
    render() {
        let filters = this.state.installationFilters.map(item => {
            return <ResultItem key={item} content={item} contentOnClick={this.props.onFilterClick.bind(this, item)}></ResultItem>;
        })
        return filters;
    }
}

export default InstallationFilterSelector;