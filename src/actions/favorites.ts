/// <reference path="../../typings/q/Q.d.ts"/>

import * as TransportAPI from '../transportApi';
import * as Q from 'q';
import * as Store from '../store/index';

export const INVALIDATE_FAVORITES = 'INVALIDATE_FAVORITES';
export const FETCH_FAVORITES_REQUEST = 'FETCH_FAVORITES_REQUEST';
export const FETCH_FAVORITES_SUCCESS = 'FETCH_FAVORITES_SUCCESS';
export const FETCH_FAVORITES_FAILED = 'FETCH_FAVORITES_FAILED';
export const FLIP_FAVORITE_DIRECTION = 'FLIP_FAVORITE_DIRECTION';
export const FETCH_FAVORITE_REQUEST = 'FETCH_FAVORITE_REQUEST';
export const FETCH_FAVORITE_SUCCESS = 'FETCH_FAVORITE_SUCCESS';
export const FETCH_FAVORITE_FAILED = 'FETCH_FAVORITE_FAILED';

export function invalidateFavorites() {
	return {
		type: INVALIDATE_FAVORITES
	};
}

export function fetchFavoritesIfNeeded() {
	return (dispatch, getState) => {
		if(shouldFetchFavorites(getState())) {
			return dispatch(fetchFavorites());
		}
	};
}

export function flipFavoriteDirection(index) {
	return {
		type: FLIP_FAVORITE_DIRECTION,
		index: index
	};
}

export function fetchFavoriteIfNeeded(index) {
	return (dispatch, getState) => {
		const favorite: Store.FavoriteStoreState = getState().favorites.items[index];

		if(shouldFetchFavorite(favorite)) {
			return dispatch(fetchFavorite(index, favorite));
		}
	};
}








function requestFavorites() {
	return {
		type: FETCH_FAVORITES_REQUEST
	};
};

function receiveFavorites(favorites) {
	return {
		type: FETCH_FAVORITES_SUCCESS,
		favorites: favorites,
		recivedAt: Date.now()
	};
};

function failedFavorites(error) {
	return {
		type: FETCH_FAVORITES_FAILED,
		error: error
	};
}

function fetchFavorites() {
	return (dispatch) => {
		dispatch(requestFavorites());

		const rawFavorites = [{
			icon: 'room',
			from: { id: '008509000' },
			to: { id: '008503000' }
		}, {
			icon: 'home',
			from: { id: '008503000' },
			to: { id: '008509000' }
		}];

		return Q.all(rawFavorites.map(function(rawFavorite) {
			return resolveFavorite(rawFavorite)
        }))
		.then((favorites) => dispatch(receiveFavorites(favorites)))
		.catch((error) => dispatch(failedFavorites(error)));
	}
}



function requestFavorite(index: number) {
	return {
		type: FETCH_FAVORITE_REQUEST,
		index: index
	};
}

function receiveFavorite(index, favorite) {
	return {
		type: FETCH_FAVORITE_SUCCESS,
		index: index,
		favorite: favorite,
		recivedAt: Date.now()
	};
};

function failedFavorite(index: number, error: Error) {
	return {
		type: FETCH_FAVORITE_FAILED,
		index: index
	};
}

function fetchFavorite(index: number, favorite: Store.FavoriteStoreState) {
	return (dispatch) => {
		dispatch(requestFavorite(index));

		resolveFavorite(favorite)
			.then((favorite) => dispatch(receiveFavorite(index, favorite)))
			.catch((error) => dispatch(failedFavorite(index, error)));
	}
}






function shouldFetchFavorites(state: Store.StoreState) {
	const favorites: Store.FavoritesStoreState = state.favorites;

	if(!favorites || favorites.items.length === 0) { return true; }
	if(favorites.isFetching) { return false; }
	return favorites.didInvalidate;
}

function shouldFetchFavorite(favorite: Store.FavoriteStoreState) {
	if(favorite.isFetching) { return false; }
	return favorite.didInvalidate;
}






function resolveFavorite(favorite: Store.FavoriteStoreState): Q.Promise<Store.FavoriteStoreState> {
	return Q.all<any>([
		TransportAPI.locations(favorite.from.id),
		TransportAPI.locations(favorite.to.id),
		TransportAPI.connections(favorite.from, favorite.to)
	])
	.then(function(resolved) {
		return {
			icon: favorite.icon,
			from: resolved[0][0],
			to: resolved[1][0],
			nextConnections: resolved[2]
		};
	})
}
