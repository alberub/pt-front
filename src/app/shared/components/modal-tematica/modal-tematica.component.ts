import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { TematicaService } from '../../services/tematica.service';
import { Tematica } from '../../../core/interfaces/Tematica.interface';
import { Categoria } from '../../../core/interfaces/Categoria.interface';
import { CategoriasService } from '../../services/categorias.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NuevaTematica } from '../../../core/interfaces/NuevaTematica.interface';

@Component({
  selector: 'app-modal-tematica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-tematica.component.html',
  styleUrl: './modal-tematica.component.css'
})
export class ModalTematicaComponent implements OnInit {

  esSeleccionado: boolean = false;
  categorias: string[] = [];
  tematicas: Tematica[] = [];
  categoriasRes: Categoria[] = [];
  existenCategorias: boolean = false;
  tematicaForm!: FormGroup;
  nombreArchivo: string = "";
  existeArchivo: boolean = false;
  private tempImg!: File | null;

  constructor(public modalService: ModalService, private tematicaService: TematicaService, private categoriaService: CategoriasService) {
  }
  
  ngOnInit(): void {
    this.tematicaForm = new FormGroup({
      nombre: new FormControl( null, Validators.required )
    })

    this.getCategorias();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.tempImg = file;
      this.nombreArchivo = file.name;
      this.existeArchivo = true;
      console.log(this.tempImg);
      
    }
  }

  crearTematica(){

    if (this.tematicaForm.valid && this.categorias.length > 0 && this.tempImg != null) {
        console.log(this.categorias, this.tematicaForm.value.nombre);
        
        const tematica: NuevaTematica = {
          nombre: this.tematicaForm.value.nombre,
          archivos: this.categorias
        };

        this.tematicaService.crearTematica(tematica, this.tempImg!)
          .subscribe( res => {
            console.log(res);
            this.modalService.toggleModalTematica();
          });

    }
  }

  accionCategorias(categoria: string) {
    if (!this.categorias.includes(categoria)) {
      this.categorias.push(categoria);      
    } else{
      const el = this.categorias.findIndex( el => el === categoria);
      console.log(el);
      this.categorias.splice(el, 1);
    }   
    console.log(this.categorias);
  }

  getCategorias(){
    this.categoriaService.getCategorias()
      .subscribe( (categorias: Array<Categoria>) => {
        if (categorias.length > 0) {
          console.log(categorias);
          
          this.categoriasRes = categorias;
          this.existenCategorias = true;
        }
      })
  }

  getTematicas(){
    this.tematicaService.getTematicas()
      .subscribe( (tematicas: Tematica[]) => {
        console.log(tematicas);
        this.tematicas = tematicas;
        // this.existenTematicas = true;
      })
  }

  removerSeleccion(){
    this.nombreArchivo = "";
    this.existeArchivo = false;
    this.tempImg = null;
  }

}
