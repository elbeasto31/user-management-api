import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SaltRounds } from './constants/jwt.constants';
import { Role } from './enums/role.enum';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AUTH_ERRORS } from '../constants/errors.constants';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService) { }

    async signIn({ username, password }: LoginDto) {
        const user = await this.userRepository.findOne({ where: { username: username } });

        if (!user || !await bcrypt.compare(password, user?.password))
            throw new BadRequestException(AUTH_ERRORS.NoSuchUser);

        return await this.generateJwt(user.username, user.role)
    }

    async signUp({ username, password, role, bossName, subordinates }: RegisterDto) {
        const user = await this.userRepository.findOne({ where: { username: username } });
        
        if (user)
            throw new BadRequestException(AUTH_ERRORS.UserAlreadyExists);

        let boss: User;
        if (role != Role.Admin) {
            boss = await this.userRepository.findOne({ where: { username: bossName, role: In([Role.Admin, Role.Boss]) } });

            if (!boss || !bossName)
                throw new BadRequestException(AUTH_ERRORS.NoSuchBoss);
        }

        let subs: User[]
        if(role != Role.User){
            subs = await this.userRepository.find({ where: { username: In(subordinates) } });
        }

        const payload: User =
        {
            username: username,
            password: await this.saltPassword(password),
            boss: boss,
            role: role,
            subordinates: subs
        };
        await this.userRepository.save(payload);

        return await this.generateJwt(username, role)
    }

    async generateJwt(userName: string, userRole: Role) {
        return {
            access_token: await this.jwtService.signAsync({ username: userName, role: userRole }),
        };
    }

    async saltPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(SaltRounds);
        return await bcrypt.hash(password, salt);
    }
}
