<template>
    <div class="container" id="machingRules" v-cloak>
		<div class="tab-content">
			<div class="row">
				<div class="col col-12 flex-box justify-content-end p-top-5">
					<el-input class="search-box blue-style" v-model='searchKey' :placeholder="$t('common.search')"
								@keyup.enter.native="updateInnerSearchKey">
						<i slot="suffix" class="el-input__icon el-icon-search three-dots-menu"
							@click="updateInnerSearchKey"></i>'
					</el-input>
					<a class="btn btn-primary flex-col-w-130 m-left-10"
						@click="onSyncServer">{{$t('vehicle.sync_from_server') }}</a>
				</div>
			</div>
			<div class="row flex-box justify-content-end">
				<span v-if="!!syncTime" class="m-right-15 m-top-20 m-bot-20">{{$t('vehicle.last_sync_at') }} {{syncTime}}</span>
				<span v-else class="m-right-15 m-top-20 m-bot-20">Not sync yet!</span>
			</div>
			<div class="custom-el-table spacing-table responsive-table">
				<el-table :data="ruleDatas" class="group-list-table spacing-table" v-loading="isLoading" 
						:element-loading-text="$t('common.loading') + '...'" 
						element-loading-spinner="el-icon-loading" 
						element-loading-background="rgba(0, 0, 0, 0.8)" 
						style="width:100%">
					<el-table-column width="50" class-name="first-col pl-5"></el-table-column>
					<el-table-column prop="id" label="ID" with="220"></el-table-column>
					<el-table-column prop="rule_name" label="Rule name" class-name="header-center last-col action-col"></el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>
<script>
import VehicleService from '../../../services/vehicle.service';
export default {
    data() {
		return {
            isLoading: false,
            ruleDatas: [],
            searchKey: '',
            syncTime: ''
		}
	},
    mounted() {
        const self = this;
        self.fetchData()
    },
    methods: {
		updateInnerSearchKey: function() {
            this.currentPage = 1;
            this.fetchData();
        },
        onSearch() {
            this.fetchData();
        },
        async onSyncServer() {
            const self = this;
            try {
                self.isLoading = true;
                const response = await VehicleService.syncMatchingRules();
                const result = response.data;
                if (result.success) {
                    self.fetchData();
                    toastr["success"](result.msg);
                } else {
                    toastr["warning"](result.msg);
                }
            } catch(err) {
                toastr["warning"]("Action unsuccessfully. Please try again!");
            }finally{
                self.isLoading = false;
            }
        },
        async fetchData() {
            const self = this;
            try {
                self.isLoading = true;
                const params = {
                    searchKey: self.searchKey,
                };
                const response = await VehicleService.getMatchingRules();
                const result = response.data;
                self.ruleDatas = result.data;
                self.syncTime = result.data.length > 0 ? self.localTimeConversion(result.data[0].updated_at, userTimezone, 'DD MMM YYYY LT') : self.syncTime;
            } catch (err) {
                toastr["warning"]("Action unsuccessfully. Please try again!");
            }finally{
                self.isLoading = false;
            }
        },
    }
}
</script>