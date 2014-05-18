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

			, showActions: false
			, refreshing: false
		};
	}

	, componentDidMount: function() {
		this.loadNextConnection();
		this.setInterval(this.handleAutomaticUpdate, UPDATE_INTERVAL);
	}

	, handleToggleActionDrawer: function() {
		this.setState({ showActions: !this.state.showActions });
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

	, loadNextConnection: function() {
		var self = this;

		self.setState({ refreshing: true });
		api.connections(
			this.props.connection.from
			, this.props.connection.to
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
			<div>
				<div className='content' onClick={ this.handleToggleActionDrawer }>
					{ this.props.connection.from.name } to { this.props.connection.to.name }
					{ this.props.connection.via && this.props.connection.via.length > 0 ? ' (via ' + this.props.connection.via.length + ' station(s))' : '' }
					{ this.state.refreshing ? <i className='fa fa-spinner fa-spin' /> : '' }
					{ !this.state.refreshing && this.state.fromNow ? <span className='fromnow'>{ this.state.fromNow }</span> : '' }
				</div>
				{ this.state.showActions ? <ActionDrawer connection={ this.props.connection } onDeleteConnection={ this.props.onDelte } /> : '' }
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = Connection;