import React from 'react';
import { Collapse } from 'react-collapse';


class CollapsibleHeading extends React.Component {

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
                <div className="overview-container" onClick={this.toggleOpen}>
                    <div className="overview-heading">
                        {this.props.heading}
                    </div>
                    <div className="dropdown-icon">
                        {this.state.isOpen ? <i className="fas fa-chevron-up icon"></i> : <i className="fas fa-chevron-down icon"></i>}
                    </div>
                </div>
                <Collapse isOpened={this.state.isOpen}>
                    {this.props.items.map((property, i) => {

                        let content = "";
                        if (property.name) {
                            content += property.name;
                        }
                        if (property.value) {
                            content += ": " + property.value;
                        }

                        return ( 
                            <div key={i}>
                                {content}
                            </div>
                        )
                    })}
                </Collapse>
            </>
        );
    }
}



export default CollapsibleHeading;