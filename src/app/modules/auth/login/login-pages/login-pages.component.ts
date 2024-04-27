import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Usuario } from '../../../../core/interfaces/Usuario.interface';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-pages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-pages.component.html',
  styleUrl: './login-pages.component.css'
})
export class LoginPagesComponent implements OnInit {

  loginForm!: FormGroup;
  errMsg: string = '';
  hasErr: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  login(){
    if (this.loginForm.valid) {
      const usuario: Usuario = {
        username: this.loginForm.value.username,
        email: this.loginForm.value.email,
        role: '',
        fechaCreacion: new Date
      }

      this.loginService.login(usuario)
        .subscribe( res => {
          console.log(res);     
          sessionStorage.setItem('token', res.token);   
          sessionStorage.setItem('userId', res.usuario.uid);
          this.router.navigateByUrl('')
        }, err => {
          console.log(err.error.error);
          this.errMsg = err.error.error;
          this.hasErr = true;
        });
    
    }
  }

  irRegistro(){
    this.router.navigateByUrl('/register')
  }

  cerrarToast(){
    this.hasErr = false;
  }

}
