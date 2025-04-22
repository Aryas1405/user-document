import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}


export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}