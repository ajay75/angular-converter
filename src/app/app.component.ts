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
	fromAmount: number = 0;
	toAmount: number = 0;
	fromCurrency: string = null;
	toCurrency: string = null;
	rates: Array<any> = [];
	fromRates = {};

	ngOnInit() {
		// Get data from API when App is initialized
		this.getData();
	}

	getData() {
		this.dataService.getRates('').then(response => {
			console.log('Initial rates:', response);

			var items: Array<any> = [];
			
			// In case we got a response from API, we will parse result to get list of rates
			if(response.rates) {
				for (var key in response.rates){
					var obj = {
						id: key,
						value: response.rates[key]
					};
					// Store data to items variable
					items.push(obj);
				}
				// Dirty hack to add base rate to rates list :)
				items.push({id: 'EUR', value: 1});
				// Time to assign data to variable
				this.rates = items;
				// Set initial currencies
				this.fromCurrency = this.rates[29].id;
				this.toCurrency = this.rates[10].id;
				// And not to forget to set initial value as well
				this.fromAmount = 100;
				this.toAmount = 0;
				this.recalculate();
				console.log(this.rates);
			} else {
				// If there is no response, something is went wrong
				this.error = 'Unable to get data data from API';
			}
		}, () => {
			this.error = 'App was unable to request rates from fixer.io API. \n If error presists, hire me to fix it for you :)';
		});
	}

	private recalculate() {
		this.onFromChange();
	}

	private onFromChange() {
		// Making sure that function is working :)
		console.log('On from change');
		this.error = null;
		// Is still everything OK?
		console.log('Selected from: ', this, this.fromCurrency);

		this.dataService.getRates(this.fromCurrency).then(response => {
			// keep an eye on console to make sure that we are actually recieving data
			console.log('OnFromChange response: ', response);

			if (response.rates) {
				this.fromRates = response.rates;
				this.onFromAmountChange();
			} else {
				this.error = 'Unable to get data data from API';
			}
		}, () => {
			this.error = 'Unable to request rates';
		});
	}
	
	private onToChange() {
		// Log to console so we can see what is happening
		console.log("onToChange", this, this.toCurrency);
		this.error = null;
		this.onFromAmountChange();
	}

	private onFromAmountChange() {
		console.log('onFromAmountChange', this, this.fromAmount);
		this.error = null;
		
		// Make sure that amount for conversion is set
		if (this.fromAmount === 0 || !this.fromAmount) {
			this.toAmount = 0;
			this.error = 'We can\'t convert nothing into nothing :D';
			return;
		}
		
		// Make sure that currency is set, although we have set them initially, but you never know :D
		if (!this.toCurrency) {
			this.toAmount = 0;
			this.error = 'Please set currency';
			return;
		}
		
		// what if someone decide to convert USD to USD? :D
		if (this.toCurrency === this.fromCurrency) {
			this.toAmount = this.fromAmount;
			this.error = 'Converting ' + this.toCurrency + ' to ' + this.fromCurrency + ' doesn\'t make much sense, does it?';
			return;
		}
	
		var number = this.fromAmount * this.fromRates[this.toCurrency];
		//$log.debug(number);
		number = Math.round(number * 100);
		//$log.debug(number);
		this.toAmount = number / 100;
		//$log.debug(vm.data.toNumber);
	}

	private onToAmountChange() {
		console.log('onToAmountChange', this, this.toAmount);
		this.error = null;
		
		// Make sure that amount for conversion is set
		if (this.toAmount === 0 || !this.toAmount) {
			this.fromAmount = 0;
			this.error = 'We can\'t convert nothing into nothing :D';
			return;
		}
		
		// Make sure that currency is set, although we have set them initially, but you never know :D
		if (!this.fromCurrency) {
			this.fromAmount = 0;
			this.error = 'Please set currency';
			return;
		}
		
		// what if someone decide to convert USD to USD? :D
		if (this.toCurrency === this.fromCurrency) {
			this.fromAmount = this.toAmount;
			this.error = 'Converting ' + this.toCurrency + ' to ' + this.fromCurrency + ' doesn\'t make much sense, does it?';
			return;
		}
		
		// Let's do the math and make sure that number is rounded to 2 decimal points
		var number = this.toAmount / this.fromRates[this.toCurrency];
		number = Math.round(number * 100);
		this.fromAmount = number / 100;
	}
}
