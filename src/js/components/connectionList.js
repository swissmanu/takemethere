/** @jsx React.DOM */
var React = require('react')
	, Button = require('./button')
	, ConnectionForm = require('./connectionForm')
	, Connection = require('./connection');


var generateGUID = (typeof(window) !== 'undefined' &&
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
		origin: {
			id: '008576090'
			, name: 'Rapperswil SG Bahnhof'
			, coordinate: {
				type: 'WGS84'
				, x: 8.817195
				, y: 47.224974
			}
		}
		, destination: {
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
		origin: {
			id: "008580199"
			, "name":"Chur, Postplatz"
			, "coordinate": {
				"type":"WGS84"
				, "x":9.531846
				, "y":46.851301
			}
		}
		, destination: {
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


var ConnectionList = React.createClass({
	getInitialState: function() {
		return {
			showAddConnectionForm: false
		};
	}
	, componentWillMount: function() {
		var connections;
		/* global localStorage */
		try {
			connections = JSON.parse(localStorage.getItem('connections'));
		} catch(err) {
			console.warn('could not parse connections from localStorage. set default.');
			connections = buildDefaultConnections();
			localStorage.setItem('connections', JSON.stringify(connections));
		}

		if(!connections) {
			console.warn('no connections in localStorage. set default.');
			connections = buildDefaultConnections();
			localStorage.setItem('connections', JSON.stringify(connections));
		}

		this.setState({ connections: connections });
	}

	, toggleConnectionForm: function() {
		this.setState({ showAddConnectionForm: !this.state.showAddConnectionForm });
		return false;
	}
	, handleSaveNewConnection: function(origin, destination, via) {
		this.toggleConnectionForm();

		var connections = this.state.connections;
		connections.push({
			id: generateGUID()
			, origin: origin
			, destination: destination
			, via: via
		});

		this.setState({ connections: connections });
	}
	, handleDeleteConnection: function(connectionToDelete) {
		var connections = this.state.connections;

		connections.some(function(connection, index) {
			if(connection.id === connectionToDelete.id) {
				connections.splice(index, 1);
				return true;
			} else {
				return false;
			}
		});

		this.setState({connections: connections});
	}

	, handleLoadDemoData: function() {
		this.setState({ connections: buildDefaultConnections() });
	}
	, handlePrintConnections: function() {
		console.log(this.state.connections);
	}

	, render: function() {
		var self = this
			, connectionNodes = this.state.connections.map(function(connection, index) {
				return (
					/* jshint ignore:start */
					<li key={ connection.id + '-' + index }>
						<Connection connection={ connection } onDelete={ self.handleDeleteConnection } />
					</li>
					/* jshint ignore:end */
				);
			});

		return (
			/* jshint ignore:start */
			<div>
				{ !this.state.showAddConnectionForm ? <Button label='Log Connections' onClick={ this.handlePrintConnections } /> : '' }
				{ !this.state.showAddConnectionForm ? <Button label='Load Demo Data' onClick={ this.handleLoadDemoData } /> : '' }
				{ !this.state.showAddConnectionForm ? <Button label='Add' onClick={ this.toggleConnectionForm } /> : '' }
				{ this.state.showAddConnectionForm ? <ConnectionForm onSave={ this.handleSaveNewConnection } onCancel={ this.toggleConnectionForm } /> : '' }
				<ul>
					{ connectionNodes }
				</ul>
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = ConnectionList;