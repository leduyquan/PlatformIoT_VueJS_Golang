
import BaseService from './configure/base.service';

class UserService extends BaseService {
  constructor() {
    super();
  }

  getUsers() {
    this.requestUrl = `${this.baseApiUrl}/admin/account/users`;
    return this.get();
  }

  createUser(body) {
    this.requestUrl = `${this.baseApiUrl}/admin/account/users`;
    return this.post(body);
  }

  updateUser(body, id) {
    this.requestUrl = `${this.baseApiUrl}/admin/account/users/${id}`;
    return this.put(body);
  }
}

export default new UserService;