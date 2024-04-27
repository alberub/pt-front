import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../../../core/interfaces/Usuario.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registes-pages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registes-pages.component.html',
  styleUrl: './registes-pages.component.css'
})
export class RegistesPagesComponent implements OnInit {

  registroForm!: FormGroup;
  errMsg: string = '';
  hasErr: boolean = false;

  constructor(private router: Router, private registroService: RegisterService) {}

  ngOnInit(): void {
    console.log('hola');
    
    this.registroForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      role: new FormControl('', Validators.required)
    })
  }

  registro(){
    console.log('vamos');
    
    if (this.registroForm.valid) {
      const usuario: Usuario = {
        username: this.registroForm.value.username,
        email: this.registroForm.value.email,
        role: this.registroForm.value.role,
        fechaCreacion: new Date()
      }

      this.registroService.registro(usuario)
        .subscribe( res => {
          this.router.navigateByUrl('login')
        }, err => {          
          this.errMsg = err.error.error;
          this.hasErr = true;
        })
    }
  }

  tieneCuenta(){
    this.router.navigateByUrl('login');
  }

  cerrarToast(){
    this.hasErr = false;
  }

}
