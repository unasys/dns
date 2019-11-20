import React from 'react';
import { setCesiumFields } from '../actions/installationActions';
import { connect } from 'react-redux';
import { fetchFields } from '../api/Installations';


class FieldHandler extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            windfarms: []
        }
        this.fetchFields = this.fetchFields.bind(this);
        this.attemptedRetry = false;
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    componentDidMount() {
        this.fetchFields();
    }

    fetchFields() {
        fetchFields(this.source.token)
            .then(payload => {
                //Here we need to assign a type to OilAndGas if it doesn't exists in the response. This is to further help the other components to filter the data.
                this.setState({
                    fields: payload.data
                });
                
                this.props.setCesiumFields(payload.data);

                if (payload.status === 401 && !this.attemptedRetry) {
                    this.attemptedRetry = true;
                    new Promise(resolve => setTimeout(resolve, 3000)).then(res => {
                        this.fete();
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
        setCesiumFields: (fields) => {
            dispatch(setCesiumFields(fields))
        }
    }
}
export default connect(null, mapDispatchToProps)(FieldHandler)