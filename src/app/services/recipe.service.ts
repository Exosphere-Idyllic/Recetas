import { Injectable, signal } from '@angular/core';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number; // en minutos
  portions: number;
  category: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  ingredients: string[];
  steps: string[];
  imageUrl?: string;
  isFavorite: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly STORAGE_KEY = 'recetas_app_data';
  
  // Usamos angular signals para reactividad moderna
  private recipesSignal = signal<Recipe[]>([]);

  constructor() {
    this.loadRecipes();
  }

  // Obtener señal de recetas para lectura reactiva
  get recipes() {
    return this.recipesSignal.asReadonly();
  }

  // Cargar de localStorage o inicializar con datos semilla
  private loadRecipes(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.recipesSignal.set(JSON.parse(stored));
          return;
        } catch (e) {
          console.error('Error parseando recetas de localStorage, reiniciando...', e);
        }
      }
    }
    
    // Inicializar con datos semilla premium
    const seedRecipes: Recipe[] = [
      {
        id: '1',
        name: 'Tacos al Pastor Caseros',
        description: 'Deliciosos tacos tradicionales mexicanos con carne de cerdo marinada en achiote y piña asada.',
        prepTime: 45,
        portions: 4,
        category: 'Almuerzo',
        difficulty: 'Medio',
        ingredients: [
          '500g de lomo de cerdo en filetes finos',
          '3 cucharadas de pasta de achiote',
          '2 chiles guajillo limpios e hidratados',
          '1/4 taza de vinagre blanco',
          '1/2 taza de jugo de piña',
          '1 taza de piña fresca picada en cubos',
          'Cebolla y cilantro picados al gusto',
          'Limones y tortillas de maíz calientes'
        ],
        steps: [
          'Licuar el achiote, los chiles guajillo, el vinagre, el jugo de piña, un trozo de cebolla y ajo hasta obtener un adobo terso.',
          'Marinar los filetes de cerdo en el adobo durante al menos 2 horas en refrigeración.',
          'En una sartén muy caliente con un poco de aceite, dorar la carne fileteada hasta que esté bien cocida y ligeramente crujiente. Cortar en trozos pequeños.',
          'En la misma sartén o una plancha, asar los cubos de piña hasta que estén dorados.',
          'Armar los tacos sobre tortillas calientes con la carne dorada, encima piña asada, cebolla, cilantro y unas gotas de limón.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
        isFavorite: true
      },
      {
        id: '2',
        name: 'Fettuccine Alfredo con Pollo',
        description: 'Pasta clásica italiana con una salsa cremosa a base de queso parmesano, mantequilla y pechuga de pollo a la plancha.',
        prepTime: 25,
        portions: 2,
        category: 'Cena',
        difficulty: 'Fácil',
        ingredients: [
          '250g de pasta fettuccine',
          '1 pechuga de pollo cortada en tiras',
          '1 taza de crema de leche para batir (heavy cream)',
          '1/2 taza de queso parmesano rallado de calidad',
          '3 cucharadas de mantequilla sin sal',
          '2 dientes de ajo finamente picados',
          'Sal, pimienta negra recién molida y perejil fresco picado'
        ],
        steps: [
          'Cocinar el fettuccine en una olla grande con agua hirviendo y sal según las instrucciones del paquete hasta que esté al dente.',
          'Sazonar las tiras de pollo con sal y pimienta. En una sartén, calentar una cucharada de mantequilla y dorar el pollo hasta que esté cocido. Retirar y reservar.',
          'En la misma sartén, derretir las dos cucharadas restantes de mantequilla a fuego medio-bajo. Agregar el ajo picado y cocinar por 1 minuto sin que se dore.',
          'Verter la crema de leche y dejar que hierva suavemente durante 3-5 minutos para que espese un poco.',
          'Agregar el queso parmesano rallado y revolver hasta que se derrita por completo en una salsa suave. Rectificar sal y pimienta.',
          'Incorporar el fettuccine escurrido y el pollo a la sartén con la salsa. Mezclar bien durante 1 minuto. Servir de inmediato espolvoreando perejil fresco.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80',
        isFavorite: false
      }
    ];

    this.recipesSignal.set(seedRecipes);
    this.saveToStorage(seedRecipes);
  }

  private saveToStorage(recipes: Recipe[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
    }
  }

  // Obtener receta por ID
  getRecipeById(id: string): Recipe | undefined {
    return this.recipesSignal().find(r => r.id === id);
  }

  // Agregar receta
  addRecipe(recipeData: Omit<Recipe, 'id'>): Recipe {
    const newRecipe: Recipe = {
      ...recipeData,
      id: Date.now().toString()
    };
    
    const updated = [...this.recipesSignal(), newRecipe];
    this.recipesSignal.set(updated);
    this.saveToStorage(updated);
    return newRecipe;
  }

  // Actualizar receta
  updateRecipe(id: string, recipeData: Partial<Recipe>): boolean {
    const recipes = this.recipesSignal();
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) return false;

    const updatedRecipes = [...recipes];
    updatedRecipes[index] = {
      ...updatedRecipes[index],
      ...recipeData
    };
    
    this.recipesSignal.set(updatedRecipes);
    this.saveToStorage(updatedRecipes);
    return true;
  }

  // Eliminar receta
  deleteRecipe(id: string): boolean {
    const recipes = this.recipesSignal();
    const filtered = recipes.filter(r => r.id !== id);
    if (filtered.length === recipes.length) return false;

    this.recipesSignal.set(filtered);
    this.saveToStorage(filtered);
    return true;
  }

  // Alternar favorito
  toggleFavorite(id: string): boolean {
    const recipes = this.recipesSignal();
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) return false;

    const updatedRecipes = [...recipes];
    updatedRecipes[index] = {
      ...updatedRecipes[index],
      isFavorite: !updatedRecipes[index].isFavorite
    };

    this.recipesSignal.set(updatedRecipes);
    this.saveToStorage(updatedRecipes);
    return true;
  }
}
