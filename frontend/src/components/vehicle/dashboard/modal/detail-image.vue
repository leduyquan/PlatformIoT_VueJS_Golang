<template>
    <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog v3-style plate-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-center">
                        <img
                            style="width: 300px"
                            :src="'data:image/png;base64, ' + item.vehicle.vehicle_crop_jpeg"
                            id="plate-recognition"
                        />
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="flex-col-100 p-left-25 p-right-25">
                        <div class="row">
                            <div class="m-bot-15 col col-md-6 col-12">
                                <div class="gray-color f-upper">
                                    Type
                                </div>
                                {{ item.vehicle.type }}
                            </div>
                            <div class="m-bot-15 col col-md-6 col-12">
                                <div class="gray-color f-upper">
                                    Confidence
                                </div>
                                {{ item.vehicle.score === 1 ? item.vehicle.score : (item.vehicle.score * 100).toFixed(2) }}%
                            </div>
                            <div class="m-bot-15 col col-md-6 col-12">
                                <div class="gray-color f-upper">
                                    X Min
                                </div>
                                {{ item.vehicle.box[0] }}
                            </div>
                            <div class="m-bot-15 col col-md-6 col-12">
                                <div class="gray-color f-upper">
                                    Y Min
                                </div>
                                {{ item.vehicle.box[1] }}
                            </div>
                            <div class="m-bot-15 col col-md-6 col-12">
                                <div class="gray-color f-upper">
                                    X Max
                                </div>
                                {{ item.vehicle.box[2] }}
                            </div>
                            <div class="m-bot-15 col col-md-6 col-12">
                                <div class="gray-color f-upper">
                                    Y Max
                                </div>
                                {{ item.vehicle.box[3] }}
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
    data() {
        return {
            item: {
                vehicle: {
                    vehicle_crop_jpeg: '',
                    box: [0, 0, 0, 0],
                    score: 0,
                    type: ''
                }
            },
            isOpen: false,
        };
    },
    mounted() {
        var self = this;
        $(self.$el).on('hidden.bs.modal', function() {
            self.isOpen = false;
        });
    },
    watch: {
        isOpen() {
            if (this.isOpen) {
                this.onOpen();
            } else {
                this.onClose();
            }
        },
    },
    computed: {
        isOpenClose() {
            if (this.isOpen) {
                this.onOpen();
            } else {
                this.onClose();
            }
            return this.isOpen;
        },
    },
    methods: {
        onOpen() {
            var self = this;
            $(this.$el).modal('show');
        },
        onClose() {
            $(this.$el).modal('hide');
        },
    },
};
</script>