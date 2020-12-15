
import BaseService from './configure/base.service';

class BarrierService extends BaseService {
  constructor() {
    super();
  }
  
  // Admin Barriers
  getBarriers() {
    this.requestUrl = `${this.baseApiUrl}/admin/barriers`;
    return this.get();
  }
  getCameraByAgent() {
    this.requestUrl = `${this.baseApiUrl}/admin/setting/agent`;
    return this.get();
  }
  getUsedCameras() {
    this.requestUrl = `${this.baseApiUrl}/admin/barriers/used-cameras`;
    return this.get();
  }
  createBarrier(body) {
    this.requestUrl = `${this.baseApiUrl}/admin/barrier`;
    return this.post(body);
  }
  updateBarrier(body, id) {
    this.requestUrl = `${this.baseApiUrl}/admin/barrier/${id}`;
    return this.put(body);
  }
  deleteBarrier(id) {
    this.requestUrl = `${this.baseApiUrl}/admin/barrier/${id}`;
    return this.delete();
  }

  // Dashboard Barriers
  getBarrierLogs(params) {
    this.requestUrl = `${this.baseApiUrl}/barriers/logs`;
    return this.get(params);
  }

  getBarrierFilter() {
    this.requestUrl = `${this.baseApiUrl}/vehicle/filter`;
    return this.get();
  }

  streamBarrierPath(id) {
    this.requestUrl = `${this.baseApiUrl}`;
    return this.requestUrl.replace('api', 'stream');
  }
}

export default new BarrierService;