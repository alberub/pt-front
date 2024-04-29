import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ContenidoService } from '../../../../shared/services/contenido.service';
import { Contenido } from '../../../../core/interfaces/Contenido.interface';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

enum tipoArchivo{
    imagenes = 1, 
    videos   = 2, 
    texto    = 3
}

@Component({
  selector: 'app-lectura-pages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lectura-pages.component.html',
  styleUrl: './lectura-pages.component.css'
})
export class LecturaPagesComponent implements OnInit {

  contenido!: Contenido;
  tipoArchivo: string = "";
  safeUrl!: SafeResourceUrl;
  texto: string = "https://res.cloudinary.com/firstproject/raw/upload/v1714113814/wmfnprhnjz8tjuzxzgw6"; 

  constructor(private ruta: ActivatedRoute, private contenidoService: ContenidoService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.ruta.params.subscribe( (res: any) => {      
      this.obtenerContenido(res.id);
    });

  }

  obtenerContenido(uid: string){
    this.contenidoService.getArchivoPorId(uid)
      .subscribe( (contenido: Contenido) => {
        this.contenido = contenido;     
        this.tipoArchivo = contenido.categoria.nombre;
        if (contenido.categoria.nombre === 'videos') {
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.convertToEmbedUrl(contenido.url));
        }

        if (contenido.categoria.nombre === 'texto') {
          this.getArchivoTexto(contenido.url);
        }
      })
  }

  private convertToEmbedUrl(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];
      return `https://www.youtube.com/embed/${videoId}`;
    } else {
      console.error('Error al extraer identificador de YouTube.');
      return '';
    }
  }

  getArchivoTexto(url: string){
    this.contenidoService.getArchivoTexto(url)
      .subscribe( res => {
        this.texto = res;
      })
  }

}
