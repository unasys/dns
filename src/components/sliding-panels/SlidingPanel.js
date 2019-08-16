import React from 'react';
import Sidebar from 'react-sidebar';
import './SlidingPanel.scss';
import Handle from './handle/Handle';

class SlidingPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: true
        };
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open });
    }

    toggleSidebar() {
        this.setState(prevState => ({
            sidebarOpen: !prevState.sidebarOpen
        }));
    }

    render() {
        let width = this.props.isSmallWidth ? '300px' : '400px';
        if (this.props.isBreadcrumbBar) {
            width = '15%';
        }
        return (
            <Sidebar
                sidebar={this.props.content}
                open={this.state.sidebarOpen}
                onSetOpen={this.onSetSidebarOpen}
                docked={this.props.isBreadcrumbBar || this.state.sidebarOpen}
                pullRight={this.props.pullRight}
                styles={
                    {
                        sidebar:
                        {
                            background: "white",
                            width: width,
                            zIndex: "3",
                            borderRight: "solid 1px rgba(255, 255, 255, 0.2)",
                            borderLeft: "solid 1px rgba(255, 255, 255, 0.2)",
                            backgroundColor: "#252B38",
                            pointerEvents:'auto'
                        }
                    }
                }
            >
                {!this.props.isBreadcrumbBar && <Handle onHandleClick={this.toggleSidebar} isFacingLeft={!this.props.pullRight}></Handle>}
            </Sidebar>
        );
    }
}

export default SlidingPanel;