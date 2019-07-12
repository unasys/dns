import React from 'react';
import '../Panels.scss';
import CollapsibleHeading from './CollapsibleHeading';
import axios from 'axios';
import { getAuxiliaryDataImage } from '../../../../api/Entities';
import history from '../../../../history.js'
import InstallationFilterSelector from '../../../pages/oil&gas/InstallationFilterSelector';
import { Collapse } from 'react-collapse';
import NavigationHeading from './NavigationHeading';

const CancelToken = axios.CancelToken;


class ConfigInstallationDetailsPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            auxiliaryDataImage: null,
        }
        this.source = CancelToken.source();
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

    render() {
        let collapsibleHeadings =
            this.props.installationDetails.Details.map(heading => {
                return <CollapsibleHeading key={heading.name} heading={heading.name} items={heading.items}></CollapsibleHeading>
            })

        let navigationHeadings =
            (this.props.projectId && <>
                <NavigationHeading heading={'View in EPM'} onClick={()=> window.open(`https://epm.unasys.com/projects/${this.props.projectId}/`, "_blank")}></NavigationHeading>
            </>)

        let installationSelection =
            this.props.installationSelectorComponent &&
            <div>
                <NavigationHeading heading={'Installations'} onClick={()=> history.push('installations')}></NavigationHeading>
            </div>

        let content =
            <>
                {installationSelection}
                {collapsibleHeadings}
                {navigationHeadings}
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