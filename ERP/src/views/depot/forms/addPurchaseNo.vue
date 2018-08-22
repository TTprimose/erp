<template>
    <div id="chooseGoodWrap">
        <div class="head color_gray">
            <el-input
                size="small"
                placeholder="请输入商品名称/商品编号"
                prefix-icon="el-icon-search"
                :style="{width: '378px'}"
                @keyup.enter.native="getTableData"
                v-model="tableParam.searchStr">
            </el-input>
            <el-button :style="{margin: '0 10px'}" type="primary" size="small" @click="getTableData">搜索</el-button>
            <i style="float: right; line-height: 60px" class="el-icon-close" @click="cancelBtnEvent"></i>
        </div>
        <div class="content">
            <el-table
                :height="$store.state.home.modelContentHeight - 98"
                @selection-change="tableChangeEvent"
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    width="55">
                    <template slot-scope="scope">
                        <el-radio class="radio" v-model="radio" :label="scope.row.id"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="boundType == 0"
                    prop="purchaseOrderNo"
                    label="采购单号"
                    width="180">
                </el-table-column>
                <el-table-column
                    v-if="boundType == 1"
                    prop="purchaseOrderNo"
                    label="退货单号"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="sellerName"
                    label="供应商">
                </el-table-column>
                <el-table-column
                    prop="buyerName"
                    label="采购单位">
                </el-table-column>
                <el-table-column
                    v-if="boundType == 0"
                    prop="purchaseHouseName"
                    label="入库仓库">
                </el-table-column>
                <el-table-column
                    v-if="boundType == 1"
                    prop="purchaseHouseName"
                    label="退货仓库">
                </el-table-column>
                <el-table-column
                    v-if="boundType == 0"
                    prop="receivedPrice"
                    label="采购金额">
                </el-table-column>
                <el-table-column
                    v-if="boundType == 1"
                    prop="receivedPrice"
                    label="退货金额">
                </el-table-column>
                <el-table-column
                    v-if="boundType == 1"
                    prop="creator"
                    width="90"
                    label="制单人">
                </el-table-column>
                <el-table-column
                    v-if="boundType == 1"
                    prop="operator"
                    width="90"
                    label="经办人">
                </el-table-column>
                <el-table-column
                    v-if="boundType == 0"
                    prop="purchasingAgent"
                    label="采购员">
                </el-table-column>
                <el-table-column
                    label="采购时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.orderTime | time_m}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="审核状态">
                    <template slot-scope="scope">
                        <span style="color: #f37069" v-if="scope.row.auditStatus == 0 || scope.row.auditStatus == 1">{{$allEnumeration.auditStatus[scope.row.auditStatus]}}</span>
                        <span v-else>{{$allEnumeration.auditStatus[scope.row.auditStatus]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="boundType == 0"
                    label="入库状态">
                    <template slot-scope="scope">
                        <span style="color: #f37069" v-if="scope.row.storeStatus == 0">{{$allEnumeration.storeStatus[scope.row.storeStatus]}}</span>
                        <span style="color: #e7a03d" v-if="scope.row.storeStatus == 1">{{$allEnumeration.storeStatus[scope.row.storeStatus]}}</span>
                        <span v-if="scope.row.storeStatus == 2">{{$allEnumeration.storeStatus[scope.row.storeStatus]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="model_footer">
            <el-button @click="sureBtnEvent" style="width: 90px" type="primary" size="small">确定</el-button>
            <el-button @click="cancelBtnEvent" style="width: 90px" size="small">取消</el-button>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="tableParam.pageNo"
                :page-sizes="[10, 30, 50, 100]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import 'utils/allEnumeration'
import api from 'api/purchase'
import API from 'api/depot'

export default {
    props: ['boundType'],
    data(){
        return {
            radio: '',
            SKUSelectvalue: [],
            totalPage: 1,
            goodsItemSelectData: [],
            goodsInfoData: [{
                oper: '',
                selfNum: '',
                barCode: '',
                goodName: '',
                SKU: '',
                qualityDate: '',
                productData: '',
                purchaseNum: '',
                unit: '',
                unitPrice: '',
                unitTotal: ''
            }],
            SKUSelectData: [],
            tableParam: {
                searchStr: '',
                pageSize: 10,
                pageNo: 1,
                mainImg: '',
                title: '',
                itemCode: '',
                categoryName: '',
                brandName: '',
                barCode: ''
            },
            tableData: [],
            selectTableData: []
        }
    },
    computed:{},
    methods:{
        handleSizeChange(data){
            this.tableParam.pageNo = this.currentPage
            this.tableParam.pageSize = data
            this.getTableData()
        },
        handleCurrentChange(data){
            this.tableParam.pageNo = data
            this.getTableData()
        },
        tableChangeEvent() {},
        getTableData(){
            if (this.boundType == 0) {
                API.getPurchaseList(this.tableParam).then((response) => {
                    this.totalPage = response.data.total
                    this.tableData = response.data.list
                })
            }
            if (this.boundType == 1) {
                this.tableData = []
                this.tableParam.auditStatus = 2
                api.getRejectListData(this.tableParam).then((response) => {
                    response.data.list.forEach(res => {
                        let obj = {
                            id: res.id,
                            purchaseOrderNo: res.returnOrderNo,
                            sellerName: res.sellerName,
                            buyerName: res.buyerName,
                            purchaseHouseName: res.returnHouseName,
                            receivedPrice: res.totalReturnMoney,
                            creator: res.creator,
                            operator: res.operator,
                            purchasingAgent: '',
                            orderTime: res.returnTime,
                            auditStatus: res.auditStatus
                        }

                        this.tableData.push(obj)
                    })
                    this.totalPage = response.data.total
                })
            }
        },
        sureBtnEvent(){
            // var flg = true;
            this.selectTableData = []
            console.log(this.radio, '打印选中')
            this.tableData.forEach((res) => {
                if (res.id == this.radio) {
                    this.selectTableData.push(res)
                }
            })
            console.log(this.tableData, '表中数据')
            if (this.selectTableData.length == 0) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '请选择订单'
                })
                return
            }
            this.$emit('saveAddpurchaseFn', this.selectTableData)
            this.$store.commit('hidePurchase')
        },
        cancelBtnEvent(){
            this.$store.commit('hidePurchase')
        }
    },
    activated(){
        this.getTableData()
    },
    created(){},
    mounted(){
        this.getTableData()
    }
}
</script>
<style>
    #chooseGoodWrap .radio .el-radio__label{
        display: none;
    }
</style>
<style scoped>
    #chooseGoodWrap{
        background: white;
    }
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
        padding-top: 0;
    }

</style>
