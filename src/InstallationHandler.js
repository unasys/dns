import React from 'react';
import { setCesiumInstallations } from './actions/installationActions';
import { connect } from 'react-redux';
import { fetchInstallations } from './api/Installations';
import axios from 'axios';

const CancelToken = axios.CancelToken;

class InstallationHandler extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            installations: []
        }
        this.source = CancelToken.source();
        this.fetchInstallations = this.fetchInstallations.bind(this);
        this.attemptedRetry = false;
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    componentDidMount() {
        this.fetchInstallations();
    }

    fetchInstallations() {
        fetchInstallations(this.source.token)
            .then(payload => {
                //Here we need to assign a type to OilAndGas if it doesn't exists in the response. This is to further help the other components to filter the data.
                this.setState({
                    installations: payload.data
                });
                
                this.props.setCesiumInstallations(payload.data);
                this.props.setAllInstallations(payload.data);

                if (payload.status === 401 && !this.attemptedRetry) {
                    this.attemptedRetry = true;
                    new Promise(resolve => setTimeout(resolve, 3000)).then(res => {
                        this.fetchInstallations();
                    });
                }
            })
            .catch((e) => {
                console.error('something went wrong when fetching installations in OilandGas.js', e);
            })
    }

    render() {
        return <span></span>
    }

}

function mapDispatchToProps(dispatch) {
    return {
        setCesiumInstallations: (installations) => {
            dispatch(setCesiumInstallations(installations))
        }
    }
}
export default connect(null, mapDispatchToProps)(InstallationHandler)