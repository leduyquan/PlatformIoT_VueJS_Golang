
import BaseService from './configure/base.service';

class RoleService extends BaseService {
  constructor() {
    super();
  }

  getRoles() {
    this.requestUrl = `${this.baseApiUrl}/admin/account/roles`;
    return this.get();
  }

  getModules() {
    this.requestUrl = `${this.baseApiUrl}/admin/configuration/modules`;
    return this.get();
  }

  getRoleDetail(id) {
    this.requestUrl = `${this.baseApiUrl}/admin/account/roles/${id}`;
    return this.get();
  }

  createRole(body) {
    this.requestUrl = `${this.baseApiUrl}/admin/account/roles`;
    return this.post(body);
  }

  updateRole(body, id) {
    this.requestUrl = `${this.baseApiUrl}/admin/account/roles/${id}`;
    return this.put(body);
  }
}

export default new RoleService;