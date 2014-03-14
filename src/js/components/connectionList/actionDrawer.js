/** @jsx React.DOM */
var React = require('react')
	, Button = require('../controls/button');

var ActionDrawer = React.createClass({
	handleDeleteConnection: function() {
		this.props.onDeleteConnection(this.props.connection);
		return false;
	}

	, render: function() {
		return (
			/* jshint ignore:start */
			<div className='actions'>
				<Button className='delete' label='Delete' onClick={ this.handleDeleteConnection } />
				<Button className='reverse' label='Reverse' />
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = ActionDrawer;