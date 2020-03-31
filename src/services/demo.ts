import Axios from './index';

const API_PATH = Axios.API_PATH;
const getUser = async (id:number)=>{
    return Axios.get(API_PATH + `/user/${id}`)
};
export interface Login {
  username:string;
  password:string;
}
const auth = async (login:Login)=>{
  return Axios.post(API_PATH +  `/login`,login)
};
export {
  getUser,
  auth
}
