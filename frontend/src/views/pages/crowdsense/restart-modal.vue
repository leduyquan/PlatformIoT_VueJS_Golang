<template>
    <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog v3-style">
            <div class="modal-content">
                <div class="modal-header">
                </div>
                <div class="modal-body d-flex justify-content-center">
                    <span class="fs-18">Do you want to restart the server?</span>
                </div>
                <div class="modal-footer padding-30">
                    <div class="flex-col-100 p-left-15 p-right-15">
                        <div class="row">
                            <div class="col col-12 text-center">
                                <button class="btn btn-default" data-dismiss="modal">No</button>
                                <el-button type="primary" class="btn btn-primary m-left-10" @click="onRestart">Yes</el-button>
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
    props: ['name', 'isOpen'],
    data() {
        return {
            form: {
            },
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
        },
        onClose() {
            $(this.$el).modal('hide');
        },
        async onRestart() {
            const self = this;
            try {
                const response = await CrowdsenseService.restartServer(self.name);
                if (response.data.status === 500) {
                    self._onFailure();
                } else {
                    self._onSuccess();
                }
            } catch (error) {
                self._onFailure();
            }
        },
        _onSuccess() {
            toastr["success"]("Successfully!");
            this.onClose();
        },
        _onFailure() {
            toastr["warning"]("Action unsuccessfully. Please try again!");
        },
    },
}
</script>
<style scoped>
    .modal .modal-dialog{
        margin: 15% auto;
        max-width: 500px;
    }
</style>