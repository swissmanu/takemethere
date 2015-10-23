/// <reference path="../typings/q/Q.d.ts" />
/// <reference path="../typings/superagent/Superagent.d.ts" />

import * as Q from 'q';
import * as Superagent from 'superagent';
import * as http from 'http';

const BASE_URL: string = 'http://transport.opendata.ch/v1';

/**
 * Searches for Stations with given query information.
 *
 * @param  {string}               query       A query string to search stations for
 * @param  {Coordinates}          coordinates Optional
 * @param  {Array<LocationType>}  types       Optional
 * @return {Q.Promise<Station[]>}
 */
export function locations(query: string, coordinates?: Coordinates, types?: Array<LocationType>): Q.Promise<Station[]> {
	let deferred: Q.Deferred<Station[]> = Q.defer<Station[]>();

	Superagent
		.get(BASE_URL + '/locations')
		.query({ query: query })
		.end((err: any, res: Superagent.Response) => {
			if(err) {
				deferred.reject(err);
			} else {
				let stations: Station[] = res.body.stations;
				deferred.resolve(stations);
			}
		});

	return deferred.promise;
}

/**
 * Fetches Connections from the OpenTransport API.
 *
 * @param  {Station}                 from [description]
 * @param  {Station}                 to   [description]
 * @param  {Station[]}               via  [description]
 * @param  {Date}                    date [description]
 * @param  {Date}                    time [description]
 * @return {Q.Promise<Connection[]>}      [description]
 */
export function connections(from: Station, to: Station, via?: Station[], date?: Date, time?: Date): Q.Promise<Connection[]> {
	let deferred: Q.Deferred<Connection[]> = Q.defer<Connection[]>();

	Superagent
		.get(BASE_URL + '/connections')
		.query({ from: from.id })
		.query({ to: to.id })
		.end((err: any, res: Superagent.Response) => {
			if(err) {
				deferred.reject(err);
			} else {
				let connections: Connection[] = res.body.connections;
				deferred.resolve(connections);
			}
		});

	return deferred.promise;
}



export enum LocationType {
	station, poi, address, refine
}

export interface Coordinates {
	type: string,
	x: number,
	y: number
}

export interface Station {
	id: string,
	type?: LocationType,
	name?: string,
	score?: number,
	coordinates?: Coordinates,
	distance?: number
}

export interface Service {
	regular: string,
	irregular: string
}

export interface Prognosis {
	platform: string,
	departure: Date,
	arrival: Date,
	capacity1st: number,
	capacity2st: number
}

export interface Journey {
	name: string,
	category: string,
	categoryCode: string,
	number: string,
	operator: string,
	to: string,
	passList: Checkpoint[],
	capacity1st: number,
	capacity2st: number
}

export interface Section {
	jorney: Journey,
	walk: string,
	departure: Checkpoint,
	arrival: Checkpoint
}

export interface Checkpoint {
	station: Station,
	arrival: Date,
	departure: Date,
	platform: string,
	prognosis: Prognosis
}

export interface Connection {
	from: Checkpoint,
	to: Checkpoint,
	duration: string,
	service: Service
}
