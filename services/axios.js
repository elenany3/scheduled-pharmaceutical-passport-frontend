import axios from 'axios';

const baseUrlSecurity = 'http://localhost:8080/';

export const Post_Request = (url, body, type) => {
  let token = '';
  const userData = JSON?.parse?.(localStorage?.getItem?.('userData'));
  if(type != 'login'){
    token = userData.token;
  }
  return axios.post(`${baseUrlSecurity}${url}`, body, {
    headers: {
      Authorization: token,
    },
  });
};

export const Delete_Request = (url, body) => {
  let token = '';
  const userData = JSON?.parse?.(localStorage?.getItem?.('userData'));
  if(userData)
  token = userData.token;
  return axios.delete(`${baseUrlSecurity}${url}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const Put_Request = (url, body) => {
  let token = '';
  const userData = JSON?.parse?.(localStorage?.getItem?.('userData'));
  if(userData)
  token = userData.token;
  return axios.put(`${baseUrlSecurity}${url}`, body, {
    headers: {
      Authorization: token,
    },
  });
};

export const Get_Request = (url) => {
  let token = '';
  const userData = JSON?.parse?.(localStorage?.getItem?.('userData'));
  if(userData)
    token = userData.token;
    return axios.get(`${baseUrlSecurity}${url}`, {
      headers: {
        Authorization: token,
      },
    }); 
};
