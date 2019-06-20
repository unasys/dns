import React from 'react';
import ResultItem from '../../../result-item/ResultItem';

class AreaSelector extends React.Component {
    render() {
        const distinctAreas = [...new Set(this.props.installations.map(installation => installation["Area"]))];
        return (
            distinctAreas.map(area => {
                return <ResultItem key={area} content={area} contentOnClick={this.props.onAreaSelected.bind(this, area)}></ResultItem>;
            })
        );
    }
}

export default AreaSelector;
