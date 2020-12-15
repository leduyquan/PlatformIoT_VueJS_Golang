import API from './api';
import AppConstant from '../../helpers/constants/app';

class BaseService {
  constructor(){
    this.requestUrl = '';
    this.baseApiUrl = AppConstant.API_URL;
  }

  get(query) {
    return API.get(this.requestUrl, query);
  }

  post(body) {
    return API.post(this.requestUrl, body);
  }

  put(body) {
    return API.put(this.requestUrl, body);
  }

  delete(body) {
    return API.delete(this.requestUrl, body);
  }
}

export default BaseService;