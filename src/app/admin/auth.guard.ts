import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BackEndService } from '../backend/backend.service';


@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(private backEndService: BackEndService, private router: Router) {}

  canActivate (): boolean {
    if ( this.backEndService.globalCounts ) {
        if ( !this.backEndService.globalCounts.listenadmin ) {
            this.router.navigateByUrl('/videos');
        }
        return this.backEndService.globalCounts.listenadmin;
    }

    this.router.navigateByUrl('/videos');
    return false;
  }

}
