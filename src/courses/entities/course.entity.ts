import { AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Course extends Model {
  @Column
  @PrimaryKey
  @AutoIncrement
  id: number;

  @Column({unique: true})
  title: string;

  @Column({unique: true})
  description: string;


}