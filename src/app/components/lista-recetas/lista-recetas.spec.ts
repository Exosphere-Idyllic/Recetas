import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRecetasComponent } from './lista-recetas';

describe('ListaRecetasComponent', () => {
  let component: ListaRecetasComponent;
  let fixture: ComponentFixture<ListaRecetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaRecetasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaRecetasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
