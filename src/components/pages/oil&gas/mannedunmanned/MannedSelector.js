import React from 'react';
import ResultItem from '../../../result-item/ResultItem';

class MannedSelector extends React.Component {
    render() {
        const distinctMannedStates = [...new Set(this.props.installations.map(installation => installation["Manned or Unmanned"]))];
        return (
            distinctMannedStates.map(mannedState => {
                return <ResultItem key={mannedState} content={mannedState} contentOnClick={this.props.onMannedSelected.bind(this, mannedState)}></ResultItem>;
            })
        );
    }
}

export default MannedSelector;
