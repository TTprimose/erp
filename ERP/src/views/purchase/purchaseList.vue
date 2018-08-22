<template>
    <div>
        <div class="model_topcol">
            <span>采购单</span>
            <div>
                <el-button @click="invalidRecordEvent" size="small">作废记录</el-button>
                <!-- <el-button @click="importEvent" size="small">导入采购单</el-button> -->
                <el-button type="primary" v-perss="'新建采购单'" @click="purchaseAddEvent" size="small">新增采购单</el-button>
            </div>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <el-card v-show="isSupperBoxShow" class="box_card">
                    <div slot="header" class="clearfix">
                        <span :style="{fontSize: '16px'}">高级搜索</span>
                        <i @click="supperBoxShow" class="el-icon-close" style="float: right; padding: 3px 0; cursor: pointer"></i>
                    </div>
                    <el-form class="myForm" :inline="true" :model="tableParam" label-position="right" size="small" label-width="80px">
                        <el-form-item label="采购单号">
                            <el-input v-model="tableParam.purchaseOrderNo" placeholder="请输入采购单号"></el-input>
                        </el-form-item>
                        <el-form-item label="制单人">
                            <el-input v-model="tableParam.creator" placeholder="请输入制单人"></el-input>
                        </el-form-item>
                        <el-form-item label="采购员">
                            <el-input v-model="tableParam.purchasingAgent" placeholder="请输入采购员"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="供应商">
                            <el-select @change="selectChangeEvent(1)" v-model="tableParam.sellerId" placeholder="请选择供应商">
                                <el-option v-for="item in supplierSelectData" :key="item.id" :label="item.sellerCompanyName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="采购单位">
                            <el-select @change="selectChangeEvent(2)" v-model="tableParam.buyerId" placeholder="请选择采购单位">
                                <el-option v-for="item in buyerNameSelectData" :key="item.id" :label="item.buyerCompanyName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="入库仓库">
                            <el-select @change="selectChangeEvent(3)" v-model="tableParam.houseId" placeholder="请选择入库仓库">
                                <el-option v-for="item in repositorySelectData" :key="item.id" :label="item.warehouseName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <br>
                        <el-form-item label="入库状态">
                            <el-select v-model="tableParam.storeStatus" placeholder="请选择入库状态">
                                <el-option label="待入库" value="0"></el-option>
                                <el-option label="部分入库" value="1"></el-option>
                                <el-option label="已入库" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审核状态">
                            <el-select v-model="tableParam.auditStatus" placeholder="请输入审核状态">
                                <el-option label="待审核" value="0"></el-option>
                                <el-option label="审核中" value="1"></el-option>
                                <el-option label="通过" value="2"></el-option>
                                <el-option label="不通过" value="3"></el-option>
                                <el-option label="撤销" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="采购时间">
                            <el-date-picker
                                v-model="tableParam.purchaseDate"
                                value-format="timestamp"
                                @change="datePickerChangeEvent"
                                type="daterange"
                                :editable="false"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <br>
                        <el-form-item>
                            <el-button @click="supperSureBoxShow" style="width: 90px" type="primary" >确定</el-button>
                            <el-button @click="supperCansleBoxShow" style="width: 90px">取消</el-button>
                            <el-button class="color_hover" @click="resetBtnEvent" type="text" style="width: 40px; color: #636365">清空</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <div v-show="!isExportShow&&!isFreSupBoxShow" class="purchaseList_title">
                    <el-input
                        size="small"
                        placeholder="请输入采购单号/供应商名称/采购单位"
                        prefix-icon="el-icon-search"
                        @clear="searchInputClear"
                        clearable
                        :style="{width: '378px'}"
                        @keyup.enter.native="getTableData"
                        v-model="tableParam.searchStr">
                    </el-input>
                    <el-button :style="{margin: '0 10px'}" @click="getTableData" type="primary" size="small">搜索</el-button>
                    <span @click="supperBoxShow">高级搜索</span>
                </div>
                <div v-show="!isExportShow&&isFreSupBoxShow" class="purchaseList_title">
                    <span class="resspan">搜索结果</span>
                    <el-button @click="resetSeraBtnEvent" icon="fa fa-eraser" type="text">清除搜索</el-button>
                    <el-button @click="goSeraBtnEvent" icon="el-icon-search" type="text">继续搜索</el-button>
                </div>
                <div v-show="isExportShow" class="purchaseList_exportWrap">
                    <ul>
                        <li :style="{borderRight: '1px solid #E4E7ED', fontSize: '12px', color: '#757577'}">
                            <span :style="{fontSize: '18px',verticalAlign: 'middle'}" class="el-icon-close" @click="closeExportWrap"></span>
                            <span>已选择</span>
                            <span v-text="selectTableData.length"> 2 </span>
                            <span>项</span>
                        </li>
                        <li :style="{paddingLeft: '20px'}">
                            <el-button :style="{width: '100px'}" size="small">导出</el-button>
                        </li>
                    </ul>
                </div>

                <el-table
                    :data="tableData"
                    :height="$store.state.home.modelContentHeight - 83"
                    ref="purchaseListTable"
                    @selection-change="handleSelectionChange"
                    :row-key="getRowKeys"
                    style="width: 100%">
                    <el-table-column
                        type="selection"
                        :reserve-selection="true"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="purchaseOrderNo"
                        label="采购单号"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="sellerName"
                        label="供应商"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="buyerName"
                        label="采购单位">
                    </el-table-column>
                    <el-table-column
                        prop="purchaseHouseName"
                        label="入库仓库">
                    </el-table-column>
                    <el-table-column
                        prop="receivedPrice"
                        label="采购金额">
                    </el-table-column>
                    <el-table-column
                        prop="creator"
                        label="制单人">
                    </el-table-column>
                    <el-table-column
                        prop="purchasingAgent"
                        label="采购员">
                    </el-table-column>
                    <el-table-column
                        prop="orderTime"
                        label="采购时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.orderTime | time_m}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="storeStatus"
                        label="入库状态">
                        <template slot-scope="scope">
                            <span style="color: #f37069" v-if="scope.row.storeStatus == 0">待入库</span>
                            <span style="color: #e7a03d" v-if="scope.row.storeStatus == 1">部分入库</span>
                            <span v-if="scope.row.storeStatus == 2">已入库</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="auditStatus"
                        label="审核状态">
                        <template slot-scope="scope">
                            <span style="color: #f37069" v-if="scope.row.auditStatus == 0">待审核</span>
                            <span style="color: #e7a03d" v-if="scope.row.auditStatus == 1">审核中</span>
                            <span v-if="scope.row.auditStatus == 2">审核通过</span>
                            <span style="color: #f37069" v-if="scope.row.auditStatus == 3">审核不通过</span>
                            <span style="color: #f37069" v-if="scope.row.auditStatus == 4">撤回</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="prop"
                        width="150"
                        label="操作">
                         <template slot-scope="scope">
                            <div v-if="scope.row.storeStatus == 0 && scope.row.auditStatus == 0">
                                <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 7)"
                                    type="text"
                                    size="small">
                                    删除
                                </el-button>
                                <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 3)"
                                    type="text"
                                    v-perss="'采购单详情'"
                                    size="small">
                                    详情
                                </el-button>
                                <!-- <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 5)"
                                    type="text"
                                    size="small">
                                    打印
                                </el-button> -->

                                <!-- <el-dropdown :hide-timeout="50" trigger="click">
                                    <span class="el-dropdown-link">
                                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-perss="'删除采购单'" @click.native.prevent="tablePropEvent(scope.row.id, 7)">删除</el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="tablePropEvent(scope.row.id, 5)">打印</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown> -->
                            </div>
                            <div v-if="scope.row.storeStatus == 0 && scope.row.auditStatus == 1">
                                <el-button
                                    :style="{marginRight: '10px'}"
                                    @click.native.prevent="tablePropEvent(scope.row.id, 4)"
                                    type="text"
                                    size="small">
                                    撤回
                                </el-button>
                                <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 3)"
                                    type="text"
                                    v-perss="'采购单详情'"
                                    size="small">
                                    详情
                                </el-button>
                                <!-- <el-button
                                    :style="{marginRight: '10px'}"
                                    @click.native.prevent="tablePropEvent(scope.row.id, 5)"
                                    type="text"
                                    size="small">
                                    打印
                                </el-button> -->
                            </div>
                            <div v-if="scope.row.storeStatus == 0 && scope.row.auditStatus == 2">
                                <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 1)"
                                    type="text"
                                    v-perss="'入库单详情'"
                                    size="small">
                                    入库
                                </el-button>
                                <!-- <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 5)"
                                    type="text"
                                    size="small">
                                    打印
                                </el-button> -->
                                <el-button
                                    :style="{marginRight: '10px'}"
                                    @click.native.prevent="tablePropEvent(scope.row.id, 3)"
                                    type="text"
                                    v-perss="'采购单详情'"
                                    size="small">
                                    详情
                                </el-button>
                            </div>
                            <div v-if="scope.row.storeStatus == 0 && (scope.row.auditStatus == 3 || scope.row.auditStatus == 4)">
                                <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 3)"
                                    type="text"
                                    v-perss="'采购单详情'"
                                    size="small">
                                    详情
                                </el-button>
                                <!-- <el-button
                                    :style="{marginRight: '10px'}"
                                    @click.native.prevent="tablePropEvent(scope.row.id, 5)"
                                    type="text"
                                    size="small">
                                    打印
                                </el-button> -->
                            </div>
                            <div v-if="scope.row.storeStatus == 1 && scope.row.auditStatus == 2">
                                <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 1)"
                                    type="text"
                                    v-perss="'入库单详情'"
                                    size="small">
                                    入库
                                </el-button>
                                <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 2)"
                                    type="text"
                                    v-perss="'新建退货单'"
                                    size="small">
                                    退货
                                </el-button>
                                <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 3)"
                                    type="text"
                                    v-perss="'采购单详情'"
                                    size="small">
                                    详情
                                </el-button>
                                <!-- <el-dropdown :hide-timeout="50" trigger="click">
                                    <span class="el-dropdown-link">
                                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-perss="'采购单详情'" @click.native.prevent="tablePropEvent(scope.row.id, 3)">详情</el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="tablePropEvent(scope.row.id, 5)">打印</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown> -->
                            </div>
                            <div v-if="scope.row.storeStatus == 2 && scope.row.auditStatus == 2">
                                <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 2)"
                                    type="text"
                                    v-perss="'新建退货单'"
                                    size="small">
                                    退货
                                </el-button>
                                <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 3)"
                                    type="text"
                                    v-perss="'采购单详情'"
                                    size="small">
                                    详情
                                </el-button>
                                <!-- <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 5)"
                                    type="text"
                                    size="small">
                                    打印
                                </el-button> -->
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="model_footer">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 30, 50, 100]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import api from 'api/purchase'
export default {
    data(){
        return {
            serchText: '',
            currentPage: 2,
            totalPage: 1,
            selectTableData: [],
            supplierSelectData: [],
            repositorySelectData: [],
            buyerNameSelectData: [],
            isSupperBoxShow: false,
            isFreSupBoxShow: false,
            tableParam: {
                searchStr: '',
                purchaseOrderNo: '',
                buyerId: '',
                purchaseDate: '',
                storeStatus: '',
                auditStatus: '',
                startTime: "",
                endTime: "",
                sellerName: "",
                sellerId: "",
                buyerName: "",
                houseId: "",
                repositoryName: "",
                pageNo: 1,
                pageSize: 10
            },
            isExportShow: false,
            tableData: []
        }
    },
    computed:{},
    methods:{
        getRowKeys(row){
            return row.id
        },
        resetSeraBtnEvent(){
            this.resetBtnEvent()
            this.getTableData()
            this.isFreSupBoxShow = false
        },
        goSeraBtnEvent(){
            this.isSupperBoxShow = true
        },
        searchInputClear(){
            this.getTableData()
        },
        supperBoxShow(){
            this.isSupperBoxShow = !this.isSupperBoxShow
        },
        supperCansleBoxShow () {
            this.isSupperBoxShow = !this.isSupperBoxShow
        },
        supperSureBoxShow () {
            this.isSupperBoxShow = !this.isSupperBoxShow
            this.isFreSupBoxShow = true
            this.getTableData()
        },
        resetBtnEvent () {
            for (var key in this.tableParam) {
                this.tableParam[key] = ""
            }
        },
        handleSizeChange(val){
            this.tableParam.pageSize = val
            this.getTableData()
        },
        handleCurrentChange(val){
            this.tableParam.pageNo = val
            this.getTableData()
        },
        inRepositoryEvent(){

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
        purchaseAddEvent(){
            this.$router.push({
                path: '/addPurchaseList/' + '1'
            })
        },
        importEvent(){
            this.$router.push({
                path: '/importPurchase'
            })
        },
        invalidRecordEvent(){
            this.$router.push({
                path: '/invalidRecord'
            })
        },
        getSupplierSelectData(){
            api.getSupplierSelectData().then((response) => {
                this.supplierSelectData = response.data.list
            })
        },
        getRepositorySelectData(){
            api.getRepoSelectData().then((response) => {
                this.repositorySelectData = response.data
            })
        },
        getBuyerComSelectData(){
            api.getBuyerComSelectData().then((response) => {
                this.buyerNameSelectData = response.data
            })
        },
        selectChangeEvent(val){
            if (val == 1){
                this.supplierSelectData.forEach((item, index) => {
                    if (item.id == this.tableParam.sellerId) {
                        this.tableParam.sellerName = item.sellerCompanyName
                    }
                })
            }
            if (val == 2) {
                this.buyerNameSelectData.forEach((item, index) => {
                    if (item.id == this.tableParam.buyerId) {
                        this.tableParam.buyerName = item.buyerCompanyName
                    }
                })
            }
            if (val == 3) {
                this.repositorySelectData.forEach((item, index) => {
                    if (item.id == this.tableParam.repositoryId) {
                        this.tableParam.repositoryName = item.warehouseName
                    }
                })
            }
        },
        datePickerChangeEvent (val) {
            this.tableParam.startTime = Math.round(val[0] / 1000)
            this.tableParam.endTime = Math.round(val[1] / 1000)
        },
        getTableData(){
            return api.getPurchaseList(this.tableParam).then((response) => {
                this.totalPage = response.data.total
                this.tableData = response.data.list
            })
        },
        tablePropEvent(rowid, type){
            this.$store.commit('setCurrentModelId', rowid)
            if (type == 3) { //详情
                this.$router.push({
                    path: '/purchaseListDetail/' + '1'
                })
            }
            if (type == 2) { //退货
                this.$router.push({
                    path: '/addPurchaseReject'
                })
            }
            if (type == 1) { //入库
                this.$router.push({
                    path: '/purchaseListDetail/' + '2'
                })
            }
            if (type == 4) { //撤回
                var paramobj = {
                    orderId: rowid,
                    processType: 1,
                    submitterId: this.$store.state.home.userInfo.user.id
                }

                api.recallList(paramobj).then(() => {
                    this.$message({
                        type: 'success',
                        duration: 1500,
                        showClose: true,
                        message: '撤回成功!'
                    })
                    this.tableParam.pageSize = 10
                    this.tableParam.pageNo = 1
                    this.getTableData()
                })
            }
            if (type == 7) { //删除
                this.myBase.confirmDelet('你确定要永久删除此采购单信息?', () => {
                    api.deletePurchaseList(rowid).then((response) => {
                        this.$message({
                            type: 'success',
                            duration: 1500,
                            showClose: true,
                            message: '删除成功'
                        })

                        this.tableParam.pageSize = 10
                        this.tableParam.pageNo = 1
                        this.getTableData()

                    })
                })
            }

        }



    },
    activated(){
        this.getSupplierSelectData()
        this.getTableData()
        this.getRepositorySelectData()
        this.getBuyerComSelectData()
    },
    mounted(){}
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
.el-form{
    color: #636365;
}

</style>
