import React from 'react';
import ResultItem from '../../../../result-item/ResultItem';

class FitlerTypeSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filterTypes:
                [
                    'Facilities'
                    // 'Disciplines',
                    // 'Areas',
                ]
        }
    }

    render() {
        let filterTypes = this.state.filterTypes.map(item => {
            return <ResultItem key={item} content={item} contentOnClick={this.props.onFilterTypeClick.bind(this, item)}></ResultItem>;
        })
        return filterTypes;
    }
}

export default FitlerTypeSelector;