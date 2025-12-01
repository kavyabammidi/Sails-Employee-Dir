export interface Employee {
  id: number;
  name: string;
  designation: string;
  department: string;
  dateOfJoining: Date;
  profilePhotoUrl: string;
  email: string;
  phone: string;
  age: number;
  address: {
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
  };
  dateOfBirth?: Date;
}