import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemorigyComponent } from './memorigy.component';

describe('MemorigyComponent', () => {
  let component: MemorigyComponent;
  let fixture: ComponentFixture<MemorigyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemorigyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemorigyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
