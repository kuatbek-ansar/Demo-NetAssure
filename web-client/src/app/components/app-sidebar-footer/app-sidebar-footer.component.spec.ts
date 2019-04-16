// base
import { MockComponent } from 'mock-component';
import { mock, instance, when, verify, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateService } from '../../services/index';
import { GlobalModule } from '../../global.module';

// needed for my tests
import { AppSidebarFooterComponent } from '.';
import { ReleaseNotesService } from '../../services/release-notes.service';
import { ReleaseNote } from '../../../../models/release-note.model';
import { Observable } from 'rxjs/Observable';
import '../../../rxjs-imports';


describe('App Sidebar Footer Component', () => {
  let component: AppSidebarFooterComponent;
  let fixture: ComponentFixture<AppSidebarFooterComponent>;

  const mockService = mock(ReleaseNotesService);

  describe('rendering', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [
          AppSidebarFooterComponent
        ],
        imports: [
          GlobalModule
        ],
        providers: [StateService,
          { provide: ReleaseNotesService, useValue: instance(mockService) }
        ]
      })
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(AppSidebarFooterComponent);
      component = fixture.componentInstance;
      when(mockService.getMostRecentReleaseNote()).thenReturn(Observable.from([]));
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  });

  describe('behaviour', () => {
    beforeEach(() => {
      component = new AppSidebarFooterComponent(null, instance(mockService));
      when(mockService.getMostRecentReleaseNote()).thenReturn(Observable.from([]));
    });

    it('should look up the most recent release notes', () => {
      component.ngOnInit();
      verify(mockService.getMostRecentReleaseNote()).once();

    });

  });



});


