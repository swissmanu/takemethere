/// <reference path="../../typings/redux/redux.d.ts" />

import { combineReducers } from 'redux';
import favorites from './favorites';

export default combineReducers({
	favorites
});
