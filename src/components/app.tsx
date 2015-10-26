/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/material-ui/material-ui.d.ts" />

import './app.scss';

import * as React from 'react';
import { List, ListItem, FontIcon, FlatButton, CircularProgress, Card, AppBar } from 'material-ui';
import FavoriteListItem from './favoriteListItem';
import {
	fetchFavoritesIfNeeded,
	invalidateFavorites,
	flipFavoriteDirection,
	fetchFavoriteIfNeeded
} from '../actions/favorites';
import { connect } from 'react-redux';
import * as Store from '../store/index';

interface AppProps {
	favorites?: Store.FavoritesStoreState,
	dispatch?: Function
}

function select(state: Store.StoreState): AppProps {
	return { favorites: state.favorites };
}

class App extends React.Component<AppProps, any> {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.dispatch(fetchFavoritesIfNeeded());
	}

	render() {
		let listItems;
		const favorites = this.props.favorites;
		const self = this;

		if(!favorites.isFetching) {
			if(favorites.items.length === 0) {
				listItems = this.createNoConnectionMessage();
			} else {
				listItems = favorites.items.map((favorite, index) => {
					const key = index + '-' +
						favorite.from.id + '-' +
						favorite.to.id;

					return (
						<FavoriteListItem
							favorite={ favorite }
							key={ key }
							onClick={ self.onClickFavorite.bind(self, index) }
							/>
					);
				});

				listItems = <List>{ listItems }</List>;
			}
		} else {
			listItems = this.createLoadingIndicator();
		}

		return (
			<div className="app">
				<Card>
					{ this.createAppBar('TakeMeThere') }
					{ listItems }
				</Card>
			</div>
		);
	}



	private createAppBar(title: string) {
		const style = { 'marginBottom': '16px' };
		const refreshConnections = (
			<FlatButton onClick={ this.onClickRefresh.bind(this) }>Refresh</FlatButton>
		);

		return (
			<AppBar
				style={ style }
				title={ title }
				showMenuIconButton={ false }
				iconElementRight={ refreshConnections }
				/>
		);
	}

	private createNoConnectionMessage() {
		const style = { 'marginBottom': '16px', 'textAlign': 'center' };
		return <div style={ style }>No Connections set up. Add on?</div>;
	}

	private createLoadingIndicator() {
		const style = { 'marginBottom': '16px', 'textAlign': 'center' };
		return <div style={ style }><CircularProgress mode="indeterminate" /></div>;
	}

	private onClickRefresh() {
		this.props.dispatch(invalidateFavorites());
		this.props.dispatch(fetchFavoritesIfNeeded());
	}

	private onClickFavorite(index: number) {
		this.props.dispatch(flipFavoriteDirection(index));
		this.props.dispatch(fetchFavoriteIfNeeded(index));
	}
}

export default connect(select)(App);
