import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AUTH } from '../constants/endpoints.constants';

@Controller(AUTH.ControllerRoute)
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post(AUTH.SignIn)
    signIn(@Body() authDto: LoginDto) {
        return this.authService.signIn(authDto);
    }

    @Post(AUTH.SignUp)
    singUp(@Body() registerDto: RegisterDto) {
        return this.authService.signUp(registerDto);
    }

}
