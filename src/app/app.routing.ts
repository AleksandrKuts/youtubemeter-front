import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { VideoMetricsComponent } from './view/video/videometrics.component';
import { VideoPlayListComponent } from './view/playlist/playlist.component';
import { VideoAllComponent } from './view/videoall/videoall.component';
import { AboutComponent } from './about/about.component';
import { AuthGuard } from './admin/auth.guard';

const appRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'videos',
        component: VideoAllComponent
    },
    {
        path: 'video',
        component: VideoMetricsComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'playlist',
        component: VideoPlayListComponent
    },
    {
        path: '',
        redirectTo: '/videos',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/videos',
        pathMatch: 'full'
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot( appRoutes,
        { enableTracing: true }  );
