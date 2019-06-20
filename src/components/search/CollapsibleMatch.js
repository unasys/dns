import React from 'react';
import { Collapse } from 'react-collapse';
import './CollapsibleMatch.scss';


class CollapsibleMatch extends React.Component {

    constructor(props) {
        super(props);
        this.state = (
            {
                isOpen: false,
            });
    }

    toggleOpen = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    render() {
        return (
            <>
                <div className="match-container" onClick={this.toggleOpen}>
                    <div className="heading-icon">
                        <div className="match-heading">
                            {this.props.matchKey}
                        </div>
                        <div className="dropdown-icon">
                            {this.state.isOpen ? <i className="fas fa-chevron-up icon"></i> : <i className="fas fa-chevron-down icon"></i>}
                        </div>
                    </div>
                    <Collapse isOpened={this.state.isOpen}>
                        {this.props.matchKey === 'highlights' &&
                            <div className="match-content-container" dangerouslySetInnerHTML={{ __html: this.props.matchContent }}>
                            </div>
                        }
                    </Collapse>
                </div>
            </>
        );
    }
}

export default CollapsibleMatch;