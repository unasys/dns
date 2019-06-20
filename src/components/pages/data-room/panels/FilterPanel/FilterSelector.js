import React from 'react';
import ResultItem from '../../../../result-item/ResultItem';

class FilterSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groupingFilters:
                [
                    'Labels'
                ]
        }
    }

    render() {
        let filters = this.state.groupingFilters.map(item => {
            return <ResultItem key={item} noChevron={true} content={item} contentOnClick={this.props.onFilterClick.bind(this, item)}></ResultItem>;
        })
        return filters;
    }
}

export default FilterSelector;