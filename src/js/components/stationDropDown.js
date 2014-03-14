/** @jsx React.DOM */
var React = require('react')
	, ReactSelect2 = require('./reactSelect2')
	, api = require('../api');


/** ReactComponent: StationDropDown
 * Wraps the <Select2> component and allows searches on transportation stations.
 */
var StationDropDown = React.createClass({
	propTypes: {
		onChange: React.PropTypes.func
		, placeholder: React.PropTypes.string
	}

	, queryStations: function(query) {
		api.locations(query.term, function(err, stations) {
			if(err === null) {
				query.callback({
					results: stations
				});
			}
		});
	}
	, formatStation: function(station) {
		return station.name;
	}

	, handleChange: function(e) {
		var selectedStation = $(e.target).select2('data');
		this.props.onChange && this.props.onChange(selectedStation);

		return false;  // catch a selection done by the return key
	}

	, render: function() {
		return (
			/* jshint ignore:start */
			<ReactSelect2
				placeholder={ this.props.placeholder }
				minimumInputLength={2}
				query={ this.queryStations }
				formatResult={ this.formatStation }
				formatSelection={ this.formatStation }
				onChange={ this.handleChange }
				defaultValue={ this.props.station } />
			/* jshint ignore:end */
		);
	}
});

module.exports = StationDropDown;