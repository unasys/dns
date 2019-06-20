import React, { Component } from 'react';
import './FileViewerWindow.scss'
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const Handle = Slider.Handle;
const handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

class JpgViewerWindow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showImage: true,
            opacity: "1"
        }
        this.hideImage = this.hideImage.bind(this);
        this.sliderOnChange = this.sliderOnChange.bind(this);
    }

    hideImage() {
        this.setState({
            showImage: false
        })
    }

    sliderOnChange(value) {
        let newValue = 1 - value
        this.setState({
            opacity: newValue
        })
    }

    componentDidUpdate(nextProps) {
        if (this.props.lastClickedDocument !== nextProps.lastClickedDocument) {
            this.setState({
                showImage: true
            })
        }
    }

    render() {
        return (
            this.state.showImage ?
                <div className="jpg-viewer-container">
                    <div className="action-bar">
                        <i className="fas fa-times close-button" onClick={this.hideImage}></i>
                    </div>
                    <div className="jpg-viewer" style={{ opacity: this.state.opacity }}>
                        <img src={this.props.lastClickedDocument.filePath} alt={"document"}></img>
                    </div>
                    <div className="opacitySlider">
                        <Slider min={0} max={1} defaultValue={0} handle={handle} step={0.01} onChange={this.sliderOnChange} />
                    </div>
                </div> : <></>
        )
    }
}

export default JpgViewerWindow;