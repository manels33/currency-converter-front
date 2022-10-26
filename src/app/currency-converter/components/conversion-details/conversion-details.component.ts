import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExchangeRatesApiService } from 'src/app/shared/services/exchange-rates-api.service';

import { MappedCurrencyRate } from 'src/app/shared/interfaces/currency-rate';

@Component({
  selector: 'app-conversion-details',
  templateUrl: './conversion-details.component.html',
  styleUrls: ['./conversion-details.component.scss']
})
export class ConversionDetailsComponent implements OnChanges {
  @Input()
  amount!: number;
  @Input()
  result!: number;

  @Input()
  fromCurrencyRate!: MappedCurrencyRate;
  @Input()
  toCurrencyRate!: MappedCurrencyRate;

  @Output() sendNewRateFrom = new EventEmitter();
  @Output() sendNewRateTo = new EventEmitter();

  fromCurrency!: string;
  toCurrency!: string;

  toRate!: number;
  fromRate!: number;
  rateNewFrom!: number;
  rateNewTo!: number;
  fixRFrom!: number;
  fixRTo!: number;
  newHistory!: {};
  dataSource = new MatTableDataSource();
  displayedColumns = ['rateReal', 'valInit', 'valCalc'];
  array_last_five!: [];

  constructor( private exchangeRatesApiService: ExchangeRatesApiService) { }

  getLastFiveHist(tabHist:any){
    tabHist.length > 5 ? this.array_last_five = tabHist.slice(-5) : this.array_last_five = tabHist;
    return this.array_last_five;
  }

  getHistoryTab(newHistory: {}){
    this.exchangeRatesApiService
    .showHistoryConversion(newHistory)
    .subscribe(
      (newH:any) => {
        if(newH) {
          return this.dataSource.data = newH;
        }
      })
      this.dataSource.data = this.getLastFiveHist(this.dataSource.data)

      return this.dataSource.data;
  }

  ngOnChanges(changes: SimpleChanges): void {
    let newHistory;
    this.fromCurrency = this.fromCurrencyRate && this.fromCurrencyRate.currency;
    this.fromRate = this.fromCurrencyRate && this.fromCurrencyRate.rate;

    this.toCurrency = this.toCurrencyRate && this.toCurrencyRate.currency;
    this.toRate = this.toCurrencyRate && this.toCurrencyRate.rate;

    this.rateNewFrom = parseFloat((+this.toRate / +this.fromRate).toFixed(5));
    this.fixRFrom = this.rateNewFrom;

    this.rateNewTo = parseFloat((+this.fromRate / +this.toRate).toFixed(5));
    this.fixRTo = this.rateNewTo;

    this.newHistory = {
      "rateInit": parseFloat((+this.toRate / +this.fromRate).toFixed(5)),
      "fromCurrencyRate": this.fromCurrencyRate,
      "toCurrencyRate": this.toCurrencyRate,
      "amount": this.amount,
      "result": this.result
    };
    this.getHistoryTab(this.newHistory);
  }

  onFixRateFrom(newRate: string):void{
    if((Number(newRate) - this.fixRFrom) <= 2 ) {
      this.rateNewFrom = Number(newRate);
    } else {
      this.rateNewFrom = this.fixRFrom;
    };
    this.sendNewRateFrom.emit(this.rateNewFrom);
  }

  onFixRateTo(newRate: string):void{
    if((Number(newRate) - this.fixRTo) <= 2 ) {
      this.rateNewTo = Number(newRate);
    } else {
      this.rateNewTo = this.fixRTo;
    };
    this.sendNewRateTo.emit(this.rateNewTo);
  }
}
