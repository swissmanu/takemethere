/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/material-ui/material-ui.d.ts" />

import * as React from 'react';
import { Card, CardHeader, CardText, Avatar, FontIcon } from 'material-ui';
import { Favorite } from '../reducers/favorites';

interface FavoriteCardProps extends React.Props<FavoriteCard> {
    favorite: Favorite
}

const CARD_STYLE = { 'margin': '16px' };

export default class FavoriteCard extends React.Component<FavoriteCardProps, any> {
    render() {
        let title = this.props.favorite.from.name + ' -> ' + this.props.favorite.to.name;
        let nextDeparture = this.props.favorite.nextConnections[0].from.departure.toString();
        let icon = <FontIcon className="material-icons">{ this.props.favorite.icon }</FontIcon>;
        let avatar = <Avatar icon={ icon } />;

        return (
            <Card style={ CARD_STYLE } expandable={ true } initiallyExpanded={ false }>
                <CardHeader
                    avatar={ avatar }
                    title={ title }
                    subtitle={ 'Next: ' + nextDeparture }
                    showExpandableButton={ true }
                    />
            </Card>
        );
    }
}
