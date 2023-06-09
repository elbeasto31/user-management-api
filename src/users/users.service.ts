import { BadRequestException, Injectable } from '@nestjs/common';
import { ChangeBossDto } from './dto/changeBoss.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtDto } from '../auth/dto/jwt.dto';
import { In, Repository } from 'typeorm';
import { Role } from '../auth/enums/role.enum';
import { User } from '../auth/entities/user.entity';
import { USERS_ERRORS } from '../constants/errors.constants';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectMapper()
        private readonly mapper: Mapper) { }

    async getUsers(jwtDto: JwtDto): Promise<UserDto[]> {

        let users: User[];

        if (jwtDto.role === Role.Admin)
            users = await this.userRepository.find({ relations: ['subordinates', 'subordinates.subordinates'] });
        else if (jwtDto.role === Role.Boss) {
            const boss = await this.userRepository.findOne({ where: { username: jwtDto.username }, relations: ['subordinates'] });
            const subordinates = await this.userRepository.find({ where: { role: Role.User } });

            users = [boss, ...subordinates];
        }
        else {
            users = [await this.userRepository.findOne({ where: { username: jwtDto.username }, relations: ['subordinates'] })];
        }

        return await this.mapper.mapArrayAsync(users, User, UserDto);
    }

    async changeBoss({ username, newBoss }: ChangeBossDto, jwtDto: JwtDto): Promise<void> {
        const user = await this.userRepository.findOne({ where: { username: username }, relations: ['boss'] });

        if (user.boss.username !== jwtDto.username)
            throw new BadRequestException(USERS_ERRORS.WrongBoss);

        const boss = await this.userRepository.findOne({ where: { username: newBoss, role: In([Role.Admin, Role.Boss]) } });

        if (!boss)
            throw new BadRequestException(USERS_ERRORS.NewBossNotFound);

        await this.userRepository.save({ ...user, boss: boss });
    }
}

