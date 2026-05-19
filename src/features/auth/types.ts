export type Message = {
  type: "success" | "error";
  text: string;
};

export type SignupFormData = {
  name: string;
  email: string;
  password: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type LoginResponse = {
  message: string;
  user: AuthUser;
  accessToken: string;
};
