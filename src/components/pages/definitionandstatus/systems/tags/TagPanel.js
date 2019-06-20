import React from 'react';
import TagSelector from '../../../../selectors/TagSelector';

class TagPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            breadcrumbName: 'Tags'
        }

        this.props.addToBreadcrumbs({ name: this.state.breadcrumbName, onClick: () => 0 });
    }

    render() {
        return (
            <TagSelector
                urlParams={
                    {
                        equipmentTypeId: this.props.equipmentType.id,
                        subsystemId: this.props.subsystem.id
                    }
                }
                onTagClick={this.props.onTagClick}
                projectId={this.props.projectId}
                selectedTag={this.props.selectedTag}>
            </TagSelector>)
    }
}

export default TagPanel;
