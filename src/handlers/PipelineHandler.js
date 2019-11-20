import React from 'react';
import { setCesiumPipelines } from '../actions/installationActions';
import { connect } from 'react-redux';
import { fetchPipelines } from '../api/Installations';

class PipelineHandler extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pipelines: []
        }
        this.fetchPipelines = this.fetchPipelines.bind(this);
        this.attemptedRetry = false;
    }

    componentDidMount() {
        this.fetchPipelines();
    }

    fetchPipelines() {
        fetchPipelines()
            .then(payload => {
                this.setState({
                    pipelines: payload
                });
                
                this.props.setCesiumPipelines(payload);

            })
            .catch((e) => {
                console.error('something went wrong when fetching installations in fetchDecomyards.js', e);
            })
    }

    render() {
        return <span></span>
    }

}

function mapDispatchToProps(dispatch) {
    return {
        setCesiumPipelines: (pipelines) => {
            dispatch(setCesiumPipelines(pipelines))
        }
    }
}
export default connect(null, mapDispatchToProps)(PipelineHandler)