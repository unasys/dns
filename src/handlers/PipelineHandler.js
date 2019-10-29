import React from 'react';
import { setCesiumPipelines } from '../actions/installationActions';
import { connect } from 'react-redux';
import { fetchPipelines } from '../api/Installations';
import axios from 'axios';

const CancelToken = axios.CancelToken;

class PipelineHandler extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pipelines: []
        }
        this.source = CancelToken.source();
        this.fetchPipelines = this.fetchPipelines.bind(this);
        this.attemptedRetry = false;
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    componentDidMount() {
        this.fetchPipelines();
    }

    fetchPipelines() {
        fetchPipelines(this.source.token)
            .then(payload => {
                this.setState({
                    pipelines: payload.data
                });
                
                this.props.setCesiumPipelines(payload.data);

                if (payload.status === 401 && !this.attemptedRetry) {
                    this.attemptedRetry = true;
                    new Promise(resolve => setTimeout(resolve, 3000)).then(res => {
                        this.fetchPipelines();
                    });
                }
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