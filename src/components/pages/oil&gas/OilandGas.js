import React from 'react';
import InstallationPanel from './InstallationPanel';
import { connect } from 'react-redux';
import axios from 'axios';
import '../../../api/RandomFact';
import { setCesiumInstallations } from '../../../actions/installationActions';
import InformationMessageBox from '../../visuals/did-you-know-box/InformationMessageBox';
import { fetchFact } from '../../../api/RandomFact';
import InstallationHandler from '../../../InstallationHandler';
import DecomyardHandler from '../../../DecomyardHandler';

const defaultFilter = (installations) => { return installations.filter(installation => { return installation.Type === "OilAndGas" }) }
const CancelToken = axios.CancelToken;

class OilandGas extends React.Component {
    constructor(props) {
        super(props);
        this.addToBreadcrumbs = this.addToBreadcrumbs.bind(this);
        this.removeBreadcrumbsAfterIndex = this.removeBreadcrumbsAfterIndex.bind(this);

        this.state = {
            breadcrumbs: [],
            installations: [],
            currentInstallationFilter: defaultFilter,
            didYouKnowMessage: null
        }
        this.clearDidYouKnowMessage = this.clearDidYouKnowMessage.bind(this);
        this.source = CancelToken.source();
    }

    componentDidMount() {
        fetchFact(this.source.token).then(res => {
            this.setState({
                didYouKnowMessage: res.data[Math.floor(Math.random()*res.data.length)]
            })
            setTimeout(this.clearDidYouKnowMessage, 6000);
        })
    }

    clearDidYouKnowMessage() {
        this.setState({
            didYouKnowMessage: null
        })
    }

    componentWillUnmount() {
        this.source.cancel()
    }

    addToBreadcrumbs(crumb) {
        if (this.state.breadcrumbs.length !== 0 && crumb.name === this.state.breadcrumbs[this.state.breadcrumbs.length - 1].name) return;

        this.setState({
            breadcrumbs: this.state.breadcrumbs.concat(crumb)
        })
    }

    removeBreadcrumbsAfterIndex(index) {
        this.setState({
            breadcrumbs: this.state.breadcrumbs.slice(0, index + 1)
        })
    }

    render() {
        return (
            <>
                {this.state.didYouKnowMessage && <InformationMessageBox message={this.state.didYouKnowMessage} clearMessage={this.clearDidYouKnowMessage}></InformationMessageBox>}
                {!this.props.hideSidePanel &&
                <InstallationPanel
                    breadcrumbs={this.state.breadcrumbs}
                    addToBreadcrumbs={this.addToBreadcrumbs}
                    removeBreadcrumbsAfter={this.removeBreadcrumbsAfterIndex}
                    installations={this.props.cesiumInstallations}
                    setCesiumInstallations={this.props.setCesiumInstallations}
                    changeMainContent={this.props.changeMainContent}>
                </InstallationPanel>}

                <InstallationHandler></InstallationHandler>
                <DecomyardHandler></DecomyardHandler>
            </>
        );
    }
}

function mapStateToProps(state) {
    let filterType = state.InstallationReducer.installationFilter;
    let decomYardFilterType = state.InstallationReducer.decomYardFilterType;
    return {
        installationFilter: filterType,
        decomYardFilter: decomYardFilterType,
        cesiumInstallations: state.InstallationReducer.cesiumInstallations,
        cesiumDecomyards: state.InstallationReducer.cesiumDecomyard
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setCesiumInstallations: (installations) => {
            dispatch(setCesiumInstallations(installations))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OilandGas)