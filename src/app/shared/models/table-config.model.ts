export interface TableConfig {
  title?: string,
  columns: Column[],
  rows: any[],
  isClickable?: boolean,
  maxHeight?: string,
  isScrollable?: boolean,
  hasNumeration?: boolean,
  hasFooter?: boolean,
  totalAmountWon?: any,
  shouldExportData?: boolean,
  pagination?: PagingConfig,
  totalRecordsCount?: number
}

export interface Column {
  columnHeader: string,
  dataKey: string,
  tooltip?: boolean,
  isCurrency?: boolean,
  shouldBeMasked?: boolean,
  sort?: SortConfig,
  hasSum?: boolean,
  isCellClickable?: boolean,
  cellAction?: ('download' | ''),
  dependsOn?: {
    dataKey: string,
    value: any,
    alternativeDataKey: string
  },
  colorLabels?: {
    dataValue: string,
    color: string
  }[]
}

export interface SortConfig {
  orderBy: string,
  order: ('asc' | 'desc' | "")
}

export interface PagingConfig {
  perPage: (50 | 100 | 250 | 500 | 1000),
  currentPage: number,
  pagesCount: number
}
