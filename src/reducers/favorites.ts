import * as TransportAPI from '../transportApi';
import * as Store from '../store/index';
import {
	INVALIDATE_FAVORITES,
	FETCH_FAVORITES_REQUEST,
	FETCH_FAVORITES_SUCCESS,
	FETCH_FAVORITES_FAILED,
	FLIP_FAVORITE_DIRECTION,
	FETCH_FAVORITE_REQUEST,
	FETCH_FAVORITE_SUCCESS,
	FETCH_FAVORITE_FAILED
} from '../actions/favorites';

const plainExtend = require('amp-extend');
const extend = <T>(...targets: T[]) => plainExtend.apply(this, [{}].concat(targets));

export interface Favorite {
    icon?: string,
    from?: TransportAPI.Station,
    to?: TransportAPI.Station,
    nextConnections?: TransportAPI.Connection[]
};

export default function favorites(prevState: Store.FavoritesStoreState = {
	isFetching: false,
	didInvalidate: false,
	items: []
}, action): Store.FavoritesStoreState {
	switch(action.type) {
		case INVALIDATE_FAVORITES:
			return extend<Store.FavoritesStoreState>(prevState, {
				didInvalidate: true
			});
		case FETCH_FAVORITES_REQUEST:
			return extend<Store.FavoritesStoreState>({}, prevState, {
				isFetching: true,
				didInvalidate: false
			});
		case FETCH_FAVORITES_SUCCESS:
			return extend<Store.FavoritesStoreState>({}, prevState, {
				isFetching: false,
				didInvalidate: false,
				lastUpdated: action.recivedAt,
				items: action.favorites.map((favorite) => {
					return extend<Store.FavoriteStoreState>(favorite, {
						isFetching: false,
						didInvalidate: false,
						lastUpdated: action.recivedAt
					});
				}),

			});
		case FETCH_FAVORITES_FAILED:
			return extend<Store.FavoritesStoreState>(prevState, {
				isFetching: false
			});


		case FETCH_FAVORITE_REQUEST:
			return extend<Store.FavoritesStoreState>(prevState, {
				items: [
					...prevState.items.slice(0, action.index),
					extend<Store.FavoriteStoreState>(prevState.items[action.index], {
						isFetching: true,
						didInvalidate: false
					}),
					...prevState.items.slice(action.index + 1)
				]
			});
		case FETCH_FAVORITE_SUCCESS:
			return extend<Store.FavoritesStoreState>(prevState, {
				items: [
					...prevState.items.slice(0, action.index),
					extend<Store.FavoriteStoreState>(
						action.favorite,
						{
							isFetching: false,
							didInvalidate: false,
							lastUpdated: action.recivedAt
						}
					),
					...prevState.items.slice(action.index + 1)
				]
			});
		case FETCH_FAVORITE_FAILED:
			return extend<Store.FavoritesStoreState>(prevState, {
				items: [
					...prevState.items.slice(0, action.index),
					extend<Store.FavoriteStoreState>(prevState.items[action.index], {
						isFetching: false
					}),
					...prevState.items.slice(action.index + 1)
				]
			});

		case FLIP_FAVORITE_DIRECTION:
			return extend<Store.FavoritesStoreState>(prevState, {
				items: [
					...prevState.items.slice(0, action.index),
					extend<Store.FavoriteStoreState>(prevState.items[action.index], {
						from: prevState.items[action.index].to,
						to: prevState.items[action.index].from,
						didInvalidate: true
					}),
					...prevState.items.slice(action.index + 1)
				]
			});
		default:
			return prevState;
	}
}
