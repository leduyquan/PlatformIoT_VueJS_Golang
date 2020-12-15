
import BaseService from './configure/base.service';

class VehicleService extends BaseService {
  constructor() {
    super();
  }

  //Vehicle dashboard
  getFilterData() {
    this.requestUrl = `${this.baseApiUrl}/vehicle/filter-data`;
    return this.get();
  }

  getVehicles(params) {
    this.requestUrl = `${this.baseApiUrl}/vehicle/list`;
    return this.get(params);
  }

  //Vehicles
  syncVehicles() {
    this.requestUrl = `${this.baseApiUrl}/admin/vehicle/plates`;
    return this.post();
  }
  getAdminVehicles() {
    this.requestUrl = `${this.baseApiUrl}/admin/vehicle/plates`;
    return this.get();
  }

  // Categories
  syncCategories() {
    this.requestUrl = `${this.baseApiUrl}/admin/vehicle/categories`;
    return this.post();
  }
  getCategories() {
    this.requestUrl = `${this.baseApiUrl}/admin/vehicle/categories`;
    return this.get();
  }

  // Matching Rules
  syncMatchingRules() {
    this.requestUrl = `${this.baseApiUrl}/admin/vehicle/rules`;
    return this.post();
  }
  getMatchingRules() {
    this.requestUrl = `${this.baseApiUrl}/admin/vehicle/rules`;
    return this.get();
  }
}

export default new VehicleService;