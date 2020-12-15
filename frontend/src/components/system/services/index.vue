<template>
	<div class="project-page" id="serviceSettings" v-cloak>
		<div class="container">
			<div class="tab-content">
				<div class="custom-el-table spacing-table responsive-table m-top-20">
					<el-table :data="seviceDatas" class="group-list-table spacing-table"
							v-loading="isLoading" 
							:element-loading-text="$t('common.loading') + '...'" 
							element-loading-spinner="el-icon-loading" 
							element-loading-background="rgba(0, 0, 0, 0.8)" 
							style="width: 100%">
						</el-table-column>
						<el-table-column prop="name" label="Agent name" class-name="first-col pl-5">
						</el-table-column>
						<el-table-column prop="status" label="Status"  class-name="header-center text-uppercase last-col action-col">
							<template>
								Running
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import SystemSettingsService from '../../../services/system-settings.service';
export default {
	data() {
		return {
        	isLoading: false,
			seviceDatas: [],
		}
    },
    mounted(){
        this.fetchData();
    },
    methods: {
        async fetchData () {
            try {
                this.isLoading = true;
                const response = await SystemSettingsService.getAgentSettings();
				const data = response.data.data;
                this.seviceDatas = [data];
            } catch(err) {
                toastr["warning"]("Action unsuccessfully. Please try again!");
            } finally {
                this.isLoading = false;
            }
        },
    }	
}
</script>