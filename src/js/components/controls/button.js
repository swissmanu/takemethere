/** @jsx React.DOM */

var React = require('react');

var Button = React.createClass({
	render: function() {
		var iconClassName;
		if(this.props.icon) {
			iconClassName = 'fa ' + this.props.icon + ' fa-fw';
		}

		return (
			/* jshint ignore:start */
			<button onClick={ this.props.onClick }>
				{ this.props.icon ? <i className={ iconClassName } /> : '' }
				{ this.props.label ? this.props.label : '' }
			</button>
			/* jshint ignore:end */
		);
	}
});

module.exports = Button;