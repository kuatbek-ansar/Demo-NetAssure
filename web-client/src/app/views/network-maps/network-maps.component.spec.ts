// base
import { MockComponent } from 'mock-component';
import { mock, instance, when, verify, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { ComponentFixture, TestBed } from '@angular/core/testing';

// needed for my tests
import { NetworkMapsComponent } from './network-maps.component'
import { NetworkMapService } from '../../services';
import { NetworkMapViewModel } from '../../view-models';

// view imports
import { ToggleButton } from 'primeng/primeng';
import { BsModalService, ModalModule } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster'
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';

// I think I'll need these for data tests
import { Observable } from 'rxjs/Observable';
import '../../../rxjs-imports';

// not sure...
import { StateService } from '../../services/index';

import { AppWidgetLoadingComponent } from '../../components/index';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalModule } from '../../global.module';


class FakeActivatedRoute {
  params = [];
}

class FakeRouter {
  navigate(path: string) { return path; }
}

describe('Network Maps Component', () => {
  let component: NetworkMapsComponent;
  let fixture: ComponentFixture<NetworkMapsComponent>;

  const mockMapService = mock(NetworkMapService);
  const mockToasterService = mock(ToasterService);
  const mockBsModalServiceService = mock(BsModalService);

  describe('rendering', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [
          NetworkMapsComponent
        ],
        imports: [
          GlobalModule,
          ModalModule,
          LaddaModule,
          FormsModule
        ],
        providers: [StateService,
          { provide: ActivatedRoute, useClass: FakeActivatedRoute },
          { provide: Router, useClass: FakeRouter },
          { provide: BsModalService, useValue: instance(mockBsModalServiceService)},
          { provide: NetworkMapService, useValue: instance(mockMapService)},
          { provide: ToasterService, useValue: instance(mockToasterService)}
        ]
      })
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(NetworkMapsComponent);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    beforeEach(() => {
      component = new NetworkMapsComponent(null, instance(mockMapService), instance(mockToasterService));
    });

    // ==================================================
    // todo: these are stubbed in for a follow-up PR  -jc
    // ==================================================
    it('should fetch existing data through the service on load', () => {
      expect(true).toEqual(true);
    });

    it('should set the first node on open', () => {
      expect(true).toEqual(true);
    });

    it('should set the appropriate node on click', () => {
      expect(true).toEqual(true);
    });

    it('should upload to the service when image confirmed', () => {
      expect(true).toEqual(true);
    });

    it('should verify upload type is image', () => {
      expect(true).toEqual(true);
    });

    it('should confirm the upload is complete through the toaster service', () => {
      expect(true).toEqual(true);
    });

    it('should delete the image through the service when delete confirmed', () => {
      expect(true).toEqual(true);
    });
  });

});


