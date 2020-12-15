import BaseService from './configure/base.service';

class CrowdsenseService extends BaseService {
    constructor() {
        super();
    }

    getCameraSDM() {
        this.requestUrl = `${this.baseApiUrl}/admin/sdm`;
        return this.get();
    }

    getCameraSDMDetail(id) {
        this.requestUrl = `${this.baseApiUrl}/admin/sdm/camera/${id}`;
        return this.get();
    }

    createCameraSDM(body) {
        this.requestUrl = `${this.baseApiUrl}/admin/sdm/camera`;
        return this.put(body);
    }

    updateCameraSDM(id, body) {
        this.requestUrl = `${this.baseApiUrl}/admin/sdm/camera/${id}`;
        return this.put(body);
    }

    restartServer(name) {
        this.requestUrl = `${this.baseApiUrl}/admin/sdm/service/${name}/restart`;
        return this.post();
    }

    streamCameraPath(id) {
        this.requestUrl = `${this.baseApiUrl}/sdm/camera/${id}`;
        return this.requestUrl.replace('api', 'stream');
    }
}

export default new CrowdsenseService();
