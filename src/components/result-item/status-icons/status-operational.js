import React from 'react';
import './Status.scss';

export default class StatusOperational extends React.Component {
	render() {
		const condition = this.props.condition
		let title = 'Operational'
		if (condition !== undefined) {
			title += ' (' + condition + ')';
		}
		return (
			<svg className={"asset-tag " + this.props.condition} id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.7 56.7"><title>{title}</title><style>{`.st0{fill:currentColor;stroke:#fff;stroke-width:0;stroke-linejoin:round;stroke-miterlimit:10}.st1{fill:none;stroke:#fff;stroke-width:2;stroke-miterlimit:10}`}</style> <path className="st0 cog" d="M9.9 28.4v-1.9c0-.5.2-.7.7-.7h2.9c.5 0 .7-.1.8-.6.4-1.5.9-2.9 1.7-4.2.4-.6.3-1-.2-1.5-.6-.6-1.2-1.2-1.8-1.7-.4-.3-.5-.6 0-1 1-.9 1.9-1.8 2.7-2.7.4-.4.6-.3.8 0l1.9 1.9c.4.4.8.5 1.3.2 1.4-.9 2.8-1.5 4.4-1.8.5-.1.4-.4.4-.7v-2.8c0-.6.2-.8.8-.8h3.8c.6 0 .8.2.8.8v2.9c0 .4 0 .6.5.7 1.5.4 2.9.9 4.3 1.7.6.4 1 .3 1.5-.2.6-.7 1.3-1.3 1.9-1.9.3-.3.4-.3.7 0 1 1 2.1 2 3.1 3 .3.3 0 .4-.1.6l-2.1 2.1c-.4.4-.4.7-.1 1.1.8 1.3 1.5 2.7 1.8 4.3.1.5.3.7.9.7.9-.1 1.9 0 2.8 0 .5 0 .7.2.7.7v3.9c0 .5-.2.7-.7.7h-2.9c-.5 0-.7.2-.8.6-.3 1.6-1 3-1.9 4.4-.3.4-.2.7.1 1.1l2.1 2.1c.2.2.4.3.1.6l-3 3c-.3.3-.5.3-.9 0-.6-.7-1.3-1.3-2-2-.3-.3-.7-.4-1.1-.1-1.4.9-2.9 1.5-4.5 1.8-.4.1-.4.4-.4.7v2.7c0 .6-.2.9-.9.9h-3.7c-.6 0-.8-.2-.8-.8v-2.8c0-.4-.1-.6-.5-.7-1.5-.3-2.9-.9-4.2-1.7-.6-.4-1.1-.4-1.6.2-.6.7-1.3 1.2-1.9 1.9-.3.3-.5.2-.8 0-.9-1-1.9-1.9-2.9-2.9-.4-.4-.2-.6 0-.9.7-.7 1.3-1.4 2-2 .4-.3.4-.7.2-1-.9-1.5-1.5-3-1.9-4.6.2-.7-.1-.7-.5-.7-.9 0-1.8-.1-2.7 0-.8.1-1-.3-1-1 .2-.5.1-1.1.2-1.6-.1 0-.1 0 0 0zm24.6.1c0-3.5-2.7-6.2-6.1-6.2-3.4 0-6.1 2.7-6.2 6.1 0 3.3 2.8 6.2 6.2 6.2 3.3-.1 6-2.8 6.1-6.1z" /><path className="st1 arrow" d="M4.5 24.1c2-11.4 12-20 24-20" /><path className="st0 arrow" d="M7.6 23.5l-3.5 4.9-2.5-5.5z" /><path className="st1 arrow" d="M52.4 32.7c-2 11.4-12 20-24 20" /><path className="st0 arrow" d="M49.3 33.2l3.5-4.8 2.5 5.4z" /></svg>)
	}
};
