import API from './api';

export const updateProfile = async (profileData) => {
  const { data } = await API.put('/users/update-profile', profileData);
  return data;
};

export const changeEmail = async (emailData) => {
  const { data } = await API.put('/users/change-email', emailData);
  return data;
};

export const changePassword = async (passwordData) => {
  const { data } = await API.put('/users/change-password', passwordData);
  return data;
};

export const deleteAccount = async (password) => {
  const { data } = await API.delete('/users/delete-account', { data: { password } });
  return data;
};
