/** @jsx React.DOM */
var React = require('react')
	, SetIntervalMixin = require('../../mixins/setInterval')
	, ActionDrawer = require('./actionDrawer')
	, api = require('../../api')
	, moment = require('moment');

require('moment-de');

var UPDATE_INTERVAL = 1000*60;  // 1 minute

var Connection = React.createClass({
	mixins: [ SetIntervalMixin ]
	, updateCounter: 0

	, getInitialState: function() {
		return {
			nextDeparture: undefined
			, fromNow: undefined

			, refreshing: false
			, showActions: false
		};
	}

	, componentDidMount: function() {
		this.loadNextConnection();
		this.setInterval(this.handleAutomaticUpdate, UPDATE_INTERVAL);
	}

	, handleAutomaticUpdate: function() {
		var now = new Date()
			, departure = new Date(this.state.nextDeparture);

		if(departure < now) {
			this.loadNextConnection();
		} else {
			this.updateDepartureFromNow(this.state.nextDeparture);
		}

	}

	, handleToggleActionDrawer: function() {
		this.setState({ showActions: !this.state.showActions });
	}

	, loadNextConnection: function() {
		var self = this;

		self.setState({ refreshing: true });
		api.connections(
			this.props.connection.origin
			, this.props.connection.destination
			, this.props.connection.via
			, function(err, connections) {
				var next = connections[0]
					, departure = next.from.departure;

				self.updateDepartureFromNow(departure);
				self.setState({
					nextDeparture: departure
					, refreshing: false
				});
			}
		);
	}

	, updateDepartureFromNow: function(nextDeparture) {
		if(nextDeparture) {
			this.setState({
				fromNow: moment(nextDeparture).fromNow()
			});
		}
	}

	, render: function() {
		return (
			/* jshint ignore:start */
			<div onClick={ this.handleToggleActionDrawer }>
				{ this.props.connection.origin.name } to { this.props.connection.destination.name }
				{ this.props.connection.via && this.props.connection.via.length > 0 ? ' (via ' + this.props.connection.via.length + ' station(s))' : '' }
				{ this.state.refreshing ? <i className='fa fa-spinner fa-spin' /> : '' }
				{ !this.state.refreshing && this.state.fromNow ? <span className='fromnow'>{ this.state.fromNow }</span> : '' }
				{ this.state.showActions ? <ActionDrawer connection={ this.props.connection } onDeleteConnection={ this.props.onDelete } /> : '' }
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = Connection;