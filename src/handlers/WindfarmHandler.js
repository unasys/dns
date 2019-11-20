import React from 'react';
import { setCesiumWindfarms } from '../actions/installationActions';
import { connect } from 'react-redux';
import { fetchWindfarms } from '../api/Installations';
class WindfarmHandler extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            windfarms: []
        }

        this.fetchWindfarms = this.fetchWindfarms.bind(this);
        this.attemptedRetry = false;
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    componentDidMount() {
        this.fetchWindfarms();
    }

    fetchWindfarms() {
        fetchWindfarms(this.source.token)
            .then(payload => {
                //Here we need to assign a type to OilAndGas if it doesn't exists in the response. This is to further help the other components to filter the data.
                this.setState({
                    windfarms: payload.data
                });
                
                this.props.setCesiumWindfarms(payload.data);

                if (payload.status === 401 && !this.attemptedRetry) {
                    this.attemptedRetry = true;
                    new Promise(resolve => setTimeout(resolve, 3000)).then(res => {
                        this.fetchWindfarms();
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
        setCesiumWindfarms: (installations) => {
            dispatch(setCesiumWindfarms(installations))
        }
    }
}
export default connect(null, mapDispatchToProps)(WindfarmHandler)