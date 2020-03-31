import { createI18n } from '@i18n-chain/taro';
import en from './locales/en';
import zh from "./locales/zh";

const i18n = createI18n({
    defaultLocale: {
        key: 'zh',
        values: zh,
    }
    // loader: (name) => import(`./locales/${name}`),
});
i18n._.define('en', en).locale('zh');

export default i18n;
