<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">采购单</span>
            <span> - 新增退货单</span>
        </div>
        <div class="content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <el-form ref="addPurRejectForm" class="myForm" :inline="true" :model="addFormData" :rules="rules" label-position="right" size="small" label-width="100px">
                <div class="banner">
                    基本信息
                </div>
                <div class="baseInfoBox">
                    <el-form-item prop="relePurchaseList" label="关联采购单">
                        <el-input v-model="addFormData.relePurchaseList" placeholder="请选择关联采购单">
                            <i
                                class="el-icon-more"
                                slot="suffix"
                                @click="relePurchaseListIconEvent"
                            >
                            </i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="returnHouseId" label="退货仓库">
                        <el-select filterable  @change="selectChangeEvent(3)" v-model="addFormData.returnHouseId" placeholder="请选择入库仓库">
                            <el-option v-for="item in repositorySelectData" :key="item.id" :label="item.warehouseName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="sellerId" label="供应商 : ">
                        <span v-text="addFormData.sellerName"></span>
                    </el-form-item>
                    <el-form-item prop="purchaseCompany" label="采购单位 : ">
                        <span v-text="addFormData.buyerName"></span>
                    </el-form-item>
                </div>
                <div class="banner">
                    商品信息
                </div>
                <div style="padding: 10px;">
                    <el-table
                        :data="goodsInfoData"
                        :span-method="arraySpanMethod"
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
                        prop="oper"
                        label="操作"
                        width="60">
                            <template slot-scope="scope">
                                <i @click="goodTableAddEvent(scope)" style="font-size: 16px; color: #666666; cursor: pointer; margin-right: 10px;" class="fa fa-plus"></i>
                                <i @click="goodTableReduceEvent(scope)" style="font-size: 16px; color: #666666; cursor: pointer" class="fa fa-minus"></i>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="itemSku"
                        label="编号"
                        width="180">
                        <template slot-scope="scope">
                            <div v-if="scope.row.itemSku === ''">
                                <el-autocomplete
                                v-model="querySearchText"
                                :style="{width: '270px'}"
                                :disabled="true"
                                placeholder="输入商品名称/编号"
                                >
                                </el-autocomplete>

                                <span class="el-icon-more"></span>
                            </div>
                            <div v-if="scope.row.itemSku !== ''">
                                <span v-text="scope.row.itemSku"></span>
                            </div>
                        </template>
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
                        prop="resReturnNum"
                        label="剩余可退数">
                            <!-- <template slot-scope="scope">
                                <span v-if="scope.row.itemSku !== ''">{{ scope.row.resReturnNum = scope.row.storeNumber - scope.row.returnNumber}}</span>
                            </template> -->
                        </el-table-column>
                        <el-table-column
                        prop="returnNumber"
                        label="退货数">
                            <template slot-scope="scope">
                                <div v-if="scope.row.itemSku === ''">
                                    <span></span>
                                </div>
                                <div v-if="scope.row.itemSku !== ''">
                                    <el-tooltip class="item" effect="dark" :content="'不得大于' + scope.row.resReturnNum" placement="top">
                                        <el-input :limt="scope.row.resReturnNum" @change.native="unitTatalEvent(scope, $event)" @keyup.native="unitTatalEvent(scope, $event)" v-model="scope.row.returnNumber"></el-input>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="itemQuantifierUnit"
                        label="单位">
                        </el-table-column>
                        <el-table-column
                        prop="returnUnitPrice"
                        label="退货单价(元)">
                            <template slot-scope="scope">
                                <div v-if="scope.row.itemSku === ''">
                                    <span></span>
                                </div>
                                <div v-if="scope.row.itemSku !== ''">
                                    <el-input @change.native="unitTatalEvent(scope)" @keyup.native="unitTatalEvent(scope)" v-model="scope.row.returnUnitPrice"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="returnMoney"
                        label="小计(元)">
                        </el-table-column>
                    </el-table>
                    <div class="tableBottom">
                        <div style="width: 460px; float: right;padding-top: 10px">
                            <el-form-item label-width="200px" prop="carriage" label="协商后,修改退货金额">
                                <el-input @keyup.native="editCostEvent" v-model="addFormData.consultPrice" placeholder="退货金额"></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item label-width="200px" prop="totalReturnMoney" label="退货金额">
                                <span style="color: #f56c6b" v-text="addFormData.showReturnMoney"></span>
                            </el-form-item>
                        </div>
                    </div>
                </div>

                <div class="goodInfoBox" style="width: 650px">
                    <el-form-item prop="returnTime" label="退货时间">
                        <el-date-picker
                        v-model="addFormData.returnTime"
                        value-format="timestamp"
                        type="datetime"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="ReturnOrderNo" label="退货单号">
                        <el-input :disabled="true" v-model="addFormData.ReturnOrderNo" placeholder="请输入采购单号"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item prop="operator" label="经办人">
                        <el-input v-model="addFormData.operator" placeholder="请输入经办人"></el-input>
                    </el-form-item>
                    <el-form-item prop="creator" label="制单人">
                        <el-input :disabled="true" v-model="addFormData.creator" placeholder="请输入制单人"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item class="marker" :style="{width: '100%'}" prop="remark" label="备注">
                        <el-input style="width: 500px" type="textarea" :rows="4" v-model="addFormData.remark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="model_footer">
            <el-button @click="saveBtnEvent" style="width: 90px" type="primary" size="small">保存</el-button>
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
            supplierSelectData: [],
            repositorySelectData: [],
            buyerNameSelectData: [],
            tabelTotalCost: "",
            goodsInfoData: [],
            addFormData: {
                purchaseOrderId: '',
                purchaseOrderNo: '',
                buyerId: '',
                buyerName: '',
                returnHouseId: '',
                returnHouseName: '',
                sellerId: '',
                sellerName: '',
                totalReturnMoney: '',
                showReturnMoney: '',
                totalReturnNumber: '',
                creator: '',
                creatorId: '',
                ReturnOrderNo: '',
                returnTime: Date.parse(new Date()),
                consultPrice: '',
                remark: '',
                operator: '',
                list: []
            },
            rules: {
                relePurchaseList: [
                    { required: true, message: '请选择关联采购单', trigger: 'blur' }
                ],
                returnHouseId: [
                    { required: true, message: '请选择入库仓库', trigger: 'blur' }
                ],
                operator: [
                    { required: true, message: '请输入经办人', trigger: 'blur' }
                ],
                returnTime: [
                    { required: true, message: '请选择退货时间', trigger: 'blur' }
                ]

            }
        }
    },
    computed:{

    },
    methods:{
        getSupplierSelectData(){
            api.getSupplierSelectData().then((response) => {
                this.supplierSelectData = response.data.list
            })
        },
        getRepositorySelectData(){
            api.getRepoSelectData().then((response) => {
                this.repositorySelectData = response.data
            })
        },
        getBuyerComSelectData(){
            api.getBuyerComSelectData().then((response) => {
                this.buyerNameSelectData = response.data
            })
        },
        goodTableAddEvent(){
            var itemobj = {
                oper: '',
                itemSku: '',
                itemMac: '',
                itemName: '',
                itemSpec: '',
                itemExp: '',
                productData: '',
                purchaseNum: '',
                itemQuantifierUnit: '',
                returnUnitPrice: '',
                returnMoney: ''
            }

            this.goodsInfoData.push(itemobj)
        },
        goodTableReduceEvent(data){
            if (this.goodsInfoData.length > 1){
                this.goodsInfoData.splice(data.$index, 1)
            } else {
                this.goodsInfoData = [{
                    oper: '',
                    itemSku: '',
                    itemMac: '',
                    itemName: '',
                    itemSpec: '',
                    itemExp: '',
                    productData: '',
                    purchaseNum: '',
                    itemQuantifierUnit: '',
                    returnUnitPrice: '',
                    returnMoney: ''
                }]
            }
        },
        arraySpanMethod({row, column, rowIndex, columnIndex}) {
            if (columnIndex === 2) {
                if (row.itemSku == ""){
                    return [1, 3];
                } else {
                    return [1, 1];
                }
            } else {
                return [1, 1];
            }
        },
        editCostEvent(){
            this.addFormData.consultPrice = this.addFormData.consultPrice.replace(/[^\d\.]/g, '')
            if (this.addFormData.consultPrice == "") {
                this.addFormData.showReturnMoney = this.tabelTotalCost
            } else {
                this.addFormData.showReturnMoney = this.addFormData.consultPrice
            }
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

                    if (column.property == 'returnNumber'){
                        this.addFormData.totalReturnNumber = sums[index]
                    }

                    if (column.property == 'returnMoney'){
                        this.tabelTotalCost = sums[index]
                        this.addFormData.totalReturnMoney = this.tabelTotalCost
                        if (this.addFormData.consultPrice == "") {
                            this.addFormData.showReturnMoney = this.tabelTotalCost
                        } else {
                            this.addFormData.showReturnMoney = this.addFormData.consultPrice
                        }
                    }
                } else {
                    sums[index] = ''
                }
            })

            return sums
        },
        unitTatalEvent(data, $event){
            if (typeof data.row.returnUnitPrice == 'string') {
                data.row.returnUnitPrice = data.row.returnUnitPrice.replace(/[^\d\.]/g, '')
                data.row.returnUnitPrice = data.row.returnUnitPrice.replace(/\b(0+)/gi, '')
            }
            if (typeof data.row.returnNumber == 'string') {
                data.row.returnNumber = data.row.returnNumber.replace(/[^\d\.]/g, '')
                data.row.returnNumber = data.row.returnNumber.replace(/\b(0+)/gi, '')
            }

            if (data.row.returnUnitPrice == '' || data.row.returnNumber == ''){
                data.row.returnMoney = 0
            } else {
                var price = parseFloat(data.row.returnUnitPrice)
                var num = parseFloat(data.row.returnNumber)

                if ($event) {
                    // var tha = $event.currentTarget
                    // var limitNum = parseFloat($(tha).attr('limt'))

                    if (num > data.row.resReturnNum) {
                        data.row.returnNumber = data.row.resReturnNum
                        data.row.returnNumber.toString()
                        this.unitTatalEvent()
                    }
                }
                data.row.returnMoney = (price * num).toFixed(2)

            }

        },

        relePurchaseListIconEvent(){
            this.$router.push({
                path: '/chooseRelePurchaseList'
            });
        },
        saveBtnEvent(){
            this.$refs['addPurRejectForm'].validate((valid) => {
                if (valid) {
                    this.saveEvent()
                }
            })
        },
        addFormDataInit(){
            for (var kk in this.addFormData) {
                this.addFormData[kk] = ""
            }
            this.goodsInfoData = [
                {
                    oper: '',
                    itemSku: '',
                    itemMac: '',
                    itemName: '',
                    itemSpec: '',
                    itemExp: '',
                    productData: '',
                    purchaseNum: '',
                    itemQuantifierUnit: '',
                    returnUnitPrice: '',
                    returnMoney: ''
                }
            ]
        },
        saveEvent(){

            this.addFormData.returnTime = Math.round(this.addFormData.returnTime / 1000)
            this.addFormData.list = this.goodsInfoData

            api.addRejectList(this.addFormData).then(() => {
                this.$message({
                    type: 'success',
                    showClose: true,
                    duration: 1500,
                    message: '保存成功!'
                });
                this.$router.go(-1)
                // this.$router.push({
                //     path: '/lookPurchaseReject'
                // })
            }).catch(() => {
                this.addFormData.returnTime = this.addFormData.returnTime * 1000
            });
        },
        setGoodsInfoData(arr){
            var resArr = []

            arr.forEach((item, index) => {
                var itemobj = this.myBase.deepCopy(item)

                // itemobj.returnNumber = "0"
                itemobj.returnUnitPrice = itemobj.purchaseUnitPrice
                itemobj.returnMoney = "0"
                itemobj.resReturnNum = itemobj.storeNumber - itemobj.returnNumber
                itemobj.returnNumber = "0"
                if (itemobj.resReturnNum < 0) {
                    itemobj.resReturnNum = 0
                }

                resArr.push(itemobj)
            })

            this.goodsInfoData = resArr
        }
    },
    created(){
        this.getSupplierSelectData()
        this.getRepositorySelectData()
        this.getBuyerComSelectData()
    },
    activated(){
        var id = this.$store.state.home.currentModelId

        this.addFormDataInit()

        this.addFormData.returnTime = Date.parse(new Date())

        if (id != "") {
            api.getPurchaseListItem(id).then((response) => {
                this.$refs['addPurRejectForm'].resetFields();
                var puraseInfo = response.data

                this.addFormData.relePurchaseList = puraseInfo.purchaseOrderNo
                this.addFormData.purchaseOrderId = id
                this.addFormData.purchaseOrderNo = puraseInfo.purchaseOrderNo
                this.addFormData.buyerId = puraseInfo.buyerId
                this.addFormData.buyerName = puraseInfo.buyerName
                this.addFormData.returnHouseId = puraseInfo.purchaseHouseId
                this.addFormData.returnHouseName = puraseInfo.purchaseHouseName
                this.addFormData.sellerId = puraseInfo.sellerId
                this.addFormData.sellerName = puraseInfo.sellerName
                this.addFormData.creator = puraseInfo.creator

                this.addFormData.creatorId = puraseInfo.creatorId
                this.addFormData.ReturnOrderNo = this.myBase.MathRand('CG-R')

                this.addFormData.list = puraseInfo.list

                this.setGoodsInfoData(this.addFormData.list)

            })
        }
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
.content{
    overflow: auto;
}
</style>
