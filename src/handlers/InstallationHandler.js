import React from 'react';
import { setCesiumInstallations } from '../actions/installationActions';
import { connect } from 'react-redux';
import { fetchInstallations } from '../api/Installations';
class InstallationHandler extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            installations: []
        }
        this.fetchInstallations = this.fetchInstallations.bind(this);
        this.attemptedRetry = false;
    }



    componentDidMount() {
        this.fetchInstallations();
    }

    fetchInstallations() {
        fetchInstallations()
            .then(payload => {
                //Here we need to assign a type to OilAndGas if it doesn't exists in the response. This is to further help the other components to filter the data.
                this.setState({
                    installations: payload
                });
                
                this.props.setCesiumInstallations(payload);
                this.props.setAllInstallations(payload);

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