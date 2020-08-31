import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { TableConfig, Column, SortConfig, PagingConfig } from '../../models/table-config.model';

const INITIAL_SORT_CONFIG: SortConfig = {
  orderBy: '',
  order: 'asc',
};

@Component({
  selector: 'table-cmp',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() tableConfig: TableConfig;
  @Output() exportData = new Subject<string>();
  @Output() rowClicked = new Subject<any>();
  @Output() cellActionTriggered = new Subject<any>();
  @Output() columnHeaderClicked = new Subject<SortConfig>();
  @Output() pagingChanged = new Subject<PagingConfig>();

  currentSort: SortConfig;

  constructor() {
    this.currentSort = INITIAL_SORT_CONFIG;
  }

  onSelectRowsCountPerPage = (rowsCount: (50 | 100 | 250 | 500 | 1000)): void => {
    this.tableConfig.pagination.perPage = rowsCount;
    this.tableConfig.pagination.currentPage = 1;
    this.pagingChanged.next(this.tableConfig.pagination);
  }

  toPreviousPage = () => {
    if (this.tableConfig.pagination.currentPage > 1) {
      this.tableConfig.pagination.currentPage = this.tableConfig.pagination.currentPage - 1;
      this.pagingChanged.next(this.tableConfig.pagination);
    }
  }

  toNextPage = () => {
    if (this.tableConfig.pagination.currentPage < this.tableConfig.pagination.pagesCount) {
      this.tableConfig.pagination.currentPage = this.tableConfig.pagination.currentPage + 1;
      this.pagingChanged.next(this.tableConfig.pagination);
    }
  }

  getRowNumber = (rowIndex: number): number => {
    if (!this.tableConfig.pagination) {
      return rowIndex + 1;
    } else {
      return rowIndex + 1 + (this.tableConfig.pagination.currentPage - 1) * this.tableConfig.pagination.perPage;
    }
  }

  shouldDisplayPagination = () => {
    if (this.tableConfig.pagination) {
      return (
        this.tableConfig.pagination.pagesCount === 1 &&
        this.tableConfig.pagination.perPage === 50 &&
        this.tableConfig.rows.length < this.tableConfig.pagination.perPage
      ) ? false : true;
    } else {
      return false;
    }
  }

  /**
   * @desc Emits sort when user clicks on header in table if header is configured to be clickable
   * @param {Column} col Column config object
   * @memberof TableComponent
   */
  onColumnHeaderClicked = (col: Column) => {
    if (col.sort) {
      this.setCurrentSort(col);
      this.columnHeaderClicked.next({ ...this.currentSort });
    }
  };

  /**
   * @desc Sets currentSort property to clicked column sort config with toggling order functionality
   * @param {Column} col Column config object
   * @memberof TableComponent
   */
  setCurrentSort = (col: Column) => {
    if (this.currentSort.orderBy !== col.sort.orderBy) {
      this.currentSort = { ...col.sort };
    } else {
      this.currentSort.order = this.currentSort.order === 'asc' ? 'desc' : 'asc';
    }
  };

  /**
   * @desc Emits event when user clicks on row in table if table is configured to be clickable
   * and outputs clicked row data in stream
   * @param {number} index Row data object
   * @memberof TableComponent
   */
  onRowClicked = (rowData: any) => {
    if (this.tableConfig.isClickable) {
      this.rowClicked.next({ ...rowData });
    }
  };

  onCellClicked = (column: Column, rowData: any) => {
    if (column.isCellClickable) {
      this.cellActionTriggered.next({ ...rowData });
    }
  };

  /**
   * @desc Outputs table title in event stream when export data from table is requested (export button is clicked)
   */
  onExportData = (): void => {
    if (this.shouldExportData()) {
      this.exportData.next(this.tableConfig.title);
    }
  }

  getActionClass = (col: Column) => {
    return col.cellAction ? `cell-${col.cellAction}-action` : '';
  }

  /**
   * @desc Gets the data to display in table cell including
   * case when one column value depends on another column value.
   * @param {any} row Data object that represents data in table row
   * @param {Column} col Data object that contains table column configuration
   * @returns {string} Data string to be displayed in appropriate cell
   * @memberof TableComponent
   */
  getData = (row: any, col: Column): string => {
    let dataValue = row[col.dataKey];

    // If data have nested structure
    if (typeof dataValue === 'object' && dataValue !== null) {
      dataValue = row[col.dataKey].value;
    }
    if (col.dependsOn) {
      if (this.isDependencyConditionFulfilled(row, col)) {
        dataValue = row[col.dependsOn.alternativeDataKey];
      }
    }
    if (!dataValue && col.isCellClickable) {
      return '';
    }
    return dataValue ? dataValue : '/';
  };

  /**
   * @desc Gets the data to display in tooltip when user hovers table cell (for registred tooltip data keys)
   * @param {any} row Data object that represents data in table row
   * @param {Column} col Data object that contains table column configuration
   * @returns {string} Data string to be displayed in tooltip
   * @memberof TableComponent
   */
  getTooltip = (row: any, col: Column): string => {
    const tooltipValue = this.getData(row, col);
    return tooltipValue !== '/' ? tooltipValue : '';
  };

  /**
   * @desc Check whether the value in the dependent column corresponds to the presumed dependent value
   * @param {any} row Data object that represents data in table row
   * @param {Column} col Data object that contains table column configuration
   * @returns {boolean} Is dependency condition satisfied
   * @memberof TableComponent
   */
  isDependencyConditionFulfilled = (row: any, col: Column) => {
    return row[col.dependsOn.dataKey] === col.dependsOn.value;
  };

  /**
   * @desc Checks if export data from table is allowed
   * @returns {boolean} Returns true if table has rows and table is configured
   * to has export data functionality
   * @memberof TableComponent 
   */
  shouldExportData = (): boolean => {
    return this.tableConfig.rows && this.tableConfig.shouldExportData;
  }

  calculateSum = (col: Column): number => {
    let sum = this.tableConfig.rows.reduce((accumulator, nextRow) => {
      return accumulator + nextRow[col.dataKey];
    }, 0);
    return sum;
  }

  getColorLabelClass = (row: any, col: Column)=> {
    const color = col.colorLabels.find((colorSetting)=> {
      return colorSetting.dataValue === this.getData(row, col);
    }).color;

    return color ? `color-label color-label--${color}`: 'color-label';
  }
}
