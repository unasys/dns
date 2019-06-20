import React from 'react';
import ResultItem from '../../result-item/ResultItem';

class CriticalitySelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            criticalities: 
                ['Class',
                'Safety',
                'Production',
                'Structural',
                'None']
        }
    }
    
    render() {
        let criticalities = this.state.criticalities.map(item => {
            return <ResultItem key={item} content={item} contentOnClick={this.props.onCriticalityClick.bind(this, item)}></ResultItem>;
        })
        return criticalities;
    }
}

export default CriticalitySelector;