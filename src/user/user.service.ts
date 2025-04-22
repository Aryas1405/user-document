import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';


interface IUser {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

interface FilterData {
    limit: number;
    offset: number;
    search: string;
    role: UserRole;
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async getByEmail(email: string): Promise<User | null> {
        const user = await this.userRepo.findOne({ where: { email } });
        return user;
    }

    async createUser(data: IUser): Promise<User> {
        const user = this.userRepo.create(data);
        const savedUser = await this.userRepo.save(user);
        console.log(savedUser)
        return savedUser;
    }

    async updateUser(id: number, data: Partial<IUser>): Promise<User> {
        const userExist = await this.userRepo.findOne({ where: { id } });
        if (!userExist) {
            throw new BadRequestException('User not exist !!')
        }
        if(data.email){
            throw new BadRequestException('Email can not be updated')
        }
        const userData = Object.assign(userExist,data)
        return await this.userRepo.save(userData);
    }

    async listUser(filter: FilterData): Promise<{users:User[],count:number}> {
        const orConditions: FindOptionsWhere<User>[] = [];
        const andConditions: Partial<User> = {};
      
        // OR condition: name OR email
        if (filter?.search) {
          orConditions.push({ name: ILike(`%${filter.search}%`) });
          orConditions.push({ email: ILike(`%${filter.search}%`) });
        }
      
        // AND condition: role
        if (filter?.role) {
          andConditions.role = filter.role;
        }
        let whereQuery: FindOptionsWhere<User>[] | FindOptionsWhere<User> | undefined;
      
        if (orConditions.length > 0) {
            // Apply AND to each OR condition
            whereQuery = orConditions.map((condition) => ({
              ...condition,
              ...andConditions,
            }));
          } else if (Object.keys(andConditions).length > 0) {
            // Only AND filters
            whereQuery = andConditions;
          }
        const [users,count] = await this.userRepo.findAndCount({
            where: whereQuery,
            skip: filter?.offset ?? 0,
            take: filter?.limit ?? 10
        });
        return {count,users};
    }
}
