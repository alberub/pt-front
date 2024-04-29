import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriasService } from '../../../../shared/services/categorias.service';
import { TematicaService } from '../../../../shared/services/tematica.service';
import { Tematica } from '../../../../core/interfaces/Tematica.interface';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../../../core/interfaces/Categoria.interface';
import { CategoriaConteo } from '../../../../core/interfaces/CategoriaConteo.interface';

@Component({
  selector: 'app-categorias-pages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias-pages.component.html',
  styleUrl: './categorias-pages.component.css'
})
export class CategoriasPagesComponent implements OnInit {

  categoriaPertenece: string = "";
  categorias: CategoriaConteo[] = [];
  tematica!: Tematica;
  portada: string = "";

  constructor(private route: ActivatedRoute, 
              private categoriasService: CategoriasService, 
              private tematicaService: TematicaService,
              private router: Router) {}

  ngOnInit(): void {
    this.route.params
      .subscribe( (res: any) => {
        this.getTematicaPorId(res.id);
        sessionStorage.setItem('tematicaId', res.id);
      });
  }

  getTematicaPorId(tematicaId: string): void{
    this.tematicaService.getTematicaPorId(tematicaId)
      .subscribe( (res: any) => {
        this.categoriaPertenece = res.tematica.nombre;
        this.categorias = res.conteo;
        this.tematica = res.tematica;
        this.portada = `url(${res.tematica.portada})`
        // this.categorias = tematica.permite;
      })
  }

  irCategoria(categoria: Categoria){ 
    sessionStorage.setItem('categoriaId', categoria.uid);
    this.router.navigateByUrl(`contenidos/${categoria.nombre}`);
  }

}
