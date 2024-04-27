import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, empty } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { CategoriasService } from '../../services/categorias.service';
import { Categoria } from '../../../core/interfaces/Categoria.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContenidoService } from '../../services/contenido.service';
import { NuevoContenido } from '../../../core/interfaces/NuevoContenido.interface';
import { SocketService } from '../../services/socket.service';
import { Contenido } from '../../../core/interfaces/Contenido.interface';

@Component({
  selector: 'app-modal-contenido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-contenido.component.html',
  styleUrl: './modal-contenido.component.css'
})
export class ModalContenidoComponent implements OnInit, OnDestroy {

  existeArchivo: boolean = false;
  nombreArchivo: string = "";
  tempImg: any = null;
  categorias: Categoria[] = [];
  contenidoForm!: FormGroup;
  private imaTmp!: File | null;
  private subs:Subscription = new Subscription();
  tematicaId: string = "";
  categoriaId: string = "";
  archivoValido: string = "";
  extension: string = "";
  esVideo: boolean = false;

  constructor(private modalService: ModalService, 
              private categoriaService: CategoriasService, 
              private contenidoService: ContenidoService,
              private socketService: SocketService) {}

  ngOnInit(): void {

    this.contenidoForm = new FormGroup({
      titulo: new FormControl( null, Validators.required),
      descripcion: new FormControl( null, Validators.required),
      url: new FormControl(null) 
    });
    this.getCategorias();

    this.categoriaId = sessionStorage.getItem('categoriaId')!;
    this.tematicaId = sessionStorage.getItem('tematicaId')!;

    this.subs.add(
      this.categoriaService.getMiObservable()
        .subscribe( res => {
          console.log(res);
          
          this.archivoValido = res;
          this.asignarExtension(res);
        })
    );

    this.categoriaService.getCategoriaPorId(this.categoriaId)
      .subscribe( (categoria: Categoria) => {
        if (categoria.nombre === 'videos') {
          this.esVideo = true;
        }
      })
  }

  crearContenido(){
    if (this.contenidoForm.valid) {
      const data: NuevoContenido = {
        titulo: this.contenidoForm.value.titulo,
        descripcion: this.contenidoForm.value.descripcion,
        creditos: sessionStorage.getItem('userId')!,
        categoria: this.categoriaId,
        tematica: this.tematicaId,
        video_url: this.contenidoForm.value.url,
        archivo: this.imaTmp!
      }
      this.contenidoService.crearContenido(data)
        .subscribe( (contenido: Contenido[]) => {
          this.contenidoService.contenido$.next(true);
          this.modalService.toggleModal();
          this.socketService.socket.emit('contenido-creado', contenido );
        });
    }
  }

  getCategorias(){
    this.categoriaService.getCategorias()
      .subscribe( res => {
        console.log(res);
        this.categorias = res;
      })
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    console.log(file?.type);    
    console.log(this.extension);
    
    const tipoArchivo = file?.type.split('/');
    const nombreCorto = tipoArchivo![0];
    console.log(nombreCorto);
    
    if (nombreCorto != this.extension) {
      return;
    }
    if (file) {
      this.nombreArchivo = file.name;
      this.existeArchivo = true;
      this.imaTmp = file;
      const reader = new FileReader();
      reader.readAsDataURL( file );
  
      reader.onloadend = () => {
        this.tempImg = reader.result;
      }
      
    }
  }

  onDragLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('dragover');
  }

  onDragOver(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.add('dragover');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('dragover');
    const files = event.dataTransfer?.files;
    if (files![0].type != this.extension) {
      return;
    }
    if (files && files.length > 0) {
      const file = files[0];
      console.log(file);
      this.existeArchivo = true;
      const size = Math.round(file.size / 1024).toString();
      this.nombreArchivo = file.name + ' - ' + size + ' KB';
      const reader = new FileReader();
      reader.readAsDataURL( file );
  
      reader.onloadend = () => {
        this.tempImg = reader.result;
      }
    }
  }

  asignarExtension(tipo: string){

    switch (tipo) {
      case 'imagenes':
        this.extension = "image";
        this.esVideo = false;
        break;
      
      case 'texto':
        this.extension = "text";
        this.esVideo = false;
        break;

      case 'videos':
        this.esVideo = true;
        break;
    
      default:
        break;
    }

  }

  removerImagen(){
    this.tempImg = null;
  }

  toggleModal(){
    this.modalService.toggleModal();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
