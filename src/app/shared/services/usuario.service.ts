import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../core/interfaces/ApiResponseArr.interface';
import { map } from 'rxjs';
import { Usuario } from '../../core/interfaces/Usuario.interface';
import { Role } from '../../core/interfaces/Role.interface';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getUsuarios(){
    return this.http.get<ApiResponse>(`${url}/usuarios`)
            .pipe(
              map( res => res.data as Usuario[] )
            )
  }

  getRoles(){
    return this.http.get<ApiResponse>(`${url}/usuarios/roles`)
            .pipe(
              map( res => res.data as Role[] )
            )
  }

  actualizarUsuario(usuario: Usuario){
    return this.http.put(`${url}/usuarios/actualizar`, usuario);
  }

}
