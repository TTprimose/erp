<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">采购退货</span>
            <span> - 新增退货单</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <div class="content_top">
                    <div class="tab_title fontWe_600" style="border-bottom: 1px solid #E4E7ED;">
                        <span v-if="baseInfo.auditStatus == 0" class="title_states">待审核</span>
                        <span v-if="baseInfo.auditStatus == 1" class="title_states">审核中</span>
                        <span v-if="baseInfo.auditStatus == 2" class="title_states">通过</span>
                        <span v-if="baseInfo.auditStatus == 3" class="title_states">未通过</span>
                        <span v-if="baseInfo.auditStatus == 4" class="title_states">撤回</span>
                        <span style="margin-left: 30px" class="title_title">采购退货单号 : </span>
                        <span v-text="baseInfo.returnOrderNo" class="title_data"></span>
                        <span class="title_title">关联采购单号 : </span>
                        <span v-text="baseInfo.purchaseOrderNo" class="title_data"></span>
                    </div>
                    <div class="tab_title fontWe_600">
                        <span class="title_title">供应商 : </span>
                        <span v-text="baseInfo.sellerName" class="title_data"></span>
                        <span class="title_title">采购单位 : </span>
                        <span v-text="baseInfo.buyerName" class="title_data"></span>
                        <span class="title_title">退货仓库 : </span>
                        <span v-text="baseInfo.returnHouseName" class="title_data"></span>
                        <span class="title_title">退货时间 : </span>
                        <span class="title_data">{{baseInfo.returnTime | time_m}}</span>
                    </div>
                </div>
                <div class="banner">
                    商品信息
                </div>
                <div class="table_wrap" :style="{height: $store.state.home.modelContentHeight - 185 + 'px'}">
                    <el-table
                        :data="baseInfo.list"
                        :summary-method="getSummaries"
                        show-summary
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
                        label="保质期(月)">
                        </el-table-column>
                        <el-table-column
                        prop="productionDate"
                        label="生产日期">
                            <template slot-scope="scope">
                                <span>{{ scope.row.productionDate | time_s }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="returnNumber"
                        label="退货数">
                        </el-table-column>
                        <el-table-column
                        prop="itemQuantifierUnit"
                        label="单位">
                        </el-table-column>
                        <el-table-column
                        prop="returnUnitPrice"
                        label="退货单价(元)">
                        </el-table-column>
                        <el-table-column
                        prop="returnMoney"
                        label="小计(元)">
                        </el-table-column>
                    </el-table>
                    <div class="table_bottom">
                        <div class="table_bottom_right">
                            <div v-if="baseInfo.consultPrice != ''" class="table_bottom_item">
                                <span class="table_bottom_title">协商后,修改退货金额 : </span>
                                <span v-text="baseInfo.consultPrice"></span>
                            </div>
                            <div class="table_bottom_item">
                                <span class="table_bottom_title">退货金额 : </span>
                                <span style="color: #f96868; font-size: 20px" v-if="baseInfo.consultPrice != ''">{{baseInfo.consultPrice | numFormat}}</span>
                                <span style="color: #f96868; font-size: 20px" v-if="baseInfo.consultPrice == ''">{{baseInfo.totalReturnMoney | numFormat}}</span>
                            </div>
                        </div>

                        <div class="table_bottom_left">
                            <div class="table_bottom_item">
                                <span class="table_bottom_title">备注 : </span>
                                <span v-text="baseInfo.remark"></span>
                            </div>
                            <div class="table_bottom_item">
                                <span class="table_bottom_title">制单人 : </span>
                                <span v-text="baseInfo.creator"></span>
                            </div>
                            <div class="table_bottom_item">
                                <span class="table_bottom_title">经办人 : </span>
                                <span v-text="baseInfo.operator"></span>
                            </div>
                        </div>


                    </div>
                </div>

            </div>
        </div>
        <div class="model_footer">
            <el-button size="small" v-RouterBack style="width: 90px; margin-left: 25px;">返 回</el-button>
        </div>
    </div>
</template>

<script>
import api from 'api/purchase'
export default {
    data(){
        return {
            baseInfo: {}
        }
    },
    computed:{},
    methods:{
        getRejectList(){
            var id = this.$store.state.home.currentModelId

            api.getRejectItemData(id).then((response) => {
                console.log(response)
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
                if (column.property == 'returnNumber' || column.property == 'returnMoney'){
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
        this.getRejectList()
    },
    created(){},
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
.content_top{
    padding: 0 10px;
}
.tab_title{
    height: 65px;
    line-height: 65px;
    padding-left: 20px;
    font-size: 15px;
}
.title_title{
    color: #929597;
}
.title_data{
    color: #5f6264;
    margin-right: 40px;
}
.title_states{
    color: #ec706b;
    font-size: 18px;
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
    height: 90px;
    border-top: none;
    color: #333;
}
.table_bottom_title{
    display: inline-block;
    width: 70px;
    text-align: right;
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
    padding-top: 100px
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
</style>
