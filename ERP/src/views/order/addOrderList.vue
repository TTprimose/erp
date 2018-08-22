<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">订单列表</span>
            <span> - 新建订单</span>
        </div>
        <div id="addOrderWrap" class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner" :style="{height: $store.state.home.modelContentHeight - 20 + 'px', overflow: 'auto'}">
                <el-form id="addOrderForm" :inline="true" ref="addOrderForm" :rules="rules" :model="addFormData" label-position="right" size="small" label-width="120px">
                    <div class="banner">买家信息</div>
                    <div class="customWrap">
                        <el-button v-if="addFormData.shopUserId == ''" @click="chooseStoreBtn" icon="el-icon-plus" size="small" type="text">选择买家</el-button>
                        <div v-if="addFormData.shopUserId != ''">
                            <span style="padding: 0 10px">买家 : </span>
                            <span style="padding: 0 10px" v-text="addFormData.shopUserName"></span>
                            <el-button @click="chooseStoreBtn" icon="el-icon-plus" size="small" type="text">更换买家</el-button>
                        </div>
                        <div id="addOrderAddresWrap" style="overflow: hidden">
                            <div v-for="(item, index) in addressData" @click="orderAddressClick($event, index)" :key="item.id" :class="[item.defaultAddr == 1 ? 'active' : '', 'orderDetail_item']">
                                <div class="orderDetail_item_top">
                                    <div class="orderDetail_item_top_name fontWe_600" v-text="item.receivedUserName"></div>
                                    <div class="orderDetail_item_top_phone" v-text="item.cellPhone"></div>
                                </div>
                                <div class="orderDetail_item_bottom maxWord">
                                    {{item.provinceName + item.cityName + item.areaName + item.addrDetail}}
                                </div>
                                <div class="orderDetail_item_active orderDetail_item_active_curr">
                                    当前地址
                                </div>
                                <div @click.stop="orderAddressClick($event, index)" class="orderDetail_item_active orderDetail_item_active_other">
                                    使用该地址
                                </div>
                            </div>

                        </div>
                        <div v-if="addFormData.shopUserId != ''">
                            <el-button @click="addAddressClick" icon="el-icon-plus" size="small" type="text">新增收货地址</el-button>
                        </div>
                    </div>
                    <div class="banner">商品信息</div>
                    <div style="padding: 10px;">
                        <el-table
                            :data="goodsInfoData"
                            border
                        style="width: 100%">
                            <el-table-column
                            label=" "
                            type="index"
                            width="50">
                            </el-table-column>
                            <el-table-column
                            prop="oper"
                            label="操作"
                            width="60">
                                <template slot-scope="scope">
                                    <i @click="goodTableAddEvent(scope)" style="font-size: 16px; color: #666666; cursor: pointer; margin-right: 10px;" class="fa fa-plus"></i>
                                    <i @click="goodTableReduceEvent(scope)" style="font-size: 16px; color: #666666; cursor: pointer" class="fa fa-minus"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="title"
                            label="商品">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.itemId === ''">
                                        <el-autocomplete
                                        :disabled="true"
                                        placeholder=""
                                        >
                                        </el-autocomplete>

                                        <span @click="chooseGoodEvent" class="el-icon-more"></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
                                        <span v-text="scope.row.title"></span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="skuName"
                            label="规格-SKU">
                            </el-table-column>
                            <el-table-column
                            prop="unitPrice"
                            label="商品单价(元)">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.itemId === ''">
                                        <span></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
                                        <span>{{scope.row.itemPrice}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="purchaseNum"
                            label="商品数量">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.itemId === ''">
                                        <span></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
                                        <el-input @change.native="countUnitTatalEvent(scope)" @keyup.native="countUnitTatalEvent(scope)" v-model="scope.row.quantity"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="unitTotal"
                            label="商品金额(元)">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.itemId === ''">
                                        <span></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
                                        <el-input @change.native="priceUnitTatalEvent(scope)" @keyup.native="priceUnitTatalEvent(scope)" v-model="scope.row.price"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="tableBottom">
                            <div style="width: 350px; float: right;padding-top: 10px">
                                <el-form-item label="应付金额">
                                    <span style="color: #f56c6b">{{totalcosts | numFormat}}</span>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                    <div class="banner">订单信息</div>
                    <div style="padding-top: 20px">
                        <el-form-item required prop="replaceImg" label="上传附件">
                            <div style="display: inline-block">
                                <el-upload
                                ref="faceIdcardUpload"
                                :action="uploadURL"
                                :data="sendData"
                                list-type="picture-card"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess1"
                                :before-upload="beforeAvatarUpload"
                                >
                                <img style="width: 80px; height: 80px;" v-if="imageUrl1" :src="imageUrl1" class="avatar">
                                <i v-if="!imageUrl1" class="el-icon-plus"></i>
                                </el-upload>
                                <span class="card_tip">图片大小不能超过2M</span>
                                <!-- <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog> -->
                            </div>
                        </el-form-item>
                        <br>
                        <el-form-item label="备注">
                            <el-input type="textarea" :rows="4" style="width: 524px" v-model="addFormData.replaceRemark" placeholder="请输入备注"></el-input>
                        </el-form-item>

                    </div>
                </el-form>


            </div>
<!-- 选择门店 -->
            <el-dialog
                class="mydialog"
                title=""
                :visible.sync="storedialogVisible"
                :close-on-click-modal="false"
                top="46px"
                :width="$store.state.home.modelContentWidth + 'px'"
                @close="storeDialogCloseEvent"
            >
                <div class="invoiceList_title">
                    <el-input
                        size="small"
                        placeholder="请输入门店名称"
                        prefix-icon="el-icon-search"
                        clearable
                        @clear="searchStoreTableEvent"
                        :style="{width: '378px'}"
                        @keyup.enter.native="searchStoreTableEvent"
                        v-model="storetableParam.searchWord">
                    </el-input>
                    <el-button @click="searchStoreTableEvent" :style="{margin: '0 30px 0 10px'}" type="primary" size="small">搜索</el-button>
                </div>
                <div>
                    <el-table
                        :data="storeTableData"
                        :height="$store.state.home.modelContentHeight - 163"
                        ref="storeTable"
                        @select="storeSelectTableEvent"
                        @select-all="storeSelectAllEvent"
                        @selection-change="storeChangeEvent"
                        style="width: 100%">
                        <el-table-column
                        type="selection"
                        width="50">
                        </el-table-column>
                        <el-table-column
                            prop="shopName"
                            label="门店名称"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="cellPhone"
                            label="手机号">
                        </el-table-column>
                        <el-table-column
                            prop="created"
                            label="门店地址">
                            <template slot-scope="scope">
                                <span>{{scope.row.provinceName + ' ' + scope.row.cityName + ' ' + scope.row.areaName + ' ' + scope.row.addrDetail}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <span slot="footer" class="dialog-footer">
                    <div style="float: left">
                        <el-button size="small" type="primary" @click="chooseStoreEvent">确 定</el-button>
                        <el-button size="small" @click="storedialogVisible = false">取 消</el-button>
                    </div>
                    <div style="float: right">
                        <el-pagination
                            @size-change="storeHandleSizeChange"
                            @current-change="storeHandleCurrentChange"
                            :current-page="storetableParam.pageNo"
                            :page-sizes="[10, 30, 50, 100]"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="storetotalPage">
                        </el-pagination>
                    </div>

                </span>
            </el-dialog>
<!-- 新增收货地址 -->
        <el-dialog
            title="新增收货地址"
            :visible.sync="addressdialogVisible"
            :close-on-click-modal="false"
            @close="addressDialogClose"
            width="30%"
            >
                <el-form :inline="true" :rules="addressRules" ref="addAddressForm" :model="addressFormData" label-position="right" size="small" label-width="120px">
                    <div>
                        <el-form-item prop="receivedUserName" label="收货人姓名">
                            <el-input style="width: 194px" v-model="addressFormData.receivedUserName" placeholder="请输入收货人姓名"></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item prop="cellPhone" label="收货人手机号">
                            <el-input style="width: 194px" v-model="addressFormData.cellPhone" placeholder="请输入收货人手机号"></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item prop="addrProvinceId" label="收货地址">
                            <area-cader ref="addAddressArea" v-on:areaFromChild="areaCallBack"></area-cader>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item prop="addrDetail" label="详细地址">
                            <el-input style="width: 354px" v-model="addressFormData.addrDetail" placeholder="请输入详细地址"></el-input>
                        </el-form-item>
                    </div>


                </el-form>


            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addressdialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addAddressEvent">确 定</el-button>
            </span>
        </el-dialog>

        </div>
        <div class="model_footer">
            <el-button size="small" @click="addOrderListBack" style="width: 90px; margin-left: 25px;">返 回</el-button>
            <el-button @click="addOrderListEvent" type="primary" size="small" style="width: 90px;">保 存</el-button>
        </div>
    </div>
</template>

<script>
import api from 'api/order'
import areaCader from 'components/areaCascader'
export default {
    components: {
        areaCader
    },
    data(){
        return {
            storeTableData: [],
            totalcosts: "0.00",
            storetableParam: {
                pageNo: 1,
                pageSize: 10,
                levelId: 0,
                isCheck: 0,
                searchWord: ''
            },
            addressData: [],
            storeTableSelectRows: [],
            storetotalPage: 0,
            goodsInfoData: [],
            imageUrl1: '',
            storedialogVisible: false,
            chooseGoodsdialogVisible: false,
            addressdialogVisible: false,
            uploadURL: process.env.API_ROOT + '/f/upload',
            sendData: {
                file: "",
                uploadType: 'erp'
            },
            addFormData: {
                replaceImg: '',
                shopUserId: '',
                shopUserName: '',
                addressId: '',
                replaceRemark: '',
                itemList: ''
            },
            addressFormData: {
                userId: '',
                receivedUserName: '',
                addrProvinceId: '',
                addrCityId: '',
                addrAreaId: '',
                addrDetail: '',
                cellPhone: '',
                defaultAddr: '0'
            },
            rules: {
                replaceImg: [
                    { required: true, message: '请选择上传附件', trigger: 'blur' }
                ]
            },
            addressRules: {
                receivedUserName: [
                    { required: true, message: '请输入收货人姓名', trigger: 'blur' }
                ],
                cellPhone: [
                    { required: true, message: '请输入收货人手机号', trigger: 'blur' }
                ],
                addrProvinceId: [
                    { required: true, message: '请选择收货地址', trigger: 'blur' }
                ],
                addrDetail: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' }
                ]
            }
        }
    },
    computed:{},
    methods:{
        addOrderListBack(){
            this.$router.push({
                path: '/orderList'
            });
        },
        addOrderListEvent(){
            this.$refs['addOrderForm'].validate((valid) => {
                if (valid) {
                    if (this.addFormData.shopUserId == '') {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '请选择买家!'
                        });
                        return
                    }
                    if (this.addFormData.addressId == '') {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '请选择收货地址!'
                        });
                        return
                    }

                    var itemList = []

                    for (var item of this.goodsInfoData){
                        if (item.itemId != "") {
                            itemList.push(item)
                        }
                    }

                    if (itemList.length == 0) {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '请选择商品信息!'
                        });
                        return
                    }

                    for (var itemgood of itemList){
                        if (itemgood.quantity == '' || itemgood.quantity == '0') {
                            this.$message({
                                type: 'warning',
                                duration: 1500,
                                showClose: true,
                                message: '请填写商品数量!'
                            });
                            return
                        }
                    }


                    this.addFormData.itemList = JSON.stringify(itemList)

                    api.addOrderList(this.addFormData).then((response) => {
                        this.$message({
                            type: 'success',
                            duration: 1500,
                            showClose: true,
                            message: '新建代下单成功!'
                        });
                        this.$router.push({
                            path: '/orderList'
                        });

                    })
                }
            })
        },
        addAddressEvent(){
            this.$refs['addAddressForm'].validate((valid) => {
                if (valid) {
                    api.addShopuserAddr(this.addressFormData).then((response) => {
                        this.addressdialogVisible = false

                        var obj = {
                            category : 1,
                            userId : this.addFormData.shopUserId
                        }

                        this.getAddressData(obj)
                    })
                }
            })
        },
        addressDialogClose(){
            this.$refs.addAddressForm.resetFields()
        },
        areaCallBack(data){
            this.addressFormData.addrProvinceId = data[0]
            this.addressFormData.addrCityId = data[1]
            this.addressFormData.addrAreaId = data[2]
        },
        addAddressClick(){
            this.addressdialogVisible = true
        },
        orderAddressClick($event, index){
            this.myBase.confirmDelet('你确定要更换订单收货地址?', () => {
                $('#addOrderAddresWrap>div').removeClass('active')
                $('#addOrderAddresWrap>div').eq(index).addClass('active')
                this.addFormData.addressId = this.addressData[index].id
            })
        },
        chooseGoodEvent(){
            this.$router.push({
                path: '/orderChooseGoods'
            });
        },
        storeChangeEvent(rows){
            this.storeTableSelectRows = rows
        },
        storeSelectAllEvent(){
            this.$refs.storeTable.clearSelection()
        },
        storeSelectTableEvent(selection, row){
            this.$refs.storeTable.clearSelection()
            this.$refs.storeTable.toggleRowSelection(row)
        },
        searchStoreTableEvent(){
            this.storetableParam.pageNo = 1
            this.storeGetTableData()
        },
        storeGetTableData(){
            return api.getStoreList(this.storetableParam).then((response) => {
                this.storetotalPage = response.data.total
                this.storeTableData = response.data.list
            })
        },
        restStoreTableParam(){
            this.storetableParam.pageSize = 10
            this.storetableParam.pageNo = 1
            this.storeGetTableData()
        },
        storeDialogCloseEvent(){
            this.restStoreTableParam()
        },
        storeHandleSizeChange(val){
            this.storetableParam.pageSize = val
            this.storeGetTableData()
        },
        storeHandleCurrentChange(val){
            this.storetableParam.pageNo = val
            this.storeGetTableData()
        },
        chooseStoreEvent(){
            if (this.storeTableSelectRows.length == 0) {
                this.$message({
                    type: 'error',
                    duration: 1500,
                    showClose: true,
                    message: '请选择门店数据!'
                })
                return
            }

            var row = this.storeTableSelectRows[this.storeTableSelectRows.length - 1]

            this.addFormData.shopUserId = row.id //添加订单
            this.addressFormData.userId = row.id  //添加收货地址
            this.addFormData.shopUserName = row.shopName
            this.storedialogVisible = false

            var obj = {
                category : 1,
                userId : row.id
            }

            this.getAddressData(obj)
        },
        getAddressData(param){
            api.getShopuseraddr(param).then((response) => {
                var addressData = response.data

                this.addressData = addressData

                for (var item of addressData){
                    if (item.defaultAddr == 1) {
                        this.addFormData.addressId = item.id
                    }
                    return
                }
            })
        },
        chooseStoreBtn(){
            this.storeGetTableData()
            this.storedialogVisible = true
        },
        handleAvatarSuccess1(res, file) {
            this.addFormData.replaceImg = res.data.url
            this.imageUrl1 = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file){
            var isJPG = false

            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                isJPG = true
            }

            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message({
                    type: 'error',
                    duration: 1500,
                    showClose: true,
                    message: '上传头像图片只能是 JPG 或 PNG 格式!'
                })
            }
            if (!isLt2M) {
                this.$message({
                    type: 'error',
                    duration: 1500,
                    showClose: true,
                    message: '上传头像图片大小不能超过 2MB!'
                })
            }

            return isJPG && isLt2M;
        },
        priceUnitTatalEvent(data){
            data.row.price = data.row.price.replace(/[^\d\.]/g, '')
            data.row.price = data.row.price.replace(/\b(0+)/gi, '')

            if (data.row.price == ''){
                data.row.price = '0'
            }

            var totalcost = 0

            for (var item of this.goodsInfoData){
                if (!isNaN(item.price) && item.price != '') {
                    totalcost += parseFloat(item.price)
                }
            }

            this.totalcosts = totalcost.toFixed(2)

        },
        restTotalCosts(){
            var totalcost = 0

            console.log(this.goodsInfoData)

            for (var item of this.goodsInfoData){
                if (!isNaN(item.price) && item.price != '') {
                    totalcost += parseFloat(item.price)
                }
            }

            this.totalcosts = totalcost.toFixed(2)
        },
        countUnitTatalEvent(data){
            data.row.quantity = data.row.quantity.replace(/\D/g, '')
            data.row.quantity = data.row.quantity.replace(/\b(0+)/gi, '')

            if (data.row.itemPrice == ''){
                data.row.itemPrice = '0'
            }
            if (data.row.quantity == '') {
                data.row.quantity = '0'
            }

            var price = parseFloat(data.row.itemPrice)
            var num = parseFloat(data.row.quantity)

            data.row.price = (price * num).toFixed(2)

            var totalcost = 0

            for (var item of this.goodsInfoData){
                if (!isNaN(item.price) && item.price != '') {
                    totalcost += parseFloat(item.price)
                }
            }

            this.totalcosts = totalcost.toFixed(2)

        },
        resetGoodsInfoData(){
            this.goodsInfoData = [{
                itemId: '',
                title: '',
                mainImg: '',
                price: '',
                skuName: '',
                itemSkuId: '',
                producedDate: '',
                quantity: '0',
                itemNumber: '',
                applyPriceInventoryId: ''

            }]
        },
        goodTableReduceEvent(data){
            if (this.goodsInfoData.length > 1){
                this.goodsInfoData.splice(data.$index, 1)
                this.restTotalCosts()
            } else {
                this.resetGoodsInfoData()
            }
        },
        goodTableAddEvent(){
            var itemobj = {
                itemId: '',
                title: '',
                mainImg: '',
                price: '',
                skuName: '',
                itemSkuId: '',
                producedDate: '',
                quantity: '0',
                itemNumber: '',
                applyPriceInventoryId: ''
            }

            this.goodsInfoData.push(itemobj)
        },
        addFormDataInit(){
            for (var kk in this.addFormData) {
                this.addFormData[kk] = ""
            }
            this.addressData = []
            this.imageUrl1 = ""
        },
        setGoodsTableData(){
            console.log(this.$store.state.purchase.goodsInfoData)

            this.$store.state.purchase.goodsInfoData.forEach((item, index) => {
                for (var child of item.skuGroups) {
                    var itemobj = this.myBase.deepCopy(item)

                    // itemobj.baseItemId  = item.id
                    // itemobj.id  = item.id
                    itemobj.skuName = child.skuPropertyNames
                    itemobj.itemSkuId = child.id
                    itemobj.itemNumber = child.itemNumber

                    itemobj.applyPriceInventoryId = child.inventoryId
                    itemobj.itemPrice = String(child.totalPrice)
                    itemobj.quantity = '0'
                    itemobj.price = '0'
                    itemobj.sendWay = '1'


                    var pushFlg = true

                    this.goodsInfoData.forEach((item1, index1) => {
                        if (item1.itemSkuId == itemobj.itemSkuId && item1.itemId == itemobj.itemId) {
                            pushFlg = false
                        }
                    })

                    if (pushFlg) {
                        this.goodsInfoData.unshift(itemobj)
                    }

                }
            })

        }

    },
    watch: {
        totalcosts(newvalue){
            this.totalcosts = newvalue
        }
    },
    created(){},
    activated(){
        if (this.$route.params.type == 1) {
            this.addFormDataInit()
            this.resetGoodsInfoData()
            this.totalcosts = "0.00"
        } else {
            this.setGoodsTableData()
        }

    },
    mounted(){}
}
</script>
<style scoped>
.maxWord{overflow:hidden; text-overflow:ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;}
.model_content_inner{
    position: relative;
}

.model_footer{
    text-align: left;
    padding-top: 10px;
}
.banner{
    height: 40px;
    background: #f5f5f5;
    line-height: 40px;
    color: #606266;
    font-weight: 600;
    padding-left: 10px;
}
.customWrap{
    padding: 20px 0;
    padding-left: 30px;
}
.tableBottom{
    width: 100%;
    height: 70px;
    border: 1px solid #E4E7ED;
    border-top: none;
}
.invoiceList_title{
    height: 63px;
    line-height: 63px;
    padding-left: 17px;
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
.orderDetail_item .orderDetail_item_active_curr{
    display: none;
}
.orderDetail_item.active .orderDetail_item_active_curr{
    display: block;
}
.orderDetail_item .orderDetail_item_active_other{
    display: block;
}
.orderDetail_item.active .orderDetail_item_active_other{
    display: none;
}
.orderDetail_item:hover .orderDetail_item_active_other{
    display: block;
}
.active:hover .orderDetail_item_active_other{
    display: none;
}
.orderDetail_item.active{
    border: 1px solid #409EFF;
}
.orderDetail_item_top{
    height: 50%;
    border-bottom: 1px dashed #E4E7ED;
}
.orderDetail_item_bottom{
    height: 35%;
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
