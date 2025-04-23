import { IsNumber, IsString } from 'class-validator';
import { UserRole } from 'src/utills/constant';

export class UpdateUser {
    @IsString()
    name?: string;

    @IsString()
    role?: UserRole;
}


export class ListUser {
    @IsString()
    search: string;

    @IsString()
    role: UserRole;

    @IsNumber()
    limit:number;

    @IsNumber()
    offset:number;
}