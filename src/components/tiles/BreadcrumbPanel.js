import React, { Component } from 'react';
import SlidingPanel from '../sliding-panels/SlidingPanel';
import RenderBreadcrumbPreview from './renderers/breadcrumbs/PreviewCrumb';

class BreadcrumbPanel extends Component {
    render() {
        const breadcrumbLength = this.props.breadcrumbs.length;

        let content =
            this.props.breadcrumbs.map((crumb, i) => {
                let isSelected = breadcrumbLength === i + 1
                return crumb.renderer(crumb.object, () => this.props.onBreadcrumbClick(crumb), isSelected);
            })

        let lastBreadcrumb = this.props.breadcrumbs[this.props.breadcrumbs.length - 1]
        let nextBreadcrumb;
        if (lastBreadcrumb) {
            nextBreadcrumb = lastBreadcrumb.nextBreadcrumb
        }

        const { previewCrumbContent } = this.props;

        if (nextBreadcrumb) {
            let appendedCrumb = RenderBreadcrumbPreview(nextBreadcrumb, () => { }, previewCrumbContent);
            content.push(appendedCrumb);
        }

        return (<SlidingPanel
            content={content}
            isBreadcrumbBar={true}>
        </ SlidingPanel>)
    }
}

export default BreadcrumbPanel