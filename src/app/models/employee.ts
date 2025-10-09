export interface Employee {
  id: number;
  name: string;
  designation: string;
  department: string;
  dateOfJoining: Date;
  profilePhotoUrl: string;
  email?: string; // optional
  dateOfBirth?: Date; // optional
}
