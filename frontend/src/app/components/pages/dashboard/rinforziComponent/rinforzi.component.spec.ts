import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RinforziComponent } from './rinforzi.component';

describe('rinforziComponent', () => {
  let component: RinforziComponent;
  let fixture: ComponentFixture<RinforziComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RinforziComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RinforziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
