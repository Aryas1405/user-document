import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Document {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    title:string;

    @Column({nullable:false})
    code:string;

    @Column({nullable:false})
    filePath:string;

    @Column({default:false})
    embeded:boolean;

}