<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">订单</span>
            <span> - 合并订单</span>
            <span style="margin-left: 5px">(合并订单是指将买家名称、手机号、收货地址相同的订单合并为一个订单进行发货)</span>
            <!-- <div>
                <el-button type="primary" size="small">下载模板</el-button>
            </div> -->
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <div class="mergeOderListTab">
                    <el-tabs v-model="activeName" @tab-click="tabClickEvent">
                        <el-tab-pane label="待合并" name="first">
                            <div class="tableTitle">
                                <table>
                                    <tr style="padding-left: 10px">
                                        <td class="ta_col_01">商品名称</td>
                                        <td class="ta_col_02">商品规格</td>
                                        <td class="ta_col_03">商品单价(元)</td>
                                        <td class="ta_col_04">商品数量</td>
                                        <td class="ta_col_05">订单金额(元)</td>
                                        <td class="ta_col_06">买家</td>
                                        <td class="ta_col_07">订单状态</td>
                                        <td class="ta_col_08">备注</td>
                                        <td class="ta_col_09">操作</td>
                                    </tr>
                                </table>
                            </div>
                            <div :style="{height: $store.state.home.modelContentHeight - 125 + 'px', overflow: 'auto'}" class="waitMergeContent">
                                <div v-for="(item0, key0) in waitMergeTableData" :key="key0" class="waitMergeContent_wrap">
                                    <div class="positio_center" v-if="waitMergeTableData.length == 0">
                                        暂无数据
                                    </div>
                                    <table v-for="(item1, index1) in item0" :key="index1">
                                        <colgroup>
                                            <col class="ta_col_01">
                                            <col class="ta_col_02">
                                            <col class="ta_col_03">
                                            <col class="ta_col_04">
                                            <col class="ta_col_05">
                                            <col class="ta_col_06">
                                            <col class="ta_col_07">
                                            <col class="ta_col_08">
                                            <col class="ta_col_09">
                                        </colgroup>
                                        <tr class="table_item_title bder_bot">
                                            <td colspan="9">
                                                <div style="float: left;">
                                                    <el-checkbox v-model="item1.checked" @change="chooseOrder($event, item1.secondaryOrderNo, key0)"></el-checkbox>
                                                </div>
                                                <div style="float: left;">
                                                    <span style="margin-left: 10px">订单编号 : </span>
                                                    <span v-text="item1.secondaryOrderNo"></span>
                                                </div>
                                                <div style="float: left;">
                                                    <span style="margin-left: 10px">付款时间 : </span>
                                                    <span>{{item1.payTime | time_s}}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-for="(item2, index2) in item1.item" :key="index2" class="table_goods_item">
                                            <td class="maxWord bder_bot" style="padding-left: 10px">
                                                <div class="maxWord" v-text="item2.itemName"></div>
                                                <div v-if="item2.isGiving == 1" class="maxWord">
                                                    <span style="font-size: 14px;" class="color_red">(赠品)</span>
                                                    <span class="el-icon-error myCur" @click="removeGiveAway(item2.id)"></span>
                                                </div>
                                            </td>
                                            <td class="bder_bot center">
                                                <el-tooltip class="item" effect="dark" :content="item2.specsMsg" placement="bottom-start">
                                                    <span class="maxWord" :span="4" v-text="item2.specsMsg"></span>
                                                </el-tooltip>
                                            </td>
                                            <td class="bder_bot center">
                                                {{item2.price | numFormat}}
                                            </td>
                                            <td class="bder_bot center">
                                                {{item2.quantity}}
                                            </td>
                                            <td v-if="index2 == 0" :rowspan="item1.item.length" class="bder_bot center bder_left">
                                                <span class="color_red">{{item1.receivedPrice | numFormat}}</span><br>
                                                <span>含运费 ：</span>
                                                <span>{{item1.freight | numFormat}}</span><br>
                                                <span>总计 ：</span>
                                                <span>{{item1.quantity}}</span>
                                                <span>件</span>
                                            </td>
                                            <td style="padding: 0 10px" v-if="index2 == 0" :rowspan="item1.item.length" class="bder_bot center bder_left">
                                                <span v-text="item1.userName"></span><br>
                                                <span v-text="item1.cellPhone"></span><br>
                                                <span v-text="item1.receiveAddress"></span>
                                            </td>
                                            <td v-if="index2 == 0" :rowspan="item1.item.length" class="bder_bot center bder_left">
                                                <span v-if="item1.secondaryStatus == 0">待支付</span>
                                                <span v-if="item1.secondaryStatus == 1 && item1.supStatus == 1">待发货</span>
                                                <span v-if="item1.secondaryStatus == 1 && item1.supStatus == 0">待接单</span>
                                                <span v-if="item1.secondaryStatus == 2">待收货</span>
                                                <span v-if="item1.secondaryStatus == 3">已完成</span>
                                                <span v-if="item1.secondaryStatus == 4">已关闭</span>
                                            </td>
                                            <td class="bder_bot center bder_left">
                                                {{item2.remark}}
                                            </td>
                                            <td v-if="index2 == 0" :rowspan="item1.item.length" class="bder_bot center bder_left">
                                                <el-button
                                                    type="text"
                                                    v-perss="'添加赠品'"
                                                    v-if="item1.supStatus==0 && item1.secondaryStatus == 1"
                                                    @click="addGiveaway(item1.secondaryOrderNo)"
                                                    size="small">
                                                    添加赠品
                                                </el-button>
                                                <br>
                                                <el-button
                                                    type="text"
                                                    v-perss="'订单详情'"
                                                    @click="enterDetail(item1.secondaryOrderNo)"
                                                    size="small">
                                                    查看详情
                                                </el-button>
                                            </td>
                                        </tr>
                                    </table>
                                    <el-row class="mergerOrderBotton" style="padding-right: 10px">
                                        <el-col :offset="19" :span="5">
                                            <el-button v-perss="'合并订单'" type="primary" size="small" @click="mergeOrder(key0)">合并订单</el-button>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="已合并" name="second">
                            <div class="tableTitle">
                                <table>
                                    <tr style="padding-left: 10px">
                                        <td class="ta_col_01">商品名称</td>
                                        <td class="ta_col_02">商品规格</td>
                                        <td class="ta_col_03">商品单价(元)</td>
                                        <td class="ta_col_04">商品数量</td>
                                        <td class="ta_col_05">订单金额(元)</td>
                                        <td class="ta_col_06">买家</td>
                                        <td class="ta_col_07">订单状态</td>
                                        <td class="ta_col_08">备注</td>
                                        <td class="ta_col_09">操作</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="waitMergeContent" :style="{height: $store.state.home.modelContentHeight - 125 + 'px', overflow: 'auto'}">
                                <div v-for="(item0, key0) in orderMergeTableData" :key="key0" class="waitMergeContent_wrap">
                                    <div class="positio_center" v-if="orderMergeTableData.length == 0">
                                        暂无数据
                                    </div>
                                    <table v-for="(item1, index1) in item0" :key="index1">
                                        <colgroup>
                                            <col class="ta_col_01">
                                            <col class="ta_col_02">
                                            <col class="ta_col_03">
                                            <col class="ta_col_04">
                                            <col class="ta_col_05">
                                            <col class="ta_col_06">
                                            <col class="ta_col_07">
                                            <col class="ta_col_08">
                                            <col class="ta_col_09">
                                        </colgroup>
                                        <tr v-if="index1 == 0">
                                            <td colspan="9" style="height: 55px">
                                                <div style="text-align: left; padding-left: 20px;" class="color_red">
                                                    <span>订单编号 : </span>
                                                    <span v-text="item0[0].mergeOrderNo"></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr class="table_item_title bder_bot">
                                            <td colspan="9">
                                                <div style="float: left;">
                                                    <span style="margin-left: 10px">订单编号 : </span>
                                                    <span v-text="item1.secondaryOrderNo"></span>
                                                </div>
                                                <div style="float: left;">
                                                    <span style="margin-left: 10px">付款时间 : </span>
                                                    <span>{{item1.payTime | time_s}}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-for="(item2, index2) in item1.item" :key="index2" class="table_goods_item">
                                            <td class="maxWord bder_bot" style="padding-left: 10px">
                                                <div class="maxWord" v-text="item2.itemName"></div>
                                                <div v-if="item2.isGiving == 1" class="maxWord">
                                                    <span style="font-size: 14px;" class="color_red">(赠品)</span>
                                                    <span class="el-icon-error myCur" @click="removeGiveAway(item2.id)"></span>
                                                </div>
                                            </td>
                                            <td class="bder_bot center">
                                                <el-tooltip class="item" effect="dark" :content="item2.specsMsg" placement="bottom-start">
                                                    <span class="maxWord" :span="4" v-text="item2.specsMsg"></span>
                                                </el-tooltip>
                                            </td>
                                            <td class="bder_bot center">
                                                {{item2.price | numFormat}}
                                            </td>
                                            <td class="bder_bot center">
                                                {{item2.quantity}}
                                            </td>
                                            <td v-if="index2 == 0" :rowspan="item1.item.length" class="bder_bot center bder_left">
                                                <span class="color_red">{{item1.receivedPrice | numFormat}}</span><br>
                                                <span>含运费 ：</span>
                                                <span>{{item1.freight | numFormat}}</span><br>
                                                <span>总计 ：</span>
                                                <span>{{item1.quantity}}</span>
                                                <span>件</span>
                                            </td>
                                            <td style="padding: 0 10px" v-if="index2 == 0" :rowspan="item1.item.length" class="bder_bot center bder_left">
                                                <span v-text="item1.userName"></span><br>
                                                <span v-text="item1.cellPhone"></span><br>
                                                <span v-text="item1.receiveAddress"></span>
                                            </td>
                                            <td v-if="index2 == 0" :rowspan="item1.item.length" class="bder_bot center bder_left">
                                                <span v-if="item1.secondaryStatus == 0">待支付</span>
                                                <span v-if="item1.secondaryStatus == 1 && item1.supStatus == 1">待发货</span>
                                                <span v-if="item1.secondaryStatus == 1 && item1.supStatus == 0">待接单</span>
                                                <span v-if="item1.secondaryStatus == 2">待收货</span>
                                                <span v-if="item1.secondaryStatus == 3">已完成</span>
                                                <span v-if="item1.secondaryStatus == 4">已关闭</span>
                                            </td>
                                            <td class="bder_bot center bder_left">
                                                {{item2.remark}}
                                            </td>
                                            <td v-if="index2 == 0" :rowspan="item1.item.length" class="bder_bot center bder_left">
                                                <el-button
                                                    type="text"
                                                    v-perss="'添加赠品'"
                                                    v-if="item1.supStatus==0 && item1.secondaryStatus == 1"
                                                    @click="addGiveaway(item1.secondaryOrderNo)"
                                                    size="small">
                                                    添加赠品
                                                </el-button>
                                                <br>
                                                <el-button
                                                    type="text"
                                                    v-perss="'订单详情'"
                                                    @click="enterDetail(item1.secondaryOrderNo)"
                                                    size="small">
                                                    查看详情
                                                </el-button>
                                            </td>
                                        </tr>
                                    </table>
                                    <el-row style="padding-right: 10px" class="mergerOrderBotton">
                                        <el-col :offset="18" :span="6">
                                            <el-button v-perss="'发货'" @click="sendCostsBtn(item0[0].mergeOrderNo)" v-if="item0[0].secondaryStatus == 1 && item0[0].supStatus == 1" type="primary" size="small">发 货</el-button>
                                            <el-button v-perss="'接单'" @click="reciveOrderBtn(item0[0].mergeOrderNo)" v-if="item0[0].secondaryStatus == 1 && item0[0].supStatus == 0" type="primary" size="small">接 单</el-button>
                                            <el-button v-perss="'拆分订单'" size="small" @click="splitOrder(item0[0].mergeOrderNo)">还原订单</el-button>
                                        </el-col>
                                    </el-row>
                                </div>


                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
        <div class="model_footer">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="tableParam.pageNo"
                :page-sizes="[10, 30, 50, 100]"
                :page-size="tableParam.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
            <!-- <el-button size="small" v-RouterBack style="width: 90px; margin-left: 25px;">返 回</el-button> -->
        </div>


        <!-- 订单发货 -->
        <el-dialog
            title="订单发货"
            :visible.sync="deliverydialogVisible"
            :close-on-click-modal="false"
            @close="deliverydialogCansule"
            width="20%"
           >
           <el-form :model="logisticsDialogData" label-position="right" size="small" label-width="80px">
               <el-form-item label="快递公司">
                    <el-select style="width: 194px" v-model="logisticsDialogData.logisticsCom" placeholder="请选择物流公司">
                        <el-option v-for="(item, key) in $allEnumeration.logistics" :key="key" :label="item" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-for="(item, index) in logisticsDialogData.logosLog" :key="index" label="物流单号">
                    <el-input style="width: 194px" v-model="logisticsDialogData.logosLog[index]" placeholder="请输入物流单号"></el-input>
                    <i @click="removeLogisticsItemBtn(index)" v-if="logisticsDialogData.logosLog.length != 1" class="el-icon-error myCur"></i>
                </el-form-item>

           </el-form>

            <el-button icon="el-icon-plus" @click="addLogisticsItemBtn" type="text" size="small">添加物流单号</el-button>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="deliverydialogCansule">取 消</el-button>
                <el-button size="small" type="primary" @click="addLogisticsSaveBtn">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 接单信息 -->
        <el-dialog
            title="接单"
            :visible.sync="recivedialogVisible"
            :close-on-click-modal="false"
            width="20%"
           >
            <span>核对订单信息无误,确定接单吗?</span><br>

            <el-radio v-model="reciveType" label="1">快递</el-radio>
            <el-radio v-model="reciveType" label="2">物流</el-radio>
            <el-radio v-model="reciveType" label="0">自提</el-radio>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="recivedialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="reciveOrderListEvent">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import API from 'api/mergeOrder'
import oapi from 'api/order'
export default {
    data(){
        return {
            currMergeOrderNo: '',
            logisticsDialogData: {
                logisticsCom: '',
                logosLog: ['']
            },
            reciveType: '1',
            deliverydialogVisible: false,
            recivedialogVisible: false,
            activeName: 'first',
            waitMergeTableData: {},
            orderMergeTableData: {},
            secondaryOrderNos: '',
            tableParam: {
                pageNo: 1,
                pageSize: 10
            },
            totalPage: 0,
            secondaryOrderNoArr: []
        }
    },
    computed:{},
    methods:{
        tabClickEvent(){
            this.tableParam.pageSize = 10
            this.tableParam.pageNo = 1
            if (this.activeName == 'first') {
                this.getWaitmergeList()
            } else {
                this.getOrdermergeList()
            }
        },
        handleSizeChange(val){
            this.tableParam.pageSize = val
            if (this.activeName == 'first') {
                this.getWaitmergeList()
            } else {
                this.getOrdermergeList()
            }

        },
        handleCurrentChange(val){
            this.tableParam.pageNo = val
            if (this.activeName == 'first') {
                this.getWaitmergeList()
            } else {
                this.getOrdermergeList()
            }
        },
        removeGiveAway(itemId){
            oapi.remGiveaway(itemId).then((response) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '删除赠品成功!'
                })
                // 获取待合并订单列表
                this.getWaitmergeList()
                // 获取待拆分订单列表
                this.getOrdermergeList()
            })
        },
        reciveOrderBtn(orderNo){ //接单按钮
            this.currMergeOrderNo = orderNo
            this.recivedialogVisible = true
        },
        reciveOrderListEvent(){ //接单确定
            oapi.receiveOrderList(this.currMergeOrderNo, this.reciveType).then((response) => {
                this.recivedialogVisible = false
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '接单成功!'
                })
                // 获取待合并订单列表
                this.getWaitmergeList()
                // 获取待拆分订单列表
                this.getOrdermergeList()
            })
        },
        sendCostsBtn(orderNo){  //发货按钮点击事件
            this.currMergeOrderNo = orderNo
            this.deliverydialogVisible = true
        },
        addLogisticsSaveBtn(){
            var obj = {
                secondaryOrderNo : this.currMergeOrderNo,
                logisticNo : this.logisticsDialogData.logosLog.join(','),
                logisticsCode  : this.logisticsDialogData.logisticsCom
            }

            oapi.orderListSend(obj).then((response) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '发货成功!'
                })

                // 获取待合并订单列表
                this.getWaitmergeList()
                // 获取待拆分订单列表
                this.getOrdermergeList()

                this.deliverydialogVisible = false

            })
        },
        addLogisticsItemBtn(){  //订单发货弹窗增加
            this.logisticsDialogData.logosLog.push('')
        },
        removeLogisticsItemBtn(index){ //订单发货弹窗减少
            this.logisticsDialogData.logosLog.splice(index, 1)
        },
        deliverydialogCansule(){  //订单发货弹窗关闭回调
            this.deliverydialogVisible = false
            this.logisticsDialogData = {
                logisticsCom: '',
                logosLog: ['']
            }
        },
        // 获取待合并列表
        getWaitmergeList() {
            API.getWaitmergeList(this.tableParam).then((res) => {
                this.waitMergeTableData = res.data.list
                this.totalPage = res.data.total

                // 将地址后两位截取，姓名和手机号
                for (let key in this.waitMergeTableData) {
                    this.waitMergeTableData[key].forEach((obj) => {
                        let arr = obj.receiveAddress.split(',')

                        this.$set(obj, 'checked', false)

                        obj.receiveAddress = arr.slice(0, arr.length - 2).join(',')
                    })
                }
            })
        },
        // 获取已合并列表
        getOrdermergeList() {
            API.getOrdermergeList(this.tableParam).then((res) => {
                this.orderMergeTableData = res.data.list
                this.totalPage = res.data.total
                console.log(this.orderMergeTableData)
                // 将地址后两位截取，姓名和手机号
                for (let key in this.orderMergeTableData) {
                    this.orderMergeTableData[key].forEach((obj) => {
                        let arr = obj.receiveAddress.split(',')

                        obj.receiveAddress = arr.slice(0, arr.length - 2).join(',')
                    })
                }
            })
        },
        // 选择订单
        chooseOrder(value, orderNo, parentIndex) {
            if (value) {
                // 被选中
                this.secondaryOrderNoArr.push({parentIndex: parseInt(parentIndex, 10), orderNo: orderNo})
            } else {
                // 取消选中
                let index = 0

                this.secondaryOrderNoArr.forEach((res, indexArr) => {
                    if (res.orderNo.indexOf(orderNo) > -1) {
                        index = indexArr
                    }
                })

                this.secondaryOrderNoArr.splice(index, 1)
            }
        },
        // 合并订单
        mergeOrder(parentIndex) {
            let orderArr = []

            this.secondaryOrderNoArr.forEach((obj) => {
                if (obj.parentIndex == parentIndex) {
                    orderArr.push(obj.orderNo)
                }
            })
            if (orderArr.length < 2) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '至少选择俩个订单进行合并！'
                });
                return
            }
            this.secondaryOrderNos = orderArr.join(',')
            API.mergeOrder({secondaryOrderNos: this.secondaryOrderNos}).then((res) => {
                if (res.result == 1) {
                    this.$message({
                        type: 'success',
                        duration: 1500,
                        showClose: true,
                        message: '合并成功！'
                    });
                    this.secondaryOrderNoArr = []
                    this.getOrdermergeList()
                    this.getWaitmergeList()
                }
            })

        },
        // 拆分订单
        splitOrder(orderNo) {
            API.splitOrder({mergeOrderNo: orderNo}).then((res) => {
                if (res.result == 1) {
                    this.$message({
                        type: 'success',
                        duration: 1500,
                        showClose: true,
                        message: '还原订单成功！'
                    });
                    this.getOrdermergeList()
                    this.getWaitmergeList()
                }
            })
        },
        // 进入详情页
        enterDetail(orderNo) {
            this.$store.commit('setCurrentModelId', orderNo)
            this.$router.push({
                path: '/oderDetail'
            })
        },
        //添加赠品
        addGiveaway(orderNo){
            this.$store.commit('setCurrentModelId', orderNo)
            this.$router.push({
                path: '/addGiveaway/2'
            })
        }
    },
    created(){},
    mounted(){

    },
    activated(){
        if (this.activeName == 'first') {
            this.getWaitmergeList()
        } else {
            this.getOrdermergeList()
        }
    }

}
</script>
<style scoped>
/* .maxWord{white-space:nowrap; overflow:hidden; text-overflow:ellipsis;} */
.model_content_inner{
    position: relative;
}

.model_footer{
    text-align: right;
}
.tableTitle{
    font-weight: bold;
    font-size: 14px;
    color: #606266;
    background: #F5F5F5;
    height: 48px;
    line-height: 48px;
    padding-left: 10px;
    padding-right: 30px;
}
.tableTitle table{
    width: 100%;
}
.tableTitle .el-col{
    padding: 0 20px;
}
.waitMerger_order_title{
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    background: #F5F5F5;
    padding-left: 10px;
}
.waitMergeContent{
    padding: 10px;
    position: relative;
}

.waitMerger_order_goods{
    height: 69px;
    border-bottom: 1px solid #DCDFE6;
}
.waitMergeContent_wrap{
    border: 1px solid #DCDFE6;
    margin-bottom: 20px;
}
.waitMerger_order_goods .el-col{
    padding: 0 10px;
}
.mergerOrderBotton{
    height: 55px;
    line-height: 55px;
    text-align: right;
}

.color_red{
    font-weight: bold;
    font-size: 16px;
}
.no_border{
    border: none;
}
.order_goods_wrap_right{
    height: 100%;
    position: absolute;
    right: 0
}
.order_goods_wrap_right .el-row{
    height: 100%;
}
.order_goods_wrap_right .el-col{
    text-align: center;
}
.order_goods_wrap{
    position: relative;
}
.el-button--text.el-button--small{
    padding: 0
}
.positio_center{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 100px;
    height: 100px;
    color: #909399;
}
.ta_col_01{
    width: 21%;
}
.ta_col_02{
    width: 16.5%;
    text-align: center;
}
.ta_col_03{
    width: 8%;
    text-align: center;
}
.ta_col_04{
    width: 8%;
    text-align: center;
}
.ta_col_05{
    width: 8%;
    text-align: center;
}
.ta_col_06{
    width: 12%;
    text-align: center;
}
.ta_col_07{
    width: 8%;
    text-align: center;
}
.ta_col_08{
    width: 8%;
    text-align: center;
}
.ta_col_09{
    width: 8%;
    text-align: center;
}
.bder_bot{
    border-bottom: 1px solid #DCDFE6;
}
.bder_top{
    border-top: 1px solid #DCDFE6;
}
.bder_left{
    border-left: 1px solid #DCDFE6;
}
.bder_right{
    border-left: 1px solid #DCDFE6;
}
.center{
    text-align: center;
}
.table_item_title td{
    font-size: 14px;
    background: #F5F5F5;
    height: 32px;
    padding-left: 10px;
}
.table_goods_item{
    height: 69px;
}
</style>
