/*var generateGUID = (typeof(window) !== 'undefined' &&
	typeof(window.crypto) !== 'undefined' &&
	typeof(window.crypto.getRandomValues) !== 'undefined') ?
	function() {
		// If we have a cryptographically secure PRNG, use that
		// http://stackoverflow.com/questions/6906916
		// /collisions-when-generating-uuids-in-javascript
		var buf = new Uint16Array(8);
		window.crypto.getRandomValues(buf);
		var S4 = function(num) {
			var ret = num.toString(16);
			while(ret.length < 4){
				ret = "0"+ret;
			}
			return ret;
		};

		return (
			S4(buf[0])+S4(buf[1])+"-"+S4(buf[2])+"-"+S4(buf[3])+"-"+
			S4(buf[4])+"-"+S4(buf[5])+S4(buf[6])+S4(buf[7])
		);
	}

	:

	function() {
		// Otherwise, just use Math.random
		// http://stackoverflow.com/questions/105034
		// /how-to-create-a-guid-uuid-in-javascript/2117523#2117523
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
			function(c) {
				var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			}
		);
	};

function buildDefaultConnections() {
	return [{
		id: generateGUID(),
		from: {
			id: '008576090'
			, name: 'Rapperswil SG Bahnhof'
			, coordinate: {
				type: 'WGS84'
				, x: 8.817195
				, y: 47.224974
			}
		}
		, to: {
			id: '008574671'
			, name: 'Domat/Ems Plaregna'
			, coordinate: {
				type: 'WGS84'
				, x: 9.462962
				, y: 46.837529
			}
		}
		, via: [{
			id: '008573800'
			, name: 'Pfäffikon SZ'
			, coordinate: {
				type: "WGS84"
				, x: 8.779476
				, y: 47.202878
			}
		}]
	}, {
		id: generateGUID(),
		from: {
			id: "008580199"
			, "name":"Chur, Postplatz"
			, "coordinate": {
				"type":"WGS84"
				, "x":9.531846
				, "y":46.851301
			}
		}
		, to: {
			id: '008574671'
			, name: 'Domat/Ems Plaregna'
			, coordinate: {
				type: 'WGS84'
				, x: 9.462962
				, y: 46.837529
			}
		}
	}];
}

(function($) {

	var connections = [{
			from: {
				id: '008576090'
				, name: 'Rapperswil SG Bahnhof'
				, coordinate: {
					type: 'WGS84'
					, x: 8.817195
					, y: 47.224974
				}
			}
			, to: {
				id: '008574671'
				, name: 'Domat/Ems Plaregna'
				, coordinate: {
					type: 'WGS84'
					, x: 9.462962
					, y: 46.837529
				}
			}
			, via: [{
				id: '008573800'
				, name: 'Pfäffikon SZ'
				, coordinate: {
					type: "WGS84"
					, x: 8.779476
					, y: 47.202878
				}
			}]
		}, {
			from: {
				id: "008580199"
				, "name":"Chur, Postplatz"
				, "coordinate": {
					"type":"WGS84"
					, "x":9.531846
					, "y":46.851301
				}
			}
			, to: {
				id: '008574671'
				, name: 'Domat/Ems Plaregna'
				, coordinate: {
					type: 'WGS84'
					, x: 9.462962
					, y: 46.837529
				}
			}
		}]
		, location;


	function refreshConnections(connections) {
		var domConnections = $('#connections');
		domConnections.empty();

		connections.forEach(function(connection, i) {
			var connectionTitle = connection.from.name + ' nach ' + connection.to.name
				, data = {
					from: connection.from.id
					, to: connection.to.id
				};

			if(connection.via) {
				data.via = connection.via.map(function(via) {
					return via.id;
				});
			}

			domConnections.append(
				$('<li/>')
				.attr('id', 'connection-' + i)
				.append(
					$('<h2/>')
					.text(connectionTitle)
				)
				.append(
					$('<p/>')
					.attr('class', 'next-upcoming')
					.text('Abfragen...')
				)
			);

			$.get(
				'http://transport.opendata.ch/v1/connections'
				, data
				, function success(response) {
					var nextConnection = response.connections[0]
						, domConnection = $('#connection-' + i)
						, domNextUpcoming = $('.next-upcoming', domConnection)
						, times = 'Abfahrt: ' +
							moment(nextConnection.from.departure).format('HH:mm') +
							', Ankunft ' +
							moment(nextConnection.to.arrival).format('HH:mm') + ' '
						, fromNow = moment(nextConnection.from.departure).fromNow();

					domNextUpcoming.text(times);
					domNextUpcoming.append(
						$('<span/>')
						.attr('class', 'fromnow')
						.text(fromNow)
					);
			});

		});
	}


	$(function() {
		//refreshConnections(connections);
	});


	/*


	navigator.geolocation.getCurrentPosition(function success(pos) {

	}, function error(err) {
		console.log(err);
	}, {
		enableHighAccuracy: true
		, maximumAge: 10000
		, timeout: 30000
	});

})($);*/