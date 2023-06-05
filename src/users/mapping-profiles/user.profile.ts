import { Injectable } from "@nestjs/common";
import { User } from "../../auth/entities/user.entity";
import { UserDto } from "../dto/user.dto";
import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, User, UserDto,
                forMember((dest) => dest.subordinates,
                    mapFrom((x) => mapper.mapArray(x.subordinates ?? [], User, UserDto))));
        };
    }
}