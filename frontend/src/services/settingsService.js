import API from './api';

export const updatePrivacySettings = async (privacyData) => {
  const { data } = await API.put('/settings/privacy', privacyData);
  return data;
};

export const updateTheme = async (theme) => {
  const { data } = await API.put('/settings/theme', { theme });
  return data;
};

export const setupTwoFactor = async (enable) => {
  const { data } = await API.put('/settings/security', { enable });
  return data;
};

export const getActivityHistory = async () => {
  const { data } = await API.get('/settings/activity');
  return data;
};

export const getBlockedUsers = async () => {
  const { data } = await API.get('/settings/blocked-users');
  return data;
};

export const unblockUser = async (id) => {
  const { data } = await API.delete(`/settings/unblock-user/${id}`);
  return data;
};
