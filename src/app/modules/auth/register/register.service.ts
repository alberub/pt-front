import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../../core/interfaces/Usuario.interface';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  registro(usuario: Usuario){
    return this.http.post<any>(`${url}/usuarios/crearUsuario`, usuario)
  }

}
