import React, { Component } from 'react';
import './SketchfabViewer.scss';

class SketchfabViewer extends Component {
    constructor(props) {
        super(props)
        this.viewerComponent = React.createRef();
        this.client = null;
        this.ua = this.ua.bind(this)
        this.setApi = this.setApi.bind(this);
        this.openWalkthrough = this.openWalkthrough.bind(this)

        this.state = {
            annotations:[]
        }
    }
    
    setApi(api) {
        this.api = api;
    }

    componentDidMount() {
        this.reRenderModel();
    }

    componentDidUpdate(prevProps) {  
        if (prevProps.isPopup === this.props.isPopup) {
            this.reRenderModel();   
        }
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.sketchfabId !== nextProps.sketchfabId || this.props.isPopup !== nextProps.isPopup) {
            return true;
        } 
        if (this.props.annotationIndex !== nextProps.annotationIndex) {
            if (nextProps.sketchfabId === nextProps.annotationModelId) {
                this.goToAnnotation(nextProps.annotationIndex);    
                this.openWalkthrough(nextProps.annotationIndex);
            }      
        }
        return false; 
    }

    ua(annotations) {
        this.setState({annotations:annotations});
    }

    goToAnnotation(index) {
        if (this.api !== undefined) {
            this.api.gotoAnnotation(index);
        }
    }

    openWalkthrough(index) {
        if (this.state.annotations[index] && this.state.annotations[index]["content"]["raw"].startsWith('http')) {
            if (this.props.annotationSelected) {
                this.props.annotationSelected(index);
            }
            //this.props.changeWalkthroughSrc(this.state.annotations[index]["content"]["raw"]);
        }
    }

    reRenderModel() {       
        const Sketchfab=window.Sketchfab;
        let version = "1.5.0"

        this.client = new Sketchfab(version, this.viewerComponent.current); 
        const updateAnnotations = this.ua;
        const popUpWalkthrough = this.openWalkthrough
        const setApi = this.setApi
        this.client.init(this.props.sketchfabId, {
            autostart: 1,
            success: function(api) {
                api.start();
                setApi(api);
                api.addEventListener('viewerready', function() {
                    api.addEventListener('annotationSelect', function (index) {
                        if (index !== -1) {
                            api.getAnnotationList(function(err, annotations) {
                                updateAnnotations(annotations);
                                popUpWalkthrough(index);
                            });
                        }
                    });
                });
            },
            ui_infos:0
        });
    }

    render() {
        let controlButtons = (<div className="popup-control-buttons">
            <div className="swap-button" onClick={this.props.onSwap}><i className="fas fa-exchange-alt"></i></div>
            <div className="close-button" onClick={this.props.closeModel}><i className="fas fa-times"></i></div>
        </div>)

        return (
                <div className={'sketchfab-container ' + 
                      (this.props.isPopup ? 'popup' : '') +
                      (this.state.sketchFabMinimised ? 'click-through': '') +
                      (this.props.isNonAbsolute ? 'position-auto' : 'position-absolute')}>
                    {this.props.isPopup &&
                    controlButtons}
                    {!this.state.sketchFabMinimised && <iframe className={this.props.isPopup ? "api-frame" : "api-frame-fullscreen"} title="sketchfab-viewer" ref={ this.viewerComponent }></iframe>}
                </div>            
            )
    }
}
  
  export default SketchfabViewer
