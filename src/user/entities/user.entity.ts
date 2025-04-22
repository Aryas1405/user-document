import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIEWER = 'viewer',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    name:string;

    @Column({nullable:false})
    email:string;

    @Column({nullable:false})
    password:string;
    
    @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER })
    role: UserRole;
}