import { UserRoles } from "../utilities/types";

export type LoginModel = {
  email: string;
  password: string;
};

export type RegisterModel = {
  email: string;
  password: string;
  role: UserRoles | undefined;
}
