import Axios,{API_PATH} from './index';

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
