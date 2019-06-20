import React from 'react';
import TagSelector from './TagSelector';

class TagPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            breadcrumbName: 'Tags'
        }

        this.props.addToBreadcrumbs({name: this.state.breadcrumbName, onClick: () => 0 });
    }

    render() {
        return (
                <TagSelector 
                    equipmentType={this.props.equipmentType}
                    discipline={this.props.discipline}
                    onTagClick={this.props.onTagClick}
                    projectId={this.props.projectId}
                    selectedTag={this.props.selectedTag}>
                </TagSelector>)
    }
}

export default TagPanel;
