import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import CounterContainer from './CounterContainer'

function Counter() {
   let counter = CounterContainer.useContainer();
  return (
      <View className='index'>
            <AtButton onClick={counter.decrement}>-</AtButton>
            <Text>{counter.count} </Text>
            <AtButton onClick={counter.increment}>+</AtButton>
      </View>
    );
}

export default Counter;
