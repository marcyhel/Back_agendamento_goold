import { Address } from "./Address.interface";
import { User } from "./User.interface";

interface Auth {
  email: string;
  password: string;
}

interface SignUp {
  user: User;
  address: Address;
  password: string;
  confirmPassword: string;
}

export { Auth, SignUp };
