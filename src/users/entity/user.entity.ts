import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ESex } from '../enum/sex.enum';
import { TAddress } from '../types';
import { ERoleDefault } from 'src/common/enum';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column({ select: false })
  password: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column({ type: String })
  lastName: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: ESex, default: ESex.OTHER })
  sex: string;

  @ApiProperty()
  @Column({ type: 'json' })
  address: TAddress;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  refreshToken: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: ERoleDefault, default: ERoleDefault.USER })
  role: string;
}
