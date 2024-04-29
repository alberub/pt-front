import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Categoria } from '../../core/interfaces/Categoria.interface';
import { ApiResponse } from '../../core/interfaces/ApiResponseArr.interface';
import { BehaviorSubject, Observable, map } from 'rxjs';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private obs$ = new BehaviorSubject<string>('');
  
  constructor(private http: HttpClient) { }

  getMiObservable(): Observable<string> {
    return this.obs$.asObservable();
  }

  emitirNuevoValor(valor: any) {
    this.obs$.next(valor);
  }

  getCategorias(){
    return this.http.get<ApiResponse>(`${url}/categorias/obtenerCategorias`)
      .pipe(        
        map( res => {
          return res.data as Array<Categoria>
        })
      )
  }

  crearCategoria(nombre: string, archivo: File){
    const formData = new FormData();
    formData.append('icono', archivo);
    formData.append('nombre', nombre)
    return this.http.post<any>(`${url}/categorias/crearCategoria`, formData);
  }

}
