import {AtButton} from "taro-ui";
import { observer } from '@tarojs/mobx';
import Taro,{useState,useEffect,useContext} from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import './index.scss'
import i18n from "../../i18n";
// import jsonPath from '../../jsonpath';
import store from '../../store/index'
import TsBase64 from '../../util/TsBase64';

var jq = require('jsonpath');

const Index =()=> {

  const { count, increment, decrement, getUser,auth } = useContext(store) as any;


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
    const c1 = TsBase64.Encode('123456');
    console.log(c1);
    console.log(TsBase64.Decode(c1));

    const json = [
      {
        nation: '中国',
        languages: [
          {
            text: '简体中文',
            value: 'zh-CN'
          },
          {
            text: 'English',
            value: 'en-CN'
          }
        ]
      },
      {
        nation: '美国',
        languages: [
          {
            text: 'English',
            value: 'en-US'
          }
        ]
      },
      {
        nation: '香港',
        languages: [
          {
            text: '繁體中文',
            value: 'cn-HK'
          },
          {
            value: 'en-HK'
          }
        ]
      },
      {
        nation: '日本',
        languages: [
          {
            text: 'English',
            value: 'en-JP'
          }
        ]
      }
    ];
              

    const s = jq.value(json,"$[?(@.nation == '中国')].languages");
    console.log(s);
    getUser(1).then(res=>console.log(res.data));
    auth({username:'1',password:'123'}).then(res=>console.log(res.data));
    i18n._.locale('zh');
  };

  return (
    <View>
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
