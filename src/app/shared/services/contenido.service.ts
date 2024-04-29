import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/interfaces/ApiResponseArr.interface';
import { BehaviorSubject, Observable, debounceTime, map } from 'rxjs';
import { NuevoContenido } from '../../core/interfaces/NuevoContenido.interface';
import { DataObserver } from '../../core/interfaces/DataObserver.interface';
import { Contenido } from '../../core/interfaces/Contenido.interface';
import { EditarContenido } from '../../core/interfaces/EditarContenido.interface';
import { ConsultaContenido } from '../../core/interfaces/ConsultaContenido.interface';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ContenidoService {

  private obs$ = new BehaviorSubject<DataObserver>({categoria:'', tematica: ''});
  public contenido$ = new BehaviorSubject<boolean>(false);
  public contenidoAct$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { }

  getMiObservable(): Observable<DataObserver> {
    return this.obs$.asObservable();
  }

  emitirNuevoValor(valor: any) {
    this.obs$.next(valor);
    sessionStorage.setItem('categoriaId', valor.categoria);
    sessionStorage.setItem('tematicaId', valor.tematica);
  }

  getContenido(categoria: string, tematica: string){
    return this.http.get<ApiResponse>(`${url}/contenidos/obtener/${categoria}/${tematica}/desc`)
      .pipe(
        map( res => res.data as Contenido[])
      )
  }

  crearContenido(data: NuevoContenido){
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('descripcion', data.descripcion);
    formData.append('creditos', data.creditos);
    formData.append('categoria', data.categoria);
    formData.append('tematica', data.tematica);
    formData.append('video_url', data.video_url);
    formData.append('archivo', data.archivo!);

    return this.http.post<ApiResponse>(`${url}/contenidos/crearContenido`, formData)
      .pipe(
        map( res => res.data as Contenido[] )
      )
  }

  actualizarContenido(contenido: EditarContenido){
    const formData = new FormData();
    formData.append('uid', contenido.uid);
    formData.append('titulo', contenido.titulo);
    formData.append('descripcion', contenido.desc);
    formData.append('video_url', contenido.video_url);
    formData.append('archivo', contenido.archivo!);
    return this.http.put<any>(`${url}/contenidos/actualizar`, formData)
  }

  getContenidoIndividual(uid: string){
    return this.http.get<{ok: boolean, data: any}>(`${url}/contenidos/obtenerContenidoIndividual/${uid}`)
      .pipe(
        map( res => res.data)
      )
  }

  buscarContenido(termino: string){
    return this.http.get<ApiResponse>(`${url}/contenidos/buscar/titulo/${termino}`)
      .pipe(
        debounceTime(2000),
        map( res => res.data as Contenido[])
      )
  }

  getArchivoPorId(uid: string){
    return this.http.get<{ok: boolean, data: Contenido}>(`${url}/contenidos/archivo/${uid}`)
      .pipe(
        map( res => res.data as Contenido)
      )
  }

  getArchivoTexto(urlArchivo: string){
    return this.http.post<string>(`${url}/contenidos/archivo/texto/consulta`, {'urlTexto': urlArchivo}, {responseType: 'text' as 'json'});
  }

  eliminarContenido(contenidoId: string){
    return this.http.delete<{ok: boolean, data: Contenido}>(`${url}/contenidos/eliminar/${contenidoId}`)
      .pipe(
        map( res => res.data as Contenido)
      )
  }

}
