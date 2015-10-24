/// <reference path="../../typings/react-redux/react-redux.d.ts" />
/// <reference path="../../typings/redux/redux.d.ts" />
/// <reference path="../../typings/redux-thunk/redux-thunk.d.ts" />

import { createStore, Middleware, applyMiddleware, Store } from 'redux';
import * as ThunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';
import { Favorite } from '../reducers/favorites';

const createStoreWithMiddlewares = applyMiddleware(
	<any>ThunkMiddleware
)(createStore);

export function configureStore(): Store {
	const store: Store = createStoreWithMiddlewares(rootReducer, {});
	return store;
};

interface Loadable {
	isFetching?: boolean,
	didInvalidate?: boolean,
	lastUpdated?: Date
};

interface LoadableArray<T> extends Loadable {
	items?: T[]
};

export interface StoreState {
	favorites: FavoritesStoreState
}

export interface FavoritesStoreState extends LoadableArray<FavoriteStoreState> {};

export interface FavoriteStoreState extends Loadable, Favorite {};
