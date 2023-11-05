import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Email {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  code: string;

  @ApiProperty()
  @Column()
  attempts: number;
}
