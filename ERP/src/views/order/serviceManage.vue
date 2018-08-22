<template>
    <div>
        <div class="model_topcol2">
            <!-- <span style="color: #409EFF">订单</span>
            <span> - 售后管理</span>
            <div>
            </div> -->
            <el-tabs v-model="tabName" @tab-click="handleClick">
                <el-tab-pane label="全部订单" name="-1"></el-tab-pane>
                <el-tab-pane label="待审核" name="1"></el-tab-pane>
                <el-tab-pane label="待寄回" name="2"></el-tab-pane>
                <el-tab-pane label="待收货" name="3"></el-tab-pane>
                <el-tab-pane label="售后完成" name="4"></el-tab-pane>
                <el-tab-pane label="售后关闭" name="5"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <el-card v-show="isSupperBoxShow" class="box_card">
                    <div slot="header" class="clearfix">
                        <span :style="{fontSize: '16px'}">高级搜索</span>
                        <i @click="supperBoxShow" class="el-icon-close" style="float: right; padding: 3px 0; cursor: pointer"></i>
                    </div>
                    <el-form :inline="true" :model="tableParam" label-position="right" size="small" label-width="80px">
                        <el-form-item label="订单编号">
                            <el-input v-model="tableParam.secondaryOrderNo" placeholder="请输入订单编号" style="width: 250px"></el-input>
                        </el-form-item>
                        <el-form-item label="申请时间">
                            <el-date-picker
                                v-model="createArr"
                                value-format="timestamp"
                                @change="datePickerChangeEvent"
                                type="datetimerange"
                                :editable="false"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="订单来源">
                            <el-select style="width: 194px" v-model="tableParam.orderSource" placeholder="请选择订单来源">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="APP" value="0"></el-option>
                                <el-option label="PC" value="1"></el-option>
                                <el-option label="代下单" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <br>
                        <el-form-item label="退款编号">
                            <el-input v-model="tableParam.refundNo" placeholder="请输入退款编号" style="width: 250px"></el-input>
                        </el-form-item>
                        <el-form-item label="付款时间">
                            <el-date-picker
                                v-model="payTime"
                                value-format="timestamp"
                                @change="datePickerChangeEvent"
                                type="datetimerange"
                                :editable="false"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="商品名称">
                            <el-input v-model="tableParam.itemName" placeholder="请输入商品名称" style="width: 194px"></el-input>
                        </el-form-item>
                        <br/>
                        <el-form-item>
                            <el-button @click="supperSureBoxShow" style="width: 90px" type="primary" >确定</el-button>
                            <el-button @click="supperCansleBoxShow" style="width: 90px">取消</el-button>
                            <el-button class="color_hover" @click="resetBtnEvent" type="text" style="width: 40px; color: #636365">清空</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <div v-show="!isExportShow&&!isFreSupBoxShow" class="purchaseList_title">
                    <!-- <el-select size="small" @change="getTableData" style="margin-right: 10px" v-model="tableParam.auditStatus" placeholder="订单状态">
                        <el-option :label="'全部订单'" :value="''"> </el-option>
                        <el-option :label="'未发货'" :value="'1'"> </el-option>
                        <el-option :label="'已发货'" :value="'2'"> </el-option>
                    </el-select> -->
                    <div>
                        <el-input
                            size="small"
                            placeholder="请输入订单编号"
                            prefix-icon="el-icon-search"
                            @clear="searchInputClear"
                            clearable
                            :style="{width: '378px'}"
                            @keyup.enter.native="getTableData"
                            v-model="tableParam.secondaryOrderNo">
                        </el-input>
                        <el-button :style="{margin: '0 10px'}" @click="getTableData" type="primary" size="small">搜索</el-button>
                        <span @click="supperBoxShow">高级搜索</span>
                    </div>
                    <!-- <div id="orderListBtnGroup">
                        <el-button type="primary" :style="{width: '90px'}" size="small" @click='stateFind($event)'>全部订单</el-button>
                        <el-button :style="{width: '90px'}" size="small" @click='stateFind($event, 1)'>待审核</el-button>
                        <el-button :style="{width: '90px'}" size="small" @click='stateFind($event, 2)'>待寄回</el-button>
                        <el-button :style="{width: '90px'}" size="small" @click='stateFind($event, 3)'>待收货</el-button>
                        <el-button :style="{width: '90px'}" size="small" @click='stateFind($event, 4)'>售后完成</el-button>
                        <el-button :style="{width: '90px'}" size="small" @click='stateFind($event, 5)'>售后关闭</el-button>
                    </div> -->

                </div>
                <div v-show="!isExportShow&&isFreSupBoxShow" class="purchaseList_title">
                    <span class="resspan">搜索结果</span>
                    <el-button @click="resetSeraBtnEvent" icon="fa fa-eraser" type="text">清除搜索</el-button>
                    <el-button @click="goSeraBtnEvent" icon="el-icon-search" type="text">继续搜索</el-button>
                    <el-button v-perss="'导出售后单'" @click="exportOrder" icon="fa fa-upload" type="text">导出</el-button>
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
                <div class="tableTitle">
                    <el-row class="tableTitle_wrap">
                        <el-col class="tableTitle_wrap_left" :span="15">
                            <el-row>
                                <el-col :span="6">商品</el-col>
                                <el-col :span="5">商品规格</el-col>
                                <el-col class="maxWord" :span="3">商品单价(元)</el-col>
                                <el-col class="maxWord" :span="3">商品数量</el-col>
                                <el-col class="maxWord" :span="4">退款金额/件数</el-col>
                                <el-col class="maxWord" :span="3">买家</el-col>
                            </el-row>
                        </el-col>
                        <el-col class="tableTitle_wrap_right" :span="9">
                            <el-row>
                                <el-col :span="8">订单状态</el-col>
                                <el-col :span="8">售后状态</el-col>
                                <el-col :span="8">操作</el-col>
                            </el-row>
                        </el-col>
                    </el-row>

                </div>
                <div class="waitMergeContent" :style="{height: $store.state.home.modelContentHeight - 125 + 'px', overflow: 'auto', position: 'relative'}">
                    <div class="positio_center" v-if="waitMergeTableData.length == 0">
                        暂无数据
                    </div>
                    <div class="waitMergeContent_wrap">
                        <div v-for="(item, index) in waitMergeTableData" :class="[waitMergeTableData.length == 0 ? 'no_border' : '', index == (waitMergeTableData.length - 1) ? 'border_bottom' : '']" :key="index" class="waitMergeContent_item">
                            <el-row style="padding-left: 10px" class="waitMerger_order_title">
                                <!-- <el-col :span="1" :style="{textAlign: 'center'}">
                                    <el-checkbox></el-checkbox>
                                </el-col> -->
                                <span>退款编号：</span>
                                <span>{{item.refundNo}}</span>
                                <span style="margin-left: 20px">订单编号：</span>
                                <span>{{item.secondaryOrderNo}}</span>
                                <span style="margin-left: 20px">付款时间：</span>
                                <span >{{item.payTime | time_m}}</span>
                                <span style="margin-left: 20px">申请时间：</span>
                                <span >{{item.created | time_m}}</span>
                            </el-row>
                            <div class="order_goods_wrap">
                                <el-row>

                                    <el-col class="order_goods_wrap_left" :span="15">
                                        <el-row type="flex" align="middle" class="waitMerger_order_goods">
                                            <el-col class="maxWord" :span="6" v-text="item.itemName"></el-col>
                                            <el-col class="maxWord" :span="5" v-text="item.specsMsg"></el-col>
                                            <el-col style="padding-left: 30px" class="maxWord" :span="4">{{item.price}}</el-col>
                                            <el-col :span="2">{{item.quantity}}</el-col>
                                            <el-col class="orderCosts" :span="4">
                                                <span class="color_red">{{item.receivedPrice}}</span><br>
                                                <span>含运费 : </span>
                                                <span>{{item.freight}}</span>
                                                <div v-if="item.specsQuantity && item.quantity">
                                                    <span>总计 ： </span>
                                                    <span>{{(Number(item.specsQuantity) * Number(item.quantity))}}</span>
                                                    <span>件</span>
                                                </div>
                                            </el-col>
                                            <el-col class="maxWord" :span="3">
                                                {{item.shopName}}
                                            </el-col>
                                        </el-row>
                                    </el-col>

                                    <el-col class="order_goods_wrap_right" :span="9">
                                        <el-row type="flex" align="middle">
                                            <el-col class="" :span="6">
                                                <span>
                                                    <span v-if="item.secondaryStatus == 0" >待支付</span>
                                                    <span v-if="item.secondaryStatus == 1 && item.supStatus == 1" >待发货</span>
                                                    <span v-if="item.secondaryStatus == 1 && item.supStatus == 0" >待接单</span>
                                                    <span v-if="item.secondaryStatus == 2" >待收货</span>
                                                    <span v-if="item.secondaryStatus == 3" >已完成</span>
                                                    <span v-if="item.secondaryStatus == 4" >已关闭</span>
                                                    <span v-if="item.secondaryStatus == 5" >交易关闭</span>
                                                </span>
                                            </el-col>

                                            <el-col class="maxWord" :span="10">
                                                <span v-if="item.afterStatus == 0" class="color_brown">无售后</span>
                                                <span v-if="item.afterStatus == 1" class="color_brown">待审核</span>
                                                <span v-if="item.afterStatus == 2" class="color_brown">待寄回</span>
                                                <span v-if="item.afterStatus == 3" class="color_brown">待收货</span>
                                                <span v-if="item.afterStatus == 4" class="color_brown">退款成功</span>
                                                <span v-if="item.afterStatus == 5" class="color_brown">退款失败</span>
                                                <span v-if="item.afterStatus == 6" class="color_brown">撤销退款</span>
                                                <span v-if="item.afterStatus == 7" class="color_brown">无法再退款</span><br>
                                                <span v-if="item.refundType == 0">仅退款</span>
                                                <span v-if="item.refundType == 1">申请补偿</span>
                                                <span v-if="item.refundType == 2">退货退款</span><br>
                                                <span>退款件数 ：</span>
                                                <span>{{item.refundQuantity}}</span>
                                                <span>件</span>
                                            </el-col>

                                            <el-col :span="6">
                                                <el-button
                                                    type="text"
                                                    style="margin-right: 5px;"
                                                    v-perss="'售后订单详情'"
                                                    @click="operaEvent(item.secondaryOrderNo, 1, item.refundNo)"
                                                    size="small">
                                                    售后详情
                                                </el-button>
                                                <el-dropdown :hide-timeout="50" trigger="click">
                                                    <span class="el-dropdown-link">
                                                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                                                    </span>
                                                    <el-dropdown-menu slot="dropdown">
                                                        <!-- <el-dropdown-item v-perss="'删除采购单'" @click.native.prevent="tablePropEvent(scope.row.id, 7)">删除</el-dropdown-item> -->
                                                        <el-dropdown-item v-perss="'订单详情'" @click.native.prevent="operaEvent(item.secondaryOrderNo, 2, item.refundNo)">订单详情</el-dropdown-item>

                                                        <el-dropdown-item v-perss="'同意退款'" @click.native.prevent="operaEvent(item.secondaryOrderNo, 3, item.refundNo)" v-if="item.refundType == 0 && item.afterStatus == 1 && item.supplierStatus == 1">同意退款</el-dropdown-item>
                                                        <el-dropdown-item v-perss="'拒绝退款'" @click.native.prevent="operaEvent(item.secondaryOrderNo, 5, item.refundNo)" v-if="item.refundType == 0 && item.afterStatus == 1 && item.supplierStatus == 1">拒绝退款</el-dropdown-item>

                                                        <el-dropdown-item v-perss="'同意退货'" @click.native.prevent="operaEvent(item.secondaryOrderNo, 4, item.refundNo)" v-if="item.refundType == 2 && item.afterStatus == 1 && item.supplierStatus == 1">同意退货</el-dropdown-item>
                                                        <el-dropdown-item v-perss="'拒绝退款'" @click.native.prevent="operaEvent(item.secondaryOrderNo, 6, item.refundNo)" v-if="item.refundType == 2 && item.afterStatus == 1 && item.supplierStatus == 1">拒绝退货</el-dropdown-item>

                                                        <el-dropdown-item v-perss="'同意退款'" @click.native.prevent="operaEvent(item.secondaryOrderNo, 3, item.refundNo)" v-if="item.refundType == 2 && item.afterStatus == 3">同意退款</el-dropdown-item>
                                                        <el-dropdown-item v-perss="'拒绝退款'" @click.native.prevent="operaEvent(item.secondaryOrderNo, 5, item.refundNo)" v-if="item.refundType == 2 && item.afterStatus == 3">拒绝退款</el-dropdown-item>

                                                        <el-dropdown-item v-perss="'同意退款'" @click.native.prevent="operaEvent(item.secondaryOrderNo, 3, item.refundNo)" v-if="item.refundType == 1 && item.afterStatus == 1 && item.supplierStatus == 1">同意退款</el-dropdown-item>
                                                        <el-dropdown-item v-perss="'拒绝退款'" @click.native.prevent="operaEvent(item.secondaryOrderNo, 5, item.refundNo)" v-if="item.refundType == 1 && item.afterStatus == 1 && item.supplierStatus == 1">拒绝退款</el-dropdown-item>

                                                    </el-dropdown-menu>
                                                </el-dropdown>
                                            </el-col>
                                        </el-row>

                                    </el-col>
                                </el-row>

                            </div>

                        </div>

                    </div>

                </div>


            </div>
        </div>
        <div class="model_footer">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="1"
                :page-sizes="[10, 30, 50, 100]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </div>

        <!-- 拒绝退款 -->
        <el-dialog
            title="拒绝退款"
            :visible.sync="declineRefundVisible"
            :close-on-click-modal="false"
            width="20%"
           >
            <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入退款理由"
            v-model="deRemark">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="declineRefundVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="declineRefundEvent">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 同意退货 -->
        <el-dialog
            title="同意退货"
            :visible.sync="greenGoodsVisible"
            :close-on-click-modal="false"
            width="40%"
           >
            <el-form :inline="true" :model="greenGoodsForm" label-position="right" size="small" label-width="80px">
                <el-form-item prop="address" label="寄回地址">
                    <el-select style="width: 550px;" filterable v-model="greenGoodsForm.address" placeholder="请选择收货地址">
                        <el-option v-for="item in addressList" :key="item.id" :label="item.address" :value="item.address"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="greenGoodsVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="greenGoodsEvent">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 拒绝退货 -->
        <el-dialog
            title="拒绝退货"
            :visible.sync="declineGoodsVisible"
            :close-on-click-modal="false"
            width="20%"
           >
            <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入退货理由"
            v-model="deGoodsRemark">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="declineGoodsVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="declineGoodsEvent">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from 'api/order'
export default {
    data(){
        return {
            exportOrderOut: process.env.API_ROOT + '/order/refund/exportExcel?',
            totalPage: 1,
            isSupperBoxShow: false,
            declineRefundVisible: false,
            declineGoodsVisible: false,
            greenGoodsVisible: false,
            isExportShow: false,
            isFreSupBoxShow: false,
            deRemark: '',
            greenGoodsForm: {
                address: ''
            },
            tabName: '-1',
            addressList: [],
            createArr: [], //储存时间控件数据
            payTime: [], //储存时间控件数据
            deGoodsRemark: '',
            currReturnNo: '',
            tableParam: {
                itemName: '',
                shopName:'',
                afterStatus:'',
                secondaryOrderNo: '',
                refundNo:"",
                createStartTime:'',
                createEndTime:'',
                payStartTime:'',
                payEndTime:'',
                pageNo: 1,
                pageSize: 10
            },
            selectTableData: [],
            waitMergeTableData: []
        }
    },
    computed:{},
    methods:{
        handleClick(tab){
            var type = tab.name

            if (type == -1) {
                this.tableParam.afterStatus = ''
            } else {
                this.tableParam.afterStatus = type
            }

            this.getTableData()
        },
        getAddressList(){ //同意退货的地址列表
            api.getRefundAddressList().then((response) => {
                console.log(response)
                this.addressList = []
                if (response.data.mapList && response.data.mapList.length > 0) {
                    for (var item of response.data.mapList) {
                        var obj = {
                            id: item.id,
                            address: item.provinceName + item.cityName + item.areaName + item.addrDetail + ' ' + item.receivedUserName + ' ' + item.cellPhone
                        }

                        this.addressList.push(obj)
                    }
                }


            })
        },
        declineRefundEvent(){ //拒绝退款
            var obj = {
                remark : this.deRemark
            }

            api.declineRefund(this.currReturnNo, obj).then(() => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '拒绝退款成功！'
                })
                this.declineRefundVisible = false
                this.deRemark = ''

                this.getTableData()
            })
        },
        declineGoodsEvent(){ //拒绝退货
            var obj = {
                remark : this.deGoodsRemark
            }

            api.declineRefund(this.currReturnNo, obj).then(() => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '拒绝退货成功！'
                })
                this.declineGoodsVisible = false
                this.deGoodsRemark = ''
                this.getTableData()
            })
        },
        operaEvent(orderNo, type, returnNo){
            if (type == 1) {  //售后详情
                this.$store.commit('setCurrentModelId', returnNo)
                this.$router.push('serviceDetail')
            }
            if (type == 2) {  //订单详情
                this.$store.commit('setCurrentModelId', orderNo)
                this.$router.push('oderDetail')
            }
            if (type == 3) { //同意退款
                this.myBase.confirm('你确定要同意退款？', () => {
                    api.agreeRefund(returnNo).then(() => {
                        this.$message({
                            type: 'success',
                            duration: 1500,
                            showClose: true,
                            message: '退款成功！'
                        })
                        this.getTableData()
                    })
                })
            }
            if (type == 4) { //同意退货
                this.greenGoodsVisible = true
                this.currReturnNo = returnNo

            }
            if (type == 5) { //拒绝退款
                this.currReturnNo = returnNo
                this.declineRefundVisible = true
            }
            if (type == 6) { //拒绝退货
                this.currReturnNo = returnNo
                this.declineGoodsVisible = true
            }

        },
        greenGoodsEvent(){
            var obj = {
                sendAddress: this.greenGoodsForm.address
            }

            api.refundCosts(this.currReturnNo, obj).then(() => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '退货成功！'
                })
                this.greenGoodsForm.address = ''
                this.greenGoodsVisible = false
                this.getTableData()
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
        resetSeraBtnEvent(){
            this.resetBtnEvent()
            this.getTableData()
            this.isFreSupBoxShow = false
        },
        goSeraBtnEvent(){
            this.isSupperBoxShow = true
        },
        closeExportWrap(){
            this.isExportShow = false
            // this.$refs.purchaseListTable.clearSelection()
        },
        supperBoxShow(){
            this.isSupperBoxShow = !this.isSupperBoxShow
        },
        supperCansleBoxShow () {
            this.isSupperBoxShow = !this.isSupperBoxShow
        },
        supperSureBoxShow () {
            this.isSupperBoxShow = !this.isSupperBoxShow
            this.isFreSupBoxShow = true
            this.getTableData()
        },
        searchInputClear(){
            this.getTableData()
        },
        // 导出订单
        exportOrder() {
            let urlStr = ''

            for (let key in this.tableParam) {
                if (this.tableParam[key] && key != 'pageNo' && key != 'pageSize') {
                    let str = key + '=' + this.tableParam[key] + '&'

                    urlStr += str
                }
            }
            urlStr = urlStr.substring(0, urlStr.length - 1)
            window.open(this.exportOrderOut + urlStr)

        },
        getTableData(){
            api.getRefundList(this.tableParam).then((response) => {
                // console.log(response)
                this.waitMergeTableData = response.data.list
                this.totalPage = response.data.total
            })
        },
        resetBtnEvent () {
            for (var key in this.tableParam) {
                if (key != 'afterStatus') {
                    this.tableParam[key] = ""
                }
            }
            this.createArr = []  //储存时间控件数据
            this.payTime = [] //储存时间控件数据
        },
        datePickerChangeEvent (val) {
            if (this.createArr.length > 0) {
                this.tableParam.createStartTime = Math.round(this.createArr[0] / 1000)
                this.tableParam.createEndTime = Math.round(this.createArr[1] / 1000)
            } else {
                this.tableParam.createStartTime = null
                this.tableParam.createEndTime = null
            }
            if (this.payTime.length > 0) {
                this.tableParam.payStartTime = Math.round(this.payTime[0] / 1000)
                this.tableParam.payEndTime = Math.round(this.payTime[1] / 1000)
            } else {
                this.tableParam.payStartTime = null
                this.tableParam.payEndTime = null
            }
        }


    },
    created(){},
    mounted(){},
    activated() {
        // this.resetSeraBtnEvent()
        this.getTableData()
        this.getAddressList()
    }
}
</script>
<style scoped>
.model_content_inner{
    position: relative;
}


.box_card{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 300px;
    z-index: 9;
}
.purchaseList_title{
    height: 52px;
    line-height: 52px;
    padding-left: 17px;
}
.purchaseList_title span{
    cursor: pointer;
}
.tableTitle{
    font-weight: bold;
    font-size: 14px;
    color: #606266;
    background: #F5F5F5;
    height: 48px;
    line-height: 48px;
}
.tableTitle .el-col{
    padding: 0 20px;

}

/* 有重复样式 */

/* .maxWord{white-space:nowrap; overflow:hidden; text-overflow:ellipsis;} */
.model_content_inner{
    position: relative;
    overflow: hidden;
}


.tableTitle{
    font-weight: bold;
    font-size: 14px;
    color: #606266;
    background: #F5F5F5;
    height: 48px;
    line-height: 48px;
}

.waitMerger_order_title{
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    background: #F5F5F5;
}
.waitMergeContent{
    padding: 10px;
}

.waitMerger_order_goods{
    height: 69px;
}

.waitMerger_order_goods .el-col{
    padding-left: 10px;
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
.mergerOrderBotton{
    height: 55px;
    line-height: 55px;
    text-align: right;
}
.color_red{
    font-weight: bold;
    font-size: 16px;
}
.height100{
    height: 100%;
}
.no_border{
    border: none;
}
.order_goods_wrap{
    position: relative;
}
.waitMergeContent_item{
    font-size: 12px;
    border: 1px solid #DCDFE6;
    /* border-bottom: none; */
    margin-bottom: 10px;
}
.border_bottom{
    border-bottom: 1px solid #DCDFE6;
}
.el-button--text.el-button--small{
    padding: 0
}
.el-dropdown{
    font-size: 12px;
}
.el-dropdown .el-dropdown-link{
    cursor: pointer;
    color: #409EFF;
}
.model_topcol2{
    height: 46px;
    line-height: 46px;
    padding-left: 20px;
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
</style>
