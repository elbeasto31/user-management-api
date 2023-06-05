import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { AuthHelper } from "../utils/auth.helper";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authHelper: AuthHelper) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = this.authHelper.getAuthHeaderToken(request);
    request.user = this.authHelper.verifyTokenAndGetUser(token);

    return true;
  }
}