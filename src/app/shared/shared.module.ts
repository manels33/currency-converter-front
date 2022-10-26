import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeRatesApiService } from './services/exchange-rates-api.service';
import { CurrencyExchangeService } from './services/currency-exchange.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ ExchangeRatesApiService, CurrencyExchangeService]
})

export class SharedModule { }
