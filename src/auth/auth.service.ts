import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/utills/contant';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async register(name: string, email: string, password: string) {
        const userExist = await this.userService.getByEmail(email);
        if (userExist) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.userService.createUser({ name, email, password: hashedPassword, role: UserRole.ADMIN })
        return { message: 'User registered successfully', userId: user.id };
    }

    async login(email: string, password: string) {
        const user = await this.userService.getByEmail(email);
        if (!user) {
            throw new Error('User does not exists');
        }
        const isValidpwd = await bcrypt.compare(password, user.password)
        if (!isValidpwd) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({ sub: user.id, role: user.role }, {
            secret: process.env.JWT_SECRET, // Ensure secret is passed here
            expiresIn: '1h',
        });
        return { access_token: token };
    }
}
