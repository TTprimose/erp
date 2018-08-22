<template>
    <div>
        <div class="model_topcol">
            <span>采购退货</span>
            <div>
                <el-button v-perss="'新建退货单'" type="primary" @click="addRejectEvent" size="small">新增退货单</el-button>
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
                        <el-form-item label="退货单号">
                            <el-input v-model="tableParam.returnOrderNo" placeholder="请输入退货单号"></el-input>
                        </el-form-item>
                        <el-form-item label="经办人">
                            <el-input v-model="tableParam.operator" placeholder="请输入经办人"></el-input>
                        </el-form-item>
                        <el-form-item label="制单人">
                            <el-input v-model="tableParam.creator" placeholder="请输入制单人"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="供应商">
                            <el-select @change="selectChangeEvent(1)" v-model="tableParam.sellerId" placeholder="请选择供应商">
                                <el-option v-for="item in supplierSelectData" :key="item.id" :label="item.sellerCompanyName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="采购单位">
                            <el-select @change="selectChangeEvent(3)" v-model="tableParam.buyerId" placeholder="请选择采购单位">
                                <el-option v-for="item in buyerNameSelectData" :key="item.id" :label="item.buyerCompanyName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="退货仓库">
                            <el-select @change="selectChangeEvent(2)" v-model="tableParam.houseId" placeholder="请选择入库仓库">
                                <el-option v-for="item in repositorySelectData" :key="item.id" :label="item.warehouseName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <br>
                        <el-form-item label="审核状态">
                            <el-select v-model="tableParam.auditStatus" placeholder="请输入审核状态">
                                <el-option label="待审核" value="0"></el-option>
                                <el-option label="审核中" value="1"></el-option>
                                <el-option label="通过" value="2"></el-option>
                                <el-option label="不通过" value="3"></el-option>
                                <el-option label="撤回" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="退货时间">
                            <el-date-picker
                                type="daterange"
                                v-model="tableParam.returnTime"
                                :editable="false"
                                value-format="timestamp"
                                @change="datePickerChange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <br>
                        <el-form-item>
                            <el-button @click="supperSureBoxShow" style="width: 90px" type="primary" >确定</el-button>
                            <el-button @click="supperBoxShow" style="width: 90px">取消</el-button>
                            <el-button @click="resetBtnEvent" type="text" style="width: 40px; color: #636365">清空</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <div v-show="!isExportShow&&!isFreSupBoxShow" class="purchaseList_title">
                    <el-input
                        size="small"
                        placeholder="请输入退货单号"
                        prefix-icon="el-icon-search"
                        clearable
                        @clear="searchInputClear"
                        @keyup.enter.native="getTableData"
                        :style="{width: '378px'}"
                        v-model="tableParam.searchStr">
                    </el-input>
                    <el-button @click="getTableData" :style="{margin: '0 10px'}" type="primary" size="small">搜索</el-button>
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
                    :row-key="getRowKeys"
                    :reserve-selection="true"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                    <el-table-column
                        type="selection"
                        :reserve-selection="true"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="returnOrderNo"
                        label="退货单号"
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
                        prop="returnHouseName"
                        label="退货仓库">
                    </el-table-column>
                    <el-table-column
                        prop="totalReturnMoney"
                        label="退货金额">
                    </el-table-column>
                    <el-table-column
                        prop="creator"
                        label="制单人">
                    </el-table-column>
                    <el-table-column
                        prop="operator"
                        label="经办人">
                    </el-table-column>
                    <el-table-column
                        prop="returnTime"
                        label="退货时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.returnTime | time_m}}</span>
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
                            <div v-if="scope.row.auditStatus == 0">
                                <el-button
                                    @click.native.prevent="tableOperEvent(scope.row.id, 1)"
                                    v-perss="'采购退货单详情'"
                                    type="text"
                                    size="small">
                                    详情
                                </el-button>
                                <el-button
                                    @click.native.prevent="tableOperEvent(scope.row.id, 2)"
                                    type="text"
                                    v-perss="'删除采购退货单'"
                                    size="small">
                                    删除
                                </el-button>
                            </div>
                            <div v-else-if="scope.row.auditStatus == 1">
                                <el-button
                                    @click.native.prevent="tableOperEvent(scope.row.id, 1)"
                                    type="text"
                                    v-perss="'采购退货单详情'"
                                    size="small">
                                    详情
                                </el-button>
                                <el-button
                                    @click.native.prevent="tableOperEvent(scope.row.id, 3)"
                                    type="text"
                                    v-perss="'撤销审核'"
                                    size="small">
                                    撤回
                                </el-button>
                            </div>
                            <div v-else>
                                <el-button
                                    @click.native.prevent="tableOperEvent(scope.row.id, 1)"
                                    type="text"
                                    v-perss="'采购退货单详情'"
                                    size="small">
                                    详情
                                </el-button>
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
            totalPage: 1,
            currentPage: 2,
            selectTableData: [],
            supplierSelectData: [],
            buyerNameSelectData: [],
            repositorySelectData: [],
            isSupperBoxShow: false,
            isFreSupBoxShow: false,
            tableHeight: 500,
            tableParam: {
                storeStatus: "",
                buyerId: "",
                houseId: "",
                creator: "",
                auditStatus: "",
                returnTime: '',
                startTime: "",
                endTime: "",
                returnOrderNo: "",
                pageNo: 1,
                pageSize: 1,
                searchStr: ''
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
        selectChangeEvent(){

        },
        resetBtnEvent () {
            for (var key in this.tableParam) {
                this.tableParam[key] = ""
            }
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
        handleSizeChange(val){
            this.tableParam.pageSize = val
            this.getTableData()
        },
        handleCurrentChange(val){
            this.tableParam.pageNo = val
            this.getTableData()
        },
        tableOperEvent(rowid, type){
            this.$store.commit('setCurrentModelId', rowid)

            if (type == 1) {
                this.$router.push({
                    path: '/lookPurchaseReject'
                })
            }
            if (type == 2) {
                this.myBase.confirmDelet('你确定要永久删除此退货单信息?', () => {
                    api.deleteRejectItem(rowid).then((response) => {
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

            if (type == 3) {
                var paramobj = {
                    orderId: rowid,
                    processType: 2,
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
        supperSureBoxShow () {
            this.isSupperBoxShow = !this.isSupperBoxShow
            this.isFreSupBoxShow = true
            this.getTableData()
        },
        addRejectEvent(){
            this.$store.commit('setCurrentModelId', "")
            this.$router.push({
                path: '/addPurchaseReject'
            })
        },
        datePickerChange(data){
            this.tableParam.startTime = Math.round(data[0] / 1000)
            this.tableParam.endTime = Math.round(data[1] / 1000)
        },
        getTableData(){
            return api.getRejectListData(this.tableParam).then((response) => {
                this.tableData = response.data.list
                this.totalPage = response.data.total
            })
        }

    },
    created(){
        this.getSupplierSelectData()
        this.getRepositorySelectData()
        this.getBuyerComSelectData()
    },
    activated(){
        this.tableParam.pageSize = 10
        this.tableParam.pageNo = 1
        this.getTableData()
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
