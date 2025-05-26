import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const getAllVouchersByUserId = async (userId, accessToken) => {
  try {
    const response = await axios.get(`${baseUrl}/v1/api/discount/users/${userId}`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        "x-client-id": userId,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    throw error;
  }
};

export const getAllVouchers = async (userId, accessToken) => {
  try {
    const response = await axios.get(`${baseUrl}/v1/api/discount`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        "x-client-id": userId,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all vouchers:", error);
    throw error;
  }
};

export const claimVoucher = async (userId, accessToken, voucherId) => {
  try {
    const response = await axios.post(`${baseUrl}/v1/api/discount/${voucherId}/users-claims/${userId}`, {
      voucherId,
    }, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        "x-client-id": userId,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error claiming voucher:", error);
    throw error;
  }
}
