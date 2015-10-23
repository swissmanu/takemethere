/// <reference path="../../typings/q/Q.d.ts"/>

import * as TransportAPI from '../transportApi';
import * as Q from 'q';
import * as Store from '../store';

export const INVALIDATE_FAVORITES = 'INVALIDATE_FAVORITES';
export const FETCH_FAVORITES_REQUEST = 'FETCH_FAVORITES_REQUEST';
export const FETCH_FAVORITES_SUCCESS = 'FETCH_FAVORITES_SUCCESS';
export const FETCH_FAVORITES_FAILED = 'FETCH_FAVORITES_FAILED';

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
            return Q.all<any>([
                TransportAPI.locations(rawFavorite.from.id),
                TransportAPI.locations(rawFavorite.to.id),
                TransportAPI.connections(rawFavorite.from, rawFavorite.to)
            ])
            .then(function(resolved) {
                return {
                    icon: rawFavorite.icon,
                    from: resolved[0][0],
                    to: resolved[1][0],
                    nextConnections: resolved[2]
                };
            });
        }))
		.then((favorites) => dispatch(receiveFavorites(favorites)))
		.catch((error) => dispatch(failedFavorites(error)));
	}
}



function shouldFetchFavorites(state: Store.StoreState) {
	const favorites: Store.FavoritesStoreState = state.favorites;

	if(!favorites || favorites.items.length === 0) { return true; }
	if(favorites.isFetching) { return false; }
	return favorites.didInvalidate;
}
