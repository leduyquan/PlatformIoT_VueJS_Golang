<template>
    <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog v3-style plate-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-center plate-capture-frame">
                        <img :src="'data:image/png;base64, ' + vehicle.vehicle_image"
                            id="plate-recognition"
                            style="width: 80%; height: 370px;"
                            class="img-fluid">
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="flex-col-100 p-left-15 p-right-15 p-bot-15">
                        <div class="row">
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">License plate</div>
                                {{vehicle.plate}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <img :src="'data:image/png;base64, ' + vehicle.plate_image" id="plate-recognition" class="img-fluid">
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">Region</div>
                                {{ region}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">
                                    Score
                                </div>
                                    {{ vehicle.vehicle_score === 1 ? 100: (vehicle.vehicle_score * 100).toFixed(2) }}%
                            </div>
                        </div>
                        <div class="row">
                            <!-- <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">Camera</div>
                                #{{vehicle.camera_id}}
                            </div> -->
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">Datetime</div>
                                {{vehicle.timestamp | formatDate}}
                            </div>
                            <div class="col col-md-5 col-12 pt-4">
                                <div class="gray-color f-upper">Body type</div>
                                {{ vehicle.vehicle_type }}
                            </div>
                            <!-- <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">
                                    {{ $t('vehicle.direction') }}
                                </div>
                                <i class="fa fa-long-arrow-up"
                                    :style="{ transform: 'rotateZ(' + vehicle.travel_direction + 'deg)', }" >
                                </i>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['title'],
    data() {
        return {
            vehicle: {},
            isOpen: false,
            region: ''
        };
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
                this.region = i18n.t('alpr.' + this.vehicle.region)
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
};
</script>
