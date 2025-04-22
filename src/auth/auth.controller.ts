import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('register')
    register(@Body() body:RegisterDto){
        return this.authService.register(body.name,body.email,body.password)
    }

    @Post('login')
    login(@Body() body:LoginDto){
        return this.authService.login(body.email,body.password)
    }
}
