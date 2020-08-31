import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { Column } from '../../models/table-config.model';
import { EuroCurrencyPipe } from '../../../pipes/euro-currency/euro-currency.pipe';
import { MaskBankAccountPipe } from '../../../pipes/mask-bank-account/mask-bank-account.pipe';
import { ThousandSeparatorPipe } from '../../../pipes/thousand-separator/thousand-separator.pipe';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableComponent, EuroCurrencyPipe, MaskBankAccountPipe, ThousandSeparatorPipe],
      providers: [CurrencyPipe, DecimalPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.tableConfig = {
      title: '',
      columns: [
        {
          columnHeader: 'col-1',
          dataKey: 'key',
          sort: {
            orderBy: 'key',
            order: 'asc'
          }
        },
        {
          columnHeader: 'col-2',
          dataKey: 'key-2'
        }
      ],
      rows: [
        {
          key: 'data-in-col-1',
        },
      ],
      isClickable: false,
      isScrollable: false,
      maxHeight: '',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test onColumnHeaderClicked()', () => {
    it('Should output column sort config object if col header has sort config property', () => {
      const streamSpy = jest.spyOn(component.columnHeaderClicked, 'next');
      const clickedColumn = component.tableConfig.columns[0];

      component.onColumnHeaderClicked(clickedColumn);

      expect(streamSpy).toBeCalledTimes(1);
      expect(streamSpy).toBeCalledWith(clickedColumn.sort);
    });

    it('Should not output column sort config object if col header not configured as clickable', () => {
      const streamSpy = jest.spyOn(component.columnHeaderClicked, 'next');
      const clickedColumn = component.tableConfig.columns[1];

      component.onColumnHeaderClicked(clickedColumn);

      expect(streamSpy).not.toHaveBeenCalled();
    });
  });

  describe('Test onRowClicked()', () => {
    it('Should output row data object if table configured as clickable', () => {
      const streamSpy = jest.spyOn(component.rowClicked, 'next');
      const clickedRowIndex = 0;
      const clickedRowData = component.tableConfig.rows[clickedRowIndex];
      component.tableConfig.isClickable = true;

      fixture.detectChanges();

      component.onRowClicked(clickedRowData);

      expect(streamSpy).toBeCalledTimes(1);
      expect(streamSpy).toBeCalledWith(clickedRowData);
    });

    it('Should not output row data if table not configured as clickable', () => {
      const streamSpy = jest.spyOn(component.rowClicked, 'next');
      const rowIndex = 1;
      component.tableConfig.isClickable = false;
      fixture.detectChanges();

      component.onRowClicked(rowIndex);

      expect(streamSpy).not.toHaveBeenCalled();
    });
  });

  describe('Test getData()', () => {
    let col: Column = {
      columnHeader: 'test',
      dataKey: 'test-key',
    };

    let row = {
      testDataKey: 'testValue',
      dependibleColumnDataKey: 'testDependibleColumnDataKey',
      dataKeyThatDependsOn: 'testDataKeyThatDependsOn',
      alternativeDataKey: 'testAlternativeDataKey',
    };

    it('Should return "/" if dataKey doesn\'t exists in row object', () => {
      const dataValue = component.getData(row, col);
      expect(dataValue).toEqual('/');
    });

    it('Should return dataValue if dataKey exists in row object', () => {
      col.dataKey = 'testDataKey';

      const dataValue = component.getData(row, col);

      expect(dataValue).toEqual(row.testDataKey);
    });

    it('Should return value of alternativeDataKey if column depends on other column value \
    and dependible data value is equal to value that column depends on', () => {
      const dependibleColumn: Column = {
        columnHeader: 'dependible-column',
        dataKey: 'dependibleColumnDataKey',
        dependsOn: {
          dataKey: 'dataKeyThatDependsOn',
          value: 'testDataKeyThatDependsOn',
          alternativeDataKey: 'alternativeDataKey',
        },
      };
      const dataValue = component.getData(row, dependibleColumn);
      expect(dataValue).toEqual(row.alternativeDataKey);
    });

    it('Should return value of primary dataKey if column depends on other column value \
    and dependible data value is NOT equal to value that column depends on', () => {
      const dependibleColumn: Column = {
        columnHeader: 'dependible-column',
        dataKey: 'dependibleColumnDataKey',
        dependsOn: {
          dataKey: 'dataKeyThatDependsOn',
          value: 'not-testDataKeyThatDependsOn',
          alternativeDataKey: 'alternativeDataKey',
        },
      };
      const dataValue = component.getData(row, dependibleColumn);
      expect(dataValue).toEqual(row[dependibleColumn.dataKey]);
    });
  });
});
