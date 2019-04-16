import { SupportCasesComponent } from './support-cases.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { when, resetCalls, mock, instance, verify, anyString, anything, anyNumber } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import { GlobalModule } from '../../global.module';
import { ModalModule } from 'ngx-bootstrap/modal/modal.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SupportCasesService, StateService } from '../../services';
import { ToasterService } from 'angular2-toaster';
import { SupportCase } from '../../../../models';
import { SupportCaseViewModel } from '../../view-models/index';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

const testSupportCase1 = new SupportCase();
const testSupportCase2 = new SupportCase();

describe('Support Cases Component', () => {
  let component: SupportCasesComponent;
  let fixture: ComponentFixture<SupportCasesComponent>;
  let mockSupportCasesService: SupportCasesService;
  let mockToasterService: ToasterService;

  beforeEach(async(() => {
    mockSupportCasesService = mock(SupportCasesService);
    mockToasterService = mock(ToasterService);

    when(mockSupportCasesService.get()).thenReturn(Observable.of([testSupportCase1, testSupportCase2]));
    when(mockSupportCasesService.getPicklistValues(anyString())).thenReturn(Observable.from([]));
    when(mockSupportCasesService.create(anything())).thenReturn(Observable.from([]));
    when(mockSupportCasesService.createComment(anything())).thenReturn(Observable.from([]));
    when(mockSupportCasesService.getDetails(anyNumber())).thenReturn(Observable.from([]));
    when(mockSupportCasesService.getComments(anyString(), anything(), anything())).thenReturn(Observable.from([]));
    when(mockToasterService.pop(anyString(), anyString(), anyString())).thenReturn();
    TestBed.configureTestingModule({
      declarations: [SupportCasesComponent],
      imports: [GlobalModule, NoopAnimationsModule],
      providers: [
        StateService,
        { provide: SupportCasesService, useValue: instance(mockSupportCasesService) },
        { provide: ToasterService, useValue: instance(mockToasterService) }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    resetCalls(mockSupportCasesService);
    fixture = TestBed.createComponent(SupportCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Support Cases Component', () => {
  let component: SupportCasesComponent;
  let mockSupportCasesService: SupportCasesService;
  let mockToasterService: ToasterService;
  let mockFormBuilder: FormBuilder;
  let mockDatePipe: DatePipe;
  mockSupportCasesService = mock(SupportCasesService);
  mockToasterService = mock(ToasterService);
  mockFormBuilder = mock(FormBuilder);
  mockDatePipe = mock(DatePipe);

  beforeEach(async () => {
    when(mockSupportCasesService.get()).thenReturn(Observable.of([testSupportCase1, testSupportCase2]));
    when(mockSupportCasesService.getPicklistValues(anyString())).thenReturn(Observable.from([]));
    when(mockSupportCasesService.create(anything())).thenReturn(Observable.from([]));
    when(mockSupportCasesService.createComment(anything())).thenReturn(Observable.from([]));
    when(mockSupportCasesService.getDetails(anyNumber())).thenReturn(Observable.from([]));
    when(mockSupportCasesService.getComments(anyString(), anything(), anything())).thenReturn(Observable.from([]));
    when(mockToasterService.pop(anyString(), anyString(), anyString())).thenReturn();
    when(mockDatePipe.transform(anything(), anything())).thenReturn('2018-01-01');
    component = new SupportCasesComponent(null, instance(mockDatePipe),
      instance(mockFormBuilder),
      instance(mockSupportCasesService),
      instance(mockToasterService));
  });
  it('should get data on init', () => {
    component.ngOnInit();
    verify(mockSupportCasesService.get()).once();
  });

  it('should clear filters on init', () => {
    // should init with no status filter selected
    component.ngOnInit();
    expect(component.showAllCases).toBeTruthy();
    expect(component.showOpenCases).toBeFalsy();
    expect(component.selectedStatusFilter).toEqual([]);
    expect(component.togglingOpenCases).toBeFalsy();
  });

  it('should call support case service on get data', () => {
    component.getData();
    verify(mockSupportCasesService.get()).atLeast(1);
  });

  it('should create filter date', () => {
    const results = component.createFilterDate(new Date());
    expect(results).toBeTruthy();
  });

  it('should build date filters', () => {
    component.dateOptions = [];
    component.supportCases = [new SupportCaseViewModel(testSupportCase1),
      new SupportCaseViewModel(testSupportCase2)];
    component.buildDateFilters();

    expect(component.dateOptions).toBeTruthy();
    expect(component.dateOptions.length).toBeGreaterThan(0);
    expect(component.dateOptions[0].label).toEqual('Current Month');
    expect(component.dateOptions[1].label).toEqual('Previous Month');
  });

  it('should set display new comment form to true', () => {
    let didReset = false;
    const commentForm = { reset: () => didReset = true};
    component.newCommentForm = <any>commentForm;
    component.displayNewCommentForm = false;
    expect(component.displayNewCommentForm).toBeFalsy();

    component.showCommentForm();
    expect(component.displayNewCommentForm).toBeTruthy();
    expect(didReset).toBeTruthy();
  });

  it('should set display comment form to false', () => {
    component.displayNewCommentForm = true;
    expect(component.displayNewCommentForm).toBeTruthy();
    component.hideCommentForm();
    expect(component.displayNewCommentForm).toBeFalsy();
  });

  it('should sort support cases by date newest first with event.order != 1', () => {
    const fakeSupportCase1 = new SupportCaseViewModel();
    fakeSupportCase1.CreatedDate = new Date(2018, 1, 1);
    const fakeSupportCase2 = new SupportCaseViewModel();
    fakeSupportCase2.CreatedDate = new Date(2018, 2, 2);
    const fakeSupportCase3 = new SupportCaseViewModel();
    fakeSupportCase3.CreatedDate = new Date(2018, 3, 3);
    component.supportCases = [fakeSupportCase1, fakeSupportCase2, fakeSupportCase3];

    expect(component.supportCases[0]).toEqual(fakeSupportCase1);
    expect(component.supportCases[1]).toEqual(fakeSupportCase2);
    expect(component.supportCases[2]).toEqual(fakeSupportCase3);

    component.onSortByDate({ order: 0 });
    expect(component.supportCases[0]).toEqual(fakeSupportCase3);
    expect(component.supportCases[1]).toEqual(fakeSupportCase2);
    expect(component.supportCases[2]).toEqual(fakeSupportCase1);
  });

  it('should sort support cases by date olderst first with event.order == 1', () => {
    const fakeSupportCase1 = new SupportCaseViewModel();
    fakeSupportCase1.CreatedDate = new Date(2018, 1, 1);
    const fakeSupportCase2 = new SupportCaseViewModel();
    fakeSupportCase2.CreatedDate = new Date(2018, 2, 2);
    const fakeSupportCase3 = new SupportCaseViewModel();
    fakeSupportCase3.CreatedDate = new Date(2018, 3, 3);
    component.supportCases = [fakeSupportCase1, fakeSupportCase2, fakeSupportCase3];

    expect(component.supportCases[0]).toEqual(fakeSupportCase1);
    expect(component.supportCases[1]).toEqual(fakeSupportCase2);
    expect(component.supportCases[2]).toEqual(fakeSupportCase3);

    component.onSortByDate({ order: 1 });
    expect(component.supportCases[0]).toEqual(fakeSupportCase1);
    expect(component.supportCases[1]).toEqual(fakeSupportCase2);
    expect(component.supportCases[2]).toEqual(fakeSupportCase3);
  });

  it('should falsify all cases and open cases when togglingOpenCases is false on filter', () => {
    component.showAllCases = true;
    component.showOpenCases = true;
    component.togglingOpenCases = false;

    component.onFilter({});
    expect(component.showAllCases).toBeFalsy();
    expect(component.showOpenCases).toBeFalsy();
  });

  it('should do nothing when togglingOpenCases is true on filter', () => {
    component.showAllCases = true;
    component.showOpenCases = true;
    component.togglingOpenCases = true;

    component.onFilter({});
    expect(component.showAllCases).toBeTruthy();
    expect(component.showOpenCases).toBeTruthy();
  });
});
