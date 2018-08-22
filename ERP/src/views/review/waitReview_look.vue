<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">待我审批</span>
            <span> - 查看订单</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <div class="tab_title fontWe_600">
                    <span v-if="baseInfo.storeStatus == 0" class="title_states">待入库</span>
                    <span v-if="baseInfo.storeStatus == 1" class="title_states">部分入库</span>
                    <span v-if="baseInfo.storeStatus == 2" class="title_states">已入库</span>
                    <span style="margin-left: 30px" class="title_title">采购单号 : </span>
                    <span v-text="baseInfo.purchaseOrderNo" class="title_data"></span>
                    <span class="title_title">供应商 : </span>
                    <span v-text="baseInfo.sellerName" class="title_data"></span>
                    <span class="title_title">采购人 : </span>
                    <span v-text="baseInfo.purchasingAgent" class="title_data"></span>
                    <span class="title_title">采购时间 : </span>
                    <span class="title_data">{{baseInfo.orderTime | time_m}}</span>
                </div>

                <div class="table_wrap" :style="{height: $store.state.home.modelContentHeight - 125 + 'px'}">
                    <el-table
                        :data="baseInfo.list"
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
                        label="商品编号(SKU)"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="itemMac"
                        label="商品条形码">
                        </el-table-column>
                        <el-table-column
                        prop="itemName"
                        label="商品名称">
                        </el-table-column>
                        <el-table-column
                        prop="itemSpec"
                        label="规格">
                        </el-table-column>
                        <el-table-column
                        prop="itemExp"
                        label="保质期(月)">
                        </el-table-column>
                        <el-table-column
                        prop="purchasingNumber"
                        label="采购数">
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
                        <div class="table_bottom_item">
                            <span class="table_bottom_title">采购单位 : </span>
                            <span v-text="baseInfo.buyerName"></span>
                            <span style="margin-left: 30px" class="table_bottom_title">采购仓库 : </span>
                            <span v-text="baseInfo.purchaseHouseName"></span>
                        </div>
                        <div class="table_bottom_item">
                            <span class="table_bottom_title">备注 : </span>
                            <span v-text="baseInfo.purchaseRemark"></span>
                        </div>
                        <div class="table_bottom_item">
                            <span class="table_bottom_title">制单人 : </span>
                            <span v-text="baseInfo.creator"></span>
                        </div>
                    </div>
                </div>


            </div>
        </div>
        <div class="model_footer">
            <el-button v-RouterBack size="small" style="width: 90px; margin-left: 25px;">返 回</el-button>
        </div>
    </div>
</template>

<script>
import api from 'api/review'
export default {
    data(){
        return {
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
            baseInfo: null
        }
    },
    computed:{},
    methods:{
        getInfoData(){
            var orderId = this.$store.state.home.currentModelId.orderId

            api.waitRe_look(1, orderId).then((response) => {
                this.baseInfo = response.data
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
                if (column.property == 'purchasingNumber' || column.property == 'purchaseTotalPrice'){
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
    created(){},
    activated(){
        this.getInfoData()
    },
    mounted(){}
}
</script>
<style scoped>
.model_content_inner{
    position: relative;
}

.model_footer{
    text-align: left;
    padding-top: 10px;
}
.tab_title{
    height: 65px;
    line-height: 65px;
    padding-left: 20px;
    font-size: 15px;
}
.title_states{
    color: #ec706b;
    font-size: 18px;
}
.title_title{
    color: #929597;
}
.title_data{
    color: #5f6264;
    margin-right: 40px;
}
.table_wrap{
    padding: 10px;
    overflow: auto;
}
.table_bottom{
    margin-top: 20px;
}
.table_bottom_item{
    height: 35px;
    line-height: 35px;
    font-weight: 600;
    color: #606365;
}
.table_bottom_title{
    display: inline-block;
    width: 70px;
    text-align: right;
}
</style>
