import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISO_KEY } from '../decorators/requiere-permiso.decorator';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermiso = this.reflector.getAllAndOverride<string>(PERMISO_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermiso) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user || user.tipo !== 'empleado') {
      throw new ForbiddenException('Access denied: only employees can access this resource');
    }
    if (!user?.permisos || !Array.isArray(user.permisos)) {
      throw new ForbiddenException('Access denied: no permissions found');
    }

    if (!user.permisos.includes(requiredPermiso)) {
      throw new ForbiddenException(`Access denied: requires "${requiredPermiso}" permission`);
    }

    return true;
  }
}
