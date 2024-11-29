import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
interface data{
  id: string
  email: string
}
export const jwtDecode = () => {
  const token = Cookies.get('user');
  if (token) {
    const data = jwt.decode(token) as data; 
    
    return data;
  } else {
    
    return null;
  }
};
export const signup_token = (token:string) => {
  const data = jwt.decode(token)
  return data
}
