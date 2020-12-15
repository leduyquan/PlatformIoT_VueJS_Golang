<template>
	<div class="project-page" id="auditSettings" v-cloak>
		<div class="container">
			<div class="tab-content">
				<div class="row">
					<div class="col col-sm-8 col-12 flex-box justify-content-end ml-auto p-top-5">
						<el-input v-model='searchKey' class="search-box" placeholder="Search" @keyup.enter.native="handleSearchChange">
							<i slot="suffix" class="el-input__icon el-icon-search three-dots-menu" @click="handleSearchChange"></i></el-input>
					</div>
				</div>
				<div class="tab-control-container">
					<div class="left-box">
						<strong>{{$t('common.show')}}</strong>
						<el-select v-model="pageSize" placeholder="Select" :disabled="isLoading"
								@change="handleSearchChange" class="max-w-70">
							<el-option v-for="item in pageSizes" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
						<strong>{{$t('common.entries')}}</strong>
					</div>
					<div class="right-box">
						<v-pagination :total="auditLogs.total" :page-size="pageSize"
									:current-page="currentPage"></v-pagination>
						<el-pagination :disabled="isLoading" @current-change="handleCurrentChange"
									:current-page.sync="currentPage" :page-sizes="pageSizes"
									:page-size="pageSize" 
									layout="prev, next" :total="auditLogs.total">
						</el-pagination>
					</div>
				</div>
				<div class="table-wrapper">
					<el-table :data="auditLogs.data" class="group-list-table spacing-table responsive-table" v-loading="isLoading"
							:element-loading-text="$t('common.loading') + '...'" element-loading-spinner="el-icon-loading"
							element-loading-background="rgba(0, 0, 0, 0.8)" style="width:100%">
						<el-table-column label="Date & Time" class-name="first-col pl-5">
							<template slot-scope="scope">{{scope.row.created_at | formatDate}}</template>
						</el-table-column>
						<el-table-column prop="description" label="Description">
						</el-table-column>
						<el-table-column prop="user.name" label="Users" class-name="header-center last-col action-col">
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import SystemAuditsService from '../../../services/system-audits.service';
export default {
	data() {
		return {
        	isLoading: false,
			auditLogs: {
        	    data: [],
        	    total: 0,
        	},
        	currentPage: 1,
			searchKey: '',
        	pageSizes: [10, 20, 50, 100],
			pageSize: 10,
		}
    },
    mounted(){
        this.fetchData();
	},
	methods: {
        async fetchData() {
            const self = this;
            try {
                self.isLoading = true;
				const params = `page=${self.currentPage}&size=${self.pageSize}&keyword=${self.searchKey}`
				const response = await SystemAuditsService.getAuditLogs(params);
				const data = response.data.data;
                self.auditLogs.data = data.data;
                self.auditLogs.total = data.pagination.total;
				self.currentPage = data.pagination.page;
            }catch(err){
                toastr["warning"]("Action unsuccessfully. Please try again!");
            }finally{
                self.isLoading = false;
            }
        },
        handleCurrentChange (currentPage) {
            this.currentPage = currentPage;
            this.fetchData();
        },
        handleSearchChange() {
            this.currentPage = 1;
            this.fetchData();
        },
	}
}
</script>