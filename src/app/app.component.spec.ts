import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AppComponent } from './app.component';
import { PersonService } from './person.service';
import { BoxPlotComponent } from './box-plot/box-plot.component';
import { Person } from '@lib/models';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let personServiceSpy: PersonService;

  const cohorts = { A: [10] };
  const people = [new Person('Alex', 10, 'A')];

  beforeEach(async(() => {
    personServiceSpy = jasmine.createSpyObj('PersonServiceSpy', ['fetch']);
    personServiceSpy.people$ = Observable.of(people);
    personServiceSpy.cohorts$ = Observable.of(cohorts);

    TestBed.configureTestingModule({
      declarations: [AppComponent, BoxPlotComponent],
      providers: [{ provide: PersonService, useValue: personServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should render title in a h1 tag', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Salary statistics');
  });

  it('should fetch the initial people', () => {
    expect(personServiceSpy.fetch).toHaveBeenCalled();
  });

  it('should expose the people and cohorts to the box plot component', () => {
    const boxPlot = fixture.debugElement.query(By.directive(BoxPlotComponent)).componentInstance;

    expect(boxPlot.people).toEqual(people);
    expect(boxPlot.cohorts).toEqual(cohorts);
  });
});
