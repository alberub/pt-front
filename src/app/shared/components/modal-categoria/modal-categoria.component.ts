import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriasService } from '../../services/categorias.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal-categoria',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-categoria.component.html',
  styleUrl: './modal-categoria.component.css'
})
export class ModalCategoriaComponent implements OnInit{

  nombreArchivo: string = "";
  existeArchivo: boolean = false;
  valid: boolean = false;
  categoriaForm!: FormGroup;
  private iconoImg!: File | null;

  constructor(private categoriaServide: CategoriasService, public modalService: ModalService) {}

  ngOnInit(): void {
    this.categoriaForm = new FormGroup({
      nombre: new FormControl( null, Validators.required)
    })
  }

  crearCategoria(){
    console.log(this.iconoImg);
    
    if (this.categoriaForm.valid && this.iconoImg != null) {
      this.valid = true;
      const nombre = this.categoriaForm.value.nombre;

      this.categoriaServide.crearCategoria(nombre, this.iconoImg!)
        .subscribe( () => {
          this.modalService.toggleModalCategoria();
          this.valid = false;
        })
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.iconoImg = file;
      this.nombreArchivo = file.name;
      this.existeArchivo = true;
      console.log(file.type);
    }
  }

  removerSeleccion(){
    this.nombreArchivo = "";
    this.existeArchivo = false;
    this.iconoImg = null;
  }

}
