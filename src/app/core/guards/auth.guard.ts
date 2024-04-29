import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../../shared/services/usuario.service';
import { tap } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {

  const user = inject(UsuarioService);  
  const router = inject(Router);
  
  return user.validaToken()
             .pipe(
              tap( esUsuario => {
                if (!esUsuario) {
                  router.navigateByUrl('/login');
                }
              })
             )
};
