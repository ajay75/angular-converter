import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {
    private apiUrl = 'http://api.fixer.io/latest';
    constructor(private http: Http) {}

    getRates(base): Promise<any> {
        let url: string;

        // Check if base is set and customize API url accordingly
        if (base) {
            url = this.apiUrl + '?base=' + base;
        } else {
            url = this.apiUrl;
        }

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
