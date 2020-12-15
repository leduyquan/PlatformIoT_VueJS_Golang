<template>
    <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog v3-style trigger-day-modal max-900">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="fs-16">Camera {{ ordinal }}</div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="text-center">
                        <img width="100%" id="myImage" src="" />
                    </div>
                </div>
                <div class="modal-footer padding-30">
                    <div class="flex-col-100 p-left-15 p-right-15">
                        <div class="row">
                            <div class="col col-12 text-center">
                                <button class="btn btn-default" data-dismiss="modal">{{$t('common.cancel')}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CrowdsenseService from '../../../services/crowdsense.service';
export default {
    props: ['id', 'ordinal', 'isOpen'],
    data() {
        return {
            eventSource: null
        };
    },
    mounted() {
        const self = this;
        $(document).ready(() => {
            $(self.$el).on('hide.bs.modal', () => {
                self.$emit('on-close');
            });
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
    methods: {
        onOpen() {
            const self = this;
            $(self.$el).modal('show');
            self.eventSource = new EventSource(CrowdsenseService.streamCameraPath(self.id));
                self.eventSource.addEventListener("message", function(e) {
                    $(document).ready(function() {
                        setTimeout(function() {
                            var myImageElement = document.getElementById('myImage');
                            var base64 = atob(e.data.slice(1, -1));
                            myImageElement.src ="data:image/jpeg;base64, " + base64;
                    }, 1000);
                });
            })
        },
        onClose() {
            $(this.$el).modal('hide');
            this.eventSource.close();
            this.eventSource = null;
        },
    },
}
</script>