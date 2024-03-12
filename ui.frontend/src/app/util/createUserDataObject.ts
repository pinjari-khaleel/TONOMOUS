import { User } from '../data/interface/User';

export const createUserDataObject = (formData: any) => {
  const user: User = {};
  for (let keyValuePair of formData.entries()) {
    const [key, value] = keyValuePair;

    if (typeof value === 'string' && value !== '') {
      user[key] = value;
    }
  }

  return user;
};
