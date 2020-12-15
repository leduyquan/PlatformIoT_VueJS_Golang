<template>
    <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog v3-style plate-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-center plate-capture-frame">
                        <template v-if="barrier.image_url" >
                            <img :src="assetUrl(barrier.image_url)"
                                id="plate-recognition" 
                                style="width: 80%; height: 370px;" 
                                class="img-fluid">
                        </template>
                        <template v-else>
                            <img :src="'data:image/png;base64, ' + barrier.vehicle_crop_jpeg"
                                id="plate-recognition" 
                                style="width: 80%; height: 370px;"  
                                class="img-fluid">
                        </template>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="flex-col-100 p-left-15 p-right-15">
                        <div class="row">
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.id')}}</div>
                                {{barrier.id}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.date_and_time')}}</div>
                                {{barrier.created_at | formatDate}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.camera')}}</div>
                                {{barrier.device_name}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.barrier_name')}}</div>
                                {{barrier.barrier}}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.detected_plate')}}</div>
                                {{barrier.best_plate_number}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <template v-if="barrier.thumbnail_url" >
                                    <img :src="assetUrl(barrier.thumbnail_url)" id="plate-recognition" class="img-fluid">
                                </template>
                                <template v-else>
                                    <img :src="'data:image/png;base64, ' + barrier.plate_crop_jpeg" id="plate-recognition" class="img-fluid">
                                </template>
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.matched')}}</div>
                                {{barrier.matched_category}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.confidence')}}</div>
                                {{barrier.best_confidence | round() }}%
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.barrier_action')}}</div>
                                {{barrier.status | startCase}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.make_model')}}</div>
                                {{barrier.vehicle_make_model | startCase}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.body_type')}}</div>
                                {{barrier.vehicle_body_type | startCase}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.province')}}</div>
                                {{barrier.region_name}}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.color')}}</div>
                                {{barrier.vehicle_color | startCase}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">{{$t('barrier.direction')}}</div>
                                <i class="fa fa-long-arrow-up"
                                   :style="{transform: 'rotateZ(' + barrier.travel_direction + 'deg)'}">
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data: function () {
            return {
                barrier:{},
                isOpen:false
            }
        },
        mounted: function() {
            var self = this;
            $(self.$el).on('hidden.bs.modal', function() {
                self.isOpen = false;
            });
        },
        watch: {
            isOpen() {
                if(this.isOpen) {
                    this.onOpen();
                } else {
                    this.onClose();
                }
            }
        },
        methods: {
            onOpen: function() {
                var self = this;
                $(this.$el).modal('show');

            },
            onClose: function() {
                $(this.$el).modal('hide');
            }
        }
}
</script>