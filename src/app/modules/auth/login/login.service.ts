import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../../core/interfaces/Usuario.interface';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(usuario: Usuario){
    return this.http.post<any>(`${url}/auth/login`, usuario);
  }

}
