import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/interfaces/ApiResponseArr.interface';
import { map } from 'rxjs';
import { Tematica } from '../../core/interfaces/Tematica.interface';
import { NuevaTematica } from '../../core/interfaces/NuevaTematica.interface';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TematicaService {

  constructor(private http: HttpClient) { }

  getTematicas(){
    return this.http.get<ApiResponse>(`${url}/tematicas`)
      .pipe(
        map( res => {
          return res.data as Tematica[];
        })
      )
  }

  crearTematica(data: NuevaTematica, archivo: File){
    const formData = new FormData();

    data.archivos.forEach( el => {
      formData.append('archivos', el);
    });
    formData.append('nombre', data.nombre );    
    formData.append('imagen', archivo );
    return this.http.post<ApiResponse>(`${url}/tematicas/crearTematica`, formData)
  }

  buscarTematica(termino: string){
    return this.http.get<ApiResponse>(`${url}/tematicas/buscar/${termino}`)
      .pipe(
        map( res => res.data as Tematica[])
      )
  }

  getTematicaPorId(tematicaId: string){
    return this.http.get<ApiResponse>(`${url}/tematicas/buscarPorId/${tematicaId}`)
      .pipe(
        map( res => res.data[0])
      )
  }

}
