import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditiviComponent } from './additivi.component';

describe('additiviComponent', () => {
  let component: AdditiviComponent;
  let fixture: ComponentFixture<AdditiviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditiviComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdditiviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
