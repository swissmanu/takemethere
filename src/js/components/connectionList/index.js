/** @jsx React.DOM */
var React = require('react')
	, Button = require('../controls/button')
	, Item = require('./item');

var ConnectionList = React.createClass({
	propTypes: {
		connections: React.PropTypes.array
		, onDeleteConnection: React.PropTypes.func
	}

	, getInitialState: function() {
		return {
			showActions: false
		};
	}

	, handleDeleteConnection: function(connectionToDelete) {
		this.props.onDeleteConnection(connectionToDelete);
	}

	, render: function() {
		var self = this
			, connectionNodes = this.props.connections.map(function(connection, index) {
				return (
					/* jshint ignore:start */
					<li className='item' key={ connection.id + '-' + index }>
						<Item connection={ connection } onDelete={ self.handleDeleteConnection } />
					</li>
					/* jshint ignore:end */
				);
			});

		return (
			/* jshint ignore:start */
			<ul className='connection-list'>
				{ connectionNodes }
			</ul>
			/* jshint ignore:end */
		);
	}
});

module.exports = ConnectionList;