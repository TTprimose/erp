<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">调拨单</span>
            <span> - 新增调拨单</span>
        </div>
        <div class="model_content" >
            <add-good v-if="isShowAddGoods" @saveAddgoodsFn="fromAddGoods"></add-good>
            <div v-if="!isShowAddGoods" class="content" :style="{height: $store.state.home.modelContentHeight - 20 + 'px'}">
                <el-form ref="myForm" class="myForm" :inline="true" :model="addFormData" :rules="rules" label-position="right" size="small" label-width="110px">
                    <div class="banner">
                        基本信息
                    </div>
                    <div class="baseInfoBox">
                        <el-form-item prop="warehouseId" label="调拨仓库">
                            <el-select
                                v-model="addFormData.warehouseId"
                                filterable
                                placeholder="请输入关键词">
                                <el-option
                                    v-for="item in houseId_option"
                                    :key="item.id"
                                    :label="item.warehouseName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="inventoryOutId" label="调出单位">
                            <el-select v-model="addFormData.inventoryOutId" placeholder="请选择">
                                <el-option
                                    v-for="item in buyerId_option"
                                    :key="item.id"
                                    :label="item.buyerCompanyName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="inventoryInId" label="调入单位">
                            <el-select v-model="addFormData.inventoryInId" placeholder="请选择">
                                <el-option
                                    v-for="item in buyerId_option"
                                    :key="item.id"
                                    :label="item.buyerCompanyName"
                                    :value="item.id">
                                </el-option>
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
                            border
                            show-summary
                            :summary-method="getSummaries"
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
                                label="编号"
                                width="180">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.itemId === ''">
                                        <el-autocomplete
                                            v-model="querySearchText"
                                            :style="{width: '270px'}"
                                            :fetch-suggestions="querySearchAsync"
                                            placeholder="输入商品名称/编号"
                                            @select="querySearchAsynSelect"
                                            :disabled="true"
                                        >
                                        </el-autocomplete>

                                        <span @click="chooseGoodEvent" class="el-icon-more"></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
                                        <span v-text="scope.row.itemCode"></span>
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
                                label="保质期">
                            </el-table-column>
                            <el-table-column
                                prop="inventoryNumber"
                                label="调拨数"
                                width="197">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.itemId === ''">
                                        <span></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
                                        <el-input-number
                                            :min="0" :max="scope.row.maxInventory" @change.native="unitTatalEvent(scope)" @keyup.native="unitTatalEvent(scope)" v-model="scope.row.inventoryNumber" label="描述文字">
                                        </el-input-number>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="itemQuantifierUnit"
                                label="单位">
                            </el-table-column>
                            <el-table-column
                                label="备注">
                                <template slot-scope="scope">
                                    <div class="addRemark" @click="addRemark(scope.$index, scope.row)" v-if="scope.row.remark === ''">
                                        <i class="el-icon-plus" style="font-weight: 900;font-size: 16px"></i>
                                    </div>
                                    <div class="addRemark" @click="addRemark(scope.$index, scope.row)" v-else style="line-height: 20px;max-height: 40px;overflow: hidden;text-overflow: ellipsis">
                                        <i class="el-icon-edit" style="font-weight: 900;font-size: 16px"></i>
                                        <span>{{scope.row.remark}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="goodInfoBox">
                        <el-form-item prop="inventoryAllocationNo" label="调拨单号">
                            <el-input :disabled="true" v-model="addFormData.inventoryAllocationNo" placeholder="请输入调拨单号"></el-input>
                        </el-form-item>
                        <el-form-item prop="operator" label="经办人">
                            <el-input v-model="addFormData.operator" placeholder="请输入经办人"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item prop="inventoryAllocationTime" label="调拨时间">
                            <el-date-picker
                                v-model="addFormData.inventoryAllocationTime"
                                type="datetime"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item prop="creator" label="制单人">
                            <el-input v-model="addFormData.creator" placeholder="制单人" :disabled="true" ></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item class="marker" :style="{width: '700px'}" prop="remark" label="备注">
                            <el-input type="textarea" :style="{width: '530px'}" :rows="4" v-model="addFormData.remark" placeholder="请输入备注信息，最多不超过100字"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>
        <el-dialog
            title="备注说明"
            :visible.sync="dialogVisible"
            width="30%">
            <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入备注信息，不得超过200字"
                v-model="remarkTextarea">
            </el-input>
            <span slot="footer" class="dialog-footer">
                            <el-button @click="remarkCancle">取 消</el-button>
                            <el-button type="primary" @click="remarkSure">确 定</el-button>
                        </span>
        </el-dialog>
        <div class="model_footer" v-if="!isShowAddGoods">
            <el-button style="width: 90px" type="primary" size="small" @click="save">保存</el-button>
            <el-button style="width: 90px" size="small" v-RouterBack>取消</el-button>
        </div>
    </div>
</template>

<script>
import 'utils/allEnumeration'
import addGood from './forms/addGoods'
import ME from 'utils/base'
import API from 'api/depot'
export default {
    components: {
        addGood
    },
    data(){
        return {
            dialogVisible: false,
            remarkTextarea: '',
            remarkIndex: 0,
            chooseDate: '',
            querySearchText: '',
            goodsInfoData: [{
                oper: '',
                itemSku: '',
                itemId: '',
                itemSpec: '',
                remark: '',
                inventoryNumber: ''
            }],
            addFormData: {
                warehouseName: '',
                warehouseId: '',
                inventoryInId: '',
                inventoryInName: '',
                inventoryOutId: '',
                inventoryOutName: '',
                inventoryAllocationTime: '',
                creator: '',
                creatorId: '',
                inventoryAllocationNo: '',
                totalInventoryNumber: 0,
                list: [],
                remark: '',
                operator: ''
            },
            buyerId_option: [],
            houseId_option: [],
            rules: {
                warehouseId: [
                    { required: true, message: '请选择调拨仓库', trigger: 'change' }
                ],
                inventoryInId: [
                    { required: true, message: '请选择调入单位', trigger: 'change' }
                ],
                inventoryOutId: [
                    { required: true, message: '请选择调出单位', trigger: 'change' }
                ],
                inventoryAllocationNo: [
                    { required: true, message: '请输入调拨单号', trigger: 'blur' }
                ],
                inventoryAllocationTime: [
                    {required: true, message: '请输入调拨时间', trigger: 'change'}
                ],
                operator: [
                    { required: true, message: '请输入经办人', trigger: 'blur' }
                ],
                creator: [
                    { required: true, message: '请输入制单人', trigger: 'blur' }
                ]
            },
            loading: true,
            validFlag: false
        }
    },
    computed:{
        isShowAddGoods() {
            return this.$store.state.depot.showAddGoods.id > 0
        }
    },
    methods:{
        // 添加商品备注
        addRemark(index, data) {
            this.dialogVisible = true
            this.remarkTextarea = data.remark
            this.remarkIndex = index
        },
        remarkCancle() {
            this.dialogVisible = false
        },
        remarkSure() {
            this.dialogVisible = false
            this.goodsInfoData[this.remarkIndex].remark = this.remarkTextarea
        },
        fromAddGoods(data) {
            let that = this
            let skuArr = []

            console.log(data, '接收的数据')
            data.forEach(res => {
                res.skuGroups.forEach((newSpec) => {
                    let obj = {
                        itemMac: res.barCode,
                        itemCode: res.itemCode,
                        itemName: res.title,
                        itemSpec: newSpec,
                        itemExp: res.expirationDate,
                        productionDate: '',
                        itemId: res.id,
                        skuId: '',
                        inventoryNumber: res.mount || 1,
                        itemQuantifierUnit: res.unit,
                        remark: ''
                    }
                    // 规格生产日期赋值给productionDate
                    let specArr = newSpec.split(':')
                    let dateStr = ''
                    let year = ''
                    let mounth = ''
                    let day = ''
                    let date = ''

                    specArr.forEach((key, index) => {
                        if (key.indexOf('生产日期') > 0) {
                            let a = index + 1

                            dateStr = specArr[a]
                            console.log(index, '测试生产日期')
                            year = dateStr.split('年')[0]
                            mounth = dateStr.split('年')[1].split('月')[0]
                            day = dateStr.split('年')[1].split('月')[1].split('日')[0]
                            mounth = mounth > 10 ? mounth : '0' + mounth
                            if (day) {
                                day = day > 10 ? day : '0' + day
                            } else {
                                day = '01'
                            }
                            date = year + '-' + mounth + '-' + day
                            obj.productionDate = Date.parse(date)
                        }
                    })

                    // 获取skuID
                    API.searchSkuList({itemId: res.id}).then((skuList) => {
                        skuList.data.list.forEach((sku) => {
                            if (sku.skuPropertyNames == obj.itemSpec) {
                                obj.skuId = sku.id
                                let obj2 = {
                                    itemId: sku.id,
                                    houseId: this.addFormData.warehouseId,
                                    buyerId: this.addFormData.inventoryOutId
                                }

                                API.getInventoryOutbound(obj2).then((re) => {
                                    obj.maxInventory = re.data.availableInventory
                                    if (re.data.availableInventory == 0) {
                                        obj.inventoryNumber = 0
                                    }
                                })
                            }
                        })
                    })
                    skuArr.push(obj)
                })
            })
            let addArr = []

            setTimeout(function () {
                skuArr.forEach((newObj) => {
                    let flag = false

                    that.goodsInfoData.forEach((oldObj) => {
                        if (newObj.skuId == oldObj.skuId) {
                            flag = true
                        }
                    })

                    if (!flag) {
                        addArr.push(newObj)
                    }
                    console.log(addArr, "获取skuID")
                })
                that.goodsInfoData = that.goodsInfoData.concat(addArr)
            }, 200)

            console.log(this.goodsInfoData, addArr, '全数据')
            // 对数据去重和去空
            this.goodsInfoData.forEach((good, index) => {
                if (!good.itemId) {
                    this.goodsInfoData.splice(index, 1)
                }
            })

        },
        clearAll() {
            for (let key in this.addFormData) {
                this.addFormData[key] = null
            }
            this.goodsInfoData = [{
                itemCode: '',
                currentStoreNumber: '',
                itemId: ''
            }]
        },
        goodTableAddEvent(){
            var itemobj = {
                oper: '',
                itemSku: '',
                itemId: '',
                itemSpec: '',
                remark: '',
                inventoryNumber: ''
            }

            this.goodsInfoData.push(itemobj)
        },
        goodTableReduceEvent(data) {
            this.goodsInfoData.splice(data.$index, 1)
            if (this.goodsInfoData.length < 1){
                let obj = {
                    itemId: ''
                }

                this.goodsInfoData.push(obj)
            }
        },
        arraySpanMethod({row, column, rowIndex, columnIndex}) {
            // console.log(rowIndex)
            // console.log(this.goodsInfoData.length)
            if (columnIndex === 2) {
                if (row.itemId == ""){
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
            data.row.unitPrice = data.row.unitPrice.replace(/[^\d\.]/g, '')
            data.row.purchaseNum = data.row.purchaseNum.replace(/[^\d\.]/g, '')
            if (data.row.unitPrice == '' || data.row.purchaseNum == ''){
                data.row.unitTotal = ''
                return
            }
            var price = parseFloat(data.row.unitPrice)
            var num = parseFloat(data.row.purchaseNum)

            data.row.unitTotal = price * num
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
                if (column.property == 'inventoryNumber' || column.property == 'unitTotal'){
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

                    if (column.property == 'unitTotal'){
                        this.tableTotalUnit = sums[index]
                    }
                } else {
                    sums[index] = ''
                }
            })

            return sums

        },
        // 入库仓库模糊搜索
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;

                setTimeout(() => {
                    this.loading = false;
                    API.getWarehouseListActive().then(res => {
                        this.houseId_option = res.data.filter(item => {
                            return item.warehouseName.indexOf(query) > -1;
                        });
                    })
                }, 200);
            } else {
                this.houseId_option = [];
            }
        },
        // 仓库列表获取
        getWareHouseList() {
            API.getWarehouseListActive().then(res => {
                this.houseId_option = res.data
            })
        },
        // 获取采购列表
        getPurchaseList() {
            API.getPurchaseAll().then(res => {
                this.buyerId_option = res.data
                console.log(this.buyerId_option, "采购列表")
            })
        },
        // 保存
        save() {
            this.addFormData.list = []
            this.addFormData.totalInventoryNumber = 0
            // 表单验证
            this.$refs.myForm.validate((valid) => {
                this.validFlag = valid
            })
            if (!this.validFlag) {
                return
            }
            // 将表中商品信息添加到addFormData
            this.goodsInfoData.forEach(res => {
                let obj = {
                    itemId: '',
                    baseItemId: '',
                    currentStoreNumber: '',
                    purchasingNumber: null,
                    remark: '',
                    itemSpec: null,
                    productionDate: ''
                }

                obj.itemId = res.skuId // sku id
                obj.baseItemId = res.itemId
                obj.remark = res.remark
                obj.itemSpec = res.itemSpec
                obj.productionDate = res.productionDate / 1000
                obj.inventoryNumber = res.inventoryNumber
                this.addFormData.list.push(obj)
                this.addFormData.totalInventoryNumber += parseInt(obj.inventoryNumber, 10)
            })
            let userInfo = JSON.parse(localStorage.getItem('userInfo'))

            this.addFormData.creatorId = userInfo.user.id
            // 通过仓库ID和采购单ID赋值给addFormData的name
            this.houseId_option.forEach(res => {
                if (res.id === this.addFormData.warehouseId) {
                    this.addFormData.warehouseName = res.warehouseName
                }
            })
            this.buyerId_option.forEach(res => {
                if (res.id === this.addFormData.inventoryInId) {
                    this.addFormData.inventoryInName = res.buyerCompanyName
                }
                if (res.id === this.addFormData.inventoryOutId) {
                    this.addFormData.inventoryOutName = res.buyerCompanyName
                }
            })
            this.postData = ME.deepCopy(this.addFormData)
            if (isNaN(this.postData.inventoryAllocationTime)) {
                this.postData.inventoryAllocationTime = Date.parse(this.postData.inventoryAllocationTime) / 1000
            } else {
                this.postData.inventoryAllocationTime = this.postData.inventoryAllocationTime / 1000
            }
            console.log(this.postData, "添加的数据")
            if (!this.postData.list[0].itemId) {
                this.$message({
                    type: 'warning',
                    message: '请选择商品'
                })
                return
            }
            if (!this.postData.operator) {
                this.$message({
                    type: 'warning',
                    message: '请选择经办人'
                })
                return
            }
            // 调取新增调拨单的接口
            API.addAllotOrder(this.postData).then(res => {
                this.$message({
                    type:'success',
                    message:'调拨单添加成功'
                })
                this.$router.push({ name: "库存调拨" })
            }).catch(error => {

            })
        },
        MathRand(data, type) {
            let sixNum = ''
            let myDate = new Date()
            let monthArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
            let day = myDate.getDate().toString() > 9 ? myDate.getDate() : '0' + myDate.getDate()

            for (let i = 0; i < data; i++) {
                sixNum += Math.floor(Math.random() * 10);
            }
            this.addFormData.inventoryAllocationNo = type + '-' + myDate.getFullYear() + monthArr[myDate.getMonth()] + day + '-' + sixNum
        },
        chooseGoodEvent(){
            // 加限制
            if (!this.addFormData.warehouseId) {
                this.$message({
                    type: 'warning',
                    message: '请先选择调拨仓库'
                })
                return
            }
            if (!this.addFormData.inventoryOutId) {
                this.$message({
                    type: 'warning',
                    message: '请先选择调出单位'
                })
                return
            }
            this.$store.commit('showAddGoods')
        }
    },
    created(){},
    mounted(){
        this.getWareHouseList()
        this.getPurchaseList()
    },
    activated() {
        this.$store.commit('hideChooseGoods')
        this.clearAll()
        // 初始化时间
        this.addFormData.inventoryAllocationTime = Date.parse(new Date())
        // 更新制单人
        const USER = sessionStorage.getItem('user')

        this.addFormData.creator = JSON.parse(USER).loginCode
        this.MathRand(6, 'DB')
    }
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
        padding-top: 10px;
    }
    .el-icon-more{
        cursor: pointer;
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
        background: #FFFFFF;
    }
    .goodInfoBox{
        width: 100%;
        margin-top: 20px;
    }
    .goodInfoBox .el-form-item{
        width: 400px;
    }
    .addRemark{
        cursor: pointer;
    }
</style>
