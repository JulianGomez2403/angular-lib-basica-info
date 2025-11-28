import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private permissionService: PermissionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

      const screenId = route.firstChild?.data['screenId'];

      if (!screenId) {
        return true;
      }

      const hasView = this.permissionService.canView(screenId);

      if (!hasView) {
        this.router.navigate(['/home.xhtml']);
        return false;
      }
      return hasView;
    }

}
