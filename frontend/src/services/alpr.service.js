import BaseService from './configure/base.service';

class AlprService extends BaseService {
    constructor() {
        super();
    }

    getLP(params) {
        this.requestUrl = `${this.baseApiUrl}/alpr/lp`;
        return this.get(params);
    }

    getCameraList() {
        this.requestUrl = `${this.baseApiUrl}/alpr/config`;
        return this.get();
    }

    streamCameraPath(id) {
        this.requestUrl = `${this.baseApiUrl}/alpr/camera/${id}/feed`;
        return this.requestUrl.replace('api', 'stream');
    }

    streamLPPath() {
        this.requestUrl = `${this.baseApiUrl}/alpr/lp`;
        return this.requestUrl.replace('api', 'stream');
    }
}

export default new AlprService();
