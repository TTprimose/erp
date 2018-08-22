<template>
    <div>
         <div class="model_topcol">
            <span style="color: #409EFF">采购退货</span>
            <span> - 新增退货单</span>
        </div>
        <div class="head color_gray">
            选择关联采购单
            <i v-RouterBack style="float: right; line-height: 60px" class="el-icon-close"></i>
        </div>
        <div class="banner">
            <el-form :inline="true" :model="tableParam" label-position="right" size="small" label-width="80px">
                <el-form-item>
                    <el-input
                        size="small"
                        placeholder="请输入采购单号"
                        clearable
                        prefix-icon="el-icon-search"
                        :style="{width: '378px', marginLeft: '17px'}"
                        v-model="tableParam.purchaseOrderNo">
                    </el-input>
                    <el-button @click="getTableData" :style="{margin: '0 10px'}" type="primary" size="small">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content" :style="{height: $store.state.home.modelContentHeight - 120 + 'px'}">
            <el-table
                :data="tableData"
                ref="chooseReleTable"
                :height="$store.state.home.modelContentHeight - 140"
                @select="tableSelectEvent"
                @selection-change="tableChangeEvent"
                highlight-current-row
                style="width: 100%">
                <el-table-column
                    type="selection"
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
            </el-table>
        </div>
        <div class="model_footer">
            <el-button @click="saveBtnEvent" style="width: 90px" type="primary" size="small">确定</el-button>
            <el-button v-RouterBack style="width: 90px" size="small">取消</el-button>
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
            tableParam: {
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
                repositoryId: "",
                repositoryName: "",
                pageNo: 1,
                pageSize: 10
            },
            selectTableData: [],
            totalPage: 1,
            currentPage: 1,
            tableData: []

        }
    },
    computed:{},
    methods:{
        mountFormat(data){
            data.row.mount = data.row.mount.replace(/[^\d\.]/g, '')
        },
        handleSizeChange(val){
            this.tableParam.pageSize = val
            this.getTableData()
        },
        handleCurrentChange(val){
            this.tableParam.pageNo = val
            this.getTableData()
        },
        tableSelectEvent(selection, row){
            this.$refs.chooseReleTable.clearSelection()
            this.$refs.chooseReleTable.toggleRowSelection(row);
        },
        getTableData(){
            return api.getPurchaseByStoreStatus(this.tableParam).then((response) => {
                this.totalPage = response.data.total
                this.tableData = response.data.list
            })
        },
        tableChangeEvent(selection){
            this.selectTableData = selection
        },
        saveBtnEvent(){
            if (this.selectTableData.length && this.selectTableData.length >= 1) {
                this.$store.commit('setCurrentModelId', this.selectTableData[0].id)
                this.$router.go(-1)
            } else {
                this.$message({
                    type: 'warning',
                    showClose: true,
                    duration: 1500,
                    message: '请选择表格数据!'
                });
            }
        }


    },
    created(){},
    activated(){
        this.getTableData()
    },
    mounted(){}
}
</script>
<style scoped>
.head{
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    padding: 0 20px;
}
.banner{
    height: 56px;
    background: #f5f5f5;
    padding-top: 11px;
}
.model_footer{
    text-align: left;
    padding-top: 11px;
    padding-left: 20px;
}
.content{
    padding: 10px;
}
.el-table{
    border: 1px solid #E4E7ED;
}
.el-pagination{
    float: right;
    padding-top: 2px;
}
</style>
