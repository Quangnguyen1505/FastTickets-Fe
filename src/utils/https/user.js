import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const getProfile = (token, userId, controller) => {
  const url = `${baseUrl}/v1/api/users/profile`;
  return axios.get(url, {
    signal: controller.signal,
    headers: { 
      authorization: `Bearer ${token}`,
      "x-client-id": userId,
    },
  });
};

export const editProfile = (
  userId,
  token,
  first_name,
  last_name,
  phone,
  image,
  controller
) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("first_name", first_name);
  formData.append("last_name", last_name);
  formData.append("phone", phone);
  const url = `${baseUrl}/v1/api/users`;
  return axios.put(url, formData, {
    data: formData,
    signal: controller.signal,
    headers: { 
      authorization: `Bearer ${token}`,
      "x-client-id": userId,
    },
  });
};

export const editPassword = (
  userId,
  token,
  { newPassword, confirmPassword, oldPassword },
  controller
) => {
  const body = {
    old_password: oldPassword,
    new_password: newPassword,
  };
  
  const url = `${baseUrl}/v1/api/users/change-password`;
  return axios.put(url, body, {
    signal: controller.signal,
    headers: { 
      authorization: `Bearer ${token}`,
      "x-client-id": userId,
    },
  });
};
