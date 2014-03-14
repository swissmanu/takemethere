/* global $ */

function locations(term, callback) {
	$.get(
		'http://transport.opendata.ch/v1/locations'
		, {
			query: term
		}
		, function success(response) {
			var stations = response.stations;
			callback(null, stations);
		})
		.fail(function() {
			callback(new Error('Could not query the api :('));
		});
}

function connections(origin, destination, via, callback) {
	var data = {
			from: origin.id
			, to: destination.id
		};

	if(via) {
		data.via = via.map(function(via) {
			return via.id;
		});
	}

	$.get(
		'http://transport.opendata.ch/v1/connections'
		, data
		, function success(response) {
			var connections = response.connections;
			callback(null, connections);
		})
		.fail(function() {
			callback(new Error('Could not query the api :('));
		});
}

module.exports = {
	locations: locations
	, connections: connections
};