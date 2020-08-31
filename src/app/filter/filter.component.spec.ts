import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component';
import { FilterModule } from './filter.module';
import { describe } from 'selenium-webdriver/testing';
import { filterMockData } from '../shared/mocks/filter-data-response';
import { FetchFilterDataService } from './fetch-filter-data.service';
import { of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const fetchFilterServiceMock = {
  fetchFilterData$: jest.fn().mockReturnValue(of(filterMockData)),
};

const httpClientMock = {
  get: jest.fn(),
};

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent],
      providers: [
        {
          provide: FetchFilterDataService,
          useValue: fetchFilterServiceMock,
        },
        {
          provide: HttpClient,
          useValue: httpClientMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test handleFilterResponse()', () => {
    const spy = spyOn(component, 'configureFilterResultsTable');

    component.handleFilterResponse(filterMockData);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(filterMockData);
    expect(component.loading).toEqual(false);
  });

  it('should test configureFilterResultsTable()', () => {
    component.configureFilterResultsTable(filterMockData);
    expect(component.filterResultsTableConfig).toEqual({
      title: 'Filter overview',
      columns: [
        { columnHeader: 'Mailaddress', dataKey: 'key', tooltip: true, sort: { orderBy: 'email', order: 'asc' } },
        {
          columnHeader: 'Total won episodes',
          dataKey: 'doc_count',
          sort: { orderBy: 'totalWonEpisodes', order: 'asc' },
        },
        {
          columnHeader: 'Total prizemoney',
          dataKey: 'wonInTotal',
          isCurrency: true,
          sort: { orderBy: 'totalPrizemoney', order: 'asc' },
        },
      ],
      rows: filterMockData.body,
      totalRecordsCount: 123,
      isScrollable: true,
      maxHeight: 'calc(100vh - 405px)',
      hasNumeration: true,
      shouldExportData: true
    });
  });

  describe('ngOnDestroy()', () => {

    test('should do nothing if subscription does not exist', () => {
      component.ngOnDestroy();
      expect(component.loadDataSubscription).toBeUndefined();
    });

    test('should close subscription if exists', () => {
      component.loadDataSubscription = new Subscription();
      const spy = jest.spyOn(component.loadDataSubscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(spy).toBeCalledTimes(1);
      expect(component.loadDataSubscription.closed).toBe(true);
    });
  });
});
