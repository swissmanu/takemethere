/** @jsx React.DOM */

var React = require('react');

var Button = React.createClass({
	render: function() {
		return (
			/* jshint ignore:start */
			<button onClick={ this.props.onClick }>{ this.props.label }</button>
			/* jshint ignore:end */
		);
	}
});

module.exports = Button;