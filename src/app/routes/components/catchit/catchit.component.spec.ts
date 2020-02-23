import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchitComponent } from './catchit.component';

describe('CatchitComponent', () => {
  let component: CatchitComponent;
  let fixture: ComponentFixture<CatchitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatchitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
