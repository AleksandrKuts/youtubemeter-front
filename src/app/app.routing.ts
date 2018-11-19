import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { VideoMetricsComponent } from './view/video/videometrics.component';
import { VideoPlayListComponent } from './view/playlist/playlist.component';
import { AboutComponent } from './about/about.component';


const appRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'video',
        component: VideoMetricsComponent
    },
    {
        path: 'playlist',
        component: VideoPlayListComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: '',
        redirectTo: '/playlist',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/playlist',
        pathMatch: 'full'
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot( appRoutes );
