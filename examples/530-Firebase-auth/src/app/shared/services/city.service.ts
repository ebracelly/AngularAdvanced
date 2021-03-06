import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {City} from '../model/city.model';

@Injectable()
export class CityService {

	private basePath: string                       = '/cities';
			cities: FirebaseListObservable<City[]> = null;
			city: FirebaseObjectObservable<City>   = null;

	constructor(private af: AngularFireDatabase) {
	}

	// 1. Get all cities. Use an optional query-parameter
	getCities(query = {}): FirebaseListObservable<City[]> {
		this.cities = this.af.list(this.basePath, {
			query: query
		});
		return this.cities;
	}

	// 2. Get specific city
	getCity(key: string): FirebaseObjectObservable<City> {
		const itemPath = `${this.basePath}/${key}`;
		this.city      = this.af.object(itemPath);
		return this.city;
	}

	// 3. Add a city
	addCity(city: City): void {
		// if no list of cities exists (i.e, if this route was directly called)
		// fetch cities first.
		if(!this.cities){
			this.getCities();
		}
		this.cities.push(city)
			.catch(error => this.handleError(error));
	}

	// 4. Update a city
	updateCity(value: any): void {
		// b/c this.city is wired to the *observable* pointing to the city in the
		// database, the value is instantly updated. Note: if you want your app to have
		// an offline mode, built some kind of cache, or use a  Store and only update on demand.
		this.city.update(value)
			.catch(error => this.handleError(error));
	}

	// 5. Remove a city
	removeCity(key: string): void {
		this.cities.remove(key);
	}

	// 6. Remove all cities
	removeAll(): void {
		this.cities.remove()
			.catch(error => this.handleError(error))
	}

	//**********************
	// Helper functions
	//***********************

	// Default for handling errors
	private handleError(err) {
		console.log('Error! ==>', err);
	}

	// Create random ID for newly added cities.
	// Note: this should not be necessary, as Firebase generates a unique $key
	// for every new city. It is here to be backward compatible with previous
	// examples.
	getRandomId(): number {
		return Math.floor((Math.random() * 10000) + 1);
	}
}