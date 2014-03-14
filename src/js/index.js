/** @jsx React.DOM */
/* jshint ignore:start */

var React = require('react')
	, Container = require('./components/container');

React.renderComponent(
	<Container />
	, document.getElementById('content')
);
