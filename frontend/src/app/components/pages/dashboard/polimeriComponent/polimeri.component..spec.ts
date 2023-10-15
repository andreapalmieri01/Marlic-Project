import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolimeriComponent } from './polimeri.component';

describe('polimeriComponent', () => {
  let component: PolimeriComponent;
  let fixture: ComponentFixture<PolimeriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolimeriComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PolimeriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
