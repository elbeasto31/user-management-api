import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangeBossDto } from './dto/changeBoss.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtDto } from 'src/auth/dto/jwt.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { USERS } from '../constants/endpoints.constants';

@Controller(USERS.ControllerRoute)
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get()
    @UseGuards(AuthGuard)
    getUsers(@Req() request) {
        return this.userService.getUsers(request.user as JwtDto);
    }

    @Post(USERS.ChangeBoss)
    @UseGuards(RolesGuard)
    @Roles(Role.Boss, Role.Admin)
    changeBoss(@Body() changeBossDto: ChangeBossDto, @Req() request) {
        return this.userService.changeBoss(changeBossDto, request.user as JwtDto);
    }
}