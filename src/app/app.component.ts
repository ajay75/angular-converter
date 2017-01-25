import { Component } from '@angular/core';
import { DataService } from './app.service';
import { OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'app-bulb-converter',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ DataService ],
})

export class AppComponent implements OnInit {
    title: string = 'Angular 2 Currency Converter';
    error: any = null;
    fromAmount: number = 10;
    toAmount: number = 0;
    fromCurrency: string = null;
    toCurrency: string = null;
    rates: Array<any> = [];
    fromRates: Object = {};
    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.convert(false, true);
    }

    public convert(reverse, initial) {
        this.dataService.getRates(this.fromCurrency).then(response => {

            if (response.rates) {
                if (initial) {
                    const items: Array<any> = this.parseData(response.rates);
                    items.push({id: 'EUR', value: 1});
                    this.rates = items;
                    this.fromCurrency = this.rates[29].id;
                    this.toCurrency = this.rates[10].id;
                    this.convert(false, false);
                }

                this.fromRates = response.rates;

                this.calculate(reverse);

            } else {
                this.error = 'Unable to get data from API';
            }
        }, (error) => {
            this.error = 'There was an error: ' + error.status + ' - ' + error.statusText;
        });
    }

    public calculate(reverse) {
        this.handleErrors();

        if (!this.error) {
            if (reverse) {
                this.fromAmount = Math.round( this.toAmount / this.fromRates[this.toCurrency] * 100) / 100;
            } else {
                this.toAmount = Math.round(this.fromAmount * this.fromRates[this.toCurrency] * 100) / 100;
            }
        }
    }

    private parseData(data) {
        const arr: Array<any> = [];

        for (const key in data) {
            if (key) {
                const obj = {
                    id: key,
                    value: data[key]
                };
                arr.push(obj);
            }
        }

        return arr;
    }

    private handleErrors() {
        this.error = null;

        if (!this.fromAmount && !this.toAmount) {
            this.error = 'Please enter the amount';
            return;
        }

        if (!this.fromCurrency) {
            this.error = 'Please set currency';
            return;
        }

        if (this.toCurrency === this.fromCurrency) {
            this.fromAmount = this.toAmount;
            this.error = 'Converting ' + this.toCurrency + ' to ' + this.fromCurrency + ' doesn\'t make much sense, does it?';
            return;
        }
    }
}
