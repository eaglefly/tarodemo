import { createI18n } from '@i18n-chain/taro';
import en from './locales/en';
import zh from "./locales/zh";

const i18n = createI18n({
    defaultLocale: {
        key: 'en',
        values: en,
    },
    loader: (name) => import(`./locales/${name}`),
});
i18n._.define('zh', zh).locale('en');

export default i18n;
