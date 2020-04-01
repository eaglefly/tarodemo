import { createContext } from '@tarojs/taro'
import { observable, action } from 'mobx'
import { getUser,auth } from '../services/demo';


class Index {
  @observable
  count = 0;

  @action.bound
  increment(){
    return this.count -= 1;
  }
  @action.bound
  decrement(){
    return this.count += 1;
  }
  @action.bound
  getUser(id:number){
     return getUser(id);
  }
  @action.bound
  auth(login){
    return auth(login);
  }
}

export default createContext(new Index());
