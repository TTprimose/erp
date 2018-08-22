<template>
    <div id="orderList">
        <div class="model_topcol2" style="position: relative;">
            <!-- <span style="color: #409EFF">订单</span>
            <span> - 订单列表</span> -->
            <div style="position: absolute; right: 20px; z-index: 999">
                <el-button v-perss="'代下单添加订单'" @click="addOrderListEvent" style="width: 90px" size="small">新建代下单</el-button>
            </div>
            <el-tabs v-model="tabName" @tab-click="handleClick">
                <el-tab-pane label="全部订单" name="-1"></el-tab-pane>
                <el-tab-pane label="待支付" name="0"></el-tab-pane>
                <el-tab-pane label="待接单" name="5"></el-tab-pane>
                <el-tab-pane label="待发货" name="1"></el-tab-pane>
                <el-tab-pane label="待收货" name="2"></el-tab-pane>
                <el-tab-pane label="已完成" name="3"></el-tab-pane>
                <el-tab-pane label="已关闭" name="4"></el-tab-pane>
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
                        <el-form-item label="订单来源">
                            <el-select v-model="tableParam.orderSource" placeholder="请选择订单来源">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="APP" value="0"></el-option>
                                <el-option label="PC" value="1"></el-option>
                                <el-option label="代下单" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <br>
                        <el-form-item label="商品名称">
                            <el-input v-model="tableParam.itemName" placeholder="请输入商品名称" style="width: 250px"></el-input>
                        </el-form-item>
                        <el-form-item label="下单时间">
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
                        <br>
                        <el-form-item>
                            <el-button @click="supperSureBoxShow" style="width: 90px" type="primary">确定</el-button>
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
                        <el-button :style="{margin: '0 10px'}" @click="searchInputEnter" type="primary" size="small">搜索</el-button>
                        <span @click="supperBoxShow">高级搜索</span>
                        <div style="float: right; margin-right: 20px">
                            注：订单状态列中“(代)”字的代表手工订单
                        </div>
                    </div>

                    <!-- <div id="orderListBtnGroup">
                        <el-button @click="orderTypeSelect($event)" type="primary" :style="{width: '90px'}" size="small">全部订单</el-button>
                        <el-button @click="orderTypeSelect($event, 0)" :style="{width: '90px'}" size="small">待支付</el-button>
                        <el-button @click="supStatusSelect($event, 0)" :style="{width: '90px'}" size="small">待接单</el-button>
                        <el-button @click="orderTypeSelect($event, 1)" :style="{width: '90px'}" size="small">待发货</el-button>
                        <el-button @click="orderTypeSelect($event, 2)" :style="{width: '90px'}" size="small">待收货</el-button>
                        <el-button @click="orderTypeSelect($event, 3)" :style="{width: '90px'}" size="small">已完成</el-button>
                        <el-button @click="orderTypeSelect($event, 4)" :style="{width: '90px'}" size="small">已关闭</el-button>
                    </div> -->

                </div>
                <div v-show="!isExportShow&&isFreSupBoxShow" class="purchaseList_title">
                    <span class="resspan">搜索结果</span>
                    <el-button @click="resetSeraBtnEvent" icon="fa fa-eraser" type="text">清除搜索</el-button>
                    <el-button @click="goSeraBtnEvent" icon="el-icon-search" type="text">继续搜索</el-button>
                    <el-button v-perss="'导出订单'" @click="exportOrder" icon="fa fa-upload" type="text">导出</el-button>
                </div>
                <!-- <div v-show="isExportShow" class="purchaseList_exportWrap">
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
                </div> -->
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
                            <td class="ta_col_08">售后状态</td>
                            <td class="ta_col_09">操作</td>
                        </tr>
                    </table>
                </div>
                <div class="waitMergeContent" :style="{height: $store.state.home.modelContentHeight - 125 + 'px', overflow: 'auto'}">
                    <div class="waitMergeContent_wrap">
                        <div class="positio_center" v-if="tableData.length == 0">
                            暂无数据
                        </div>
                        <table v-for="(item1, index1) in tableData" :key="index1" class="waitMergeContent_item">
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
                                        <span v-if="item1.isReplaceOrder == 1" class="color_red" :style="{fontSize: '14px', marginLeft: '10px'}">(代)</span>
                                        <span v-if="item1.isSeparated == 1" class="color_red" :style="{fontSize: '14px', marginLeft: '10px'}">(被拆分)</span>
                                        <span style="margin-left: 10px">订单编号 : </span>
                                        <span v-text="item1.secondaryOrderNo"></span>
                                    </div>
                                    <div style="float: left;  margin-left: 30px">
                                        <span>买家 : </span>
                                        <span v-text="item1.shopName"></span>
                                    </div>
                                    <div style="float: right;  margin-right: 30px">
                                        <el-button style="color: #606266;" icon="fa fa-commenting" v-perss="'订单备注提交'" @click="addRemarkEvent(index1)" type="text">备注</el-button>
                                        <el-button style="color: #606266" v-perss="'异常处理提交'" icon="fa fa-exclamation-triangle" @click="addErrorEvent(index1)" type="text">异常处理</el-button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="(item2, index2) in item1.item" :key="index2" class="table_item_goods">
                                <td class="maxWord bder_bot" style="padding-left: 10px">
                                    <div class="maxWord" v-text="item2.itemName"></div>
                                    <div v-if="item2.isGiving == 1" class="maxWord">
                                        <span style="font-size: 14px;" class="color_red">(赠品)</span>
                                        <span class="el-icon-error myCur" @click="removeGiveAway(item2.id)"></span>
                                    </div>
                                    <div v-if="item2.remark">
                                        <el-tooltip class="item" effect="dark" :content="item2.remark" placement="bottom-start">
                                            <i style="font-size: 14px" class="fa fa-commenting-o color_blue"></i>
                                        </el-tooltip>
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
                                    <span v-text="item1.adressStr"></span>
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
                                    <div v-if="item2.afterStatus">
                                        <span v-if="item2.afterStatus == 1">待审核</span>
                                        <span v-if="item2.afterStatus == 2">待寄回</span>
                                        <span v-if="item2.afterStatus == 3">已寄回</span>
                                        <span v-if="item2.afterStatus == 4">退款成功</span>
                                        <span v-if="item2.afterStatus == 5">退款失败</span>
                                        <span v-if="item2.afterStatus == 6">撤销退款</span>
                                        <br>
                                        <span>退款件数 : </span><span> {{item2.refundQuantity}} </span>
                                        <br>
                                        <el-button @click="propEvent2(1, item2.refundNo)" size="small" type="text">售后详情</el-button>
                                    </div>
                                </td>
                                <td style="padding: 10px" v-if="index2 == 0" class="bder_bot center bder_left" :rowspan="item1.item.length">
                                    <!-- 待支付| -->
                                    <div v-if="item1.secondaryStatus == 0">
                                        <el-button v-perss="'订单详情'" @click="propEvent(1, index1)" size="small" type="text">订单详情</el-button>
                                    </div>
                                    <!-- 待发货| -->
                                    <div v-if="item1.secondaryStatus == 1 && item1.supStatus == 1">
                                        <el-button style="width: 90px" size="small" v-perss="'发货'" @click="propEvent(3, index1)" type="primary">发货</el-button><br>
                                        <el-button style="margin-top: 5px" size="small" v-perss="'订单详情'" @click="propEvent(1, index1)" type="text">订单详情</el-button>
                                        <!-- <el-button v-if="item1.supStatus == 0" size="small" @click="propEvent(2, index1)" type="text">接单</el-button> -->
                                    </div>
                                    <!-- 待接单| -->
                                    <div v-if="item1.secondaryStatus == 1 && item1.supStatus == 0">
                                        <el-button style="width: 90px" v-if="item1.supStatus == 0 && item1.isSeparated != 1" v-perss="'接单'" size="small" @click="propEvent(2, index1)" type="primary">接单</el-button><br v-if="item1.supStatus == 0 && item1.isSeparated != 1">
                                        <el-button size="small" v-if="item1.isSeparated != 1" style="margin-top: 5px" v-perss="'添加赠品'" @click="propEvent(5, index1)" type="text">添加赠品</el-button><br v-if="item1.isSeparated != 1">
                                        <el-button v-if="item1.isSeparated == 0 && item1.isSeparateOrder == 0" size="small" @click="propEvent(6, index1)" type="text">拆分订单</el-button><br v-if="item1.isSeparated == 0 && item1.isSeparateOrder == 0">
                                        <el-button style="margin-bottom: 5px" v-if="item1.isSeparated == 1" size="small" @click="propEvent(7, index1)" type="primary">还原订单</el-button><br v-if="item1.isSeparated == 1">
                                        <el-button size="small" v-perss="'订单详情'" @click="propEvent(1, index1)" type="text">订单详情</el-button>
                                    </div>
                                    <div v-if="item1.secondaryStatus == 2">
                                        <el-button @click="propEvent(4, index1)" size="small" type="text">查看物流</el-button><br>
                                        <el-button v-perss="'订单详情'" @click="propEvent(1, index1)" size="small" type="text">订单详情</el-button><br>
                                        <!-- <el-button v-if="item1.supStatus == 0" @click="propEvent(2, index1)" size="small" type="text">接单</el-button> -->
                                    </div>
                                    <div v-if="item1.secondaryStatus == 3">
                                        <el-button @click="propEvent(4, index1)" size="small" type="text">查看物流</el-button><br>
                                        <el-button v-perss="'订单详情'" @click="propEvent(1, index1)" size="small" type="text">订单详情</el-button><br>
                                        <!-- <el-button v-if="item1.supStatus == 0" @click="propEvent(2, index1)" size="small" type="text">接单</el-button> -->
                                    </div>
                                    <div v-if="item1.secondaryStatus == 4">
                                        <el-button v-perss="'订单详情'" @click="propEvent(1, index1)" size="small" type="text">订单详情</el-button><br>
                                        <!-- <el-button v-if="item1.supStatus == 0" @click="propEvent(2, index1)" size="small" type="text">接单</el-button> -->
                                    </div>
                                </td>
                            </tr>
                            <tr style="height: 32px;" v-if="item1.oneselfRemark">
                                <td style="padding-left: 20px" colspan="9">
                                    <span>供应商备注 : </span>
                                    <span>{{item1.oneselfRemark}}</span>
                                </td>
                            </tr>
                        </table>

                    </div>

                </div>


            </div>
        </div>
        <div class="model_footer">
            <!-- <el-button size="small" style="width: 90px; margin-left: 25px;">返 回</el-button> -->
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
<!-- 备注信息 -->
        <el-dialog
            title="备注"
            :visible.sync="remarkdialogVisible"
            :close-on-click-modal="false"
            width="30%"
           >
            <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注内容"
            v-model="remarkinfo">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="remarkdialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="postRemarkEvent">确 定</el-button>
            </span>
        </el-dialog>
<!-- 异常信息 -->
        <el-dialog
            title="异常处理"
            :visible.sync="errordialogVisible"
            :close-on-click-modal="false"
            width="30%"
           >
            <el-form :inline="true">
                <el-form-item label="异常说明: ">
                    <el-input :rows="3" style="width: 350px" type="textarea" v-model="errorRemark" placeholder="请输入异常说明"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="errordialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="postErrorEvent">确 定</el-button>
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
<!-- 物流信息 -->
        <el-dialog
            title="物流信息"
            :visible.sync="logisticsdialogVisible"
            :close-on-click-modal="false"
            @close="logisticsdialogCansule"
            width="40%"
           >
           <el-tabs v-model="activeName">
               <el-tab-pane style="border: 1px solid #e4e7ed;" v-for="(item1, index1) in logisticsInfo" :key="index1" :label="'包裹' + (index1 + 1)" :name="index1 + ''">
                   <div style="height: 35px; line-height: 35px; border-bottom: 1px solid #e4e7ed">
                       <span style="padding-left: 20px;">物流公司: </span><span style="margin-right: 20px;" v-text="item1.logisticsName"></span>
                       <span>物流单号: </span><span v-text="item1.logisticNo"></span>
                   </div>
                   <div style="height: 400px; overflow: auto;">
                       <div v-if="item1.list" v-for="(item2, index2) in item1.list.list" :key="index2" class="logistics_item">
                            <span v-text="item2.remark" class="logistics_item_span"></span><br>
                            <span v-text="item2.datetime" class="logistics_item_span"></span>
                        </div>
                   </div>
               </el-tab-pane>
           </el-tabs>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="logisticsdialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
<!-- 拆分订单 -->
    <el-dialog
        id="splitList_dialog"
        title="拆分订单"
        :visible.sync="splitListVisible"
        :close-on-click-modal="false"
        @close="splitListdialogCansule"
        width="40%"
        >
        <div style="max-height: 600px;border-top: 1px solid #DCDFE6;overflow: auto;">
            <div style="font-size: 14px" class="padding_10">
                原订单商品信息
            </div>
            <div class="tableTitle tableTitle2">
                <table>
                    <tr style="padding-left: 10px">
                        <td style="padding-left: 10px" class="spt_col_01">
                            <el-checkbox @change="preSplitCheckAllChange" v-model="preSplitTotalChecked" :indeterminate="isIndeterminate"></el-checkbox>
                            <span>商品名称</span>
                        </td>
                        <td class="spt_col_02 center">商品规格</td>
                        <td class="spt_col_03 center">商品单价(元)</td>
                        <td class="spt_col_04 center">商品数量</td>
                        <td class="spt_col_05 center">拆分商品数量</td>
                    </tr>
                </table>
            </div>
            <div class="padding_10">
                <table class="border_all tr_height">
                    <colgroup>
                        <col class="spt_col_01">
                        <col class="spt_col_02">
                        <col class="spt_col_03">
                        <col class="spt_col_04">
                        <col class="spt_col_05">
                    </colgroup>
                    <tr v-for="(item, index) in preSplitListObj.item" :key="index" class="bder_bot">
                        <td class="padding_left_10">
                            <el-checkbox @change="splitGoodsItemCheckChange(item)" v-model="item.checked"></el-checkbox>
                            <span v-text="item.itemName"></span>
                        </td>
                        <td class="center maxWord" v-text="item.specsMsg"></td>
                        <td class="center" v-text="item.price"></td>
                        <td class="center" v-text="item.quantity"></td>
                        <td class="center padding_left_10 padding_right_10">
                            <el-tooltip class="item" effect="dark" :content="'库存数量: ' + item.physicalInventory" placement="right">
                                <el-input @change.native="splitListNumInputEvent(item)" @keyup.native="splitListNumInputEvent(item)" v-model="item.splitNum" :disabled="item.inputDisabled" size="mini"></el-input>
                            </el-tooltip>
                        </td>
                    </tr>
                    <tr>
                        <td class="padding_left_10" colspan="3">
                            <span>订单金额: </span>
                            <span class="color_red">{{preSplitListObj.receivedPrice | numFormat}}</span>
                        </td>
                        <td style="text-align: right; padding-right: 10px" colspan="2">
                            <el-button @click="splitListSplitEvent" size="small" type="primary">拆分订单</el-button>
                        </td>
                    </tr>
                </table>
            </div>

            <div style="border-top: 1px dashed #DCDFE6; font-size: 14px" class="padding_10 color_brown">
                拆分后子订单商品信息
            </div>
            <div v-if="splitSecondTableArr.length != 0" class="tableTitle tableTitle2">
                <table>
                    <tr style="padding-left: 10px">
                        <td style="padding-left: 10px" class="spt_col_01">商品名称</td>
                        <td class="spt_col_02 center">商品规格</td>
                        <td class="spt_col_03 center">商品单价(元)</td>
                        <td class="spt_col_04 center">拆分后商品数量</td>
                        <td class="spt_col_05 center">操作</td>
                    </tr>
                </table>
            </div>
            <div class="padding_10 splitTable_wrap">
                <table v-for="(sitem, index) in splitSecondTableArr" :key="index" class="border_all tr_height">
                    <colgroup>
                        <col class="spt_col_01">
                        <col class="spt_col_02">
                        <col class="spt_col_03">
                        <col class="spt_col_04">
                        <col class="spt_col_05">
                    </colgroup>
                    <tr class="bder_bot tr_title_height_back">
                        <td class="padding_left_10" colspan="5">
                            <span style="margin-right: 20px" v-text="'子订单' + (index + 1)"></span>
                            <span>子订单金额: </span>
                            <span class="color_red">{{sitem.receivedPrice | numFormat}}</span>
                        </td>
                    </tr>
                    <tr v-for="(sitem2, index2) in sitem.item" :key="index2" class="bder_bot">
                        <td class="padding_left_10 maxWord" v-text="sitem2.itemName"></td>
                        <td class="center maxWord" v-text="sitem2.specsMsg"></td>
                        <td class="center" v-text="sitem2.price"></td>
                        <td class="center" v-text="sitem2.resNum"></td>
                        <td v-if="index2 == 0" class="center bder_left" :rowspan="sitem.item.length">
                            <el-button @click="cansuleSplitListEvent(index)" size="small" type="text">取消拆分</el-button>
                        </td>
                    </tr>

                </table>

            </div>


        </div>

        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="splitListVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="splitListSaveEvent">确 定</el-button>
        </span>
    </el-dialog>

    </div>
</template>

<script>
import api from 'api/order'
export default {
    data(){
        return {
            exportOrderOut: process.env.API_ROOT + '/order/exportExcel?',
            isSupperBoxShow: false,
            isExportShow: false,
            isFreSupBoxShow: false,
            remarkdialogVisible: false,
            recivedialogVisible: false,
            deliverydialogVisible: false,
            logisticsdialogVisible: false,
            errordialogVisible: false,
            splitListVisible: false,
            preSplitTotalChecked: false,
            isIndeterminate: false,
            remarkinfo: '',
            errorRemark: '',
            reciveType: '1',
            activeName: '0',
            tabName: '-1',
            totalPage: 0,
            dataIndex: null, //用于确定操作的那条数据
            createArr: [],  //储存时间控件数据
            payTime: [], //储存时间控件数据
            tableParam: {
                secondaryStatus: '',
                secondaryOrderNo : '',
                supStatus: null,
                shopName: '',
                itemName: '',
                createStartTime: null, //下单开始时间
                createEndTime: null, //下单结束时间
                orderSource: null,
                payStartTime: null,
                payEndTime: null,
                timeType: null,
                pageNo: 1,
                pageSize: 10
            },
            preSplitListObj: {},
            logisticsDialogData: { //发货弹窗
                logisticsCom: '',
                logosLog: ['']
            },
            logisticsInfo: [],  //物流信息
            selectTableData: [],
            tableData: [],
            splitSecondTableArr : []

        }
    },
    computed:{},
    methods:{
        cansuleSplitListEvent(index){
            var index1 = index

            if (index1 == this.splitSecondTableArr.length - 1) {
                index1 = index1 - 1
            }
            var resArr = []

            resArr = this.splitSecondTableArr.splice(index1, 1)[0].item
            resArr = JSON.parse(JSON.stringify(resArr))

            var preListArr = JSON.parse(JSON.stringify(this.preSplitListObj.item))

            for (var ritem of resArr) {
                var flg = true

                for (var item of preListArr) {
                    if (item.itemSkuId == ritem.itemSkuId) {
                        item.quantity = parseInt(item.quantity, 10) + parseInt(ritem.resNum, 10)
                        item.checked = false
                        item.inputDisabled = true
                        flg = false
                    }
                }

                if (flg) {
                    ritem.quantity = parseInt(ritem.resNum, 10)
                    ritem.splitNum = ''
                    ritem.checked = false
                    ritem.inputDisabled = true
                    preListArr.push(ritem)
                }
            }

            this.splitSecondTableArr.pop()

            if (this.splitSecondTableArr.length !== 0) {
                this.splitSecondTableArr.push(this.splitItemArrToObj(preListArr, 2))
            }
            this.$set(this.preSplitListObj, 'item', preListArr)
            this.preSplitTotalChecked = false
        },
        splitListSplitEvent(){
            var itemCheckedArr = [] //勾选的数据
            var itemSplitArr = [] //勾选的拆分数量不为零的数据

            for (var item of this.preSplitListObj.item) {
                if (item.checked) { //拿出勾选的数据
                    itemCheckedArr.push(item)
                    if (item.splitNum != '' && item.splitNum != '0') {
                        itemSplitArr.push(item)
                    }
                }
            }

            if (itemCheckedArr.length == 0) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '请勾选商品数据!'
                });
                return
            }
            if (itemSplitArr.length == 0) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '拆分数量应大于0且小于或等于商品数量!'
                });
                return
            }

            if (this.splitSecondTableArr.length >= 2) { //已拆分过的订单,先去除最后一个
                this.splitSecondTableArr.pop()
            }

            this.splitSecondTableArr.unshift(this.splitItemArrToObj(itemSplitArr, 1)) //拆分的数据放在第一位

            var resArr = [] //承接余下的数据

            for (var ritem of this.preSplitListObj.item) {
                if (ritem.checked) { //勾选的数据
                    if (ritem.splitNum != '' && ritem.splitNum != '0') {
                        var num = parseInt(ritem.quantity, 10)
                        var splitnum = parseInt(ritem.splitNum, 10)

                        if (num !== splitnum) {
                            ritem.quantity = num - splitnum
                            ritem.splitNum = ''
                            ritem.checked = false
                            ritem.inputDisabled = true
                            resArr.push(ritem)
                        }
                    } else {
                        ritem.checked = false
                        ritem.inputDisabled = true
                        ritem.splitNum = ''
                        resArr.push(ritem)
                    }
                } else {
                    ritem.checked = false
                    ritem.inputDisabled = true
                    ritem.splitNum = ''
                    resArr.push(ritem)
                }
            }

            this.preSplitListObj.item = resArr

            this.splitSecondTableArr.push(this.splitItemArrToObj(resArr, 2))
            this.preSplitTotalChecked = false

        },
        splitItemArrToObj(arr, type){
            var deepArr = JSON.parse(JSON.stringify(arr))
            var obj = {}
            var total = 0

            for (var item of deepArr) {
                var price = parseFloat(item.splitPrice)
                var num

                if (type == 1) {
                    this.$set(item, 'resNum', item.splitNum)
                    num = parseFloat(item.splitNum)
                } else {
                    this.$set(item, 'resNum', item.quantity)
                    num = parseFloat(item.quantity)
                }

                var itemtotal = price * num

                total += itemtotal
            }
            obj.receivedPrice = total.toFixed(2)
            obj.item = deepArr
            return obj
        },
        splitListNumInputEvent(goodsitem){

            if (typeof this.preSplitListObj.item == 'undefined') {
                return
            }

            goodsitem.splitNum = this.myBase.formatIntNum(goodsitem.splitNum)

            if (this.preSplitListObj.item.length >= 2) {
                if (goodsitem.splitNum > goodsitem.quantity) {
                    goodsitem.splitNum = goodsitem.quantity
                }
            } else {
                if (goodsitem.splitNum >= goodsitem.quantity) {
                    goodsitem.splitNum = goodsitem.quantity - 1
                }
            }
        },
        splitGoodsItemCheckChange(goodsitem){
            goodsitem.inputDisabled = !goodsitem.checked

            var flg = true  //商品是否被全选中

            for (var item of this.preSplitListObj.item) {
                if (!item.checked) {
                    flg = false
                    break
                }
            }

            this.preSplitTotalChecked = flg
        },
        preSplitCheckAllChange(){
            for (var item of this.preSplitListObj.item) {
                item.inputDisabled = !this.preSplitTotalChecked
                item.checked = this.preSplitTotalChecked
            }
        },
        splitListSaveEvent(){
            if (this.splitSecondTableArr.length == 0) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '请进行拆分操作!'
                })
                return
            }
            var paramobj = {}

            paramobj.secondaryOrderNo = this.preSplitListObj.secondaryOrderNo

            this.splitSecondTableArr.forEach((item, index) => {
                item.secondaryOrderNo = this.preSplitListObj.secondaryOrderNo + '_' + (index + 1)
                item.receivablePrice = item.receivedPrice
                for (var item1 of item.item) {
                    item1.quantity = item1.resNum
                    item1.receivablePrice = (parseFloat(item1.splitPrice) * parseFloat(item1.quantity)).toFixed(2)
                    item1.receivedPrice = (parseFloat(item1.splitPrice) * parseFloat(item1.quantity)).toFixed(2)
                }
            });
            paramobj.itemList = JSON.stringify(this.splitSecondTableArr)

            api.splitOrderList(paramobj).then((response) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '拆分成功!'
                })
                this.splitListVisible = false
                this.getTableData()
            })


        },
        splitListdialogCansule(){  //拆分订单关闭回调,数据重置
            this.preSplitTotalChecked = false
            this.splitSecondTableArr = []
        },
        handleClick(tab){
            var type = tab.name

            this.tableParam.supStatus = null
            this.tableParam.secondaryStatus = null

            if (type == '-1') {  //全部订单
                this.tableParam.secondaryStatus = ""
            } else if (type == '5') { //待接单
                this.tableParam.secondaryStatus = 1
                this.tableParam.supStatus = 0
            } else if (type == 1) { //代发货
                this.tableParam.supStatus = 1
                this.tableParam.secondaryStatus = type
            } else {
                this.tableParam.secondaryStatus = type
            }

            this.getTableData()
        },
        removeGiveAway(itemId){
            api.remGiveaway(itemId).then((response) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '删除赠品成功!'
                })
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
        addLogisticsSaveBtn(){
            var obj = {
                secondaryOrderNo : this.tableData[this.dataIndex].secondaryOrderNo,
                logisticNo : this.logisticsDialogData.logosLog.join(','),
                logisticsCode  : this.logisticsDialogData.logisticsCom
            }

            api.orderListSend(obj).then((response) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '发货成功!'
                })

                this.getTableData()

                this.deliverydialogVisible = false

            })
        },
        deliverydialogCansule(){
            this.deliverydialogVisible = false
            this.logisticsDialogData = {
                logisticsCom: '',
                logosLog: ['']
            }
        },
        logisticsdialogCansule(){
            this.logisticsdialogVisible = false
            this.logisticsInfo = []
        },
        removeLogisticsItemBtn(index){
            this.logisticsDialogData.logosLog.splice(index, 1)
        },
        addLogisticsItemBtn(){
            this.logisticsDialogData.logosLog.push('')
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
        // 高级搜索
        supperSureBoxShow () {
            this.isSupperBoxShow = !this.isSupperBoxShow
            this.isFreSupBoxShow = true
            // this.tableParam.createArr = ''
            // this.tableParam.payTime = ''
            this.tableParam.pageNo = 1
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
        searchInputEnter(){
            this.tableParam.pageNo = 1
            this.getTableData()
        },
        getTableData(){
            return api.getOrderList(this.tableParam).then((response) => {
                this.totalPage = response.data.total
                this.tableData = response.data.list

                //前端处理数据,订单总数量,总运费,地址
                for (var item of this.tableData) {
                    if (item.item && item.item.length > 0) {
                        var freight = 0
                        var quantity = 0

                        for (var item2 of item.item) {
                            freight += Number(item2.freight)
                            quantity += Number(item2.quantity)
                        }
                        freight = freight.toFixed(2)
                        this.$set(item, 'freight', freight)
                        this.$set(item, 'quantity', quantity)
                    } else {
                        this.$set(item, 'freight', 0.00)
                        this.$set(item, 'quantity', 0)
                    }

                    var adressArr = item.receiveAddress.split(",")
                    var adressStr = ''

                    adressArr = adressArr.splice(0, adressArr.length - 2)
                    adressStr = adressArr.join(',')

                    this.$set(item, 'adressStr', adressStr)
                }
            })
        },
        resetBtnEvent () {
            for (var key in this.tableParam) {
                if (key != 'secondaryStatus' && key != 'supStatus') {
                    this.tableParam[key] = ""
                }
            }
            this.createArr = []  //储存时间控件数据
            this.payTime = [] //储存时间控件数据
        },
        datePickerChangeEvent () {
            this.setDatePicker()
        },
        setDatePicker(){
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
        },
        timeClearEvent(){
            this.tableParam.createStartTime = ""
            this.tableParam.createEndTime = ""
        },
        addRemarkEvent(index){
            this.dataIndex = index
            this.remarkdialogVisible = true
        },
        addErrorEvent(index){
            this.dataIndex = index
            this.errordialogVisible = true
        },
        postRemarkEvent(){
            var obj = {
                oneselfRemark : this.remarkinfo
            }

            api.addRemark(this.tableData[this.dataIndex].secondaryOrderNo, obj).then((response) => {
                this.remarkdialogVisible = false
                this.remarkinfo = ""
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '备注修改成功!'
                })
                this.getTableData()
            })
        },
        postErrorEvent(){
            var obj = {
                errorRemark  : this.errorRemark
            }

            api.postOrderError(this.tableData[this.dataIndex].secondaryOrderNo, obj).then((response) => {
                this.errordialogVisible = false
                this.errorRemark = ""
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '备注异常成功!'
                })
            })

        },
        propEvent2(type, number){
            if (type == 1) { //售后详情
                this.$store.commit('setCurrentModelId', number)
                this.$router.push({
                    path: '/serviceDetail'
                })
            }
        },
        propEvent(type, index){
            this.dataIndex = index

            if (type == 1) { //详情
                this.$store.commit('setCurrentModelId', this.tableData[this.dataIndex].secondaryOrderNo)

                this.$router.push({
                    path: '/oderDetail'
                })
            }
            if (type == 2) { //接单
                this.recivedialogVisible = true
                this.reciveType = "1"
            }
            if (type == 3) { //发货
                this.deliverydialogVisible = true
            }
            if (type == 5) { //新增赠品
                this.$store.commit('setCurrentModelId', this.tableData[this.dataIndex].secondaryOrderNo)
                this.$router.push({
                    path: '/addGiveaway/1'
                })
            }
            if (type == 6) { //拆分订单
                this.splitListVisible = true
                this.preSplitListObj = JSON.parse(JSON.stringify(this.tableData[this.dataIndex]))

                for (var sitem of this.preSplitListObj.item) { //被拆分订单商品信息处理
                    if (typeof sitem.physicalInventory == 'undefined') { //库存数量
                        this.$set(sitem, 'physicalInventory', 0)
                    }
                    var splitPrice = parseFloat(sitem.receivedPrice) / parseFloat(sitem.quantity)

                    this.$set(sitem, 'splitPrice', splitPrice) //分配后的单价
                    this.$set(sitem, 'inputDisabled', true) //输入框是否被禁用
                    this.$set(sitem, 'splitNum', '') //商品被拆分的数量
                    this.$set(sitem, 'checked', false) //商品是否被勾选
                }
            }

            if (type == 7) { //还原订单
                var paramobj = {
                    beforeSeparateNo: this.tableData[this.dataIndex].secondaryOrderNo
                }

                api.canselSplitOrderList(paramobj).then((response) => {
                    this.$message({
                        type: 'success',
                        duration: 1500,
                        showClose: true,
                        message: '订单还原成功!'
                    })
                    this.getTableData()
                })
            }

            if (type == 4) { //查看物流
                api.getOrderOrderMsg(this.tableData[this.dataIndex].secondaryOrderNo).then((response) => {
                    if (response.data.logisticMsg && response.data.logisticMsg.length != 0) {
                        this.logisticsdialogVisible = true

                        for (var item of response.data.logisticMsg){
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

                            } else {
                                item.list = {}
                            }
                        }

                        this.logisticsInfo = response.data.logisticMsg

                    } else {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '暂时没有物流信息!'
                        })
                    }
                })

            }
        },
        reciveOrderListEvent(){
            api.receiveOrderList(this.tableData[this.dataIndex].secondaryOrderNo, this.reciveType).then((response) => {
                this.recivedialogVisible = false
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '接单成功!'
                })
                this.getTableData()
            })
        },
        addOrderListEvent(){
            this.$router.push({
                path: '/addOrderList/' + '1'
            })
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
.waitMerger_order_remark{
    height: 35px;
    line-height: 35px;
    border-top: 1px solid #DCDFE6;
    padding-left: 15px;
}
.model_content_inner{
    position: relative;
}

.box_card{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 250px;
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
    padding: 0 10px;
    padding-right: 30px;
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
.waitMergeContent{
    padding: 10px;
}

.waitMerger_order_goods{
    height: 69px;
    /* line-height: 69px; */
    border-bottom: 1px solid #DCDFE6;
}
.waitMergeContent_wrap{
    font-size: 12px;
    position: relative;
    height: 100%;
}
.waitMerger_order_title{
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    background: #F5F5F5;
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
.orderCosts{
    line-height: 2;
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
.el-button--text.el-button--small{
    padding: 0;
}
.logistics_item{
    margin-left: 15px;
    margin-bottom: 10px;
}
.waitMergeContent_item{
    width: 100%;
    margin-bottom: 10px;
    border: 1px solid #DCDFE6;
    table-layout: fixed;
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
.border_all{
    border: 1px solid #DCDFE6;
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
.tableTitle{
    font-weight: bold;
    font-size: 14px;
    color: #606266;
    background: #F5F5F5;
    height: 48px;
    line-height: 48px;
}
.tableTitle table{
    width: 100%;
}
.tableTitle2{
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
}
.table_item_title td{
    font-size: 14px;
    background: #F5F5F5;
    height: 32px;
}
.table_item_goods{
    height: 85px;
}
.table_item_title .el-button{
    padding: 0
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
.padding_10{
    padding: 10px;
}
.padding_left_10{
    padding-left: 10px;
}
.padding_right_10{
    padding-right: 10px;
}
.spt_col_01{
    width: 30%;
}
.spt_col_02{
    width: 25%;
}
.spt_col_03{
    width: 15%;
}
.spt_col_04{
    width: 15%;
}
.spt_col_05{
    width: 15%;
}
#splitList_dialog table{
    width: 100%;
    table-layout: fixed;
}
.tr_height tr{
    height: 40px;
    line-height: 40px;
}
.tr_title_height_back{
    height: 32px !important;
    line-height: 32px !important;
    background: #F5F5F5;
}
.splitTable_wrap table{
    margin-bottom: 10px;
}
</style>
