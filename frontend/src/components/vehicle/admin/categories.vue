<template>
    <div class="container" id="categoryList" v-cloak>
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
				<span v-if="!!syncTime" class="m-right-15 m-top-20 m-bot-5">{{$t('vehicle.last_sync_at') }} {{syncTime}}</span>
				<span v-else class="m-right-15 m-top-20 m-bot-20">Not sync yet!</span>
			</div>
			<div class="tab-control-container">
				<div class="left-box">
					<span class="page-size">
						<strong>{{$t('vehicle.show') }}</strong>
						<el-select v-model="pageSize" class="max-w-70" placeholder="Select" @change="handleSizeChange">
							<el-option v-for="item in pageSizes" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
						<strong>{{$t('vehicle.entries') }}</strong>
					</span>
				</div>
				<div class="right-box">
					<v-pagination :total="caterogies.total" :page-size="pageSize" :current-page="currentPage"></v-pagination>
					<el-pagination :disabled="isLoading" @current-change="handleCurrentChange"
									:current-page.sync="currentPage" :page-sizes="pageSizes" :page-size="pageSize"
									layout="prev, next" :total="caterogies.total">
					</el-pagination>
				</div>
			</div>
			<el-table ref="categoryList" :fit="true" :data='caterogies.data'
						class="vehicle-list-table spacing-table responsive-table"
						:class="{'collapsed':collapseCols.length > 0}" v-loading="isLoading"
						:element-loading-text="$t('common.loading') + '...'" element-loading-spinner="el-icon-loading"
						element-loading-background="rgba(0, 0, 0, 0.8)" style="width:100%" @sort-change='handleSort'>
				<el-table-column type="expand" width="30">
					<template slot-scope="props">
						<p v-for="col in collapseCols" :key="col.name">
							<span v-if="col.name == 'tags'"> <strong>{{col.label}}</strong>:
								{{displayTags(props.row[col.name])}}</span>
							<span v-else><strong>{{col.label}}</strong>: {{props.row[col.name]}}</span>
						</p>
					</template>
				</el-table-column>
				<el-table-column v-for="(col,index) in expandCols" :key="col.name" :prop="col.name" :label="col.label"
									:sortable="col.sortable" :width="(index == (expandCols.length - 1))?'':col.width"
									:class-name="index==(expandCols.length - 1)?'last-col':''">
					<template scope="props">
						<span v-if="col.name == 'tags'">{{displayTags(props.row[col.name])}}</span>
						<span v-else>{{props.row[col.name]}}</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
import VehicleService from '../../../services/vehicle.service';
export default {
    data() {
		return {
    	    screenWidth:0,
    	    searchKey: '',
    	    sortData: {},
    	    responsiveCols: [
    	        { name: 'id', label: i18n.t('vehicle.id'), sortable: 'custom', width: 250, minScreen: 0 },
    	        { name: 'name', label: i18n.t('vehicle.category_name'), sortable: 'custom', width: 180, minScreen: 0 },
    	        { name: 'type', label: i18n.t('vehicle.category_type'), sortable: 'custom', width: 180, minScreen: 900 },
    	        { name: 'tags', label: i18n.t('vehicle.category_tags'), sortable: 'custom', width: 180, minScreen: 1150 },
    	    ],
    	    pageSizes: [10, 25, 50, 100],
    	    pageSize: 10,
    	    currentPage: 1,
    	    isLoading: false,
    	    caterogies: {
    	        current_page:0,
    	        data:[],
    	        total:0
    	    },
    	    selectAction:'',
    	    syncTime: ''
		}
    },
    mounted: function () {
        var self = this;
        self.fetchData();
        this.resizeHandle();
        this.$nextTick(function() {
            window.addEventListener('resize', this.resizeHandle);
        });
    },
    computed: {
        expandCols:function(){
            var self = this;
            return this.responsiveCols.filter(x=>x.minScreen <= self.screenWidth)
        },
        collapseCols:function(){
            var self = this;
            return this.responsiveCols.filter(x=>x.minScreen > self.screenWidth)
        },
    },
    methods: {
        resizeHandle: function () {
            this.screenWidth = $(window).width();
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.fetchData();
        },
        handleSizeChange: function (currentSize) {
            this.currentPage = 1;
            this.fetchData();
        },
        handleSort(obj) {
            this.sortData = obj
            this.caterogies.data = [];
            this.fetchData();
        },
        displayTags: function (tags) {
            if(tags) {
                return tags.join(' & ');
            }
            
            return '';
        },
        updateInnerSearchKey: function() {
            this.currentPage = 1;
            this.fetchData();
        },
        async onSyncServer (){
            const self = this;
            try {
                self.isLoading = true;
                const response = await VehicleService.syncCategories();
                const result = response.data;                    
                if (result.success) {
                    toastr["success"](result.msg);
                    self.fetchData();
                } else {
                    toastr["warning"](result.msg);
                }
            } catch(err) {
                toastr["warning"]("Action unsuccessfully. Please try again!");
            }finally {
                self.isLoading = false;
            }
        },
        async fetchData () {
            const self = this;
            try {
                self.isLoading = true;
                const sorting = Object.assign(
                    { prop: 'created_at', order: 'descending' },
                    _.pick(self.sortData, ['prop', 'order'])
                );
                const params = {
                    page: self.currentPage,
                    size: self.pageSize,
                    filter: {searchKey: self.searchKey},
                    sort: sorting,
                }
                //const response = await self.$http.get(self.baseUrl(`admin/vehicles/categories`), {params: params});
                const response = await VehicleService.getCategories();
                const result = response.data;
                self.caterogies.data = result.data;
                self.caterogies.total = result.data ? result.data.length : 0;
                self.syncTime = result.data.length > 0 ? self.localTimeConversion(result.data[0].updated_at, userTimezone, 'DD MMM YYYY LT') : self.syncTime;
            } catch(err) {
                toastr["warning"]("Action unsuccessfully. Please try again!");
            } finally {
                self.isLoading = false;
            }
        },
    }
}
</script>