
import BaseService from './configure/base.service';

class SystemSettingsService extends BaseService {
  constructor() {
    super();
  }
  
  //Setting Agent
  getAgentSettings() {
    this.requestUrl = `${this.baseApiUrl}/admin/setting/agent`;
    return this.get();
  }

  updateAgentSetting (body) {
  this.requestUrl = `${this.baseApiUrl}/admin/setting/agent`;
    return this.put(body);
  }

  //Setting Camera
  getCameraPath() {
    this.requestUrl = `${this.baseApiUrl}/admin/setting/camera/directory`;
    return this.get();
  }

  fetchCameraSettings(body) {
    this.requestUrl = `${this.baseApiUrl}/admin/setting/camera/fetch`;
    return this.post(body);
  }

  getCameraSettings() {
  this.requestUrl = `${this.baseApiUrl}/admin/setting/camera`;
    return this.get();
  }
}

//To create a instance, dont need use new in child-class
export default new SystemSettingsService;