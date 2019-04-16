import { ReportsComponent } from './reports.component';
import { Top10UtilizedCircuitsComponent } from './top10-utilized-circuits/top10-utilized-circuits.component';
import { Top10UtilizedInterfacesComponent } from './top10-utilized-interfaces/top10-utilized-interfaces.component';
import { Bottom10UtilizedCircuitsComponent } from './bottom10-utilized-circuits/bottom10-utilized-circuits.component';
import { Bottom10UtilizedInterfacesComponent } from './bottom10-utilized-interfaces/bottom10-utilized-interfaces.component';
import { ManagedDevicesComponent } from './managed-devices/managed-devices.component';
import { EndOfSupportComponent } from './end-of-support/end-of-support.component';
import { ApproachingEndOfSupportComponent } from './approaching-end-of-support/approaching-end-of-support.component';
import { CircuitValueScoresComponent } from './circuit-value-scores/circuit-value-scores.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportTypes } from './report-types.enum';
import { AppWidgetLoadingComponent } from '../../components/index';
import { DropdownModule } from 'primeng/primeng';
import { StateService, ReportsService } from '../../services/index';
import { mock, instance, when, verify, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../rxjs-imports';
import { GlobalModule } from '../../global.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ManagedDevicesHistoryComponent } from './managed-devices-history/managed-devices-history.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MockComponent } from 'mock-component';
import { TableModule } from 'primeng/table';

class FakeActivatedRoute {
  params = [];
}

class FakeRouter {
  navigate(path: string) { return path; }
}

describe('Reports Component', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        ReportsComponent,
        MockComponent(Top10UtilizedCircuitsComponent),
        MockComponent(Top10UtilizedInterfacesComponent),
        MockComponent(Bottom10UtilizedCircuitsComponent),
        MockComponent(Bottom10UtilizedInterfacesComponent),
        MockComponent(ManagedDevicesComponent),
        MockComponent(ManagedDevicesHistoryComponent),
        MockComponent(EndOfSupportComponent),
        MockComponent(ApproachingEndOfSupportComponent),
        MockComponent(CircuitValueScoresComponent)
      ],
      imports: [
        GlobalModule,
        ReportsRoutingModule,
        TableModule,
        DropdownModule
      ],
      providers: [ReportsService, StateService,
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: FakeRouter }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
  });
});
describe('Reports Component', () => {
  const mockRouter = mock(Router);
  let component: ReportsComponent;
  beforeEach(() => {
    component = new ReportsComponent(null, null, instance(mockRouter));
  });

  it('should have Top 10 Utilized Circuits as default', () => {
    expect(component.report).toEqual(ReportTypes.Top10UtilizedCircuits);
  });

  /** @todo: Need to figure out how to test the route subscribe */
  // it('should set the default report to route param', () => {
  //     expect(the report to be different than default).somehow()
  // });

  it('should have report types', () => {
    expect(component.reportTypes).toEqual(ReportTypes);
  });
});
