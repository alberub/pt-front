import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalGenericoComponent } from '../../../../shared/components/modal-generico/modal-generico.component';
import { ModalService } from '../../../../shared/services/modal.service';
import { SocketService } from '../../../../shared/services/socket.service';

@Component({
  selector: 'app-home-pages',
  standalone: true,
  imports: [RouterModule, CommonModule, ModalGenericoComponent],
  templateUrl: './home-pages.component.html',
  styleUrl: './home-pages.component.css'
})
export class HomePagesComponent implements OnInit {

  sidebarState: boolean = false;
  toastSatate: boolean = false;
  private sub$: Subscription = new Subscription();
  rutas: any[] = [];
  mensaje: string = '';

  constructor(private router: Router, public modalService: ModalService, private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.socket.on('nuevo-contenido', (payload) => {
      this.eventoContenido(payload);
    });
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.modalService.cerrarConEscape();
  }

  toggleSidebar(){
    this.sidebarState == true ?
    this.sidebarState = false :
    this.sidebarState = true;    
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');    
  }

  eventoContenido(payload: any){
    const { data } = payload;
    console.log(payload);
    this.mensaje = `El usuario ${data.creditos.username} ha agregado contenido a la categoría ${data.categoria.nombre} en la Temática ${data.tematica.nombre}.`;    
  }

  cerrarToast(){
    this.mensaje = '';
  }

}
