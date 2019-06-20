import React from 'react';
import { setCesiumInstallations } from './actions/installationActions';
import { connect } from 'react-redux';
import { fetchInstallations } from './api/Installations';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import auth0Client from './auth/auth';

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

    componentDidMount() {
        let accessToken = auth0Client.getAccessToken();
        let organisationId = accessToken ? jwt_decode(accessToken)['https://epm.unasys.com/organisation'] : null
        this.fetchInstallations(organisationId);
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    fetchInstallations(organisationId) {
        fetchInstallations(this.source.token)
            .then(payload => {
                //Here we need to assign a type to OilAndGas if it doesn't exists in the response. This is to further help the other components to filter the data.
                this.setState({
                    installations: payload.data
                });
                if (organisationId && organisationId === "dcf04485-7877-4330-b486-85b0c1f312ff") {
                    this.props.setCesiumInstallations(payload.data.filter(installation => installation["Facility Operator"] === "TAQA"))
                } else {
                    this.props.setCesiumInstallations(payload.data);
                }

                if (payload.status === 401 && !this.attemptedRetry) {
                    this.attemptedRetry = true;
                    new Promise(resolve => setTimeout(resolve, 3000)).then(res => {
                        this.fetchInstallations(organisationId);
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