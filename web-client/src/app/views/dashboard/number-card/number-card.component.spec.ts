import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberCardComponent } from './number-card.component';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { StateService } from '../../../services/index';
import { Router } from '@angular/router';
import { mock, instance } from 'ts-mockito/lib/ts-mockito';

describe('NumberCardComponent', () => {
  let component: NumberCardComponent;
  let fixture: ComponentFixture<NumberCardComponent>;

  beforeEach(async(() => {
    const mockRouter = mock(Router);
    TestBed.configureTestingModule({
      declarations: [NumberCardComponent, AppWidgetLoadingComponent],
      providers: [StateService,
        { provide: Router, useValue: instance(mockRouter) }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
