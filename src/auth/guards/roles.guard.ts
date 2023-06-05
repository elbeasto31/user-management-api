import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { AuthHelper } from '../utils/auth.helper';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
        private authHelper: AuthHelper) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.authHelper.getAuthHeaderToken(request);

        const user = this.authHelper.verifyTokenAndGetUser(token);
        request.user = user;

        return requiredRoles.some((role) => user.role === role);
    }
}