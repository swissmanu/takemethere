/** @jsx React.DOM */
var React = require('react')
	, Button = require('./button')
	, StationDropDown = require('./stationDropDown');

var ConnectionForm = React.createClass({
	getInitialState: function() {
		return {
			origin: undefined
			, destination: undefined
			, via: []
		};
	}

	, handleSubmit: function() {
		var origin = this.state.origin
			, destination = this.state.destination
			, via = this.state.via;

		if(!origin || !destination) {
			return false;
		}

		this.props.onSave(origin, destination, via);

		return false;
	}
	, handleOriginChanged: function(origin) {
		this.setState({ origin: origin });
	}
	, handleDestinationChanged: function(destination) {
		this.setState({ destination: destination });
	}
	, handleViaChanged: function(index, station) {
		var via = this.state.via;

		via[index] = station;
		this.setState({ via: via });
	}
	, handleAddVia: function() {
		var via = this.state.via;

		via.push({});
		this.setState({ via: via });

		return false;
	}
	, handleDeleteVia: function(index) {
		var via = this.state.via;

		via.splice(index, 1);
		this.setState({ via: via });

		return false;
	}
	, render: function() {
		var self = this
			, viaNodes = [];

		this.state.via.forEach(function(station, index) {
			viaNodes.push(
				/* jshint ignore:start */
				<li key={ station.id + '-' + index } className='station via'>
					<StationDropDown station={ station } placeholder='Via' onChange={ self.handleViaChanged.bind(null, index) } />
					<Button label='Delete' onClick={ self.handleDeleteVia.bind(null, index) } />
				</li>
				/* jshint ignore:end */
			);
		});

		return (
			/* jshint ignore:start */
			<form onSubmit={ this.handleSubmit }>
				<fieldset>
					<legend>Itinerary</legend>
					<ol className='itinerary'>
						<li className='station origin'>
							<StationDropDown station={ this.state.origin } placeholder='Origin' onChange={ this.handleOriginChanged } />
						</li>
						{ viaNodes }
						<li className='station destination'>
							<StationDropDown station={ this.state.destination } placeholder='Destination' onChange={ this.handleDestinationChanged } />
						</li>
					</ol>
				</fieldset>
				<input type="submit" value="Save" />
				<Button label='Cancel' onClick={ this.props.onCancel } />
				<Button label='Add Via' onClick={ this.handleAddVia } />
			</form>
			/* jshint ignore:end */
		);
	}
});

module.exports = ConnectionForm;