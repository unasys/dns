import React from 'react';
import ResultItem from '../../result-item/ResultItem';
import history from '../../../history';

class InstallationFilterSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            installationFilters: 
                [
                'Operator',
                'Installation Type',
                'Area of the North Sea',
                'Manned/Unmanned'
                ]
        }
    }
    
    render() {
        let filters = this.state.installationFilters.map(item => {
            return <ResultItem key={item} content={item} contentOnClick={this.props.onFilterClick.bind(this, item)}></ResultItem>;
        })
        filters.push(<ResultItem key={'All Installations'} content={'All Installations'} contentOnClick={() => history.push('/installations')}></ResultItem>);
        return filters;
    }
}

export default InstallationFilterSelector;