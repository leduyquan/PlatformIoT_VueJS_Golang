<template>
	<div class="project-page" id="agentSettings" v-cloak>
		<div class="container">
			<div class="tab-content">
				<div class="form-group d-flex align-items-center m-top-10">
					<div class="m-bot-10 p-top-10">
						<div class="fs-12">Agent name: </div>
						<input type="text" class="form-control flex-col-w-220" v-model="form.name">
					</div>
				</div>
				<div class="form-group d-flex align-items-center m-top-10">
					<div class="m-bot-10 p-top-10">
						<div class="fs-12">Agent-Server address: </div>
						<input type="text" class="form-control flex-col-w-220" v-model="form.server_address">
					</div>
				</div>
				<div class="col col-10 buttons text-center m-top-40 m-bot-40">
					<button type="button" class="btn btn-primary" @click="saveSettings">{{$t('common.save')}}</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import SystemSettingsService from '../../../../services/system-settings.service.js';
export default {
	data() {
		return {
			form: {
				id: '',
				name:'',
				server_address:''
			}
		}
    }, 
    mounted(){
		var self = this;
		self.fetchAgent();
	},
	methods: {
		async fetchAgent() {
			const self = this;
			try {
				const response = await SystemSettingsService.getAgentSettings();
				const data = response.data.data;
				self.form = _.pick(data, ['id', 'name', 'server_address']);
			} catch(err) {
				toastr["warning"]("Action unsuccessfully. Please try again!");
			}
        },
		async saveSettings() {
			const self = this;
			try {
				const body = self.form;
				const response = await SystemSettingsService.updateAgentSetting(body);
				if (response.data.success) {
                    toastr["success"](response.data.msg);
                } else {
                    toastr["warning"]("Action unsuccessfully. Please try again!");
                }
			} catch(err) {
				toastr["warning"]("Action unsuccessfully. Please try again!");
			}
		},
	}	
}
</script>