/** @jsx React.DOM */
var React = require('react')
	, Button = require('./button')
	, api = require('../api')
	, moment = require('moment');

require('moment-de');

var Connection = React.createClass({
	getInitialState: function() {
		return {
			nextDeparture: undefined
			, refreshing: false
		};
	}
	, loadNextConnection: function() {
		var self = this;

		self.setState({ refreshing: true });

		api.connections(
			this.props.connection.origin, this.props.connection.destination, this.props.connection.via
			, function(err, connections) {
				var next = connections[0]
					, departure = next.from.departure;

				self.setState({
					nextDeparture: departure
					, refreshing: false
				});
			}
		);
	}

	, componentDidMount: function() {
		this.loadNextConnection();
	}


	, render: function() {
		var fromnow;

		if(this.state.nextDeparture) {
			fromnow = moment(this.state.nextDeparture).fromNow();
		}

		return (
			/* jshint ignore:start */
			<div>
				{ this.props.connection.origin.name } to { this.props.connection.destination.name }
				{ this.props.connection.via && this.props.connection.via.length > 0 ? ' (via ' + this.props.connection.via.length + ' station(s))' : '' }
				{ this.state.refreshing ? <i className='fa fa-spinner fa-spin' /> : '' }
				{ !this.state.refreshing && fromnow ? <span className='fromnow'>{ fromnow }</span> : '' }
				<Button label='Delete' onClick={ this.props.onDelete.bind(null, this.props.connection) } />
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = Connection;