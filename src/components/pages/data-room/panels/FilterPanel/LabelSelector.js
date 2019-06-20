import React, { Component } from 'react';
import axios from 'axios';
import { getAllLabels } from '../../../../../api/Documents';
import ResultItem from '../../../../result-item/ResultItem';
import { changeFilters } from '../../../../../actions/dataroomActions';
import { connect } from 'react-redux';

const CancelToken = axios.CancelToken;

class LabelSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: null,
            checkedItems: new Map()
        }
        this.source = CancelToken.source();
        this.handleChange = this.handleChange.bind(this);
        this.props.addToBreadcrumbs({ name: 'Label', onClick: (() => { }) });
    }
    componentDidMount() {
        getAllLabels(this.props.projectId, this.source.token).then(result => {
            this.setState({
                labels: result.data._embedded.items
            });
        })
    }

    handleChange(e) {
        const item = e.target.textContent;
        const isChecked = e.currentTarget.parentNode.classList.contains('selected');
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, !isChecked) }), () => {
            let selectedFilters = []
            for (let [selectedName, selected] of this.state.checkedItems) {
                if (selected) {
                    selectedFilters.push(selectedName);
                }
            }
            this.props.changeFilters(selectedFilters);
        });
    }

    render() {
        return (
            this.state.labels && this.state.labels.map((label, i) => {
                let content = (
                    < div >
                        {label}
                    </div >)
                return <ResultItem key={i} noChevron={true} content={content} selected={this.state.checkedItems.get(label)} contentOnClick={this.handleChange}></ResultItem>;

            })
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeFilters: (filters) => {
            dispatch(changeFilters(filters))
        }
    }
}

export default connect(null, mapDispatchToProps)(LabelSelector);