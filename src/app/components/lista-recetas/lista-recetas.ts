import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipeService, Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-lista-recetas',
  imports: [CommonModule],
  templateUrl: './lista-recetas.component.html',
  styleUrls: ['./lista-recetas.component.css']
})
export class ListaRecetasComponent implements OnInit {

  recetas: Recipe[] = [];
  recetasFiltradas: Recipe[] = [];
  terminoBusqueda: string = '';

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.recetas = this.recipeService.recipes();
    if (this.router.url.includes('favoritos')) {
      this.recetasFiltradas = this.recetas.filter(r => r.isFavorite);
    } else {
      this.recetasFiltradas = this.recetas;
    }
  }

  buscarReceta(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda = input.value.toLowerCase();
    const source = this.router.url.includes('favoritos')
      ? this.recetas.filter(r => r.isFavorite)
      : this.recetas;
    this.recetasFiltradas = source.filter(r =>
      r.name.toLowerCase().includes(this.terminoBusqueda)
    );
  }

  toggleFavorito(receta: Recipe): void {
    this.recipeService.toggleFavorite(receta.id);
    this.recetas = this.recipeService.recipes();
    if (this.router.url.includes('favoritos')) {
      this.recetasFiltradas = this.recetas.filter(r => r.isFavorite);
    } else {
      this.recetasFiltradas = this.recetas.filter(r =>
        r.name.toLowerCase().includes(this.terminoBusqueda)
      );
    }
  }

  eliminarReceta(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      this.recipeService.deleteRecipe(id);
      this.recetas = this.recipeService.recipes();
      const source = this.router.url.includes('favoritos')
        ? this.recetas.filter(r => r.isFavorite)
        : this.recetas;
      this.recetasFiltradas = source.filter(r =>
        r.name.toLowerCase().includes(this.terminoBusqueda)
      );
    }
  }

  editarReceta(id: string): void {
    this.router.navigate(['/editar', id]);
  }

  verDetalle(id: string): void {
    this.router.navigate(['/receta', id]);
  }
}