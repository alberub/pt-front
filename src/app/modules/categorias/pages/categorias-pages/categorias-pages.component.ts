import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriasService } from '../../../../shared/services/categorias.service';
import { TematicaService } from '../../../../shared/services/tematica.service';

@Component({
  selector: 'app-categorias-pages',
  standalone: true,
  imports: [],
  templateUrl: './categorias-pages.component.html',
  styleUrl: './categorias-pages.component.css'
})
export class CategoriasPagesComponent implements OnInit {

  constructor(private route: ActivatedRoute, private categoriasService: CategoriasService, private tematicaService: TematicaService) {}

  ngOnInit(): void {
    this.route.params
      .subscribe( (res: any) => {
        this.getTematicaPorId(res.id);
      });
  }

  getTematicaPorId(tematicaId: string): void{
    this.tematicaService.getTematicaPorId(tematicaId)
      .subscribe( res => {
        console.log(res);        
      })
  }

}
