/** @jsx React.DOM */
/* jshint ignore:start */

var React = require('react')
	, ConnectionList = require('./components/connectionList');

React.renderComponent(
	<ConnectionList />
	, document.getElementById('content')
);
