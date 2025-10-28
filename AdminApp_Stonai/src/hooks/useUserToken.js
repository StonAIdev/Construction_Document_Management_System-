import { useState } from 'react';

export default function useUserToken() {
  const getUser = () => {
    const val = localStorage.getItem('user');
    const userToken = JSON.parse(val);
    return userToken;
  };
  const [user, setUser] = useState(getUser());

  const saveUserToken = (userToken) => {
    localStorage.setItem('user', JSON.stringify(userToken));
    setUser(userToken);
  };
  return {
    setUser: saveUserToken,
    user
  };
}
