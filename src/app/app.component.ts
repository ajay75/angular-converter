import { Component } from '@angular/core';
import { DataService } from './app.service';
import 'rxjs/add/operator/toPromise';
@Component({
    selector: 'converter',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ DataService ],
})

export class AppComponent {
    constructor(private dataService: DataService) {}
    title: string = 'Angular 2 Currency Converter made by future Bulb employee';
    error: any = null;
    fromAmount: number = 10;
    toAmount: number = 0;
    fromCurrency: string = null;
    toCurrency: string = null;
    rates: Array<any> = [];
    fromRates = {};

    ngOnInit() {
        this.convert(false, true);
    }

    private convert(reverse, initial) {
        this.error = null;

        this.dataService.getRates(this.fromCurrency).then(response => {

            if (response.rates) {

                if(initial) {
                    let items: Array<any> = [];

                    for (let key in response.rates){
                        if (key) {
                            let obj = {
                                id: key,
                                value: response.rates[key]
                            };
                            items.push(obj);
                        }
                    }

                    items.push({id: 'EUR', value: 1});
                    this.rates = items;
    				this.fromCurrency = this.rates[29].id;
    				this.toCurrency = this.rates[10].id;
                    this.convert(false, false);
                }

                this.fromRates = response.rates;

                if (this.fromAmount === 0 || !this.fromAmount ) {
                    this.error = 'We can\'t convert nothing into nothing :D';
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

                if (reverse) {
                    this.fromAmount = Math.round( this.toAmount / this.fromRates[this.toCurrency] * 100) / 100;
                } else {
                    this.toAmount = Math.round(this.fromAmount * this.fromRates[this.toCurrency] * 100) / 100;
                }

            } else {
                this.error = 'Unable to get data from API';
            }
        }, (error)=> {
            this.error = 'Došlo je do greške: ' + error.status + ' - ' + error.statusText;
        });
    }
}
