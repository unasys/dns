import React, { Component } from 'react'
import SelectableDocument from './SelectableDocument'

class SelectableDocumentList extends Component {

    render() {
        return (
            <div className="document-container">
                {this.props.documents.map(documentObject => (
                    <React.Fragment key={documentObject.heading}>
                        <div className="heading" >{documentObject.heading}</div>
                        {documentObject.items.map((document, i) => (
                            <SelectableDocument
                                key={i}
                                document={document}>
                            </SelectableDocument>
                        ))}
                    </React.Fragment>
                )
                )}
            </div>
        )
    }
}

export default SelectableDocumentList;