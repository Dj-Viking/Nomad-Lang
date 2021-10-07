
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  ManyToOne
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';

//this is now both an object type and an entity
@ObjectType()
@Entity()
export class Card extends BaseEntity {

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Field()
  @Column({ nullable: true })
  creatorId?: number;

  @Field()
  @Column({ nullable: true })
  frontSideText?: string;

  @Field()
  @Column({ nullable: true })
  frontSideLanguage?: string;

  @Field()
  @Column({ nullable: true })
  frontSidePicture?: string; //base 64 encoded??? not sure yet

  @Field()
  @Column( { nullable: true })
  backSideText?: string;
  
  @Field()
  @Column( { nullable: true })
  backSideLanguage?: string;

  @Field()
  @Column( { nullable: true })
  backSidePicture?: string;

  //not exposing the creator here
  @ManyToOne(() => User, user => user.cards, { onDelete: "CASCADE" })
  creator: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

}