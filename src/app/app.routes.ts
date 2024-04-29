import { Routes } from '@angular/router';
import { HomePagesComponent } from './modules/home/pages/home-pages/home-pages.component';
import { LoginPagesComponent } from './modules/auth/login/login-pages/login-pages.component';
import { RegistesPagesComponent } from './modules/auth/register/registes-pages/registes-pages.component';
import { TematicaPagesComponent } from './modules/tematica/pages/tematica-pages/tematica-pages.component';
import { AdminPagesComponent } from './modules/admin/pages/admin-pages/admin-pages.component';
import { ContenidoPagesComponent } from './modules/contenido/pages/contenido-pages/contenido-pages.component';
import { LecturaPagesComponent } from './modules/lectura/pages/lectura-pages/lectura-pages.component';
import { CategoriasPagesComponent } from './modules/categorias/pages/categorias-pages/categorias-pages.component';
import { adminGuard } from './core/guards/admin.guard';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginPagesComponent
    },
    {
        path: 'register',
        component: RegistesPagesComponent
    },
    {
        path: '',
        component: HomePagesComponent,
        children: [
            {
                path: '',
                // canActivate: [AuthGuard],
                component: TematicaPagesComponent,               
            },
            {
                path: 'categorias/:id',
                component: CategoriasPagesComponent,               
            },
            {
                path: 'contenidos/:id',
                // canActivate: [AuthGuard],
                component: ContenidoPagesComponent,              
            },
            {
                path: 'lectura/:id',
                canActivate: [AuthGuard],
                component: LecturaPagesComponent
            },
            {
                path: 'admin',
                canActivate: [adminGuard],
                component: AdminPagesComponent
            }
        ]
    }
];
