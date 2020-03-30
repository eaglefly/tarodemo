import { createContext } from '@tarojs/taro'
import { observable, action, decorate } from 'mobx'

class Index {
  count = 0;
  increment(){
    return this.count -= 1;
  }
  decrement(){
    return this.count += 1;
  }

}
decorate(Index, {
  count: observable,
  increment: action.bound,
  decrement: action.bound
})

export default createContext(new Index())
