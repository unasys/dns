import React from 'react';
import '../Panels.scss';
import CollapsibleHeading from './CollapsibleHeading';
import axios from 'axios';
import { getAuxiliaryDataImage } from '../../../../api/Entities';
import NavigationHeading from './NavigationHeading';
import history from '../../../../history.js'
import InstallationFilterSelector from '../../../pages/oil&gas/InstallationFilterSelector';
import { Collapse } from 'react-collapse';

const CancelToken = axios.CancelToken;


class ConfigInstallationDetailsPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            auxiliaryDataImage: null,
            installationDropdownIsOpen: false
        }
        this.source = CancelToken.source();
        this.toggleInstallationDropdownOpen = this.toggleInstallationDropdownOpen.bind(this);
    }

    componentDidMount() {
        if (this.props.installationDetails["EntityImage ID"]) {
            let imageId = this.props.installationDetails["EntityImage ID"];
            getAuxiliaryDataImage(this.props.projectId, this.props.entityId, imageId, this.source.token).then(image => {
                this.setState({
                    auxiliaryDataImage: image.data
                })
            })
        }
    }

    toggleInstallationDropdownOpen() {
        this.setState({
            installationDropdownIsOpen: !this.state.installationDropdownIsOpen
        })
    }

    render() {
        let collapsibleHeadings =
            this.props.installationDetails.Details.map(heading => {
                return <CollapsibleHeading key={heading.name} heading={heading.name} items={heading.items}></CollapsibleHeading>
            })

        let installationSelection =
            this.props.installationSelectorComponent &&
            <div>
                <div className="overview-container" onClick={this.toggleInstallationDropdownOpen}>
                    <div className="overview-heading">
                        Installations
                    </div>
                    <div className="dropdown-icon">
                        {this.state.installationDropdownIsOpen ? <i className="fas fa-chevron-up icon"></i> : <i className="fas fa-chevron-down icon"></i>}
                    </div>
                </div>
                <Collapse isOpened={this.state.installationDropdownIsOpen}>
                    <InstallationFilterSelector onFilterClick={this.props.onInstallationFilterClick}> </InstallationFilterSelector>
                </Collapse>
            </div>

        let content =
            <>
                {installationSelection}
                {collapsibleHeadings}
            </>

        let imageId;
        let imageAndHeader;

        let panel;

        if (this.props.installationDetails["Image ID"]) {
            imageId = this.props.installationDetails["Image ID"];
            imageAndHeader = (<>
                <div className="overview-thumbnail">
                    <img src={`https://epmdata.blob.core.windows.net/assets/images/${imageId}.jpg`} alt="overview-thumbnail" ></img>
                </div>
            </>)
            panel = <>
                {imageAndHeader}
                {content}
            </>
        } else if (this.props.installationDetails["EntityImage ID"]) {
            imageAndHeader = (<>
                <div className="overview-thumbnail">
                    <img src={"data:image/jpeg;base64," + this.state.auxiliaryDataImage} alt="overview-thumbnail" ></img>
                </div>
            </>)
            panel = <>
                {imageAndHeader}
                {content}
            </>
            return panel; // returning just the content, no sliding panel, caller will provide this.
        }

        return (
            panel
        );
    }
}

export default ConfigInstallationDetailsPanel;