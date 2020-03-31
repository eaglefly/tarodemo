import { createContext } from '@tarojs/taro'
import { observable, action, decorate } from 'mobx'
import { getUser,auth,Login } from '../services/demo';


class Index {
  count = 0;
  increment(){
    return this.count -= 1;
  }
  decrement(){
    return this.count += 1;
  }
  getUser(id:number){
     return getUser(id);
  }
  auth(login:Login){
    return auth(login);
  }
}
decorate(Index, {
  count: observable,
  increment: action.bound,
  decrement: action.bound,
  getUser: action.bound,
  auth: action.bound
});

export default createContext(new Index());
