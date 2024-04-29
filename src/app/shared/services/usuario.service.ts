import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../core/interfaces/ApiResponseArr.interface';
import { catchError, map, of, tap } from 'rxjs';
import { Usuario } from '../../core/interfaces/Usuario.interface';
import { Usuario as UsuarioModel } from '../../core/models/Usuario';
import { Role } from '../../core/interfaces/Role.interface';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario!: UsuarioModel;

  constructor(private http: HttpClient) { }

  getUsuarios(){
    return this.http.get<ApiResponse>(`${url}/usuarios/obtenerUsuarios`)
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

  validaTokenUsuario(){
    return this.http.get<any>(`${url}/auth/renew`)
    .pipe(
      map(( res: any) => {
        const { email, fechaCreacion, role, uid, username } = res.usuario;
        this.usuario = new UsuarioModel(email, fechaCreacion, role, uid, username);
        sessionStorage.setItem('token', res.token);
        return true;
      })
    )
  }

  validaToken(){
    return this.http.get<any>(`${url}/auth/renew`)
      .pipe(
        map(( res: any) => {
          const { email, fechaCreacion, role, uid, username } = res.usuario;
          this.usuario = new UsuarioModel(email, fechaCreacion, role, uid, username);
          sessionStorage.setItem('token', res.token);
          return true;
        }), catchError( () => of(false))
      )
  }

  validaRol(){
    return this.http.get(`${url}/usuarios/verificarRole`)
      .pipe(
        map( (res) => {
          return true;
        }), catchError( () => of(false))
      )

  }

}
