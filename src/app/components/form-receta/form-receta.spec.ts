import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReceta } from './form-receta';

describe('FormReceta', () => {
  let component: FormReceta;
  let fixture: ComponentFixture<FormReceta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormReceta],
    }).compileComponents();

    fixture = TestBed.createComponent(FormReceta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
