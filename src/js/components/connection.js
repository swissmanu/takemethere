/** @jsx React.DOM */
var React = require('react')
	, Button = require('./button');

var Connection = React.createClass({
	render: function() {
		var self = this;
		return (
			/* jshint ignore:start */
			<div>
				{ this.props.connection.from.name } to { this.props.connection.to.name }
				{ this.props.connection.via && this.props.connection.via.length > 0 ? ' (via ' + this.props.connection.via.length + ' station(s))' : '' }
				<Button label='Delete' onClick={ this.props.onDelete.bind(null, this.props.connection) } />
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = Connection;