import React from 'react';
import { setCesiumDecomyards } from '../actions/installationActions';
import { connect } from 'react-redux';
import { fetchDecomyards } from '../api/Installations';

class DecomyardHandler extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            decomyards: []
        }
        this.fetchDecomyards = this.fetchDecomyards.bind(this);
        this.attemptedRetry = false;
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    componentDidMount() {
        this.fetchDecomyards();
    }

    fetchDecomyards() {
        fetchDecomyards(this.source.token)
            .then(payload => {
                this.setState({
                    decomyards: payload.data
                });
                
                this.props.setCesiumDecomyards(payload.data);

                if (payload.status === 401 && !this.attemptedRetry) {
                    this.attemptedRetry = true;
                    new Promise(resolve => setTimeout(resolve, 3000)).then(res => {
                        this.fetchDecomyards();
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
        setCesiumDecomyards: (installations) => {
            dispatch(setCesiumDecomyards(installations))
        }
    }
}
export default connect(null, mapDispatchToProps)(DecomyardHandler)