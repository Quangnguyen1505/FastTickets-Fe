import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const register = (email, password, controller) => {
  const body = {
    name: "quang1",
    email: email,
    password: password,
  };
  console.log("body:: ", body)
  const url = `${baseUrl}/v1/api/access/register`;
  return axios.post(url, body, {
    signal: controller.signal,
  });
};

export const login = (email, password, controller) => {
  const body = {
    email: email,
    password: password,
  };
  const url = `${baseUrl}/v1/api/access/login`;
  return axios.post(url, body, {
    signal: controller.signal,
  });
};

export const checkEmail = (email) => {
  const body = {
    email: email,
  };
  const url = `${baseUrl}/auth/forgot-password`;
  return axios.post(url, body);
};

export const resetPassword = (id, newPassword, confirmPassword) => {
  const body = {
    newPassword: newPassword,
    confirmPassword: confirmPassword,
  };
  const url = `${baseUrl}/auth/reset-password/${id}`;
  return axios.post(url, body);
};

export const checkId = (id) => {
  const url = `${baseUrl}/auth/reset-password/${id}`;
  return axios.get(url);
};

export const logout = (token, userId, controller) => {
  const url = `${baseUrl}/v1/api/access/logout`;
  return axios.get(
    url,
    {
      signal: controller.signal,
      headers: { 
        authorization: `Bearer ${token}`,
        "x-client-id": userId,
      },
    }
  );
};
