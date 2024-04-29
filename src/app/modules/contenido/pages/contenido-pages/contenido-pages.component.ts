import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ModalContenidoComponent } from '../../../../shared/components/modal-contenido/modal-contenido.component';
import { ModalService } from '../../../../shared/services/modal.service';
import { ContenidoService } from '../../../../shared/services/contenido.service';
import { Contenido } from '../../../../core/interfaces/Contenido.interface';
import { CommonModule } from '@angular/common';
import { Subscription, debounceTime } from 'rxjs';
import { ModalEditarComponent } from '../../../../shared/components/modal-editar/modal-editar.component';
import { Router } from '@angular/router';
import { ModalGenericoComponent } from '../../../../shared/components/modal-generico/modal-generico.component';
import { UsuarioService } from '../../../../shared/services/usuario.service';

@Component({
  selector: 'app-contenido-pages',
  standalone: true,
  imports: [ModalContenidoComponent, CommonModule, ModalEditarComponent, ModalGenericoComponent],
  templateUrl: './contenido-pages.component.html',
  styleUrl: './contenido-pages.component.css'
})
export class ContenidoPagesComponent implements OnInit, OnDestroy {

  contenidoId: string = "";

  mostrarModal: boolean = false;
  contenidos: Contenido[] = [];
  contenidoPorCategoria: Contenido[] = [];
  role: string = "";
  private sub$: Subscription = new Subscription();
  private tematicaId: string = "";
  private categoriaId: string = "";
  constructor(public modalService: ModalService, 
              private contenidoService: ContenidoService, 
              private router: Router, 
              private usuarioService: UsuarioService) {
                if (sessionStorage.getItem('token')) {
                  this.usuarioService.validaTokenUsuario()
                    .subscribe( () => {
                      if (this.usuarioService.usuario) {                
                        this.role = this.usuarioService.usuario.role;
                      }
                    });
                }
              }

  ngOnInit(): void {
    this.categoriaId = sessionStorage.getItem('categoriaId')!;
    this.tematicaId = sessionStorage.getItem('tematicaId')!;
    this.getContenido();

    this.sub$.add(
      this.contenidoService.contenido$
        .subscribe( res => {
          this.getContenido();
        })
    )
  }

  verContenido(contenido: Contenido){    
    this.router.navigateByUrl(`lectura/${contenido.uid}`);
  }

  buscarContenido(termino: string){    
    if (termino.trim().length === 0) {
      this.contenidos = this.contenidoPorCategoria;
      return;
    } 
    this.contenidoService.buscarContenido(termino)
      .pipe(
        debounceTime(2000)
      )
      .subscribe( (contenidos: Contenido[]) => {
        if (contenidos.length > 0) {
          this.contenidos = contenidos;
        }
      })
  }

  getContenido(){
    this.contenidoService.getContenido(this.categoriaId, this.tematicaId)
      .subscribe( (contenido: Contenido[]) => {  
        contenido.forEach( contenido => {
          if (contenido.url.startsWith('https://www.youtube.com/watch?v=')) {
            const idYouTube = this.extraerYoutubeId(contenido.url);
            const urlYouTube = `https://img.youtube.com/vi/${idYouTube}/maxresdefault.jpg`
            contenido.url = urlYouTube!;        
          }
        });
        this.contenidos = contenido;
        this.contenidoPorCategoria = contenido;
      })
  }

  extraerYoutubeId(url: string): string  | null{
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null; 
  }

  setContenido(contenido: Contenido){
    this.contenidoService.contenidoAct$.next(contenido.uid);
    this.modalService.toggleModalEditar();
  }

  eliminarContenido(contenidoId: string){
    this.mostrarModal = true;
    this.contenidoId = contenidoId;    
  }

  accionModalEliminar(continua: boolean){
    if (continua) {
        this.contenidoService.eliminarContenido(this.contenidoId)
        .subscribe( res => {   
          this.mostrarModal = false;          
          this.getContenido();   
        })
    } else{
      this.mostrarModal = false;
      this.contenidoId = "";
    }
  }
  
  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

}
