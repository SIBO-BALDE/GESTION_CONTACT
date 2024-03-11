import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorbeilComponent } from './corbeil.component';

describe('CorbeilComponent', () => {
  let component: CorbeilComponent;
  let fixture: ComponentFixture<CorbeilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorbeilComponent]
    });
    fixture = TestBed.createComponent(CorbeilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
