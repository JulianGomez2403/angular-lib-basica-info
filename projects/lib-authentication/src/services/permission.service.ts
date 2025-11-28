import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly STORAGE_KEY = 'user_permissions';

  getPermissions(screenId: string): string[] {
    const raw = sessionStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw)[screenId] ?? [] : [];
  }

  canView(screenId: string): boolean {
    return this.getPermissions(screenId).includes('C');
  }

  canCreate(screenId: string): boolean {
    return this.getPermissions(screenId).includes('A');
  }

  canEdit(screenId: string): boolean {
    return this.getPermissions(screenId).includes('M');
  }

  canDelete(screenId: string): boolean {
    return this.getPermissions(screenId).includes('B');
  }
}
