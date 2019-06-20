import React, { Component } from 'react';
import axios from 'axios';
import { search } from '../../api/Search';
import { DebounceInput } from 'react-debounce-input';
import './Search.scss';
import CollapsibleMatch from './CollapsibleMatch';
import { getContentForDocument } from '../../api/Documents';
import FileSaver from 'file-saver';

const CancelToken = axios.CancelToken;

class Search extends Component {
    constructor(props) {
        super(props);
        this.source = CancelToken.source();
        this.search = this.search.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.state = {
            searchResults: null
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        this.source.cancel();
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({
                searchResults: null
            })
        }
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    search(e) {
        let entityType = this.props.isDataRoom && 'Document'
        search(this.props.projectId, this.source.token, e.target.value, entityType).then(res => {
            this.setState({
                searchResults: res.data
            })
        });
    }

    mapMatchTypeKey(key) {
        if (key === 'content') {
            return 'highlights'
        }
        return key;
    }

    downloadOnClick(url) {
        //if (document.currentRevision.fileType) { check if doucment is internal or external?
        getContentForDocument(url).then(res => {
            FileSaver.saveAs(res.data, "TEMPDownloadName");
        })
        //}
    }

    openExternalLink(e, url) {
        e.stopPropagation()
        var newWindow = window.open();
        getContentForDocument(url).then(res => {
            newWindow.location = res.data;
        })
    }

    getDocumentIcons(url) {
        return (<>
            <i className="fas fa-download" onClick={this.downloadOnClick.bind(this, url)}></i>
            <i className="fas fa-external-link-alt" onClick={(e) => { this.openExternalLink(e, url) }}></i>
        </>)
    }

    render() {
        let suggestions = (
            this.state.searchResults &&
            <div className="suggestions-container" ref={this.setWrapperRef} >
                <div className="suggestions-title">Search Results({this.state.searchResults.total})</div>
                {this.state.searchResults._embedded.items.slice(0, 5).map(suggestion => {
                    return (
                        <div className="suggestion">
                            <div className="suggestion-left-container">

                                <div className="type">{suggestion.type}</div>

                                {suggestion.highlight && suggestion.highlight.map(highlight => {
                                    return (
                                        <CollapsibleMatch matchKey={this.mapMatchTypeKey(highlight.key)} matchContent={highlight.value}></CollapsibleMatch>
                                    )
                                })}
                            </div>
                            <div className="icons">
                                {(suggestion.type.toLowerCase() === 'document') && this.getDocumentIcons(suggestion._links.contents.href)}
                            </div>
                        </div>)
                })
                }
            </div>
        )

        let searchBar = (
            <div className="search-container">
                <i className="fas fa-grip-horizontal"></i>
                <DebounceInput
                    type="text"
                    minLength={2}
                    debounceTimeout={400}
                    name="search"
                    className="search-bar"
                    autoComplete="off"
                    placeholder="Search"
                    onChange={e => this.search(e)}>
                </DebounceInput>
            </div>
        )
        return (
            <div style={{ position: 'absolute' }}>
                {searchBar}
                {suggestions}
            </div>
        )
    }
}

export default Search