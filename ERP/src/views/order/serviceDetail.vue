<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">售后管理</span>
            <span> - 售后详情</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px', overflow: 'auto'}">
            <div class="model_content_inner">
                <div>
                    <div class="textLine">
                        <p>基本信息</p>
                    </div>
                    <div class="orderInfo">
                        <ul>
                            <li>
                                <span>退款编号：</span>
                                <span>{{orderInfo.refundNo}}</span>
                            </li>
                            <li>
                                <span>商品信息：</span>
                                <span>{{orderInfo.itemName}}</span>
                            </li>
                            <li>
                                <span>规格数量：</span>
                                <span>{{orderInfo.quantity}}</span>
                            </li>
                            <li>
                                <span>买家：</span>
                                <span>{{orderInfo.shopName}}</span>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <span>支付金额：</span>
                                <span><span>{{orderInfo.receivedPrice}}</span> 元</span>
                            </li>
                            <!-- <li>
                                <span>支付编号：</span>
                                <span>{{orderInfo.payNo}}</span>
                            </li> -->
                            <li>
                                <span>供应商：</span>
                                <span>{{orderInfo.supplierName}}</span>
                            </li>
                            <li>
                                <span>支付平台：</span>
                                <span v-if="orderInfo.payType == 'ali'">支付宝</span>
                                <span v-if="orderInfo.payType == 'wx'">微信</span>
                                <span v-if="orderInfo.payType == 'audit'">线下支付</span>
                            </li>
                            <li>
                                <span>订单来源：</span>
                                <span>
                                    <span v-if='orderInfo.orderSource == 0'>APP</span>
                                    <span v-if='orderInfo.orderSource == 1'>PC</span>
                                    <span v-if='orderInfo.orderSource == 2'>代下单</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <div class="textLine">
                        <p>退款信息</p>
                    </div>
                    <div class="orderInfo">
                        <ul>
                            <li>
                                <span>售后类型：</span>
                                <span style="color:#e13c3b">
                                    <span v-if='orderInfo.refundType == 0'>仅退款</span>
                                    <span v-if='orderInfo.refundType == 1'>申请补偿</span>
                                    <span v-if='orderInfo.refundType == 2'>退货退款</span>
                                </span>
                            </li>
                            <li>
                                <span>退货数量：</span>
                                <span>{{orderInfo.refundQuantity}}</span>
                            </li>
                            <li>
                                <span>退款原因：</span>
                                <span>
                                    <span v-if='orderInfo.refundCause == 0'>没有收到商品仅退款</span>
                                    <span v-if='orderInfo.refundCause == 1'>快递少件仅退款</span>
                                    <span v-if='orderInfo.refundCause == 2'>商品未发货仅退款</span>
                                    <span v-if='orderInfo.refundCause == 3'>奶粉憋罐补偿退款</span>
                                    <span v-if='orderInfo.refundCause == 4'>奶粉包装损坏补偿退款</span>
                                    <span v-if='orderInfo.refundCause == 5'>生产日期不一致补偿退款</span>
                                    <span v-if='orderInfo.refundCause == 6'>商品发错补偿退款</span>
                                    <span v-if='orderInfo.refundCause == 7'>奶粉爆罐退货退款</span>
                                    <span v-if='orderInfo.refundCause == 8'>奶粉憋罐退货退款</span>
                                    <span v-if='orderInfo.refundCause == 9'>包装破损退货退款</span>
                                    <span v-if='orderInfo.refundCause == 10'>商品生产日期退货退款</span>
                                    <span v-if='orderInfo.refundCause == 11'>商品发错退货退款</span>
                                    <span v-if='orderInfo.refundCause == 12'>无理由退货退款</span>
                                </span>
                            </li>
                            <li>
                                <div style="float: left;">图片：</div>
                                <div style="display: inline-block" class="textImg" v-for="(item, index) in orderInfo.refundPicUrl" :key="index">
                                    <img v-for="(date, ind) in item.picUrl" :key="ind" @click="imgClickBtn(date)" style="width: 95px; height: 95px" :src="date" alt=""/>
                                </div>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <span>退款金额：</span>
                                <span><span style="color:#e13c3b">{{orderInfo.refundPrice}}</span> 元</span>
                            </li>
                            <li>
                                <span>订单编号：</span>
                                <span>{{orderInfo.secondaryOrderNo}}</span>
                            </li>
                            <li>
                                <span>原因说明：</span>
                                <span>{{orderInfo.remark}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <div class="textLine">
                        <p>退款记录</p>
                    </div>
                    <div class="textLineT">
                        <span>售后状态：</span>
                        <span style="color:#e13c3b">
                            <span v-if='orderInfo.afterStatus == 0'>无售后</span>
                            <span v-if='orderInfo.afterStatus == 1'>待审核</span>
                            <span v-if='orderInfo.afterStatus == 2'>待寄回（审核成功）</span>
                            <span v-if='orderInfo.afterStatus == 3'>已寄回（审核成功）</span>
                            <span v-if='orderInfo.afterStatus == 4'>退款成功（审核成功）</span>
                            <span v-if='orderInfo.afterStatus == 5'>退款失败（审核成功），可再次发起</span>
                            <span v-if='orderInfo.afterStatus == 6'>撤销退款</span>
                            <span v-if='orderInfo.afterStatus == 7'>无法再退款</span>
                        </span>
                    </div>
                    <div class="textTable">
                        <el-table
                            :data="orderInfo.flow"
                            style="width: 100%;border:1px solid #e5e8ea;border-bottom:none"
                            >
                            <el-table-column
                                prop="operType"
                                label="操作对象">
                                <template slot-scope="scope">
                                    <span v-if='scope.row.operType == 0'>供应商</span>
                                    <span v-if='scope.row.operType == 1'>门店</span>
                                    <span v-if='scope.row.operType == 2'>平台</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="operContent"
                                label="操作内容">
                            </el-table-column>
                            <el-table-column
                                prop="created"
                                label="操作时间">
                                <template slot-scope="scope">
                                    {{scope.row.created | time_s}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>

        </div>

        <footer>
            <el-button size='small' @click="returnPrev" style="width:90px;margin-left:30px;margin-top:12px">返回</el-button>
        </footer>

        <!-- 图片展示 -->
        <el-dialog
        title="图片展示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
            <img style="width: 100%" :src="imgUrl" alt="">
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import api from 'api/order'
export default {
    components: {

    },
    data(){
        return {
            orderInfo: {},
            dialogVisible: false,
            imgUrl: ''
        }
    },
    computed:{},
    created(){},
    methods: {
        imgClickBtn(ourl){
            this.imgUrl = ourl
            this.dialogVisible = true
        },
        returnPrev() {
            this.$router.go(-1)
        },
        getTableFrom() {
            api.getRefundRefundMsgRefundNo(this.$store.state.home.currentModelId).then((response) => {
                this.orderInfo = response.data
                this.orderInfo.refundPicUrl = JSON.parse(this.orderInfo.refundPicUrl)
            })
        }
    },
    mounted(){

    },
    activated() {
        this.getTableFrom()
    }
}
</script>
<style scoped>
.model_content_inner{
    overflow: auto
}
.textLine{
    background: #f5f5f5;
    height: 40px;
    line-height: 40px
}
.textLine p{
    padding: 0 20px;
    color: #606266;
    font-weight: 600;
}
.orderInfo{
    display: flex;
    width: 100%;
    justify-content: space-between;
    color: #888b8b
}
.orderInfo>ul{
    padding: 20px 40px;
    width: 50%
}
.orderInfo>ul li{
    margin-bottom: 20px
}
.textLineT{
    padding:20px
}
.textTable{
    padding: 10px 20px;
}
.textImg{
    display: inline-block;
    display: flex;

}
</style>
