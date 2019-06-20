import React from 'react';
import ResultItem from '../../result-item/ResultItem';
import { Collapse } from 'react-collapse';

class ActivityStepsBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            narrativeBoxOpen: false
        }
        this.changeNarrativeState = this.changeNarrativeState.bind(this);
    }

    changeNarrativeState() {
        this.setState({
            narrativeBoxOpen: !this.state.narrativeBoxOpen
        })
    }

    render() {
        return (<div className="activity-steps-box">
            <div className="title-bar">
                <div className="title">{"Steps (" + this.props.activitySteps.length + ")"}</div>
                <div className="close-button" onClick={this.props.closeActivitySteps}><i className="fas fa-times"></i></div>
            </div>
            <div className="narrative-box">
                <>
                    <div className="overview-container" onClick={this.changeNarrativeState} >
                        <div className="overview-heading">
                            Narrative
                    </div>
                        <div className="dropdown-icon">
                            {this.state.narrativeBoxOpen ? <i className="fas fa-chevron-up icon"></i> : <i className="fas fa-chevron-down icon"></i>}
                        </div>
                    </div>
                    <Collapse isOpened={this.state.narrativeBoxOpen}>
                        <div className="narrative">
                            {this.props.narrative}
                        </div>
                    </Collapse>
                </>
            </div>
            {this.props.activitySteps.map(activityStep => {
                return <ResultItem content={activityStep.sequence + ". " + activityStep.name} noChevron={true} contentOnClick={function () { }}></ResultItem>
            })}
        </div>)
    }
}

export default ActivityStepsBox