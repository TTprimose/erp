<template>
    <div>
        <div class="model_topcol">
            <span class="blue">{{$allEnumeration.boundType[$route.params.type]}}单</span><span> - 详情</span>
            <div>
                <!--<el-button size="small">打印</el-button>-->
            </div>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="tab_content">
                <div class="tab_title fontWe_600">
                    <span class="title_states" v-if="inbound">{{$allEnumeration.storeType[goodsInfoData.storeType]}}</span>
                    <span class="title_states" v-if="outbound">{{$allEnumeration.deliverType[goodsInfoData.deliverType]}}</span>
                    <div>
                        <span class="title_title">{{$allEnumeration.boundType[$route.params.type]}}仓库 : </span>
                        <span class="title_data" v-if="inbound">{{goodsInfoData.storeHouseName}}</span>
                        <span class="title_data" v-if="outbound">{{goodsInfoData.deliverHouseName}}</span>
                    </div>
                    <div>
                        <span class="title_title">{{$allEnumeration.boundType[$route.params.type]}}单号 : </span>
                        <span class="title_data" v-if="inbound">{{goodsInfoData.storeNo}}</span>
                        <span class="title_data" v-if="outbound">{{goodsInfoData.deliverNo}}</span>
                    </div>
                    <div>
                        <span class="title_title">采购单位 : </span>
                        <span class="title_data">{{goodsInfoData.buyerName}}</span>
                    </div>
                    <div>
                        <span class="title_title">{{$allEnumeration.boundType[$route.params.type]}}时间 : </span>
                        <span class="title_data" v-if="inbound">{{goodsInfoData.storeTime | time_s}}</span>
                        <span class="title_data" v-if="outbound">{{goodsInfoData.deliverTime | time_s}}</span>
                    </div>
                    <div>
                        <span class="title_title">制单人 : </span>
                        <span class="title_data">{{goodsInfoData.creator}}</span>
                    </div>
                </div>
                <div class="banner">
                    商品信息
                </div>
                <div class="table_wrap" :style="{height: $store.state.home.modelContentHeight - 128 + 'px'}">
                    <el-table
                        :data="goodsInfoData.list"
                        show-summary
                        border
                        :summary-method="getSummaries"
                        style="width: 100%;">
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
                            label="生产日期">
                            <template slot-scope="scope">
                                <span>{{scope.row.productionDate | time}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="deliverNumber"
                            label="数量"
                            v-if="outbound">
                        </el-table-column>
                        <el-table-column
                            prop="currentStoreNumber"
                            label="数量"
                            v-if="inbound">
                        </el-table-column>
                        <el-table-column
                            prop="itemQuantifierUnit"
                            label="单位">
                        </el-table-column>
                        <el-table-column
                            prop="remark"
                            label="备注">
                        </el-table-column>
                    </el-table>
                    <div class="table_bottom">
                        <div class="table_bottom_item">
                            <span class="table_bottom_title">{{$allEnumeration.boundType[$route.params.type]}}备注 : </span>
                            <span v-if="inbound">{{goodsInfoData.storeRemark}}</span>
                            <span v-if="outbound">{{goodsInfoData.remark}}</span>
                        </div>
                        <div class="table_bottom_item">
                            <span class="table_bottom_title">经办人 : </span>
                            <span>{{goodsInfoData.operator}}</span>
                        </div>
                        <!-- <div class="table_bottom_item" v-if="invalid">
                            <span class="table_bottom_title">作废时间 : </span>
                            <span>{{goodsInfoData.invalidTime | time_s}}</span>
                        </div>
                        <div class="table_bottom_item" v-if="invalid">
                            <span class="table_bottom_title">作废理由 : </span>
                            <span>{{goodsInfoData.invalidReason}}</span>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="model_footer">
            <el-button style="width: 90px" size="small" v-RouterBack>返回</el-button>
        </div>
    </div>
</template>

<script>
import 'utils/allEnumeration'
import ME from 'utils/base'
import API from 'api/depot'
export default {
    data() {
        return {
            goodsInfoData: '',
            orderDetail: {
                list: [
                    {
                        currentStoreNumber: 0,
                        id: '',
                        itemId: '这和商品',
                        purchasingNumber: '',
                        remark: '',
                        storeOrderId: ''
                    }
                ],
                buyerId: '',
                buyerName: '',
                creator: '',
                id: '',
                operator: '',
                purchaseOrderId: '',
                purchaseOrderNo: '',
                storeHouseId: '',
                storeHouseName: '',
                storeNo: '',
                storeRemark: '',
                storeTime: '',
                storeType: '',
                totalStoreNumber: 0
            },
            outbound: false,
            inbound: true,
            invalid: false
        }
    },
    computed:{},
    methods:{
        // 表格合计计算
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];

            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));

                if (!values.every(value => isNaN(value))) {

                    // sums[7] = values.reduce((prev, curr) => {
                    //     let value2 = parseInt(curr, 10);
                    //
                    //     if (!isNaN(value2)) {
                    //         return prev + curr;
                    //     } else {
                    //         return prev;
                    //     }
                    // }, this.goodsInfoData.totalStoreNumber);
                    sums[7] = this.goodsInfoData.totalStoreNumber || this.goodsInfoData.totalDeliverNumber

                } else {
                    sums[index] = '';
                }
            })
            return sums;
        },
        // 获取详情
        getboundDetail() {
            if (this.inbound) { // 入库单
                console.log("入库")
                API.getInboundDetail(this.$route.params.id).then(res => {
                    this.goodsInfoData = ME.deepCopy(res.data)
                    if (this.goodsInfoData.invalidTime) {
                        this.invalid = true
                    }
                })
            } else if (this.outbound) { // 出库单
                console.log("出库")
                API.getOutboundDetail(this.$route.params.id).then(res => {
                    this.goodsInfoData = ME.deepCopy(res.data)
                    if (this.goodsInfoData.invalidTime) {
                        this.invalid = true
                    }
                })
            }
        }

    },
    mounted() {
        // this.getboundDetail()

    },
    activated () {
        if (this.$route.params.type === 'inbound') {
            this.inbound = true
            this.outbound = false
        } else if (this.$route.params.type === 'outbound') {
            this.outbound = true
            this.inbound = false
        }
        this.getboundDetail()
        console.log(this.inbound, this.outbound, this.$route)
    }
}
</script>

<style scoped>
    .table_wrap{
        overflow-y: scroll;
    }
    .model_topcol .blue {
        color: #409eff;
    }
    .model_footer{
        line-height: 50px;
        text-align: left;
        padding-left: 40px;
    }
    .tab_title{
        height: 65px;
        line-height: 65px;
        font-size: 14px;
        background: #FFFFFF;
        font-weight: bold;
        display: flex;
        justify-content: space-around;
    }
    .title_states{
        color: #f66c6b;
        font-size: 16px;
    }
    .title_title{
        color: #909399;
    }
    .title_data{
        color: #666;
    }
    .banner{
        height: 45px;
        font: 14px/45px "Microsoft YaHei";
        font-weight: bold;
        text-indent: 10px;
    }
    .table_wrap{
        padding: 10px;
        background: #FFFFFF;
    }
    .table_bottom{
        padding: 15px 0 0 10px;
    }
    .table_bottom_item{
        line-height: 28px;
        color: #606266;
    }
    .table_bottom_title{
        color: #909399;
    }
</style>
