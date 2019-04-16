import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproachingEndOfSupportComponent } from './approaching-end-of-support.component';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { DropdownModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { ReportsService, StateService } from '../../../services/index';
import { mock, instance, when, verify, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../../rxjs-imports';
import { EndOfSupport } from '../../../models/zabbix/index';

describe('ApproachingEndOfSupportComponent', () => {
  let component: ApproachingEndOfSupportComponent;
  let fixture: ComponentFixture<ApproachingEndOfSupportComponent>;
  let mockReportsService: ReportsService;

  beforeEach(() => {
    mockReportsService = mock(ReportsService);
    when(mockReportsService.getApproachingEndOfSupport()).thenReturn(Observable.from([]));
  });

  describe('rendering', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ApproachingEndOfSupportComponent, AppWidgetLoadingComponent],
        imports: [
          TableModule,
          DropdownModule],
        providers: [{ provide: ReportsService, useValue: instance(mockReportsService) },
          StateService]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      resetCalls(mockReportsService);
      fixture = TestBed.createComponent(ApproachingEndOfSupportComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.model = [];
      component.rows = [];
      component.total = 0;
      component.filterDaysAhead = '';
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    beforeEach(() => {
      resetCalls(mockReportsService);
      component = new ApproachingEndOfSupportComponent(null, instance(mockReportsService));
      component.model = [];
      component.rows = [];
      component.total = 0;
      component.filterDaysAhead = '';
    });

    it('should call the report service on init', () => {
      component.ngOnInit();
      verify(mockReportsService.getApproachingEndOfSupport()).once();
    });

    it('should filter rows', () => {
      component.filterDaysAhead = '2';
      const testModel1 = new EndOfSupport();
      testModel1.daysUntilEoS = 1;
      const testModel2 = new EndOfSupport();
      testModel2.daysUntilEoS = 2;
      const testModel3 = new EndOfSupport();
      testModel3.daysUntilEoS = 3;
      const expectedModel = [testModel1, testModel2];

      component.model = [testModel1, testModel2, testModel3];
      const filteredRows = component.filterRows();

      expect(filteredRows.length).toEqual(expectedModel.length);
      expect(filteredRows).toEqual(expectedModel);
    });

    it('should set filter days ahead', () => {
      const testDays = '5';
      component.setDaysAhead(testDays);
      expect(component.filterDaysAhead).toEqual(testDays);
    });

    it('should set rows', () => {
      const testDays = '2';
      const testModel1 = new EndOfSupport();
      testModel1.daysUntilEoS = 1;
      const testModel2 = new EndOfSupport();
      testModel2.daysUntilEoS = 2;
      const testModel3 = new EndOfSupport();
      testModel3.daysUntilEoS = 3;

      component.model = [testModel1, testModel2, testModel3];
      const expectedRows = [testModel1, testModel2];

      component.setDaysAhead(testDays);

      expect(component.rows.length).toBeGreaterThanOrEqual(2);
      expect(component.rows).toEqual(expectedRows);
    });

    it('should set total', () => {
      const testDays = '2';
      const testModel1 = new EndOfSupport();
      testModel1.daysUntilEoS = 1;
      testModel1.newEquipmentCost = 1;
      const testModel2 = new EndOfSupport();
      testModel2.daysUntilEoS = 2;
      testModel2.newEquipmentCost = 2;
      const testModel3 = new EndOfSupport();
      testModel3.daysUntilEoS = 3;
      testModel3.newEquipmentCost = 3;

      component.model = [testModel1, testModel2, testModel3];
      const expectedTotal = 3; // 1 + 2 (2 testDays)

      component.setDaysAhead(testDays);

      expect(component.total).toEqual(expectedTotal);
    });

    it('should set default days ahead values', () => {
      // values set in constructor
      expect(component.daysAhead.length).toEqual(6);
      expect(component.daysAhead[0]).toEqual({ label: '30 days', value: 30 });
      expect(component.daysAhead[1]).toEqual({ label: '60 days', value: 60 });
      expect(component.daysAhead[2]).toEqual({ label: '90 days', value: 90 });
      expect(component.daysAhead[3]).toEqual({ label: '6 months', value: 183 });
      expect(component.daysAhead[4]).toEqual({ label: '1 year', value: 365 });
      expect(component.daysAhead[5]).toEqual({ label: '18 months', value: 548 });
    });
  });

});
