<template>
    <div id="purchaseDetail_wrap">
        <div class="tab_wrap">
            <el-tabs v-model="tabActive" @tab-click="tabHandleClick">
                <el-tab-pane class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}" label="采购单详情" name="detail">
                    <div class="tab_content">
                        <div class="tab_title fontWe_600">
                            <span v-if="purchaseListInfo.storeStatus == 0" class="title_states">待入库</span>
                            <span v-if="purchaseListInfo.storeStatus == 1" class="title_states">部分入库</span>
                            <span v-if="purchaseListInfo.storeStatus == 2" class="title_states">已入库</span>
                            <span style="margin-left: 30px" class="title_title">采购单号 : </span>
                            <span class="title_data" v-text="purchaseListInfo.purchaseOrderNo"></span>
                            <span class="title_title">供应商 : </span>
                            <span class="title_data" v-text="purchaseListInfo.sellerName"></span>
                            <span class="title_title">采购单位 : </span>
                            <span class="title_data" v-text="purchaseListInfo.buyerName"></span>
                            <span class="title_title">入库仓库 : </span>
                            <span class="title_data" v-text="purchaseListInfo.purchaseHouseName">默认仓库</span>
                            <span class="title_title">采购时间 : </span>
                            <span class="title_data">{{purchaseListInfo.orderTime | time}}</span>
                        </div>
                        <div class="banner">
                            商品信息
                        </div>
                        <div class="table_wrap" :style="{height: $store.state.home.modelContentHeight - 125 + 'px'}">
                            <el-table
                                :data="goodsInfoData"
                                show-summary
                                :summary-method="getSummaries"
                                border
                            style="width: 100%">
                                <el-table-column
                                label=" "
                                type="index"
                                width="50">
                                </el-table-column>
                                <el-table-column
                                prop="itemSku"
                                label="编号"
                                width="180">
                                </el-table-column>
                                <el-table-column
                                prop="itemMac"
                                label="条码">
                                </el-table-column>
                                <el-table-column
                                prop="itemName"
                                label="商品">
                                </el-table-column>
                                <el-table-column
                                prop="itemSpec"
                                label="规格-SKU">
                                </el-table-column>
                                <el-table-column
                                prop="itemExp"
                                label="保质期">
                                </el-table-column>
                                <el-table-column
                                prop="productionDate"
                                label="生产日期">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.productionDate | time_s }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="purchasingNumber"
                                label="采购数">
                                </el-table-column>
                                <el-table-column
                                prop="giftNumber"
                                label="赠品数量">
                                </el-table-column>
                                <el-table-column
                                prop="itemQuantifierUnit"
                                label="单位">
                                </el-table-column>
                                <el-table-column
                                prop="purchaseUnitPrice"
                                label="采购单价(元)">
                                </el-table-column>
                                <el-table-column
                                prop="purchaseTotalPrice"
                                label="小计(元)">
                                </el-table-column>
                            </el-table>
                            <div class="table_bottom">
                                <div class="table_bottom_right">
                                     <div class="table_bottom_item">
                                        <span class="table_bottom_title">运费 : </span>
                                        <span v-text="purchaseListInfo.freight"></span>
                                    </div>
                                    <div class="table_bottom_item">
                                        <span class="table_bottom_title">其他费用 : </span>
                                        <span v-text="purchaseListInfo.otherMoney"></span>
                                    </div>
                                    <div class="table_bottom_item">
                                        <span class="table_bottom_title">应付金额 : </span>
                                        <span style="color: #f96868; font-size: 20px">{{purchaseListInfo.totalMoney + purchaseListInfo.otherMoney + purchaseListInfo.freight | numFormat}}</span>
                                    </div>
                                </div>
                                <div class="table_bottom_left">
                                    <div class="table_bottom_item">
                                        <span class="table_bottom_title">备注 : </span>
                                        <span v-text="purchaseListInfo.purchaseRemark"></span>
                                    </div>
                                    <div class="table_bottom_item">
                                        <span class="table_bottom_title">采购员 : </span>
                                        <span v-text="purchaseListInfo.purchasingAgent"></span>
                                    </div>
                                    <div class="table_bottom_item">
                                        <span class="table_bottom_title">制单人 : </span>
                                        <span v-text="purchaseListInfo.creator"></span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}" label="入库记录" name="inrepos">
                    <div class="tab_content">
                        <div class="tab_title fontWe_600 tab_ruku_title">
                            <span v-if="storeBaseInfo.storeStatus == 0" class="title_states">待入库</span>
                            <span v-if="storeBaseInfo.storeStatus == 1" class="title_states">部分入库</span>
                            <span v-if="storeBaseInfo.storeStatus == 2" class="title_states">已入库</span>
                            <span style="margin-left: 30px" class="title_title">采购单号 : </span>
                            <span v-text="storeBaseInfo.purchaseOrderNo" class="title_data"></span>
                            <span class="title_title">供应商 : </span>
                            <span v-text="storeBaseInfo.sellerName" class="title_data"></span>
                            <span class="title_title">采购单位 : </span>
                            <span v-text="storeBaseInfo.buyerName" class="title_data">妈妈去哪儿</span>
                            <span class="title_title">入库仓库 : </span>
                            <span v-text="storeBaseInfo.purchaseHouseName" class="title_data"></span>
                        </div>
                        <div :style="{height: $store.state.home.modelContentHeight - 84 + 'px'}"  class="ruku_content">
                            <wait-ruku :fatherValue="storeBaseInfo"></wait-ruku>
                            <stock-record v-for="item in storeListData" :key="item.id" :baseInfo="storeBaseInfo" :fatherValue="item"></stock-record>
                        </div>
                    </div>

                </el-tab-pane>
            </el-tabs>
            <div v-show="tabActive == 'detail'" style="position: absolute; right: 10px; top: 7px">

                <!-- <el-button size="small" style="width: 90px">导出</el-button> -->
                <!-- <el-button size="small" style="width: 90px">编辑</el-button> -->
                <!-- <el-button size="small" @click="deleteEvent" style="width: 90px">删除</el-button> -->
                <!-- <el-button size="small" style="width: 90px">打印</el-button> -->
                <!-- <el-button size="small" type="primary" style="width: 90px">入库</el-button> -->
            </div>
        </div>
        <div class="wrap_footer">
            <el-button v-RouterBack style="width: 90px" size="small">返回</el-button>
        </div>
    </div>
</template>

<script>
import api from 'api/purchase'
import waitRuku from 'views/purchase/childComponents/waitin_goodslist'
import stockRecord from 'views/purchase/childComponents/stockRecord'
export default {
    components: {
        waitRuku,
        stockRecord
    },
    data(){
        return {
            tabActive: 'detail',
            goodsInfoData: [{
                selfNum: '11111',
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
            purchaseListInfo: {},
            storeBaseInfo: {},
            storeListData: []
        }
    },
    computed:{},
    methods:{
        tabHandleClick(tab){
        },
        getPurchaseListItem(){
            var purId = this.$store.state.home.currentModelId

            api.getPurchaseListItem(purId).then((response) => {
                this.purchaseListInfo = response.data
                this.goodsInfoData = response.data.list
                console.log(this.purchaseListInfo)

            })
        },
        getStoreRecordInfo(){
            var purId = this.$store.state.home.currentModelId

            api.getStoreRecord(purId).then((response) => {
                this.storeBaseInfo = response.data.obj
                this.storeListData = response.data.list
            })
        },
        getSummaries(param){
            var columns = param.columns
            var data = param.data
            var sums = []

            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                if (column.property == 'purchasingNumber' || column.property == 'purchaseTotalPrice' || column.property == 'giftNumber'){
                    const values = data.map(item => Number(item[column.property]));

                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);

                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);

                    }
                } else {
                    sums[index] = ''
                }
            })
            return sums
        }
    },
    activated(){
        this.getPurchaseListItem()
        this.getStoreRecordInfo()
        if (this.$route.params.tabtype == 1) {
            this.tabActive = 'detail'
        } else {
            this.tabActive = 'inrepos'
        }

    },
    created(){
        this.getPurchaseListItem()
        this.getStoreRecordInfo()
    },
    mounted(){}
}
</script>
<style scoped>
.tab_title{
    height: 65px;
    line-height: 65px;
    padding-left: 20px;
    font-size: 15px;
}
.tab_ruku_title{
    background: #fff2ef
}
.tab_title span{
    display: inline-block;
}
.title_states{
    color: #ec706b;
    font-size: 18px;
}
.tab_content{
    background: #ffffff;
    height: 100%;
}
.title_title{
    color: #929597;
}
.title_data{
    color: #5f6264;
    margin-right: 40px;
}
.banner{
    height: 40px;
    background: #f5f5f5;
    line-height: 40px;
    color: #606266;
    font-weight: 600;
    padding-left: 10px;
}
.table_wrap{
    padding: 10px;
    overflow: auto;
}
.table_bottom{
    border: 1px solid #ebeef5;
    height: 120px;
    border-top: none;
    color: #333;
}
.table_bottom .table_bottom_title{
    color: #606365;
}
.table_bottom_right .table_bottom_title{
    width: 200px;
}
.table_bottom_right{
    float: right;
    height: 50px;
    padding-right: 30px;
    padding-top: 10px;
}
.table_bottom_left{
    float: left;
    padding-top: 120px
}
.table_bottom_item{
    height: 35px;
    line-height: 35px;
}
.table_bottom_title{
    display: inline-block;
    width: 70px;
    text-align: right;
}
.wrap_footer{
    height: 49px;
    line-height: 49px;
    padding-left: 25px;
}
.ruku_content{
    overflow: auto;
    padding: 10px;
}
</style>
