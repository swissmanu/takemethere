/** @jsx React.DOM */
var React = require('react')
	, Button = require('../controls/button')
	, Item = require('./item');

var ConnectionList = React.createClass({
	propTypes: {
		connections: React.PropTypes.array
		, onDeleteConnection: React.PropTypes.func
	}

	, handleDeleteConnection: function(connectionToDelete) {
		this.props.onDeleteConnection(connectionToDelete);
	}

	, render: function() {
		var self = this
			, connectionNodes = this.props.connections.map(function(connection, index) {
				return (
					/* jshint ignore:start */
					<li key={ connection.id + '-' + index }>
						<Item connection={ connection } onDelete={ self.handleDeleteConnection } />
					</li>
					/* jshint ignore:end */
				);
			});

		return (
			/* jshint ignore:start */
			<ul>
				{ connectionNodes }
			</ul>
			/* jshint ignore:end */
		);
	}
});

module.exports = ConnectionList;