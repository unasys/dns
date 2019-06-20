import React, { Component } from "react";
import './styles/Tags.scss';
import ActionPanel from "./ActionPanel";
import TagsTable from "./TagsTable";

class Tags extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTag: null
        }
        this.selectTag = this.selectTag.bind(this);
    }

    selectTag(tag) {
        this.setState({
            selectedTag: tag
        })
    }

    render() {
        return (
            <div className="tags-grid-container">
                <div className="main-content">
                    <TagsTable projectId={this.props.projectId} selectTag={this.selectTag}></TagsTable>
                </div>
                <div className="right-sidebar">
                    <ActionPanel entity="Tag" projectId={this.props.projectId} selectedTag={this.state.selectedTag}></ActionPanel>
                </div>
            </div>
        )
    }
}

export default Tags;