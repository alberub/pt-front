import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../../../../shared/services/categorias.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import { Usuario } from '../../../../core/interfaces/Usuario.interface';
import { Role } from '../../../../core/interfaces/Role.interface';
import { ModalService } from '../../../../shared/services/modal.service';
import { ModalTematicaComponent } from '../../../../shared/components/modal-tematica/modal-tematica.component';
import { ModalCategoriaComponent } from '../../../../shared/components/modal-categoria/modal-categoria.component';

@Component({
  selector: 'app-admin-pages',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalTematicaComponent, ModalCategoriaComponent],
  templateUrl: './admin-pages.component.html',
  styleUrl: './admin-pages.component.css'
})
export class AdminPagesComponent implements OnInit {

  padron: any[] = [];
  pagina: number = 1;
  totalPaginas: number = 0;
  usuarios: Usuario[] = [];
  roles: Role[] = [];

  constructor(private categoriaService: CategoriasService, private usuarioService: UsuarioService, public modalService: ModalService) {}

  ngOnInit(): void {
    // this.getCategorias();
    this.getUsuarios();
    this.getRoles();
  }

  getCategorias(){
    this.categoriaService.getCategorias()
      .subscribe( res => {          
      })
  }

  getUsuarios(){
    this.usuarioService.getUsuarios()
      .subscribe( (res: Usuario[]) => {
        this.usuarios = res;
    });
  }

  getRoles(){
    this.usuarioService.getRoles()
      .subscribe( (res: Role[]) => {
        this.roles = res;
      })
  }

  changeRole(usuario: Usuario){
    this.actualizarUsuario(usuario);
  }

  rolesFiltrados(roleActual: string){
    return this.roles.filter( role => {
      return role.nombreRol !== roleActual;
    });
  }

  actualizarUsuario(usuario: Usuario){
    this.usuarioService.actualizarUsuario(usuario)
      .subscribe( () => {
        this.modalService.toggleModalGenerico();
      });
  }   

  incrementarPagina(){
    if (this.pagina < this.totalPaginas) {
      this.pagina++;      
    }
  }

  decrementarPagina(){
    if(this.pagina > 1){
      this.pagina--;      
    }
  }

}
