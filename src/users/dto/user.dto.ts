import { AutoMap } from "@automapper/classes";
import { Role } from "../../auth/enums/role.enum";

export class UserDto{
    @AutoMap()
    username: string;

    @AutoMap()
    role: Role;

    subordinates: UserDto[];
}