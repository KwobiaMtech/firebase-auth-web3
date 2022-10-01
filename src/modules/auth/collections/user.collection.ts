import { Collection } from 'fireorm';

@Collection()
export class User {
  id!: string;
  idNumber: number;
  dateOfBirth: Date;
}
