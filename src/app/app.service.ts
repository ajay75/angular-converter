import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataService {
	private apiUrl = 'http://api.fixer.io/latest';
	constructor(private http: Http) {}

	getRates(base): Promise<any> {
		// Check if base is set and customize API url accordingly
		if(base){
			var url = this.apiUrl + '?base=' + base;
		} else {
			var url = this.apiUrl;
		}

		// We could expand this even further by adding date picker to select historycal conversion and if statement that will check if date is selected, but for now it will just check for latest rates available
		
		// Get rates from API
		return this.http.get(url)
			.toPromise()
			.then(rsp => rsp.json())
			.catch(this.errorHandler);
	}

	private errorHandler(error: any): Promise<any> {
		// log error to console
		console.error('There was an error', error);
		return Promise.reject(error.message || error);
	}
}
