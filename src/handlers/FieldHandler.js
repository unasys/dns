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



    componentDidMount() {
        this.fetchFields();
    }

    fetchFields() {
        fetchFields()
            .then(payload => {
                //Here we need to assign a type to OilAndGas if it doesn't exists in the response. This is to further help the other components to filter the data.
                this.setState({
                    fields: payload
                });
                
                this.props.setCesiumFields(payload);
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