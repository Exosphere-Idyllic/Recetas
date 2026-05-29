import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipeService, Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-detalle-receta',
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-receta.html',
  styleUrl: './detalle-receta.css',
})
export class DetalleReceta implements OnInit {
  recipe: Recipe | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.recipe = this.recipeService.getRecipeById(id);
      }
    });
  }

  toggleFavorite(): void {
    if (this.recipe) {
      this.recipeService.toggleFavorite(this.recipe.id);
      // Actualizar la referencia local para refrescar la UI
      this.recipe = this.recipeService.getRecipeById(this.recipe.id);
    }
  }

  deleteRecipe(): void {
    if (this.recipe && confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      this.recipeService.deleteRecipe(this.recipe.id);
      this.router.navigate(['/inicio']);
    }
  }

  goBack(): void {
    this.router.navigate(['/inicio']);
  }
}
