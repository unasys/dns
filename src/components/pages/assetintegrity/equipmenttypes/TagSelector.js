import React from 'react';
import ResultItem from '../../../result-item/ResultItem';
import axios from 'axios';

const CancelToken = axios.CancelToken;

class TagSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: []
        }
        this.source = CancelToken.source();
        this.props.addToBreadcrumbs({name: 'Tags', onClick:() => 0});
    }

    fetchTags(projectId, criticality, equipmentType) {
        axios.get(`/projects/${projectId}/tags?equipmentTypeId=${equipmentType.id}&criticality=${criticality.toLowerCase()}`, {
            cancelToken: this.source.cancelToken
        })
        .then(payload => {
            this.setState({
                tags: payload.data._embedded.items
            });
        })
        .catch(() => {
          console.log('something went wrong when fetching installations in equipmenttypeselector.js');
        })
    }

    componentDidMount() {
        this.fetchTags(this.props.projectId, this.props.critical, this.props.equipmentType)
    }
    
    componentWillUnmount() {
        this.source.cancel();
    }

    render() {        
        return (
            this.state.tags.map(tag => {
                return <ResultItem key={tag.id} content={tag.name} contentOnClick={() => this.props.onTagClick(tag)}></ResultItem>;
            })
        );
    }
}

export default TagSelector;
