<template>
    <div class="modal fade" role="dialog">
        <div class="modal-dialog v3-style edit-vehicle-modal max-600">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="title-wrapper">
                        <h4 class="modal-title">{{ title }}</h4>
                    </div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div>{{message}}</div>
                    <div class="form-group">
                        <label>{{ $t("common.type_delete_to_confirm") }}:</label>
                        <div class="col-w-30p">
                            <input type="text" class="form-control" :class="{'is-invalid': confirmText=='invalid'}" v-model="confirmText"/>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-center p-bot-20">
                    <button class="btn btn-secondary" @click="onClose">{{ $t("common.cancel") }}</button>
                    <button class="btn btn-danger" @click="onConfirm">{{ $t("common.ok") }}</button>
                </div>
            </div>
        </div>
        <div v-if="isOpenClose"></div>
    </div>
</template>
<script>
export default {
    props: ['isOpen','title','message'],
    data: function() {
        return {
            confirmText:'',
        };
    },
    mounted: function() {
        var self = this;
        $(self.$el).on('hidden.bs.modal', function() {
            self.$emit('on-close', self.form);
        });
    },
    computed: {
        isOpenClose: function() {
            if(this.isOpen) {
                this.onOpen();
            } else {
                this.onClose();
            }
            return this.isOpen;
        }
    },
    methods: {
        onOpen: function() {
            $(this.$el).modal('show');
        },
        onClose:function(){
            $(this.$el).modal('hide');
        },
        onConfirm: function() {
            if(this.confirmText == 'DELETE'){
                this.$emit('on-confirm', this.form);
            }else{
                this.confirmText = 'invalid';
            }
        },
        selectUploadFile: function (evt) {
            var self = this;
            self.upload_filename = evt.target.value.replace(/\\/g, '/').replace(/.*\//, '');
        },
    }
}
</script>