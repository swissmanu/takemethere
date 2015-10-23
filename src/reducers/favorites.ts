import * as TransportAPI from '../transportApi';
import * as Store from '../store';
import {
	INVALIDATE_FAVORITES,
	FETCH_FAVORITES_REQUEST,
	FETCH_FAVORITES_SUCCESS,
	FETCH_FAVORITES_FAILED
} from '../actions/favorites';

const plainExtend = require('amp-extend');
const extend = <T>(...targets: T[]) => plainExtend.apply(this, [{}].concat(targets));

export interface Favorite {
    icon: string,
    from: TransportAPI.Station,
    to: TransportAPI.Station,
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
				items: action.favorites,
				lastUpdated: action.recivedAt
			});
		case FETCH_FAVORITES_FAILED:
			return extend<Store.FavoritesStoreState>({}, prevState, {
				isFetching: false
			});
		default:
			return prevState;
	}
}