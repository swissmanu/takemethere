/**
 * @jsx React.DOM
 */

/** ReactComponent: Select2
 * Wraps the mighty select2 dropdown library into a react component.
 *
 * Credits & based upon:
 * *based upon http://jsfiddle.net/pHp77/1/
 */
var Select2 = React.createClass({
	propTypes: {
		name: React.PropTypes.string

		// The initial selected value; one of the option children should have a
		// matching value="..."
		, defaultValue: React.PropTypes.object

		// Callback executed when the selected value changes; receives a single
		// jQuery event object `e` from select2; `e.target` refers to the real
		// <select> element and `e.val` refers to the new selected value
		, onChange: React.PropTypes.func

		, query: React.PropTypes.func
		, formatResult: React.PropTypes.func
		, formatSelection: React.PropTypes.func
		, minimumInputLength: React.PropTypes.number
		, multiple: React.PropTypes.bool
		, placeholder: React.PropTypes.string
	}
	, getInitialState: function() {
		return { value: null };
	}
	, render: function() {
		return (
			<input type="hidden" />
		);
	}
	, componentDidMount: function() {
		var domNode = $(this.getDOMNode())
			, options = {};


		if(this.props.query != null) {
			options.query = this.props.query;
		}
		if(this.props.formatResult != null) {
			options.formatResult = this.props.formatResult;
		}
		if(this.props.formatSelection != null) {
			options.formatSelection = this.props.formatSelection;
		}
		if(this.props.minimumInputLength != null) {
			options.minimumInputLength = this.props.minimumInputLength;
		}
		/*if (this.props.defaultValue != null) {
			options.val = this.props.defaultValue;
		}*/
		if (this.props.placeholder != null) {
			options.placeholder = this.props.placeholder;
		}

		domNode.select2(options);

		if (this.props.defaultValue != null) {
			domNode.select2('data', this.props.defaultValue);
		}

		$(domNode).on('change', this._handleChange);
	},

	componentWillUnmount: function() {
		$(this.getDOMNode()).select2('destroy');
	},

	_handleChange: function(e) {
		this.props.onChange && this.props.onChange(e);
	}
});

/** ReactComponent: StationDropDown
 * Wraps the <Select2> component and allows searches on transportation stations.
 */
var StationDropDown = React.createClass({
	propTypes: {
		onChange: React.PropTypes.func
		, placeholder: React.PropTypes.string
	}

	, queryStations: function(query) {
		$.get(
			'http://transport.opendata.ch/v1/locations'
			, {
				query: query.term
			}
			, function success(response) {
				var stations = response.stations;
				query.callback({
					results: stations
				});
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
			<Select2
				placeholder={ this.props.placeholder }
				minimumInputLength={2}
				query={ this.queryStations }
				formatResult={ this.formatStation }
				formatSelection={ this.formatStation }
				onChange={ this.handleChange }
				defaultValue={ this.props.station } />
		);
	}
});

var Button = React.createClass({
	render: function() {
		return (
			<button onClick={ this.props.onClick }>{ this.props.label }</button>
		);
	}
});


var Connection = React.createClass({
	render: function() {
		var self = this;
		return (
			<div>
				{ this.props.connection.from.name } to { this.props.connection.to.name }
				{ this.props.connection.via && this.props.connection.via.length > 0 ? ' (via ' + this.props.connection.via.length + ' station(s))' : '' }
				<Button label='Delete' onClick={ this.props.onDelete.bind(null, this.props.connection, this.props.key) } />
			</div>
		);
	}
});

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
	}
	, handleDeleteVia: function(index) {
		var via = this.state.via;

		via.splice(index, 1);
		this.setState({ via: via });
	}
	, render: function() {
		var self = this
			, viaNodes = [];

		this.state.via.forEach(function(station, index) {
			viaNodes.push(
				<li key={ station.id + '-' + index } className='station via'>
					<StationDropDown station={ station } placeholder='Via' onChange={ self.handleViaChanged.bind(null, index) } />
					<Button label='Delete' onClick={ self.handleDeleteVia.bind(null, index) } />
				</li>
			);
		});

		return (
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
		);
	}
});

var ConnectionList = React.createClass({
	getInitialState: function() {
		return {
			showAddConnectionForm: true
		};
	}
	, componentWillMount: function() {
		var connections;

		try {
			connections = JSON.parse(localStorage.getItem('connections'));
		} catch(err) {
			console.warn('could not parse connections from localStorage. set default.');
			connections = buildDefaultConnections();
			localStorage.setItem('connections', JSON.stringify(connections));
		}

		if(!connections) {
			console.warn('no connections in localStorage. set default.')
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
			, from: origin
			, to: destination
			, via: via
		});

		this.setState({ connections: connections });
	}
	, handleDeleteConnection: function(connection, key) {
		var connections = this.state.connections;

		connections.some(function(connection, index) {
			if(connection.id === key) {
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
					<li key={ connection.id }>
						<Connection connection={ connection } onDelete={ self.handleDeleteConnection } />
					</li>
				);
			});

		return (
			<div>
				{ !this.state.showAddConnectionForm ? <Button label='Log Connections' onClick={ this.handlePrintConnections } /> : '' }
				{ !this.state.showAddConnectionForm ? <Button label='Load Demo Data' onClick={ this.handleLoadDemoData } /> : '' }
				{ !this.state.showAddConnectionForm ? <Button label='Add' onClick={ this.toggleConnectionForm } /> : '' }
				{ this.state.showAddConnectionForm ? <ConnectionForm onSave={ this.handleSaveNewConnection } onCancel={ this.toggleConnectionForm } /> : '' }
				<ul>
					{ connectionNodes }
				</ul>
			</div>
		);
	}
});
React.renderComponent(
	<ConnectionList />,
	document.getElementById('content')
);



