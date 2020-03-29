import {AtButton} from "taro-ui";
import axios from 'taro-axios'
import Taro,{useState,useEffect} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import CounterContainer from './CounterContainer';
import Counter from './Counter';
import i18n from "../../i18n";

const Index =()=> {
  const message = i18n.profile.info({
    name: 'Tom',
  });

  const [locale, setLocale] = useState('en');

  useEffect(() => {
    return i18n._.listen(setLocale);
  }, []);

  const switchToEnglish = () => {
    i18n._.locale('en');
  };

  const switchToChinese = () => {
    axios("/api").then(res=>console.log(res.data));
    i18n._.locale('zh');
  };

  return (
    <View>
      <Text>Hello world!</Text>
      <Text>{message} </Text>
      <Text>{locale} </Text>
      <AtButton onClick={switchToEnglish}>English</AtButton>
      <AtButton onClick={switchToChinese}>中文</AtButton>
      <CounterContainer.Provider initialState={10}>
        <Counter />
      </CounterContainer.Provider>
    </View>
  )
};
Index.config = {
  navigationBarTitleText: '首页'
};
export default Index;
