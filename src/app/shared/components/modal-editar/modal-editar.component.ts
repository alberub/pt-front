import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ContenidoService } from '../../services/contenido.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contenido } from '../../../core/interfaces/Contenido.interface';
import { CommonModule } from '@angular/common';
import { TematicaService } from '../../services/tematica.service';
import { CategoriasService } from '../../services/categorias.service';
import { Categoria } from '../../../core/interfaces/Categoria.interface';
import { Tematica } from '../../../core/interfaces/Tematica.interface';
import { EditarContenido } from '../../../core/interfaces/EditarContenido.interface';

@Component({
  selector: 'app-modal-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-editar.component.html',
  styleUrl: './modal-editar.component.css'
})
export class ModalEditarComponent implements OnInit, OnDestroy {

  private sub$: Subscription = new Subscription();
  editarForm!: FormGroup;
  contenido: any;
  esVideo: boolean = false;
  existeContenido: boolean = false;
  categorias: Categoria[] = [];
  tematicas: Tematica[] = [];
  nombreArchivo: string = "";
  existeArchivo: boolean = false;
  uidContenido: string = "";
  private tempImg!: File | null;
  extension: string = "";
  accept: string = "";

  constructor(public modalService: ModalService, 
              private contenidoService: ContenidoService,
              private tematicaService: TematicaService,
              private categoriaService: CategoriasService) {}
  
  ngOnInit(): void {

    this.editarForm = new FormGroup({
      titulo: new FormControl(null, Validators.required),
      desc: new FormControl(null, Validators.required),
      contenido: new FormControl(null)
      // categoria: new FormControl(null, Validators.required),
      // tematica: new FormControl(null, Validators.required)
    })

    this.sub$.add(
      this.contenidoService.contenidoAct$
        .subscribe( res => {
          this.getContenidoIndovidual(res);
        })
    );
    this.getCategorias();
    this.getTematicas();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.tempImg = file;
      this.nombreArchivo = file.name;
      this.existeArchivo = true;
    }
  }

  editarContenido(){
    this.validaciones();
    var data: EditarContenido;
    if (this.editarForm.valid) {
      const data: EditarContenido = {
        uid: this.uidContenido,
        titulo: this.editarForm.value.titulo,
        desc: this.editarForm.value.desc,
        video_url: this.editarForm.value.contenido,
        archivo: this.tempImg
      }
      this.contenidoService.actualizarContenido(data)
        .subscribe( res => {
          this.modalService.toggleModalEditar();    
          this.contenidoService.contenido$.next(true);
        })
    }
  }

  validaUrlVideo():boolean{
    const url: string = this.editarForm.get('contenido')?.value;
    let result: boolean = false;
    if (url.startsWith('https://www.youtube.com')) {
      result = true;
    }
    return result;
  }

  validaciones(){
    if (this.esVideo) { 
      this.editarForm.get('contenido')?.setValidators([Validators.required]);
      this.editarForm.get('contenido')?.updateValueAndValidity();
    }
  }

  getContenidoIndovidual(contenidoId: string){
    this.contenidoService.getContenidoIndividual(contenidoId)
      .subscribe( (contenido: any) => {        
        this.contenido = contenido;
        this.asignarExtension(contenido.categoria.nombre);
        this.existeContenido = true;
        this.uidContenido = contenido.uid;
        this.editarForm.get('titulo')?.setValue(this.contenido.titulo);
        this.editarForm.get('desc')?.setValue(this.contenido.descripcion);
        this.editarForm.get('contenido')?.setValue(this.contenido.url);
        if(contenido.categoria.nombre == 'videos'){
          this.esVideo = true;
        }     
      });
  }

  getCategorias(){
    this.categoriaService.getCategorias()
      .subscribe( res => {
        this.categorias = res
      })
  }

  getTematicas(){
    this.tematicaService.getTematicas()
      .subscribe( res => {
        this.tematicas = res
      })
  }

  removerSeleccion(){
    this.nombreArchivo = "";
    this.existeArchivo = false;
    this.tempImg = null;
  }

  asignarExtension(tipo: string){

    switch (tipo) {
      case 'imagenes':
        this.extension = "image";
        this.accept = "image/*"
        this.esVideo = false;
        break;
      
      case 'texto':
        this.extension = "text";
        this.accept = "text/plain"
        this.esVideo = false;
        break;

      case 'videos':
        this.esVideo = true;
        break;
    
      default:
        break;
    }

  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

}
