import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AUTH_ERRORS } from "../../constants/errors.constants";

@Injectable()
export class AuthHelper {
    constructor(private jwtService: JwtService) { }

    getAuthHeaderToken(request): string {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith(process.env.JWT_TYPE)) {
            throw new UnauthorizedException(AUTH_ERRORS.WrongCreds);
        }

        return authHeader.split(' ')[1];
    }

    verifyTokenAndGetUser(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (err) {
            throw new UnauthorizedException(AUTH_ERRORS.WrongCreds);
        }
    }
}