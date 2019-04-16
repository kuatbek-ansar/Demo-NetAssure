import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitDetailsComponent } from './details.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { CircuitPredictiveService } from '../../../services/circuit-predictive.service';
import { mock, instance, anything, when } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import { StateService } from '../../../services';
import { CircuitPredictive } from '../../../../../models';

describe('DetailsComponent', () => {

  describe('rendering', () => {
    let component: CircuitDetailsComponent;
    let fixture: ComponentFixture<CircuitDetailsComponent>;

    beforeEach(async(() => {
      const mockCircuitPredictive = mock(CircuitPredictiveService);
      when(mockCircuitPredictive.getCircuitPredictive(anything())).thenReturn(Observable.from([]));
      const mockActivatedRoute = {
        params: Observable.from([{ id: 1 }])
      }
      TestBed.configureTestingModule({
        declarations: [CircuitDetailsComponent],
        imports: [RouterModule, ChartsModule],
        providers: [StateService,
          { provide: CircuitPredictiveService, useValue: instance(mockCircuitPredictive) },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
        ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(CircuitDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
  describe('behaviour', () => {
    let component: CircuitDetailsComponent;
    const mockCircuitPredictive = mock(CircuitPredictiveService);
    const mockActivatedRoute = {
      params: Observable.from([{ id: 1 }])
    };

    beforeEach(() => {
      component = new CircuitDetailsComponent(null, instance(mockCircuitPredictive), <any>mockActivatedRoute)
    });

    it('should map fields', () => {
      const model = new CircuitPredictive();
      model.predictiveData = [];
      model.averageBitsReceived = 1;
      model.averageBitsSent = 2;
      model.lowBitsReceived = 3;
      model.lowBitsSent = 4;
      model.highBitsReceived = 5;
      model.highBitsSent = 6;
      model.willBreachSLA = true;
      model.willBreachSLAIn = '6000 years';

      when(mockCircuitPredictive.getCircuitPredictive(anything())).thenReturn(Observable.from([model]));
      component.ngOnInit();
      expect(component.model.averageBitsReceived).toBe(model.averageBitsReceived);
      expect(component.model.highBitsReceived).toBe(model.highBitsReceived);
      expect(component.model.lowBitsReceived).toBe(model.lowBitsReceived);
      expect(component.model.averageBitsSent).toBe(model.averageBitsSent);
      expect(component.model.highBitsSent).toBe(model.highBitsSent);
      expect(component.model.lowBitsSent).toBe(model.lowBitsSent);

      expect(component.model.willBreachSLA).toBe(model.willBreachSLA);
      expect(component.model.willBreachSLAIn).toBe(model.willBreachSLAIn);
    });

    it('should map predictive data', () => {
      const model = new CircuitPredictive();
      model.predictiveData = [{
        bitsReceived: 50,
        bitsSent: 100,
        date: new Date(2018, 1, 1)
      },
      {
        bitsReceived: 55,
        bitsSent: 110,
        date: new Date(2018, 1, 2)
      }];

      when(mockCircuitPredictive.getCircuitPredictive(anything())).thenReturn(Observable.from([model]));
      component.ngOnInit();
      expect(component.model.predictiveData.data.length).toBe(4);
      expect(component.model.predictiveData.data[0].data.length).toBe(2);
      expect(component.model.predictiveData.data[1].data.length).toBe(2);
      expect(component.model.predictiveData.data[0].data[0]).toBe(model.predictiveData[0].bitsSent);
      expect(component.model.predictiveData.data[0].data[1]).toBe(model.predictiveData[1].bitsSent);
      expect(component.model.predictiveData.data[1].data[0]).toBe(model.predictiveData[0].bitsReceived);
      expect(component.model.predictiveData.data[1].data[1]).toBe(model.predictiveData[1].bitsReceived);
    });

    it('should map predictive labels', () => {
      const model = new CircuitPredictive();
      model.predictiveData = [{
        bitsReceived: 50,
        bitsSent: 100,
        date: new Date(2018, 0, 1)
      },
      {
        bitsReceived: 55,
        bitsSent: 110,
        date: new Date(2018, 0, 2)
      }];

      when(mockCircuitPredictive.getCircuitPredictive(anything())).thenReturn(Observable.from([model]));
      component.ngOnInit();
      expect(component.model.predictiveData.labels.length).toBe(2);
      expect(component.model.predictiveData.labels[0]).toBe('2018-01-01');
      expect(component.model.predictiveData.labels[1]).toBe('2018-01-02');
    })
  });
});
