import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public modalState: boolean = false;
  public modalGenerico: boolean = false;
  public modalTematica: boolean = false;
  public modalCategoria: boolean = false;
  public modalEditar: boolean = false;

  constructor() { }

  toggleModal(){
    this.modalState == true ?
    this.modalState = false :
    this.modalState = true
  }

  toggleModalGenerico(){
    this.modalGenerico == true ?
    this.modalGenerico = false :
    this.modalGenerico = true
  }

  toggleModalTematica(){
    this.modalTematica == true ?
    this.modalTematica = false :
    this.modalTematica = true
  }

  toggleModalCategoria(){
    this.modalCategoria == true ?
    this.modalCategoria = false :
    this.modalCategoria = true
  }

  toggleModalEditar(){
    this.modalEditar == true ?
    this.modalEditar = false :
    this.modalEditar = true
  }


  cerrarConEscape(){
    this.modalState = false;
    this.modalGenerico = false;
  }

}
