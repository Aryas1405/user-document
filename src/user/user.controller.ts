import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ListUser, UpdateUser } from './dto/user.dto';
import {AuthGuard} from './../middleware/auth.guard';
import {RoleGuard} from './../middleware/role.guard';
import { Roles } from 'src/middleware/roles.decorator';
import { UserRole } from 'src/utills/constant';

@UseGuards(AuthGuard, RoleGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Put('/update/:id')
    @Roles(UserRole.ADMIN)
    register(@Param('id')id:number,@Body() body: UpdateUser) {
        return this.userService.updateUser(id,body)
    }

    @Get('/list')
    @Roles(UserRole.ADMIN,UserRole.VIEWER)
    login(@Query() query:ListUser) {
        return this.userService.listUser(query)
    }
}
