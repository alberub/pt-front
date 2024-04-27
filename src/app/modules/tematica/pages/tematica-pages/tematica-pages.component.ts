import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalContenidoComponent } from '../../../../shared/components/modal-contenido/modal-contenido.component';
import { ModalService } from '../../../../shared/services/modal.service';
import { TematicaService } from '../../../../shared/services/tematica.service';
import { Tematica } from '../../../../core/interfaces/Tematica.interface';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../../../core/interfaces/Categoria.interface';
import { CategoriasService } from '../../../../shared/services/categorias.service';
import { ContenidoService } from '../../../../shared/services/contenido.service';
import { DataObserver } from '../../../../core/interfaces/DataObserver.interface';
import { Subscription, debounceTime } from 'rxjs';
import { NuevoContenido } from '../../../../core/interfaces/NuevoContenido.interface';
import { ModalEditarComponent } from '../../../../shared/components/modal-editar/modal-editar.component';
import { Contenido } from '../../../../core/interfaces/Contenido.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tematica-pages',
  standalone: true,
  imports: [ModalContenidoComponent, CommonModule, ModalEditarComponent],
  templateUrl: './tematica-pages.component.html',
  styleUrl: './tematica-pages.component.css'
})
export class TematicaPagesComponent implements OnInit, OnDestroy {

  tematicas: Tematica[] = [];
  consultaTematicas: Tematica[] = [];
  private sub$: Subscription = new Subscription();

  constructor(public modalService: ModalService, 
              private tematicaService: TematicaService, 
              private router: Router) {}

  ngOnInit(): void {
    this.getTematicas();
  }

  getTematicas(){
    this.tematicaService.getTematicas()
      .subscribe( res => {
        this.tematicas = res;
        this.consultaTematicas = res;
      })
  }

  seleccionarTematica(tematica: Tematica){
    this.router.navigateByUrl(`/categorias/${tematica.uid}`);
  }

  buscarTematica(termino: string){    
    if (termino.trim().length === 0) {
      this.tematicas = this.consultaTematicas;
      return;
    } 
    this.tematicaService.buscarTematica(termino)
      .pipe(
        debounceTime(2000)
      )
      .subscribe( (tematicas: Tematica[]) => {
        if (tematicas.length > 0) {
          this.tematicas = tematicas;          
        }
      })
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

}
