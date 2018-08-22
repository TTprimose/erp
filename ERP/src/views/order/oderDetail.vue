<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">订单列表</span>
            <span> - 订单详情</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <div style="padding: 10px 10px 0 10px">
                    <step-bar :step-texts="testText" :step-nums="stepNums" :current-step="currentStep"></step-bar>
                </div>
                <div style="height: 81px; line-height: 81px; padding-left: 20px; margin-top: 40px" class="color_red">
                    <span>当前订单状态 : </span>
                    <span v-if="orderInfo.secondaryStatus == 0">待支付</span>
                    <span v-if="orderInfo.secondaryStatus == 1 && orderInfo.supStatus == 1">待发货</span>
                    <span v-if="orderInfo.secondaryStatus == 1 && orderInfo.supStatus == 0">待接单</span>
                    <span v-if="orderInfo.secondaryStatus == 2">待收货</span>
                    <span v-if="orderInfo.secondaryStatus == 3">已完成</span>
                    <span v-if="orderInfo.secondaryStatus == 4">已关闭</span>
                    <span v-if="orderInfo.secondaryStatus == 5">交易关闭</span>
                    <div style="float: right; margin-right: 20px;">
                        <el-button v-if="orderInfo.secondaryStatus == 0" @click="updateCostEvent" type="primary" size="small">修改费用信息</el-button>
                    </div>
                </div>
                <div class="banner">基本信息</div>
                <div class="baseInfo">
                    <div class="baseItem">
                        <span>订单编号 : </span>
                        <span v-text="orderInfo.secondaryOrderNo"></span><br>
                        <span>支付平台 : </span>
                        <span v-if="orderInfo.payType == 'ali'">支付宝</span>
                        <span v-if="orderInfo.payType == 'wx'">微信</span>
                        <span v-if="orderInfo.payType == 'audit'">线下支付</span>
                        <br>
                        <span>订单来源 : </span>
                        <span v-if="orderInfo.orderSource == 0">APP</span>
                        <span v-if="orderInfo.orderSource == 1">PC</span>
                        <span v-if="orderInfo.orderSource == 2">代下单</span>
                    </div>
                    <div class="baseItem">
                        <span>买家 : </span>
                        <span v-text="orderInfo.shopName"></span><br>
                        <span v-if="orderInfo.payNo != '0'">支付编号 : </span>
                        <span v-if="orderInfo.payNo != '0'" v-text="orderInfo.payNo"></span>
                    </div>
                </div>
                <div class="banner">物流信息</div>
                <div v-if="!orderInfo.logisticMsg" class="nologistics">
                    暂无发货信息
                </div>
                <div v-if="orderInfo.logisticMsg" class="logistics">
                    <el-tabs v-model="activeName">
                        <el-tab-pane style="border: 1px solid #e4e7ed;background: #f5f5f5" v-for="(item1, index1) in orderInfo.logisticMsg" :key="index1" :label="'包裹' + (index1 + 1)" :name="index1 + ''">
                            <div style="height: 35px; line-height: 35px; border-bottom: 1px solid #e4e7ed">
                                <span style="padding-left: 20px;">物流公司: </span><span style="margin-right: 20px;" v-text="item1.logisticsName"></span>
                                <span>物流单号: </span><span v-text="item1.logisticNo"></span>
                            </div>
                            <div>
                                <div v-if="index2 <= 1" v-for="(item2, index2) in item1.list.list" :key="index2" class="logistics_item">
                                    <span v-text="item2.remark" class="logistics_item_span"></span><br>
                                    <span v-text="item2.datetime" class="logistics_item_span"></span>
                                </div>
                                <div v-if="item1.logisticLookflg">
                                    <div v-if="index2 > 1 && index2 < item1.list.list.length - 1" v-for="(item2, index2) in item1.list.list" :key="index2" class="logistics_item">
                                        <span v-text="item2.remark" class="logistics_item_span"></span><br>
                                        <span v-text="item2.datetime" class="logistics_item_span"></span>
                                    </div>
                                </div>
                                <div style="padding-left: 30px;" class="myCur color_brown" v-if="!item1.logisticLookflg && item1.isMaxThree" @click="logisticLookTotalBtn(index1)">
                                    <span>...查看全部</span>
                                </div>
                                <div v-if="index2 > 1 && index2 == (item1.list.list.length - 1)" v-for="(item2, index2) in item1.list.list" :key="index2" class="logistics_item">
                                    <span v-text="item2.remark" class="logistics_item_span"></span><br>
                                    <span v-text="item2.datetime" class="logistics_item_span"></span>
                                </div>

                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="banner">订单明细</div>
                <div class="orderDetail">
                    <div class="orderDetail_title">
                        收货信息 :
                        <span style="margin: 0 20px;" v-text="orderInfo.shopName"></span>
                        <span v-text="orderInfo.receiveAddress"></span>
                    </div>

                    <!-- <div class="orderDetail_bottom">
                        <el-button icon="el-icon-plus" @click="addAddressClick" type="text">新增收货地址</el-button>
                    </div> -->
                </div>

                <div style="padding: 20px">
                    <el-table
                        :data="orderInfo.item"
                        ref="orderDetailTable"
                        style="width: 100%">
                        <el-table-column
                            prop="itemName"
                            label="商品"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="specsMsg"
                            label="商品规格">
                        </el-table-column>
                        <el-table-column
                            prop="price"
                            label="商品单价(元)">
                        </el-table-column>
                        <el-table-column
                            prop="quantity"
                            label="商品数量">
                        </el-table-column>
                        <el-table-column
                            prop="freight"
                            label="运费(元)">
                        </el-table-column>
                        <el-table-column
                            prop="couponMoney"
                            label="优惠(元)">
                        </el-table-column>
                        <el-table-column
                            prop="receivablePrice"
                            label="小计(元)">
                        </el-table-column>
                    </el-table>
                    <el-row class="goodsTableBottom">
                        <el-col :offset="20" :span="4">
                            <span>订单金额 ： </span>
                            <span class="color_red" v-if="orderInfo.receivedPrice || orderInfo.receivedPrice == '0'">￥</span>
                            <span style="font-size: 16px;" v-if="orderInfo.receivedPrice || orderInfo.receivedPrice == '0'" class="color_red" v-text="orderInfo.receivedPrice"></span>
                        </el-col>
                    </el-row>
                </div>
                <div class="banner">操作信息</div>
                <div class="opert_conten" style="padding: 20px">
                    <el-table
                        :data="orderRecord"
                        ref="userName"
                        style="width: 100%">
                        <el-table-column
                            prop="userName"
                            label="操作者"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="created"
                            label="操作时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.created | time_m}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="orderStatus"
                            label="订单状态">
                            <template slot-scope="scope">
                                <span v-if="scope.row.orderStatus == 0">待支付</span>
                                <span v-if="scope.row.orderStatus == 1">待发货</span>
                                <span v-if="scope.row.orderStatus == 2">待收货</span>
                                <span v-if="scope.row.orderStatus == 3">已完成</span>
                                <span v-if="scope.row.orderStatus == 4">已关闭</span>
                                <span v-if="scope.row.orderStatus == 5">交易关闭</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="payStatus"
                            label="付款状态">
                            <template slot-scope="scope">
                                <span v-if="scope.row.payStatus == 0">待支付</span>
                                <span v-if="scope.row.payStatus == 1">已支付</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="sendStatus"
                            label="发货状态">
                            <template slot-scope="scope">
                                <span v-if="scope.row.sendStatus == 0">待发货</span>
                                <span v-if="scope.row.sendStatus == 1">待收货</span>
                                <span v-if="scope.row.sendStatus == 2">已收货</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="remark"
                            label="备注">
                        </el-table-column>
                    </el-table>
                </div>


            </div>
        </div>
        <div class="model_footer">
            <el-button v-RouterBack size="small" style="width: 90px; margin-left: 25px;">返 回</el-button>
        </div>

        <el-dialog
            title="修改费用信息"
            :visible.sync="costdialogVisible"
            :close-on-click-modal="false"
            @open="costDialogOpenEvent"
            width="30%"
            >
            <el-table
                :data="costOrderInfoData1"
                ref="costDetailTable"
                style="width: 100%">
                <el-table-column
                    prop="goodsCosts"
                    label="商品金额(元)"
                    >
                </el-table-column>
                <el-table-column
                    prop="freight"
                    label="运费">
                    <template slot-scope="scope">
                        <span>{{totalCost | numFormat}}</span>
                        <!-- <el-input size="mini" @change.native="unitTatalEvent1(scope)" @keyup.native="unitTatalEvent1(scope)" v-model="scope.row.freight">
                            <template slot="prepend">+￥</template>
                        </el-input> -->
                    </template>
                </el-table-column>
                <el-table-column
                    prop="preferenti"
                    label="优惠券(元)">
                </el-table-column>
            </el-table>
            <el-table
                :data="costOrderInfoData2"
                ref="costDetailTable"
                style="width: 100%">
                <el-table-column
                    prop="cost1"
                    label="活动优惠(元)"
                    >
                </el-table-column>
                <el-table-column
                    prop="selfMoney"
                    label="折扣金额">
                    <template slot-scope="scope">
                        <el-input size="mini" @change.native="unitTatalEvent2(scope)" @keyup.native="unitTatalEvent2(scope)" v-model="scope.row.selfMoney">
                            <template slot="prepend">-￥</template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="total"
                    label="支付金额(元)">
                </el-table-column>
            </el-table>


            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="costdialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="editOrderCostsEvent">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import api from 'api/order'
import stepBar from 'components/stepBar'
import areaCader from 'components/areaCascader'
export default {
    components: {
        stepBar,
        areaCader
    },
    data(){
        return {
            testText: ['1. 下单时间 2018-07-12 13:58', '2.支付时间 2018-07-12 13:58', '3.接单时间 2018-07-12 13:58', '4.待发货', '确认收货'],
            stepNums: 5,
            currentStep : 3,
            orderInfo: {},
            nologistics: false,
            costdialogVisible: false,
            addressdialogVisible: false,
            activeName: '0',
            logisticLookflg: false,
            orderRecord: [],
            totalCost: 0, //计算订单运费
            costOrderInfoData1: [],
            costOrderInfoData2: []
        }
    },
    computed:{},
    created(){},
    methods: {
        costDialogOpenEvent(){
            this.setCostOrderData(this.orderInfo)
        },
        editOrderCostsEvent(){
            var obj = {
                secondaryOrderNo: this.orderInfo.secondaryOrderNo,
                receivedPrice: Number(this.costOrderInfoData2[0].selfMoney)
            }

            api.editOrderList(obj).then((response) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '修改订单成功!'
                })

                this.costdialogVisible = false

                this.getOrderDetailInfo()
            })
        },
        logisticLookTotalBtn(index){
            this.orderInfo.logisticMsg[index].logisticLookflg = !this.orderInfo.logisticMsg[index].logisticLookflg
        },
        orderAddressClick($event){
            this.changeOrderAddressEvent()
        },
        addAddressClick(){
            this.addressdialogVisible = true
        },
        updateCostEvent(){
            this.costdialogVisible = true
        },
        formatNum(value){
            var val = value

            val = val.replace(/^0*(0\.|[1-9])/, '$1') //解决粘贴不起作用的问题
            val = val.replace(/[^\d\.]/g, '') //清除“数字”和“.”以外的字符
            val = val.replace(/\.{2,}/g, ".") //只能输入一个小数点
            val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".") //只能输入一个小数点

            if (val.indexOf(".") < 0 && val != "") {  //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                if (val.substr(0, 1) == '0' && val.length == 2) {
                    val = val.substr(1, val.length);
                }
            }
            return val
        },
        unitTatalEvent1(data){
            data.row.freight = this.formatNum(data.row.freight)

            if (data.row.freight == ''){
                data.row.freight = '0'
            }

            var freight = Number(data.row.freight)
            var goodsCost = Number(data.row.goodsCosts)
            var couponMoney = Number(this.costOrderInfoData2[0].couponMoney)

            this.costOrderInfoData2[0].total = (goodsCost + freight - couponMoney).toFixed(2)

            if (this.costOrderInfoData2[0].total < 0) {
                this.costOrderInfoData2[0].total = 0
            }
        },
        unitTatalEvent2(data){
            data.row.selfMoney = this.formatNum(data.row.selfMoney)

            if (data.row.selfMoney == ''){
                data.row.selfMoney = '0'
            }
            if (data.row.selfMoney >= data.row.total2){
                data.row.selfMoney = data.row.total2
            }

            // var freight = Number(this.costOrderInfoData1[0].freight)
            var goodsCost = Number(this.costOrderInfoData1[0].goodsCosts)
            var preferenti = Number(this.costOrderInfoData1[0].preferenti)
            var couponMoney = Number(data.row.selfMoney)

            this.costOrderInfoData2[0].total = (goodsCost - preferenti - couponMoney).toFixed(2)

            if (isNaN(this.costOrderInfoData2[0].total)) {
                this.costOrderInfoData2[0].total = 0.00
            }

            if (this.costOrderInfoData2[0].total < 0) {
                this.costOrderInfoData2[0].total = 0
            }
        },
        getOrderDetailInfo(){
            var secondaryOrderNo = this.$store.state.home.currentModelId

            api.getOrderOrderMsg(secondaryOrderNo).then((response) => {
                console.log(response)
                this.orderInfo = response.data;


                //物流信息数据处理
                if (this.orderInfo.logisticMsg && this.orderInfo.logisticMsg.length != 0) {
                    this.logisticsdialogVisible = true

                    for (var item of this.orderInfo.logisticMsg){
                        this.$set(item, 'logisticLookflg', false) //物流信息是否展开
                        if (item.list) {
                            item.list = JSON.parse(item.list)

                            if (item.list.list) {
                                var resArr = []

                                for (var item2 of item.list.list){
                                    var obj = item2

                                    resArr.unshift(obj)
                                }
                                item.list.list = resArr
                            } else {
                                item.list.list = []
                            }

                            if (item.list.list.length > 3) {
                                this.$set(item, 'isMaxThree', true) //判断物流信息长度是否大于三
                            } else {
                                this.$set(item, 'isMaxThree', false) //判断物流信息长度是否大于三
                            }

                        } else {
                            item.list = {}
                        }
                    }

                    console.log(this.orderInfo.logisticMsg)

                } else {

                }

                //计算运费
                this.totalCost = 0
                if (this.orderInfo.item && this.orderInfo.item.length > 0) {
                    for (var oitem of this.orderInfo.item){
                        if (oitem.freight) {
                            this.totalCost += Number(oitem.freight)
                        }
                    }
                }


                //修改费用信息提取
                this.setCostOrderData(this.orderInfo)
                //操作信息提取
                this.orderRecord = this.orderInfo.orderRecord

                //步进条展示

                if (this.orderInfo.receptionTime) { //收货
                    this.currentStep = 5
                    this.testText[4] = '收货时间 ' + this.myBase.changeTime(this.orderInfo.receptionTime)
                    this.testText[3] = '发货时间 ' + this.myBase.changeTime(this.orderInfo.shippingTime)
                    this.testText[2] = '接单时间 ' + this.myBase.changeTime(this.orderInfo.acceptOrderTime)
                    this.testText[1] = '支付时间 ' + this.myBase.changeTime(this.orderInfo.payTime)
                    this.testText[0] = '下单时间 ' + this.myBase.changeTime(this.orderInfo.created)
                    return
                }
                if (this.orderInfo.shippingTime) { //发货
                    this.currentStep = 4
                    this.testText[4] = '确认收货'
                    this.testText[3] = '发货时间 ' + this.myBase.changeTime(this.orderInfo.shippingTime)
                    this.testText[2] = '接单时间 ' + this.myBase.changeTime(this.orderInfo.acceptOrderTime)
                    this.testText[1] = '支付时间 ' + this.myBase.changeTime(this.orderInfo.payTime)
                    this.testText[0] = '下单时间 ' + this.myBase.changeTime(this.orderInfo.created)
                    return
                }
                if (this.orderInfo.acceptOrderTime) { //接单
                    this.currentStep = 3
                    this.testText[4] = '确认收货'
                    this.testText[3] = '待发货'
                    this.testText[2] = '接单时间 ' + this.myBase.changeTime(this.orderInfo.acceptOrderTime)
                    this.testText[1] = '支付时间 ' + this.myBase.changeTime(this.orderInfo.payTime)
                    this.testText[0] = '下单时间 ' + this.myBase.changeTime(this.orderInfo.created)
                    return
                }
                if (this.orderInfo.payTime) { //支付
                    this.currentStep = 2
                    this.testText[4] = '确认收货'
                    this.testText[3] = '待发货'
                    this.testText[2] = '待接单'
                    this.testText[1] = '支付时间 ' + this.myBase.changeTime(this.orderInfo.payTime)
                    this.testText[0] = '下单时间 ' + this.myBase.changeTime(this.orderInfo.created)
                    return
                }
                if (this.orderInfo.created) { //下单
                    this.currentStep = 1
                    this.testText[4] = '确认收货'
                    this.testText[3] = '待发货'
                    this.testText[2] = '待接单'
                    this.testText[1] = '待支付'
                    this.testText[0] = '下单时间 ' + this.myBase.changeTime(this.orderInfo.created)
                    return
                }

            })
        },
        setCostOrderData(orderInfo){
            //修改费用信息提取
            this.costOrderInfoData1 = [
                {
                    goodsCosts: orderInfo.receivablePrice,
                    freight: orderInfo.freight || '0',
                    preferenti: orderInfo.couponMoney
                }
            ]
            this.costOrderInfoData2 = [
                {
                    // receivedPrice
                    cost1: '0',
                    selfMoney: (Number(orderInfo.receivablePrice) - Number(orderInfo.receivedPrice) - Number(orderInfo.couponMoney)).toFixed(2),
                    total: Number(orderInfo.receivedPrice),
                    total2: Number(orderInfo.receivablePrice) - Number(orderInfo.couponMoney)
                }
            ]
        }
    },
    activated(){
        this.getOrderDetailInfo()
    },
    mounted(){

    }
}
</script>
<style scoped>
.moneyicon{
    font-size: 12px;
    font-weight: 400;
}
.goodsTableBottom{
    height: 50px;
    line-height: 50px;
    border: 1px solid #E4E7ED;
    border-top: none;
    font-size: 14px;
    font-weight: 600;
    color: #606266;
}
.model_content_inner{
    position: relative;
    height: 100%;
    overflow: auto;
}
.banner{
    height: 40px;
    background: #f5f5f5;
    line-height: 40px;
    color: #606266;
    font-weight: 600;
    padding-left: 10px;
}
.model_footer{
    text-align: left;
    padding-top: 10px;
}
.baseInfo{
    height: 138px;
    padding: 20px 0 20px 20px;
}
.baseInfo .baseItem{
    height: 100%;
    width: 500px;
    float: left;
}
.baseInfo .baseItem span{
    height: 35px;
    line-height: 35px;
}
.nologistics{
    height: 73px;
    line-height: 73px;
    padding-left: 20px;
}
.logistics{
    padding: 20px;
    padding-top: 0px
}
.logistics_item{
    margin-left: 15px;
    margin: 10px 0;
}
.logistics_item_span{
    margin-left: 30px;
}
.logistics_item_span_first{
    margin-left: 42px;
}
.orderDetail{
    overflow: hidden;
    padding: 20px;
    position: relative;
}
.orderDetail_item{
    height: 161px;
    float: left;
    width: 273px;
    border: 1px solid #E4E7ED;
    margin-left: 10px;
    padding: 10px 20px;
    position: relative;
    margin-bottom: 20px;
}
.orderDetail_item:hover{
    background: #ffffff;
    opacity: 0.7;
}
.orderDetail_item:hover .orderDetail_item_active{
    display: block;
}
.orderDetail_item.active{
    border: 1px solid #409EFF;
}

.orderDetail_item_top{
    height: 50%;
    border-bottom: 1px dashed #E4E7ED;
}
.orderDetail_item_bottom{
    height: 50%;
    padding-top: 10px;
}
.orderDetail_item_top_name{
    float: left;
    line-height: 60px;
}
.orderDetail_item_top_phone{
    float: right;
    text-align: right;
    line-height: 60px;
}
.orderDetail_item_active{
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: #409EFF;
    display: none;
    cursor: pointer;
}
.active .orderDetail_item_active{
    display: block;
}
.orderDetail_bottom{
    position: absolute;
    bottom: 0px;
}
.el-table{
    border: 1px solid #ebeef5;
}
</style>
