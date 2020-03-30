import {AtButton} from "taro-ui";
import { observer } from '@tarojs/mobx';
import axios from 'taro-axios'
import Taro,{useState,useEffect,useContext} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import i18n from "../../i18n";
// import jsonPath from '../../jsonpath';
import store from '../../store/index'

const Index =()=> {
  const { count, increment, decrement } = useContext(store)


  const message = i18n.profile.info({
    name: 'Tom',
  });

  const [locale, setLocale] = useState('zh');

  useEffect(() => {
    return i18n._.listen(setLocale);
  }, []);

  const switchToEnglish = () => {
    i18n._.locale('en');
  };

  const switchToChinese = () => {
    const headers = {
      'Accept-Language': 'zh-CN',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '',
      'Access-Control-Allow-Credentials': ''
    };
    axios.defaults.headers = headers;
    // axios.get("http://10.221.128.9:8280/tRetailAPI/config/validation").then((res)=>{
    //   const jres = jsonPath(res.data,'$.configProperties');
    //   console.log(jres);
    // });
    i18n._.locale('zh');
  };

  return (
    <View>
      <Text>Hello world!</Text>
      <Text>{message} </Text>
      <Text>{locale} </Text>
      <AtButton onClick={switchToEnglish}>English</AtButton>
      <AtButton onClick={switchToChinese}>中文</AtButton>

      <AtButton onClick={increment}>-</AtButton>
            <Text>{count} </Text>
      <AtButton onClick={decrement}>+</AtButton>

    </View>
  )
};
Index.config = {
  navigationBarTitleText: '首页'
};
export default observer(Index)
