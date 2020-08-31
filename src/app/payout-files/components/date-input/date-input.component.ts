import { Component, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';

interface DateSelection {
  year?: number;
  month?: number;
  day?: number;
}

const INITIAL_STATE: DateSelection = {
  year: + new Date().getFullYear(),
  month: + new Date().getMonth()
}

@Component({
  selector: 'date-input-cmp',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss']
})
export class DateInputComponent implements OnInit {
  @Output() dateInputed = new Subject<DateSelection>();
  years: number[];
  months: string[];
  days: number[];

  currentSelect: DateSelection;

  constructor() {
    this.currentSelect = { ...INITIAL_STATE };
  }

  ngOnInit() {
    this.initYears();
    this.initMonths();
    this.initDays();
    this.outputSelection();
  }

  initYears = () => {
    const sequence = Array.from(Array(+new Date().getFullYear() - 2017).keys());
    this.years = sequence.map(num => +new Date().getFullYear() - num);
  }

  initMonths = () => {
    this.months = moment.months();
  }

  initDays = () => {
    let sequence = Array.from(Array(31).keys());
    sequence = sequence.map(num => (num + 1));

    if (this.currentSelect.month === 1 && this.currentSelect.year % 4 === 0) {
      this.days = sequence.slice(0, 29);
    } else if (this.currentSelect.month === 1 && this.currentSelect.year % 4 !== 0) {
      this.days = sequence.slice(0, 28);
    } else if ([0, 2, 4, 6, 7, 9, 11].includes(this.currentSelect.month)) {
      this.days = sequence.slice();
    } else {
      this.days = sequence.slice(0, 30);
    }

  }

  getMonthName = () => {
    return moment.months()[this.currentSelect.month] || 'any';
  }

  onYearSelect = (year) => {
    if (year !== 'any') {
      this.currentSelect.year = year;
      this.initDays();
    } else {
      delete this.currentSelect.year;
      delete this.currentSelect.month;
      delete this.currentSelect.day;
    }
  }

  onMonthSelect = (monthIndex) => {
    if (monthIndex !== 'any') {
      this.currentSelect.month = monthIndex;
      this.initDays();
      delete this.currentSelect.day;
    } else {
      delete this.currentSelect.month;
      delete this.currentSelect.day;
    }
  }

  onDaySelect = (day) => {
    if (day !== 'any') {
      this.currentSelect.day = day;
    } else {
      delete this.currentSelect.day;
    }
  }

  onSubmit = (event) => {
    this.unFocusButton(event);
    this.outputSelection();
  }
  
  outputSelection = () => {
    const dateSelection = { ...this.currentSelect };
    if (dateSelection.month || dateSelection.month === 0) {
      dateSelection.month = dateSelection.month + 1;
    }
    this.dateInputed.next(dateSelection);
  }

  /**
   * @desc This method unfocus button
   * @memberof SearchInputComponent
   */
  unFocusButton = (event): void => {
    event.srcElement.blur();
  }
}
