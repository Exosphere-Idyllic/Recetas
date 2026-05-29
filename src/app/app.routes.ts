import { Routes } from '@angular/router';
import { ListaRecetasComponent } from './components/lista-recetas/lista-recetas';
import { FormReceta } from './components/form-receta/form-receta';
import { DetalleReceta } from './components/detalle-receta/detalle-receta';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: ListaRecetasComponent },
  { path: 'agregar', component: FormReceta },
  { path: 'editar/:id', component: FormReceta },
  { path: 'receta/:id', component: DetalleReceta },
  { path: 'favoritos', component: ListaRecetasComponent },
  { path: '**', redirectTo: 'inicio' }
];
