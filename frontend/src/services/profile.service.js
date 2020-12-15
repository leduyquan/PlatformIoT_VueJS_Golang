
import BaseService from './configure/base.service';

class ProfileService extends BaseService {
  constructor() {
    super();
  }

  getProfileDetail() {
    this.requestUrl = `${this.baseApiUrl}/profiles`;
    return this.get();
  }

  updateProfile(body) {
    this.requestUrl = `${this.baseApiUrl}/profiles`;
    return this.post(body);
  }

  changePassword(body) {
    this.requestUrl = `${this.baseApiUrl}/profiles/password/change`;
    return this.post(body);
  }
}

export default new ProfileService;