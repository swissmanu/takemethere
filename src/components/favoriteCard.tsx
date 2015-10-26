/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/material-ui/material-ui.d.ts" />

import * as React from 'react';
import { ListItem, MenuItem, IconMenu, IconButton, Avatar, FontIcon } from 'material-ui';
import { Favorite } from '../reducers/favorites';
import * as Store from '../store/index';

interface FavoriteCardProps extends React.Props<FavoriteCard> {
    favorite: Store.FavoriteStoreState,
    onClick?: React.FormEventHandler
}

const CARD_STYLE = { 'margin': '16px' };

export default class FavoriteCard extends React.Component<FavoriteCardProps, any> {
    render() {
        let title = this.props.favorite.from.name + ' -> ' + this.props.favorite.to.name + this.props.favorite.isFetching;
        let nextDeparture = this.props.favorite.nextConnections[0].from.departure.toString();
        let icon = <FontIcon className="material-icons">{ this.props.favorite.icon }</FontIcon>;
        let avatar = <Avatar icon={ icon } />;

        let iconButton = <IconButton onClick={ this.props.onClick }>{ icon }</IconButton>;

        return (
            <ListItem
                primaryText={ title }
                secondaryText={ 'Next: ' + nextDeparture }
                leftAvatar={ avatar }
                rightIconButton={ iconButton }
                />
        );
    }
}
