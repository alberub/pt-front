import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() { }

  socket = io('http://localhost:3000', {
    autoConnect: true, 
    withCredentials: true,
    'extraHeaders':{
      'bearer': sessionStorage.getItem('token') || ''
    }
  });

}
