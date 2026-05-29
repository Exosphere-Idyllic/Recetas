import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { RecipeService, Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-form-receta',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './form-receta.html',
  styleUrl: './form-receta.css',
})
export class FormReceta implements OnInit {
  isEditMode = false;
  recipeId: string | null = null;

  // Objeto modelo inicializado con valores por defecto
  recipe: Omit<Recipe, 'id'> = {
    name: '',
    description: '',
    prepTime: 20,
    portions: 2,
    category: 'Almuerzo',
    difficulty: 'Medio',
    ingredients: [],
    steps: [],
    imageUrl: '',
    isFavorite: false
  };

  // Variables para agregar a los arrays dinámicos
  newIngredient = '';
  newStep = '';

  // Control de errores de validación
  showErrors = false;

  // Lista de categorías predefinidas para el dropdown
  categories: string[] = [
    'Desayuno',
    'Almuerzo',
    'Cena',
    'Entrada',
    'Postre',
    'Bebida',
    'Snack'
  ];

  // Lista de URLs de imágenes predeterminadas
  presetImages = [
    { name: 'Ensalada Fresca', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' },
    { name: 'Pasta Italiana', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' },
    { name: 'Postre de Chocolate', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hamburguesa Gourmet', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
    { name: 'Desayuno Saludable', url: 'https://images.unsplash.com/photo-1497888329096-51c27beff665?auto=format&fit=crop&w=600&q=80' }
  ];

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Detectamos si la ruta tiene un parámetro 'id' (Modo Edición)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const existingRecipe = this.recipeService.getRecipeById(id);
        if (existingRecipe) {
          this.isEditMode = true;
          this.recipeId = id;
          // Clonamos la receta para evitar mutación directa en el servicio
          this.recipe = {
            name: existingRecipe.name,
            description: existingRecipe.description,
            prepTime: existingRecipe.prepTime,
            portions: existingRecipe.portions,
            category: existingRecipe.category,
            difficulty: existingRecipe.difficulty,
            ingredients: [...existingRecipe.ingredients],
            steps: [...existingRecipe.steps],
            imageUrl: existingRecipe.imageUrl || '',
            isFavorite: existingRecipe.isFavorite
          };
        } else {
          // Si no existe la receta, redirigimos a agregar
          this.router.navigate(['/agregar']);
        }
      }
    });
  }

  // Evento para agregar ingrediente dinámicamente (haciendo clic o presionando enter)
  addIngredient(event?: Event): void {
    if (event) {
      event.preventDefault(); // Evitamos que envíe el formulario si se presiona enter
    }

    const ingredient = this.newIngredient.trim();
    if (ingredient) {
      this.recipe.ingredients.push(ingredient);
      this.newIngredient = ''; // Limpiamos el input
    }
  }

  // Eliminar ingrediente por índice
  removeIngredient(index: number): void {
    this.recipe.ingredients.splice(index, 1);
  }

  // Evento para agregar paso de preparación dinámicamente
  addStep(event?: Event): void {
    if (event) {
      event.preventDefault(); // Evitamos que envíe el formulario
    }

    const step = this.newStep.trim();
    if (step) {
      this.recipe.steps.push(step);
      this.newStep = ''; // Limpiamos la caja de texto
    }
  }

  // Eliminar paso de preparación por índice
  removeStep(index: number): void {
    this.recipe.steps.splice(index, 1);
  }

  // Seleccionar una imagen preestablecida
  selectPresetImage(url: string): void {
    this.recipe.imageUrl = url;
  }

  // Alternar favorito directamente en el formulario
  toggleFavoriteForm(): void {
    this.recipe.isFavorite = !this.recipe.isFavorite;
  }

  // Validador rápido de campos mínimos requeridos
  isFormValid(): boolean {
    return (
      this.recipe.name.trim() !== '' &&
      this.recipe.description.trim() !== '' &&
      this.recipe.prepTime > 0 &&
      this.recipe.portions > 0 &&
      this.recipe.ingredients.length > 0 &&
      this.recipe.steps.length > 0
    );
  }

  // Envío del formulario
  onSubmit(): void {
    this.showErrors = true;

    if (this.isFormValid()) {
      if (this.isEditMode && this.recipeId) {
        this.recipeService.updateRecipe(this.recipeId, this.recipe);
      } else {
        this.recipeService.addRecipe(this.recipe);
      }

      // Limpiamos o redirigimos al inicio
      this.router.navigate(['/inicio']);
    }
  }

  // Cancelar operación
  cancel(): void {
    this.router.navigate(['/inicio']);
  }
}
