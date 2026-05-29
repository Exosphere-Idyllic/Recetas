import { Component, Input } from '@angular/core';
import { Receta } from '../../models/receta.model';
import { RecetaService } from '../../services/receta.service';

@Component({
  selector: 'app-detalle-receta',
  imports: [],
  templateUrl: './detalle-receta.html',
  styleUrl: './detalle-receta.css',
})
export class DetalleRecetaComponent {
  @Input() receta!: Receta;

  constructor(private recetaService: RecetaService) {}
  marcarComoFavorita() {
    this.recetaService.marcarComoFavorita(this.receta.id);
  }
}