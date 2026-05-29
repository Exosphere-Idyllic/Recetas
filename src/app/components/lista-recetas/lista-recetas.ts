import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecetaService } from '../../services/receta.service';
import { Receta } from '../../models/receta.model';

@Component({
  selector: 'app-lista-recetas',
  templateUrl: './lista-recetas.component.html',
  styleUrls: ['./lista-recetas.component.css']
})
export class ListaRecetasComponent implements OnInit {

  recetas: Receta[] = [];
  recetasFiltradas: Receta[] = [];
  terminoBusqueda: string = '';

  constructor(private recetaService: RecetaService, private router: Router) {}

  ngOnInit(): void {
    this.recetas = this.recetaService.obtenerRecetas();
    this.recetasFiltradas = this.recetas;
  }

  buscarReceta(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda = input.value.toLowerCase();
    this.recetasFiltradas = this.recetas.filter(r =>
      r.nombre.toLowerCase().includes(this.terminoBusqueda)
    );
  }

  toggleFavorito(receta: Receta): void {
    this.recetaService.toggleFavorito(receta.id);
    receta.favorito = !receta.favorito;
  }

  eliminarReceta(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      this.recetaService.eliminarReceta(id);
      this.recetas = this.recetaService.obtenerRecetas();
      this.recetasFiltradas = this.recetas.filter(r =>
        r.nombre.toLowerCase().includes(this.terminoBusqueda)
      );
    }
  }

  editarReceta(id: number): void {
    this.router.navigate(['/editar-receta', id]);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/detalle-receta', id]);
  }
}