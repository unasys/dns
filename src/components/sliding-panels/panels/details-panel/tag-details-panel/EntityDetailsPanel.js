import React from 'react';
import '../../Panels.scss';
import ConfigInstallationDetailsPanel from '../ConfigInstallationDetailsPanel';
import axios from 'axios';
import { fetchEntityDocuments } from '../../../../../api/Documents';
import { fetchEntityActivities } from '../../../../../api/Activities';
import ResultItem from '../../../../result-item/ResultItem';
import { Collapse } from 'react-collapse';

const CancelToken = axios.CancelToken;

class EntityDetailsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            documents: [],
            activities: [],
            documentsIsOpen: false,
            activitiesIsOpen: false,
            activitySelectedId: null
        }
        this.source = CancelToken.source();
        this.changeDocumentsState = this.changeDocumentsState.bind(this);
        this.changeActivitiesState = this.changeActivitiesState.bind(this);
        this.activityOnClick = this.activityOnClick.bind(this);
    }

    componentDidMount() {
        this.fetchDocumentsForEntity();
        this.fetchActivitiesForEntity();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.entityId !== this.props.entityId) {
            this.setState({
                documents: [],
                activities: []
            })
            this.fetchDocumentsForEntity();
            this.fetchActivitiesForEntity();
        }
    }

    fetchDocumentsForEntity() {
        fetchEntityDocuments(this.props.projectId, this.props.entityId, this.source.token).then(documents => {
            this.setState({
                documents: documents.data._embedded.items
            })

        });
    }

    fetchActivitiesForEntity() {
        fetchEntityActivities(this.props.projectId, this.props.entityId, this.source.token).then(activities => {
            this.setState({
                activities: activities.data._embedded.items
            })
        })
    }

    changeDocumentsState() {
        this.setState({
            documentsIsOpen: !this.state.documentsIsOpen
        })
    }

    changeActivitiesState() {
        this.setState({
            activitiesIsOpen: !this.state.activitiesIsOpen
        })
    }

    activityOnClick(activity) {
        axios.get(activity._links.steps.href)
            .then(activityPayload => {
                let activitySteps = null;
                if (activityPayload.data.count !== 0) {
                    activitySteps = {
                        steps: activityPayload.data._embedded.items,
                        narrative: activity.detail
                    }
                }
                this.setState({
                    activitySelectedId: activity.id
                })
                this.props.setActivitySteps(activitySteps);
            })
    }

    render() {
        let content;
        if (this.props.auxiliaryData) {
            content = <ConfigInstallationDetailsPanel
                installationDetails={this.props.auxiliaryData}
                projectId={this.props.projectId}
                entityId={this.props.entityId}>
            </ConfigInstallationDetailsPanel>
        }

        if (this.state.documents.length > 0 || this.state.activities.length > 0) {
            content = (<div>
                <ConfigInstallationDetailsPanel
                    installationDetails={this.props.auxiliaryData}
                    projectId={this.props.projectId}
                    entityId={this.props.entityId}>
                </ConfigInstallationDetailsPanel>

                {this.state.documents &&
                    <>
                        <div className="overview-container" onClick={this.changeDocumentsState} >
                            <div className="overview-heading">
                                Documents
                             </div>
                            <div className="dropdown-icon">
                                {this.state.documentsIsOpen ? <i className="fas fa-chevron-up icon"></i> : <i className="fas fa-chevron-down icon"></i>}
                            </div>
                        </div>
                        <Collapse isOpened={this.state.documentsIsOpen}>
                            <div>
                                {this.state.documents.map(document => {
                                    return <ResultItem content={document.name} externalLinkSrc={document.currentRevision.content} contentOnClick={function () { }}></ResultItem>
                                })}
                            </div>
                        </Collapse>
                    </>
                }
                {
                    <>
                        <div className="overview-container" onClick={this.changeActivitiesState} >
                            <div className="overview-heading">
                                Activities
                             </div>
                            <div className="dropdown-icon">
                                {this.state.activitiesIsOpen ? <i className="fas fa-chevron-up icon"></i> : <i className="fas fa-chevron-down icon"></i>}
                            </div>
                        </div>
                        <Collapse isOpened={this.state.activitiesIsOpen}>
                            <div>
                                {this.state.activities.map(activity => {
                                    let isLargeResultItem = activity.name !== null && activity.code !== null
                                    let content = <>
                                        <div>{activity.code}</div>
                                        <div>{activity.name}</div>
                                    </>
                                    return <ResultItem content={content} selected={this.state.activitySelectedId === activity.id} largeResultItem={isLargeResultItem} contentOnClick={this.activityOnClick.bind(this, activity)}></ResultItem>
                                })}
                            </div>
                        </Collapse>
                    </>
                }
            </div>);
        }

        let finalContent = this.props.auxiliaryData ? content : <span></span>

        return (
            <>
                {finalContent}
            </>
        )
    }
}

export default EntityDetailsPanel;
