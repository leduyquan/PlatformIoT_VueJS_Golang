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
                        <img :src="baseUrl(alpr.filename)"
                            id="plate-recognition"
                            style="width: 80%; height: 370px;"
                            class="img-fluid">
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="flex-col-100 p-left-15 p-right-15">
                        <div class="row">
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">License plate</div>
                                {{alpr.plate}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <img :src="baseUrl(alpr.crop_image)" id="plate-recognition" class="img-fluid">
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">Region</div>
                                {{ region}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">Body type</div>
                                {{!!alpr.vehicle ? alpr.vehicle.type : ''}}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">Camera</div>
                                #{{alpr.camera_id}}
                            </div>
                            <div class="col col-md-3 col-12 pt-4">
                                <div class="gray-color f-upper">Datetime</div>
                                {{alpr.timestamp | formatDate}}
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
                alpr:{},
                isOpen:false,
                region: ''
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
                    this.region = !!this.alpr.region ? i18n.t('alpr.' + this.alpr.region.code) : 'unknown'
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