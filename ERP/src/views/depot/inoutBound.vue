<template>
    <div>
        <div class="model_topcol">
            <span>出入库明细</span>
            <div>
                <!--<el-button type="primary" @click="purchaseAddEvent" size="small">导出库存表</el-button>-->
            </div>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <el-card v-show="isSupperBoxShow" class="box_card">
                    <div slot="header" class="clearfix">
                        <span :style="{fontSize: '16px'}">高级搜索</span>
                        <i @click="supperBoxShow" class="el-icon-close" style="float: right; padding: 3px 0; cursor: pointer"></i>
                    </div>
                    <el-form class="myForm" :inline="true" :model="searchFormData" label-position="right" size="small" label-width="90px">
                        <el-form-item label="编号">
                            <el-input v-model="searchFormData.itemSku" placeholder="请输入编号"></el-input>
                        </el-form-item>
                        <el-form-item label="条码">
                            <el-input v-model="searchFormData.itemMac" placeholder="请输入条码"></el-input>
                        </el-form-item>
                        <el-form-item label="名称">
                            <el-input v-model="searchFormData.itemName" placeholder="请输入名称"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="商品分类">
                            <el-select v-model="searchFormData.itemTypeId" placeholder="请选择">
                                <el-option
                                    v-for="item in item_option"
                                    :key="item.id"
                                    :label="item.categoryName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属仓库">
                            <el-select
                                v-model="searchFormData.houseId"
                                filterable
                                placeholder="请选择仓库">
                                <el-option
                                    v-for="item in houseId_option"
                                    :key="item.id"
                                    :label="item.warehouseName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出入库类型">
                            <el-select v-model="outInboundType" placeholder="出入库类型">
                                <el-option-group
                                    v-for="group in inoutBoundOption"
                                    :key="group.label"
                                    :label="group.label">
                                    <el-option
                                        v-for="item in group.options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-option-group>
                            </el-select>
                        </el-form-item>

                        <br>
                        <el-form-item label="采购单位">
                            <el-select v-model="searchFormData.buyerId" placeholder="请选择">
                                <el-option
                                    v-for="item in buyerId_option"
                                    :key="item.id"
                                    :label="item.buyerCompanyName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="采购时间">
                            <el-date-picker
                                v-model="searchFormData.date"
                                type="daterange"
                                :editable="false"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <br>
                        <el-form-item>
                            <el-button style="width: 90px" type="primary" @click="supperSureBoxShow">确定</el-button>
                            <el-button @click="supperBoxShow" style="width: 90px">取消</el-button>
                            <el-button type="text" style="width: 40px; color: #636365" @click="clear">清空</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <div v-show="!isExportShow&&!isFreSupBoxShow" class="purchaseList_title">
                    <el-input
                        size="small"
                        placeholder="请输入编号/条码/名称"
                        prefix-icon="el-icon-search"
                        :style="{width: '378px'}"
                        @keyup.enter.native='search'
                        clearable
                        @change="clearSearchStr"
                        v-model="searchFormData.searchStr">
                    </el-input>
                    <el-button :style="{margin: '0 10px'}" type="primary" size="small" @click="search">搜索</el-button>
                    <span @click="supperBoxShow">高级搜索</span>
                </div>
                <div v-show="!isExportShow&&isFreSupBoxShow" class="purchaseList_title">
                    <span class="resspan">搜索结果</span>
                    <el-button @click="resetSeraBtnEvent" icon="fa fa-eraser" type="text">清除搜索</el-button>
                    <el-button @click="goSeraBtnEvent" icon="el-icon-search" type="text">继续搜索</el-button>
                </div>
                <el-table
                    :data="tableData"
                    :height="$store.state.home.modelContentHeight - 83"
                    ref="purchaseListTable"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                    <el-table-column
                        width="100"
                        prop="itemSku"
                        label="编号"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="itemMac"
                        label="条码"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="itemName"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        prop="itemSpec"
                        label="规格-sku">
                    </el-table-column>

                    <el-table-column
                        prop="itemQuantifierUnit"
                        label="单位">
                    </el-table-column>
                    <el-table-column
                        prop="warehouseName"
                        label="所属仓库">
                    </el-table-column>
                    <el-table-column
                        width="128"
                        label="出入库类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type == 0">{{$allEnumeration.storeType[scope.row.orderType]}}</span>
                            <span v-if="scope.row.type == 1">{{$allEnumeration.deliverType[scope.row.orderType]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="buyerName"
                        label="采购单位">
                    </el-table-column>
                    <el-table-column
                        width="148"
                        prop="orderNo"
                        label="出入库单号">
                    </el-table-column>
                    <el-table-column
                        width="128"
                        label="出入库时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.orderTime | time_m}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="orderNumber"
                        label="出入库数">
                    </el-table-column>
                    <el-table-column
                        prop="inventory"
                        label="实际库存">
                    </el-table-column>
                    <el-table-column
                        prop="prop"
                        width="150"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                                @click.native.prevent="inBoundDetail(scope.$index, scope.row)"
                                type="text"
                                size="small">
                                详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="model_footer">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[10, 30, 50, 100]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import 'utils/allEnumeration'
import API from 'api/depot'
import ME from 'utils/base'
export default {
    data(){
        return {
            warnState: '',
            currentPage: 1,
            selectTableData: [],
            isSupperBoxShow: false,
            isFreSupBoxShow: false,
            tableHeight: 500,
            outInboundType: '',
            loading: false,
            houseId_option: [],
            buyerId_option: [],
            item_option: [],
            searchFormData: {
                itemSku: null,
                itemMac: null,
                itemName: null,
                deliverType: null,
                storeType: null,
                itemTypeId: null,
                houseId: null,
                buyerId: null,
                startTime: null,
                endTime: null,
                date: null,
                searchStr: null
            },
            isExportShow: false,
            tableData: [],
            total: 0,
            inoutBoundOption: [{
                label: '入库类型',
                options: [{
                    value: '1',
                    label: '入库采购'
                }, {
                    value: '2',
                    label: '销售退货'
                }, {
                    value: '3',
                    label: '其他'
                }]
            }, {
                label: '出库类型',
                options: [{
                    value: '00',
                    label: '商城订单'
                }, {
                    value: '11',
                    label: '线下订单'
                }, {
                    value: '22',
                    label: '采购退货'
                }, {
                    value: '33',
                    label: '批发'
                }, {
                    value: '44',
                    label: '其他'
                }]
            }]
        }
    },
    computed:{},
    methods:{
        resetSeraBtnEvent(){
            this.clear()
            this.search()
            this.isFreSupBoxShow = false
        },
        goSeraBtnEvent(){
            this.isSupperBoxShow = true
        },
        supperSureBoxShow(){
            this.isFreSupBoxShow = true
            this.search()
        },
        handleSizeChange(data){
            this.currentPage = 1
            this.searchFormData.pageNo = this.currentPage
            this.searchFormData.pageSize = data
            this.getInoutBoundList(this.searchFormData)
        },
        handleCurrentChange(data){
            this.searchFormData.pageNo = data
            this.getInoutBoundList(this.searchFormData)
        },
        // 获取出入库列表
        getInoutBoundList(data) {
            API.inoutBound(data).then(res => {
                this.tableData = res.data.list
                this.total = res.data.total || 0
                this.tableData.orderTime = this.tableData.orderTime * 1000
            })
        },
        // 获取采购列表
        getPurchaseList() {
            API.getPurchaseAll().then(res => {
                this.buyerId_option = res.data
                console.log(this.buyerId_option, "采购列表")
            })
        },
        // 获取商品类目列表
        getItemList() {
            API.getItemAll().then(res => {
                this.item_option = res.data
                console.log(this.item_option, "sdadsada")
            })
        },
        // 搜索清空
        clear() {
            for (let key in this.searchFormData) {
                if (key != 'searchStr') {
                    this.searchFormData[key] = null
                }
            }
            this.outInboundType = ''
        },
        clearSearchStr() {
            this.search()
        },
        // 搜索
        search() {
            if (this.searchFormData.date) {
                this.searchFormData.startTime = Date.parse(this.searchFormData.date[0]) / 1000
                this.searchFormData.endTime = Date.parse(this.searchFormData.date[1]) / 1000
            } else {
                this.searchFormData.startTime = null
                this.searchFormData.endTime = null
            }
            if (this.outInboundType.length == 1) {
                this.searchFormData.storeType = this.outInboundType
                this.searchFormData.deliverType = null
            } else if (this.outInboundType.length == 2) {
                this.searchFormData.storeType = null
                this.searchFormData.deliverType = this.outInboundType.slice(1)
            }
            this.postData = ME.deepCopy(this.searchFormData)
            this.$delete(this.postData, 'date')
            // console.log(this.postData)
            this.getInoutBoundList(this.postData)
            this.isSupperBoxShow = false
        },
        // 入库仓库模糊搜索
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    API.getWarehouseListActive().then(res => {
                        this.houseId_option = res.data.filter(item => {
                            return item.warehouseName.toLowerCase().indexOf(query.toLowerCase()) > -1;
                        });
                        console.log(res, "请求来仓库")
                    })
                }, 200);
            } else {
                this.houseId_option = [];
            }
        },
        // 仓库列表获取
        getWareHouseList() {
            API.getWarehouseListActive().then(res => {
                this.houseId_option = res.data
            })
        },
        // 进入详情页
        inBoundDetail(index, data) {
            if (data.type == 1) { //出库
                this.$router.push({name: '出入库详情', params: {id: data.id, type: 'outbound'}})
            } else if (data.type == 0) { //入库
                this.$router.push({name: '出入库详情', params: {id: data.id, type: 'inbound'}})
            }
        },
        closeExportWrap(){
            this.isExportShow = false
            this.$refs.purchaseListTable.clearSelection()
        },
        handleSelectionChange(val){
            this.selectTableData = val
            if (this.selectTableData.length > 0){
                this.isExportShow = true
            } else {
                this.isExportShow = false
            }
        },
        supperBoxShow(){
            this.isSupperBoxShow = !this.isSupperBoxShow
        },
        purchaseAddEvent(){
            this.$router.push({
                name: '新增入库',
                params: {type: '出库'}
            })
        },
        dropdownSelectEvent(command){
            if (command == 1){
                this.$router.push({
                    path: '/purchaseListDetail'
                })
            }
        }
    },
    created(){},
    mounted(){
        this.getInoutBoundList()
        this.getPurchaseList()
        this.getWareHouseList()
        this.getItemList()
    },
    activated() {
        this.clear()
        this.isSupperBoxShow = false
        // 商品库存页进入
        if (this.$route.params.id) {
            this.clear()
            this.searchFormData.searchStr = this.$route.params.id
            this.search()
        }
    }
}
</script>
<style scoped>
    .purchaseList_title{
        height: 63px;
        line-height: 63px;
        padding-left: 17px;
    }
    .purchaseList_exportWrap{
        height: 63px;
        padding-top: 15px;
    }
    .purchaseList_title span{
        cursor: pointer;
    }
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
        font-size: 12px;
    }
    .purchaseList_exportWrap>ul{
        overflow: hidden;
        padding-left: 0;
    }
    .purchaseList_exportWrap>ul>li{
        float: left;
        padding: 0 20px;
        height: 33px;
        line-height: 32px;
    }
    .box_card{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 300px;
        z-index: 9;
    }
    .model_content_inner{
        position: relative;
    }
    .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
        width: 390px;
    }
    .el-form, .el-table{
        color: #636365;
    }
    .el-table .cell .auditStatus_0, .el-table .cell .auditStatus_1{
        color: #e6a23c;
    }
    .el-table .cell .auditStatus_2{
        color: #606266;
    }
    .el-table .cell .auditStatus_3{
        color: #f56c6c;
    }

</style>
