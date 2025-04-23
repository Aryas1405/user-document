import { IsNumber, IsString } from 'class-validator';
import { UserRole } from 'src/utills/constant';

export class UpdateDocument {
    @IsString()
    name?: string;
}


export class ListDocument {
    @IsString()
    search: string;

    @IsString()
    role: UserRole;

    @IsNumber()
    limit:number;

    @IsNumber()
    offset:number;
}

export class AskQuestion {
    @IsString()
    question: string;
}
