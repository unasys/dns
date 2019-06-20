import React from 'react';
import './ResultItem.scss';

class NoResultItem extends React.Component {
    render() {
        return (
            <div className="result-item-container">
                <div className="result-item" onClick={this.props.contentOnClick}>
                    <div className="result-item-content">
                        {'No Results.'}
                    </div>
                </div>
            </div>
        );
    }
}

export default NoResultItem;