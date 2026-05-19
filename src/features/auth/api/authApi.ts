import type { LoginFormData, LoginResponse, SignupFormData } from "../types";

const postData = async <TResponse, TBody>(url: string, body: TBody) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data as TResponse;
};

export const signupUser = (formData: SignupFormData) =>
  postData("/api/auth/register", formData);

export const loginUser = (formData: LoginFormData) =>
  postData<LoginResponse, LoginFormData>("/api/auth/login", formData);
