/** @jsx React.DOM */

var React = require('react')
	, select2 = require('select2');

/** ReactComponent: Select2
 * Wraps the mighty select2 dropdown library into a react component.
 *
 * Credits & based upon:
 * *based upon http://jsfiddle.net/pHp77/1/
 */
var ReactSelect2 = React.createClass({
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
			/* jshint ignore:start */
			<input type="hidden" />
			/* jshint ignore:end */
		);
	}
	, componentDidMount: function() {
		var domNode = $(this.getDOMNode())
			, options = {};


		if(this.props.query !== null) {
			options.query = this.props.query;
		}
		if(this.props.formatResult !== null) {
			options.formatResult = this.props.formatResult;
		}
		if(this.props.formatSelection !== null) {
			options.formatSelection = this.props.formatSelection;
		}
		if(this.props.minimumInputLength !== null) {
			options.minimumInputLength = this.props.minimumInputLength;
		}
		/*if (this.props.defaultValue !== null) {
			options.val = this.props.defaultValue;
		}*/
		if (this.props.placeholder !== null) {
			options.placeholder = this.props.placeholder;
		}

		domNode.select2(options);

		if (this.props.defaultValue !== null) {
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

module.exports = ReactSelect2;