import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipeService, Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-lista-recetas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-recetas.component.html',
  styleUrls: ['./lista-recetas.component.css']
})
export class ListaRecetasComponent implements OnInit {

  recetas: Recipe[] = [];
  recetasFiltradas: Recipe[] = [];
  terminoBusqueda: string = '';
  esFavoritos: boolean = false;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.esFavoritos = this.router.url.includes('favoritos');
    this.recargarLista();
  }

  /** Recarga la lista desde el servicio y aplica el filtro de búsqueda/favoritos */
  private recargarLista(): void {
    this.recetas = this.recipeService.recipes();
    const fuente = this.esFavoritos
      ? this.recetas.filter(r => r.isFavorite)
      : this.recetas;
    this.recetasFiltradas = this.terminoBusqueda
      ? fuente.filter(r => r.name.toLowerCase().includes(this.terminoBusqueda))
      : fuente;
  }

  /** Evento (input) del buscador */
  buscarReceta(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda = input.value.toLowerCase().trim();
    this.recargarLista();
  }

  /** Alternar favorito con evento (click) */
  toggleFavorito(receta: Recipe): void {
    this.recipeService.toggleFavorite(receta.id);
    this.recargarLista();
  }

  /** Eliminar receta con confirmación */
  eliminarReceta(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      this.recipeService.deleteRecipe(id);
      this.recargarLista();
    }
  }

  /** Navegar al formulario de edición */
  editarReceta(id: string): void {
    this.router.navigate(['/editar', id]);
  }

  /** Ver detalle de receta */
  verDetalle(id: string): void {
    this.router.navigate(['/receta', id]);
  }

  /** Ir al formulario de agregar */
  irAgregar(): void {
    this.router.navigate(['/agregar']);
  }
}