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
		}]
		, location;


	$(function() {
		var domConnections = $('<ul/>');
		$('body').append(domConnections);

		connections.forEach(function(connection, i) {
			var connectionTitle = connection.from.name + ' nach ' + connection.to.name;

			domConnections.append(
				$('<li/>')
				.attr('id', 'connection-' + i)
				.append(
					$('<h2/>')
					.text(connectionTitle)
				)
			);

			/*$.get('http://transport.opendata.ch/v1/connections', {
				from: connection.from.id
				, to: connection.to.id
				, via: connection.via[0].id
			}, function success(response) {*/
				var response = window.fakeResponse;
				var nextConnection = response.connections[0]
					, connectionElement = $('#connection-' + i)
					, nextConnectionElement = $('.next-upcoming', connectionElement)
					, text = 'Abfahrt: ' + nextConnection.from.departure + ', Ankunft ' + nextConnection.to.arrival;



				if(nextConnectionElement.length > 0) {
					nextConnectionElement.text(text);
				} else {
					$(connectionElement).append(
						$('<p/>')
						.attr('class', 'next-upcoming')
						.text(text)
					);
				}
			//});

		});


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
*/

})($);