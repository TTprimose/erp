<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">采购单</span>
            <span> - 新增采购单</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner" :style="{height: $store.state.home.modelContentHeight - 20 + 'px'}">
                <el-form class="myForm" ref="addPurchaseListForm" :inline="true" :model="addFormData" :rules="rules" label-position="right" size="small" label-width="90px">
                    <div class="banner">
                        基本信息
                    </div>
                    <div class="baseInfoBox">
                        <el-form-item prop="sellerId" label="供应商">
                            <el-select filterable  @change="selectChangeEvent(1)" v-model="addFormData.sellerId" placeholder="请选择供应商">
                                <el-option v-for="item in supplierSelectData" :key="item.id" :label="item.sellerCompanyName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="purchaseHouseId" label="入库仓库">
                            <el-select filterable  @change="selectChangeEvent(2)" v-model="addFormData.purchaseHouseId" placeholder="请选择入库仓库">
                                <el-option v-for="item in repositorySelectData" :key="item.id" :label="item.warehouseName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="buyerId" label="采购单位">
                            <el-select filterable  @change="selectChangeEvent(3)" v-model="addFormData.buyerId" placeholder="请选择采购单位">
                                <el-option v-for="item in buyerNameSelectData" :key="item.id" :label="item.buyerCompanyName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="banner">
                        商品信息
                    </div>
                    <div style="padding: 10px;">
                        <el-table
                            :data="goodsInfoData"
                            :span-method="arraySpanMethod"
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
                            prop="oper"
                            label="操作"
                            width="60">
                                <template slot-scope="scope">
                                    <i @click="goodTableAddEvent(scope)" style="font-size: 16px; color: #666666; cursor: pointer; margin-right: 10px;" class="fa fa-plus"></i>
                                    <i @click="goodTableReduceEvent(scope)" style="font-size: 16px; color: #666666; cursor: pointer" class="fa fa-minus"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="itemCode"
                            label="编号"
                            width="180">
                            <template slot-scope="scope">
                                <div v-if="scope.row.id === ''">
                                    <el-autocomplete
                                    v-model="querySearchText"
                                    :style="{width: '270px'}"
                                    :disabled="true"
                                    :fetch-suggestions="querySearchAsync"
                                    placeholder=""
                                    @select="querySearchAsynSelect"
                                    >
                                    </el-autocomplete>

                                    <span @click="chooseGoodEvent" class="el-icon-more"></span>
                                </div>
                                <div v-if="scope.row.id !== ''">
                                    <span v-text="scope.row.itemCode"></span>
                                </div>
                            </template>
                            </el-table-column>
                            <el-table-column
                            prop="barCode"
                            label="条码">
                            </el-table-column>
                            <el-table-column
                            prop="title"
                            label="商品">
                            </el-table-column>
                            <el-table-column
                            prop="SKU"
                            label="规格-SKU">
                            </el-table-column>
                            <el-table-column
                            prop="expirationDate"
                            label="保质期(月)">
                            </el-table-column>
                            <!-- <el-table-column
                            width="220"
                            prop="productionDate"
                            label="生产日期">
                                <template slot-scope="scope">
                                    <el-date-picker
                                    size="small"
                                    v-if="scope.row.id !== ''"
                                    v-model="scope.row.productionDate"
                                    value-format="timestamp"
                                    type="date"
                                    placeholder="生产日期">
                                    </el-date-picker>
                                </template>
                            </el-table-column> -->
                            <el-table-column
                            prop="purchaseNum"
                            label="采购数">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.id === ''">
                                        <span></span>
                                    </div>
                                    <div v-if="scope.row.id !== ''">
                                        <el-input @change.native="unitTatalEvent(scope)" @keyup.native="unitTatalEvent(scope)" v-model="scope.row.purchaseNum"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="giftNumber"
                            label="赠品数量">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.id === ''">
                                        <span></span>
                                    </div>
                                    <div v-if="scope.row.id !== ''">
                                        <el-input @change.native="unitTatalEvent(scope)" @keyup.native="unitTatalEvent(scope)" v-model="scope.row.giftNumber"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="unit"
                            label="单位">
                            </el-table-column>
                            <el-table-column
                            prop="unitPrice"
                            label="采购单价(元)">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.id === ''">
                                        <span></span>
                                    </div>
                                    <div v-if="scope.row.id !== ''">
                                        <el-input @change.native="unitTatalEvent(scope)" @keyup.native="unitTatalEvent(scope)" v-model="scope.row.unitPrice"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="unitTotal"
                            label="小计(元)">
                            </el-table-column>
                        </el-table>
                        <div class="tableBottom">
                            <div style="width: 350px; float: right;padding-top: 10px">
                                <el-form-item prop="freight" label="运费">
                                    <el-input @change.native="costInputChangeEvent()" @keyup.native="costInputChangeEvent()" v-model="addFormData.freight" placeholder="请输入运费"></el-input>
                                </el-form-item>
                                <el-form-item prop="otherMoney" label="其他费用">
                                    <el-input @change.native="costInputChangeEvent()" @keyup.native="costInputChangeEvent()" v-model="addFormData.otherMoney" placeholder="请输入其他费用"></el-input>
                                </el-form-item>
                                <el-form-item prop="receivedPrice" label="应付金额">
                                    <span style="color: #f56c6b" v-text="addFormData.receivedPrice"></span>
                                </el-form-item>
                            </div>
                        </div>
                    </div>

                    <div class="goodInfoBox" style="width: 650px">
                        <el-form-item prop="orderTime" label="采购时间">
                            <el-date-picker
                            v-model="addFormData.orderTime"
                            value-format="timestamp"
                            type="datetime"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item prop="purchaseOrderNo" label="采购单号">
                            <el-input :disabled="true" v-model="addFormData.purchaseOrderNo" placeholder="请输入采购单号"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item prop="purchasingAgent" label="采购员">
                            <el-input v-model="addFormData.purchasingAgent" placeholder="请输入采购员"></el-input>
                        </el-form-item>
                        <el-form-item prop="creator" label="制单人">
                            <el-input :disabled="true" v-model="addFormData.creator" placeholder="请输入制单人"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item class="marker" :style="{width: '100%'}" prop="purchaseRemark" label="备注">
                            <el-input style="width: 490px" type="textarea" :rows="4" v-model="addFormData.purchaseRemark" placeholder="请输入备注"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>

        </div>
        <div class="model_footer">
            <el-button @click="saveBtn" style="width: 90px" type="primary" size="small">保存</el-button>
            <el-button v-RouterBack style="width: 90px" size="small">取消</el-button>
        </div>
    </div>
</template>

<script>
import api from 'api/purchase'
export default {
    data(){
        return {
            querySearchText: '',
            tableTotalUnit: 0,
            supplierSelectData: [],
            repositorySelectData: [],
            buyerNameSelectData: [],
            goodsInfoData: [],
            initGoodsInfoData: [{
                id: '',
                oper: '',
                itemCode: '',
                barCode: '',
                title: '',
                SKU: '',
                expirationDate: '',
                productData: '',
                purchaseNum: '',
                giftNumber: '',
                unit: '',
                unitPrice: '',
                unitTotal: '',
                skuGroups: [""]
            }],
            addFormData: {
                buyerId: "",
                buyerName: "",
                creator: this.$store.state.home.userInfo.user.userName,
                creatorId: this.$store.state.home.userInfo.user.id,
                purchaseOrderNo: "",
                list: [],
                orderTime: Date.parse(new Date()),
                purchaseHouseId: "",
                purchaseHouseName: "",
                purchasingAgent: "",
                purchasingTotalNumber: "0",
                receivedPrice: "0",
                sellerId: "",
                sellerName: "",
                totalMoney: "",
                freight: "",
                otherMoney: ''
            },
            rules: {
                sellerId: [
                    { required: true, message: '请选择供应商', trigger: 'blur' }
                ],
                purchaseHouseId: [
                    { required: true, message: '请选择入库仓库', trigger: 'blur' }
                ],
                buyerId: [
                    { required: true, message: '请选择采购单位', trigger: 'blur' }
                ],
                orderTime: [
                    { required: true, message: '请选择采购时间', trigger: 'blur' }
                ],
                purchaseOrderNo: [
                    { required: true, message: '请输入采购单号', trigger: 'blur' }
                ],
                creator: [
                    { required: true, message: '请输入制单人', trigger: 'blur' }
                ],
                purchasingAgent: [
                    { required: true, message: '请输入采购员', trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        tableTotalUnit(newvalue){
            this.addFormData.receivedPrice = newvalue

            if (!isNaN(this.addFormData.freight) && this.addFormData.freight != ""){
                this.addFormData.receivedPrice = this.addFormData.receivedPrice + parseFloat(this.addFormData.freight)
            }
            if (!isNaN(this.addFormData.otherMoney) && this.addFormData.otherMoney != ""){
                this.addFormData.receivedPrice = this.addFormData.receivedPrice + parseFloat(this.addFormData.otherMoney)
            }

            this.addFormData.receivedPrice = this.addFormData.receivedPrice.toFixed(2)

        }
    },
    computed:{},
    methods:{
        goodTableAddEvent(){
            var itemobj = {
                oper: '',
                id: '',
                itemCode: '',
                barCode: '',
                title: '',
                SKU: '',
                expirationDate: '',
                productData: '',
                purchaseNum: '',
                giftNumber: '',
                unit: '',
                unitPrice: '',
                unitTotal: ''
            }

            this.goodsInfoData.push(itemobj)
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
                if (column.property == 'purchaseNum' || column.property == 'unitTotal' || column.property == 'giftNumber'){
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

                    if (column.property == 'purchaseNum'){
                        this.addFormData.purchasingTotalNumber = sums[index]
                    }

                    if (column.property == 'unitTotal'){
                        this.tableTotalUnit = sums[index]
                        this.addFormData.totalMoney = this.tableTotalUnit
                    }
                } else {
                    sums[index] = ''
                }
            })

            return sums

        },
        goodTableReduceEvent(data){
            if (this.goodsInfoData.length > 1){
                this.goodsInfoData.splice(data.$index, 1)
            } else {
                this.resetGoodsInfoData()
            }
        },
        resetGoodsInfoData(){
            this.goodsInfoData = [{
                oper: '',
                id: '',
                itemCode: '',
                barCode: '',
                title: '',
                SKU: '',
                expirationDate: '',
                productData: '',
                purchaseNum: '0',
                giftNumber: '0',
                unit: '',
                unitPrice: '',
                unitTotal: '',
                skuGroups: [""]
            }]
        },
        arraySpanMethod({row, column, rowIndex, columnIndex}) {
            if (columnIndex === 2) {
                if (row.id === ""){
                    return [1, 3];
                } else {
                    return [1, 1];
                }
            } else {
                return [1, 1];
            }
        },
        querySearchAsync(){

        },
        querySearchAsynSelect(){

        },
        unitTatalEvent(data){

            data.row.unitPrice = this.myBase.formatNum(data.row.unitPrice)
            data.row.purchaseNum = this.myBase.formatNum(data.row.purchaseNum)
            data.row.giftNumber = this.myBase.formatNum(data.row.giftNumber)

            if (data.row.giftNumber == '') {
                data.row.giftNumber = '0'
            }


            if (data.row.unitPrice == '' || data.row.purchaseNum == ''){
                data.row.unitTotal = 0
                return
            }
            var price = parseFloat(data.row.unitPrice)
            var num = parseFloat(data.row.purchaseNum)
            var giftnum = parseFloat(data.row.giftNumber)

            if (num >= giftnum) {
                data.row.unitTotal = (price * (num - giftnum)).toFixed(2)
            } else {
                data.row.unitTotal = 0
            }
        },
        costInputChangeEvent(){
            this.addFormData.freight = this.myBase.formatNum(this.addFormData.freight)
            this.addFormData.otherMoney = this.myBase.formatNum(this.addFormData.otherMoney)

            this.addFormData.receivedPrice = this.tableTotalUnit

            if (this.addFormData.freight != "" && !isNaN(this.addFormData.freight)){
                this.addFormData.receivedPrice = this.addFormData.receivedPrice + parseFloat(this.addFormData.freight)
            }
            if (this.addFormData.otherMoney != "" && !isNaN(this.addFormData.otherMoney)){
                this.addFormData.receivedPrice = this.addFormData.receivedPrice + parseFloat(this.addFormData.otherMoney)
            }

            this.addFormData.receivedPrice = this.addFormData.receivedPrice.toFixed(2)
        },
        chooseGoodEvent(){
            this.$router.push({
                path: '/chooseGood'
            });
        },
        getSupplierSelectData(){
            api.getSupplierSelectData().then((response) => {
                this.supplierSelectData = response.data.list
            })
        },
        saveBtn(){
            this.$refs['addPurchaseListForm'].validate((valid) => {
                if (valid) {
                    this.addFormData.orderTime = Math.round(this.addFormData.orderTime / 1000)
                    // this.addFormData.buyerId = "1"

                    this.saveBtnEvent()
                }
            })
        },
        saveBtnEvent(){
            var listArr = []
            var saveFlg = false
            var numFlg = false

            this.goodsInfoData.forEach((item, index) => {
                if (item.itemCode) {
                    saveFlg = true
                    var itemobj = {
                        baseItemId  : item.baseItemId,
                        itemId : item.itemId,
                        purchasingNumber: item.purchaseNum,
                        giftNumber: item.giftNumber,
                        purchaseUnitPrice: item.unitPrice,
                        purchaseTotalPrice: item.unitTotal,
                        itemSku: item.itemCode,
                        itemMac: item.barCode,
                        itemSpec: item.SKU,
                        itemExp: item.expirationDate,
                        // productionDate : Math.round(item.productionDate / 1000),
                        itemQuantifierUnit: item.unit
                    }

                    if (parseFloat(item.giftNumber) > parseFloat(item.purchaseNum)) {
                        numFlg = true
                    }

                    if (item.productionDate != "") {
                        itemobj.productionDate = Math.round(item.productionDate / 1000)
                    }
                    listArr.push(itemobj)
                }

            })

            this.addFormData.list = listArr

            if (!saveFlg) {
                this.$message({
                    type: 'error',
                    duration: 1500,
                    showClose: true,
                    message: '请选择商品信息'
                })
                this.addFormData.orderTime =  this.addFormData.orderTime * 1000
                return
            }
            if (numFlg) {
                this.$message({
                    type: 'error',
                    duration: 1500,
                    showClose: true,
                    message: '商品采购数应大于赠品数量!'
                })
                this.addFormData.orderTime =  this.addFormData.orderTime * 1000
                return
            }
            api.addPurchaseList(this.addFormData).then((response) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '新增成功'
                })

                this.$router.push({
                    path: '/purchaseList'
                });

            })
            this.addFormData.orderTime =  this.addFormData.orderTime * 1000
        },
        getRepositorySelectData(){
            api.getRepoSelectData().then((response) => {
                this.repositorySelectData = response.data
            })
        },
        getBuyerComSelectData(){
            api.getBuyerComSelectData().then((response) => {
                this.buyerNameSelectData = response.data
                // var flg = true

                // this.buyerNameSelectData.forEach((item, index) => {
                //     if (item.id == this.$store.state.home.userInfo.user.buyerId) {
                //         flg = false
                //     }
                // })

                // if (flg) {
                //     this.$message({
                //         type: 'warning',
                //         duration: 1500,
                //         showClose: true,
                //         message: '采购单位被禁用,无法操作'
                //     })
                // }
                // this.addFormData.buyerId = this.$store.state.home.userInfo.user.buyerId
                // this.selectChangeEvent(3)
            })
        },
        setGoodsTableData(){

            this.$store.state.purchase.goodsInfoData.forEach((item, index) => {
                for (var child of item.skuGroups) {
                    var itemobj = this.myBase.deepCopy(item)

                    itemobj.baseItemId  = item.id
                    itemobj.id  = item.id
                    itemobj.SKU = child.skuPropertyNames
                    itemobj.itemId = child.id
                    if (item.mount) {
                        itemobj.purchaseNum = item.mount
                    } else {
                        itemobj.purchaseNum = '0'
                    }

                    itemobj.unitPrice = '0'
                    itemobj.unitTotal = '0'
                    itemobj.giftNumber = '0'

                    if (itemobj.SKU) {
                        //处理SKU规格时间
                        var itemSkuStrArr = itemobj.SKU.split(',')
                        var itemDateStr = ""

                        itemSkuStrArr.forEach((item1, index1) => {
                            if (item1.indexOf('生产日期') > -1) {
                                itemDateStr = item1.split(':')[1]
                            }
                        })

                        if (itemDateStr == "") {
                            itemobj.productionDate = ""
                        } else {
                            var year = itemDateStr.split('年')[0]
                            var month = itemDateStr.split('年')[1].split('月')[0]
                            var day = itemDateStr.split('年')[1].split('月')[1].split('日')[0]

                            month = month > 10 ? month : '0' + month
                            if (day) {
                                day = day > 10 ? day : '0' + day
                            } else {
                                day = '01'
                            }
                            var resDate = year + '-' + month + '-' + day

                            itemobj.productionDate = Date.parse(resDate)

                        }
                    }

                    var pushFlg = true

                    this.goodsInfoData.forEach((item1, index1) => {
                        if (item1.SKU == itemobj.SKU && item1.baseItemId == itemobj.baseItemId) {
                            pushFlg = false
                        }
                    })

                    if (pushFlg) {
                        this.goodsInfoData.unshift(itemobj)
                    }

                }
            })

            console.log(this.goodsInfoData)

        },
        selectChangeEvent(type){
            if (type == 1) {
                this.$refs['addPurchaseListForm'].validateField('sellerId')
                var itemobj1 = this.setSelectName(this.addFormData.sellerId, this.supplierSelectData)

                this.addFormData.sellerName = itemobj1.sellerCompanyName
            }
            if (type == 2) {
                this.$refs['addPurchaseListForm'].validateField('purchaseHouseId')
                var itemobj2 = this.setSelectName(this.addFormData.purchaseHouseId, this.repositorySelectData)

                this.addFormData.purchaseHouseName = itemobj2.warehouseName
            }
            if (type == 3) {
                this.$refs['addPurchaseListForm'].validateField('buyerId')
                var itemobj3 = this.setSelectName(this.addFormData.buyerId, this.buyerNameSelectData)

                this.addFormData.buyerName = itemobj3.buyerCompanyName
            }

        },
        setSelectName(fid, Arr){
            var itemobj = {}

            Arr.forEach((item, index) => {
                if (fid == item.id) {
                    itemobj = item
                }
            })

            return itemobj
        },
        addFormDataInit(){
            for (var kk in this.addFormData) {
                this.addFormData[kk] = ""
            }
            this.addFormData.orderTime = Date.parse(new Date())
            this.addFormData.creator = this.$store.state.home.userInfo.user.userName
            this.addFormData.creatorId = this.$store.state.home.userInfo.user.id
        }
    },
    activated(){
        // this.addFormDataInit()
        if (this.$route.params.type == 1) {
            this.addFormDataInit()
            this.resetGoodsInfoData()
        } else {
            this.setGoodsTableData()
        }
        this.getSupplierSelectData()
        this.getRepositorySelectData()
        this.getBuyerComSelectData()
        this.addFormData.purchaseOrderNo = this.myBase.MathRand('CG')
    },
    beforeRouteLeave(to, from, next){
        this.$store.commit('setGoodsInfoData', this.initGoodsInfoData)
        next()
    },
    mounted(){}
}
</script>
<style scoped>
.banner{
    height: 40px;
    background: #f5f5f5;
    line-height: 40px;
    color: #606266;
    font-weight: 600;
    padding-left: 10px;
}
.baseInfoBox{
    height: 82px;
    padding-top: 10px;
}
.el-icon-more{
    cursor: pointer;
}
.tableBottom{
    width: 100%;
    height: 150px;
    border: 1px solid #E4E7ED;
    border-top: none;
}
.el-date-editor{
    width: 194px;
}
.model_footer{
    line-height: 50px;
    text-align: left;
    padding-left: 40px;
}
.model_content_inner{
    overflow: auto;
}
.el-textarea__inner{
    width: 370px;
}
</style>
