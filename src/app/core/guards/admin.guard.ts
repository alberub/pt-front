import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../../shared/services/usuario.service';
import { tap } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {

  const user = inject(UsuarioService);
  const router = inject(Router);

  return user.validaRol()
    .pipe(
      tap( esAdmin => {
        if (!esAdmin) {
          router.navigateByUrl('');
        }
      })
    )
};
