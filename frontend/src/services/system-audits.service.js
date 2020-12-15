
import BaseService from './configure/base.service';

class SystemAuditsService extends BaseService {
  constructor() {
    super();
  }

  getAuditLogs(params) {
    this.requestUrl = `${this.baseApiUrl}/admin/audits?${params}`;
    return this.get();
  }
}

export default new SystemAuditsService;