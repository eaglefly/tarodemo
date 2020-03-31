import axios from 'taro-axios';

class Axios {
    public header = {}
    public API_PATH  = ''; // '/om'
    public setHeaders ( header:{}) {
        axios.defaults.headers = header;
    }
    public setApiPath (apiPath:string){
        this.API_PATH = apiPath;
    }
    public  get(url:string,params?:{},config?:{}) {
        return axios.get( url, params || config);
    }
    public  post(url:string,params?:{},config?:{}){
        return axios.post( url,params,config);
    }

}
export default (new Axios());
