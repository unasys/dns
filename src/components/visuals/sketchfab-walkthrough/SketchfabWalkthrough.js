import React, { Component } from 'react';
import SketchfabModel from '../sketchfab/SketchfabModel';
import Walkthrough from '../walkthrough/Walkthrough';

class SketchfabWalkthrough extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sketchFabMaximised: this.props.sketchFabInitialMaximised,
            walkthroughClosed: false,
            modelClosed: false
        }

        this.onSwap = this.onSwap.bind(this);
        this.closeWalkthrough = this.closeWalkthrough.bind(this);
        this.closeModel = this.closeModel.bind(this);
    }

    onSwap() {
        this.setState({
            sketchFabMaximised: !this.state.sketchFabMaximised
        })
    }

    closeWalkthrough() {
        this.setState({
            walkthroughClosed: true
        })
    }

    closeModel() {
        this.setState({
            modelClosed: true
        })
    }

    render() {
        return <div>
            {!this.state.modelClosed &&
                <SketchfabModel isPopup={!this.state.sketchFabMaximised} onSwap={this.onSwap} closeModel={this.closeModel}></SketchfabModel>}
            {!this.state.walkthroughClosed &&
                <Walkthrough isPopup={this.state.sketchFabMaximised} onSwap={this.onSwap} closeWalkthrough={this.closeWalkthrough}> </Walkthrough>}
        </div>
    }
}

export default SketchfabWalkthrough;