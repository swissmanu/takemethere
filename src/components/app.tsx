/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/material-ui/material-ui.d.ts" />

import './app.scss';

import * as React from 'react';
import { FontIcon, FlatButton, CircularProgress, Card, AppBar } from 'material-ui';
import FavoriteCard from './favoriteCard';
import { fetchFavoritesIfNeeded, invalidateFavorites } from '../actions/favorites';
import { connect } from 'react-redux';
import * as Store from '../store';

interface AppProps {
	favorites?: Store.FavoritesStoreState
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
		let cards;
		const favorites = this.props.favorites;

		if(!favorites.isFetching) {
			if(favorites.items.length === 0) {
				cards = this.createNoConnectionMessage();
			} else {
				cards = favorites.items.map((favorite, index) => {
					const key = index + '-' +
						favorite.from.id + '-' +
						favorite.to.id;

					return (
						<FavoriteCard
							favorite={ favorite }
							key={ key }
							/>
					);
				});
			}
		} else {
			cards = this.createLoadingIndicator();
		}

		return (
			<div className="app">
				<Card>
					{ this.createAppBar('TakeMeThere') }
					{ cards }
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
}

export default connect(select)(App);
