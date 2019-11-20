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


    componentDidMount() {
        this.fetchDecomyards();
    }

    fetchDecomyards() {
        fetchDecomyards()
            .then(payload => {
                this.setState({
                    decomyards: payload
                });
                
                this.props.setCesiumDecomyards(payload);

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