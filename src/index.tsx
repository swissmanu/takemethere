/// <reference path="../typings/react/react.d.ts" />
/// <reference path="../typings/react-dom/react-dom.d.ts" />
/// <reference path="../typings/react-redux/react-redux.d.ts" />
/// <reference path="../typings/redux/redux.d.ts" />

import * as React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import App from './components/app';
import { configureStore } from './store';

const ReactDOM = require('react-dom');
const store: Store = configureStore();

ReactDOM.render((
	<Provider store={ store }>
		<App />
	</Provider>
), document.getElementById('content'));
