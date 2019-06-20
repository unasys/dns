import React from 'react';
import TagSelector from '../../../../selectors/TagSelector';

class TagPanel extends React.Component {
    constructor(props) {
        super(props);
        this.onTagClick = this.onTagClick.bind(this);
    }

    onTagClick(tag) {
        this.props.onTagClick(tag)
        this.props.onEntityClick(tag.id);
    }

    render() {
        return (
            <TagSelector
                urlParams={
                    {
                        equipmentTypeId: this.props.equipmentType.id,
                        locationId: this.props.location.id
                    }
                }
                projectId={this.props.projectId}
                onTagClick={this.onTagClick}
                selectedTag={this.props.selectedTag}>
            </TagSelector>)
    }
}

export default TagPanel;
