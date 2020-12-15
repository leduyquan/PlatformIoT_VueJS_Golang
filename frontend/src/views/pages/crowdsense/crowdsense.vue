<template>
    <div class="page-with-sidebar" style="padding-left: 0px">
        <div class="fixed-top bg-blue-dark">
            <div class="flex-box">
                <div class="right-top-header flex-col">
                    <nav class="navbar navbar-expand-md justify-content-center" style="padding: 16px 0;">
                        <a class="navbar-brand white-color" href="/"><img :src="assetUrl('img/logos/crowdsense.svg')" alt="logo" height="15"></a>
                    </nav>
                </div>
            </div>
        </div>
        <div class="content-wrapper">
            <div class="container-fluid container-limited limit-container-width">
                <div class="container-wraper camera">
                    <div class="configuration">
                        <div class="camera__title">Camera Configuration</div>
                        <div class="configuration__list">
                            <div v-for="(item,index) in cameras" :key="index" class="configuration__item d-flex justify-content-between mb-3">
                                <div class="name-item">
                                    <svg height="36" width="36"><use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="assetUrl('img/crowdsense.svg#security')"></use> </svg>
                                    <span class="ml-4">Camera {{ index + 1 }}</span>
                                </div>
                                <span data-toggle="dropdown" class="d-flex align-items-center fs-22 c-pointer"><i class="fa fa-ellipsis-v"></i></span>
                                <ul class="c-pointer dropdown-menu dropdown-menu-right">
                                    <li @click="openCameraModal(item.id, index + 1)"><span class="fs-12 ml-2">View</span></li>
                                    <li @click="openModal(item.id, index + 1)"><span class="fs-12 ml-2">Edit</span></li>
                                </ul>
                            </div>
                        </div>
                        <!-- <div class="configuration__create d-flex justify-content-center align-items-center" @click="openModal()">
                            <i class="fa fa-plus"></i><span class="ml-3">Add camera</span>
                        </div> -->
                    </div>
                    <div class="service">
                        <div class="camera__title">Service Status</div>
                        <div class="service__list">
                            <div v-for="(item,index) in services" :key="index" class="service_block" v-on:dblclick="openRestartModal(item.name)">
                                <div style="height: 75px">
                                    <svg :height="getHeight(item.title)" :width="getHeight(item.title)">
                                        <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="assetUrl(`img/crowdsense.svg#${item.title}`)"></use>
                                    </svg>
                                </div>
                                <span>{{ convertServiceName(item.title, item.cameraCount) }}</span>
                                <hr>
                                <div class="Active">
                                    <i v-show="item.active" class="fa fa-circle m-right-10"></i>
                                    <span>{{ item.active ? 'Active' : 'Inactive' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <Modal :id="cameraId" :ordinal="cameraOrdinal" :get-camera="getCamera" :is-open="isOpenModal" @on-close="isOpenModal = false"></Modal>
        <CameraModal :id="cameraId" :ordinal="cameraOrdinal" :is-open="isOpenCameraModal" @on-close="isOpenCameraModal = false"></CameraModal>
        <RestartModal :name="cameraName" :is-open="isOpenRestartModal" @on-close="isOpenRestartModal = false"></RestartModal>
        </div>
    </div>
</template>
<script>
import Modal from './modal';
import RestartModal from './restart-modal'
import CameraModal from './camera-modal'
import CrowdsenseService from '../../../services/crowdsense.service';
export default {
    components: {
        Modal,
        CameraModal,
        RestartModal
    },
    data() {
        return {
            cameras: [],
            services: [],
            cameraId: '',
            cameraName: '',
            cameraOrdinal: '',
            isOpenModal: false,
            isOpenCameraModal: false,
            isOpenRestartModal: false,
        };
    },
    mounted() {
        const self = this;
        self.getCamera();
    },
    methods: {
        async getCamera() {
            const self = this;
            const response = await CrowdsenseService.getCameraSDM();
            const { data } = response.data;
            self.cameras = data.cameras;
            self.services = data.services.map((x) => ({
                ...x,
                title: this.handleDetection(x.name).name,
                cameraCount: this.handleDetection(x.name).id
            }));
        },
        convertServiceName(name, id) {
            return {
                'broker': 'Broker Server',
                'client': 'SDM Server Service',
                'detection': `SDM Detection for camera ${id}`
            }[name];
        },
        getHeight(name) {
            return name === 'detection' ? 45 : 60;
        },
        openModal(id = null, ordinal) {
            this.isOpenModal = true;
            this.cameraId = id;
            this.cameraOrdinal = ordinal;
        },
        openRestartModal(name) {
            this.isOpenRestartModal = true;
            this.cameraName = name;
        },
        openCameraModal(id, ordinal) {
            this.isOpenCameraModal = true;
            this.cameraId = id;
            this.cameraOrdinal = ordinal;
        },
        handleDetection(name){
            if (name.includes('detection')) {
                if (name === 'detection') {
                    return { name, id: '' };
                } else {
                    return { name: name.split('_')[0], id: +name.split('_')[1] + 1 };
                }
            }
            return { name, id: '' };
        },
    },
};
</script>

<style lang="scss" scoped>
.container-wraper {
    padding: 35px 350px;
}

.camera {
    &__title {
        font-size: 22px;
        margin-bottom: 20px;
    }

    .configuration {
        font-size: 18px;
        margin-bottom: 50px;

        &__list {
            margin-bottom: 30px;

            ul > li:hover {
                background-color: #4e6de2;
                color: #FFF;
            }
        }
        &__item {
            border-radius: 4px;
            background-color: #1f3951;
            border: 1px solid #4aa0d5;
            padding: 20px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
        }
        &__create {
            border-radius: 4px;
            background-color: #1f3951;
            border: 1px dotted #4aa0d5;
            padding: 15px;
            color: #4aa0d5;
            cursor: pointer;
        }
        &__create:active {
            background-color: #314C66;
        }
    }

    .service {
        &__list {
            display: grid;
            grid-gap: 25px;
            grid-template-columns: repeat(auto-fill, 350px);
            justify-content: space-between;

            .service_block {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                border: 1px solid #4aa0d5;
                background-color: #314C66;
                color: #fff;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
                padding: 30px 10px;
                font-size: 18px;
                cursor: pointer;

                hr {
                    width: 250px;
                    margin-left: auto;
                    margin-right: auto;
                    height: 0.1px;
                    background-color:#4aa0d5;
                }
            }
        }
    }
}

@media #{only screen and (max-width : 1480px)} {
    .container-wraper {
        padding: 35px 100px;
    }
}
@media #{only screen and (max-width : 1000px)} {
    .container-wraper {
        padding: 35px 35px;
    }
}
@media #{only screen and (max-width : 845px)} {
    .container-wraper {
        padding: 35px 35px;
        .service__list {
            justify-content: center;
        }
    }
}

</style>
