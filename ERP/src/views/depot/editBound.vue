<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF" v-if="inbound">入库单</span>
            <span style="color: #409EFF" v-if="outbound">出库单</span>
            <span> - 编辑</span>
        </div>
        <div class="model_content" >
            <div class="content" :style="{height: $store.state.home.modelContentHeight - 20 + 'px'}">
                <el-form class="myForm" :inline="true" :model="addFormData" :rules="rules" label-position="right" size="small" label-width="110px">
                    <div class="banner">
                        基本信息
                    </div>
                    <div class="baseInfoBox">
                        <el-form-item prop="storeType" label= "入库类型" v-if = "inbound">
                            <el-select v-model="addFormData.storeType" placeholder="请选择入库类型">
                                <el-option label="采购" value="1"></el-option>
                                <el-option label="销售退货" value="2"></el-option>
                                <el-option label="其他" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="deliverType" label= "出库类型" v-if = "outbound">
                            <el-select v-model="addFormData.deliverType" placeholder="请选择出库类型">
                                <el-option label="商城订单" value="0"></el-option>
                                <el-option label="线下订单" value="1"></el-option>
                                <el-option label="采购退货" value="2"></el-option>
                                <el-option label="批发" value="3"></el-option>
                                <el-option label="其他" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="storeHouseName" label="入库仓库" v-if = "inbound">
                            <el-select
                                v-model="addFormData.storeHouseName"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                :remote-method="remoteMethod"
                                :loading="loading">
                                <el-option
                                    v-for="item in houseId_option"
                                    :key="item.id"
                                    :label="item.warehouseName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="deliverHouseId" label="出库仓库" v-if = "outbound">
                            <el-select
                                v-model="addFormData.deliverHouseName"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                :remote-method="remoteMethod"
                                :loading="loading">
                                <el-option
                                    v-for="item in houseId_option"
                                    :key="item.id"
                                    :label="item.warehouseName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="buyerName" label="采购单位">
                            <el-select v-model="addFormData.buyerName" placeholder="请选择">
                                <el-option
                                    v-for="item in buyerId_option"
                                    :key="item.id"
                                    :label="item.buyerCompanyName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="purchaseOrderNo" label="关联采购单号">
                            <el-input v-model="addFormData.purchaseOrderNo" placeholder="请选择采购单号">
                            </el-input>
                            <span @click="chooseGoodEvent" class="el-icon-more" style="position: absolute; right: 5px;top: 9px;"></span>
                        </el-form-item>
                        <el-form-item prop="storeTime" label="入库时间" v-if="inbound">
                            <el-date-picker
                                v-model="addFormData.storeTime"
                                type="datetime"
                                placeholder="请选择入库时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item prop="deliverTime" label="出库时间" v-if="outbound">
                            <el-date-picker
                                v-model="addFormData.deliverTime"
                                type="datetime"
                                placeholder="请选择出库时间">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="banner">
                        商品信息
                    </div>
                    <div style="padding: 10px;">
                        <el-table
                            :data="addFormData.list"
                            show-summary
                            :span-method="arraySpanMethod"
                            border
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
                                prop="itemSku"
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
                                        >
                                        </el-autocomplete>

                                        <span @click="chooseGoodEvent" class="el-icon-more"></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
                                        <span v-text="scope.row.itemId"></span>
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
                                prop="productionDate"
                                label="生产日期">
                            </el-table-column>
                            <el-table-column
                                prop="currentStoreNumber"
                                label="入库数"
                                v-if="inbound">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.itemId === ''">
                                        <span></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
                                        <el-input @change.native="unitTatalEvent(scope)" @keyup.native="unitTatalEvent(scope)" v-model="scope.row.currentStoreNumber"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="deliverNumber"
                                label="出库数"
                                v-if="outbound">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.itemId === ''">
                                        <span></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
                                        <el-input @change.native="unitTatalEvent(scope)" @keyup.native="unitTatalEvent(scope)" v-model="scope.row.deliverNumber"></el-input>
                                    </div>
                                </template>
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
                    </div>
                    <div class="goodInfoBox">
                        <el-form-item prop="storeNo" label="入库单号" v-if="inbound">
                            <el-input v-model="addFormData.storeNo" placeholder="请输入入库单号" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item prop="storeNo" label="出库单号" v-if="outbound">
                            <el-input v-model="addFormData.deliverNo" placeholder="请输入出库单号" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item prop="operator" label="经办人">
                            <el-input v-model="addFormData.operator" placeholder="请输入经办人"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item prop="creator" label="制单人">
                            <el-input v-model="addFormData.creator" placeholder="请输入制单人" :disabled="true"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item class="marker" :style="{width: '700px'}" prop="deliverRemark" label="备注" v-if="outbound">
                            <el-input type="textarea" :style="{width: '530px'}" :rows="4" v-model="addFormData.deliverRemark" placeholder="请输入备注信息，最多不超过100字"></el-input>
                        </el-form-item>
                        <el-form-item class="marker" :style="{width: '700px'}" prop="storeRemark" label="备注" v-if="inbound">
                            <el-input type="textarea" :style="{width: '530px'}" :rows="4" v-model="addFormData.storeRemark" placeholder="请输入备注信息，最多不超过100字"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>
        <div class="model_footer">
            <el-button style="width: 90px" type="primary" size="small" @click="save">保存</el-button>
            <el-button style="width: 90px" size="small" v-RouterBack>取消</el-button>
        </div>
    </div>
</template>

<script>
import 'utils/allEnumeration'
import ME from 'utils/base'
import API from 'api/depot'
export default {
    data(){
        return {
            querySearchText: '',
            houseId_option: [],
            buyerId_option: [],
            loading: false,
            inbound: false,
            outbound: false,
            changeObj: {},
            goodsInfoData: [{
            }],
            addFormData: {
                storeType: '',
                storeTime: '',
                storeHouseId: '',
                storeHouseName: '',
                buyerId: '',
                buyerName: '',
                operator: '',
                creator: '',
                purchaseOrderNo: '',
                totalStoreNumber: 0,
                storeRemark: '',
                list: [],
                creatorId: ''
            },
            rules: {
                storeType: [
                    { required: true, message: '入库类型', trigger: 'blur' }
                ],
                storeHouseId: [
                    { required: true, message: '请选择入库仓库', trigger: 'blur' }
                ],
                buyerId: [
                    { required: true, message: '请选择采购单位', trigger: 'blur' }
                ],
                storeTime: [
                    { required: true, message: '请选择入库时间', trigger: 'blur' }
                ],
                creator: [
                    { required: true, message: '请输入制单人', trigger: 'blur' }
                ],
                deliverTime: [
                    { required: true, message: '请选择出库时间', trigger: 'blur' }
                ],
                storeNo: [
                    { required: true, message: '请输入入库单号', trigger: 'blur' }
                ]
            },
            postData: {}
        }
    },
    computed:{
    },
    methods:{
        goodTableAddEvent(){
            let itemobj = {
                oper: '',
                itemSku: '',
                itemId: '',
                itemSpec: '',
                barCode: '',
                goodName: '',
                itemExp: '',
                SKU: '',
                qualityDate: '',
                productData: '',
                currentStoreNumber: '',
                unit: '',
                unitPrice: '',
                unitTotal: ''
            }

            this.addFormData.list.push(itemobj)
        },
        goodTableReduceEvent(data){
            if (this.addFormData.list.length > 1){
                this.addFormData.list.splice(data.$index, 1)
            }
        },
        arraySpanMethod({row, column, rowIndex, columnIndex}) {

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
        // 获取采购列表
        getPurchaseList() {
            API.getPurchaseAll().then(res => {
                this.buyerId_option = res.data
                console.log(this.buyerId_option, "采购列表")
            })
        },
        // 入库仓库模糊搜索
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    API.getWarehouseListActive().then(res => {
                        this.houseId_option = res.data.filter(item => {
                            return item.warehouseName.toLowerCase().indexOf(query.toLowerCase()) > -1;
                        });
                        console.log(res, "请求来仓库")
                    })
                }, 200);
            } else {
                this.houseId_option = [];
            }
        },
        querySearchAsync(){

        },
        querySearchAsynSelect(){

        },
        unitTatalEvent(data){
            if (data.row.currentStoreNumber) {
                data.row.currentStoreNumber = data.row.currentStoreNumber.replace(/[^\d\.]/g, '')
            }
            if (data.row.deliverNumber) {
                data.row.deliverNumber = data.row.deliverNumber.replace(/[^\d\.]/g, '')
            }
            if (data.row.unitPrice == '' || data.row.currentStoreNumber == ''){
                data.row.unitTotal = ''
                return
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
                if (column.property == 'currentStoreNumber' || column.property == 'deliverNumber'){
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
        chooseGoodEvent(){
            this.$router.push({
                path: '/chooseGood'
            });
        },
        // 产生随机数并加到编码
        MathRand(data) {
            let sixNum = ''
            let myDate = new Date()
            let monthArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
            let day = myDate.getDate().toString() > 9 ? myDate.getDate() : '0' + myDate.getDate()

            for (let i = 0; i < data; i++) {
                sixNum += Math.floor(Math.random() * 10);
            }
            if (this.inbound) {
                this.addFormData.storeNo = 'IN' + '-' + myDate.getFullYear() + monthArr[myDate.getMonth()] + day + '-' + sixNum
            }
            if (this.outbound) {
                this.addFormData.deliverNo = 'OUT' + '-' + myDate.getFullYear() + monthArr[myDate.getMonth()] + day + '-' + sixNum
            }
        },
        // 保存结果
        save() {
            this.addFormData.creatorId = '12346'
            if (!isNaN(this.addFormData.storeHouseName)) {
                this.addFormData.storeHouseId = this.addFormData.storeHouseName
            }
            if (!isNaN(this.addFormData.deliverHouseName)) {
                this.addFormData.deliverHouseId = this.addFormData.deliverHouseName
            }
            if (!isNaN(this.addFormData.buyerName)) {
                this.addFormData.buyerId = this.addFormData.buyerName
            }
            // 通过仓库ID和采购单ID赋值给addFormData的name
            this.houseId_option.forEach(res => {
                if (res.id === this.addFormData.storeHouseId) {
                    this.addFormData.storeHouseName = res.warehouseName
                }
                if (res.id === this.addFormData.deliverHouseId) {
                    this.addFormData.deliverHouseName = res.warehouseName
                }
            })
            this.buyerId_option.forEach(res => {
                if (res.id === this.addFormData.buyerId) {
                    this.addFormData.buyerName = res.buyerCompanyName
                }
            })
            this.postData = ME.deepCopy(this.addFormData)
            console.log(JSON.stringify(this.postData), "添加数据")
            // 出入库操作
            if (this.inbound) {
                if (isNaN(this.postData.storeTime)) {
                    this.postData.storeTime = Date.parse(this.postData.storeTime) / 1000
                } else {
                    this.postData.storeTime = this.postData.storeTime / 1000
                }
                this.postData.totalStoreNumber = 0
                // 将表中商品信息添加到addFormData
                this.postData.list.forEach(res => {
                    this.postData.totalStoreNumber += parseInt(res.currentStoreNumber, 10)
                })
                // 数据判空
                for (let key in this.postData) {
                    if (!this.postData[key]) {
                        if (key == 'storeType') {
                            this.$message({
                                type: 'warning',
                                message: '请选择入库类型'
                            })
                            return
                        }
                        if (key == 'storeHouseId') {
                            this.$message({
                                type: 'warning',
                                message: '请选择入库仓库'
                            })
                            return
                        }
                        if (key == 'buyerId') {
                            this.$message({
                                type: 'warning',
                                message: '请选择采购单位'
                            })
                            return
                        }
                        if (key == 'storeTime') {
                            this.$message({
                                type: 'warning',
                                message: '请选择入库时间'
                            })
                            return
                        }
                        if (key == 'storeNo') {
                            this.$message({
                                type: 'warning',
                                message: '请选择入库单号'
                            })
                            return
                        }
                        if (key == 'creator') {
                            this.$message({
                                type: 'warning',
                                message: '请选择制单人'
                            })
                            return
                        }
                    }
                }
                if (!this.postData.list[0].itemId) {
                    this.$message({
                        type: 'warning',
                        message: '请选择商品'
                    })
                    return
                }
                // 调取新增入库单的接口
                API.addInboundOrder(this.postData).then(res => {
                    this.$message({
                        type:'success',
                        message:'入库单编辑成功'
                    })
                    this.$router.push({ name: "入库列表" })
                }).catch(error => {

                })
            } else if (this.outbound) {
                if (isNaN(this.postData.deliverTime)) {
                    this.postData.deliverTime = Date.parse(this.postData.deliverTime) / 1000
                } else {
                    this.postData.deliverTime = this.postData.deliverTime / 1000
                }
                this.postData.totalDeliverNumber = 0
                // 将表中商品信息添加到addFormData
                this.postData.list.forEach(res => {
                    this.postData.totalDeliverNumber += parseInt(res.deliverNumber, 10)
                })
                console.log(this.postData, '转化数据')
                // 数据判空
                for (let key in this.postData) {
                    if (!this.postData[key]) {
                        if (key == 'deliverType') {
                            this.$message({
                                type: 'warning',
                                message: '请选择出库类型'
                            })
                            return
                        }
                        if (key == 'deliverHouseId') {
                            this.$message({
                                type: 'warning',
                                message: '请选择出库仓库'
                            })
                            return
                        }
                        if (key == 'buyerId') {
                            this.$message({
                                type: 'warning',
                                message: '请选择采购单位'
                            })
                            return
                        }
                        if (key == 'deliverTime') {
                            this.$message({
                                type: 'warning',
                                message: '请选择出库时间'
                            })
                            return
                        }
                        if (key == 'deliverNo') {
                            this.$message({
                                type: 'warning',
                                message: '请选择出库单号'
                            })
                            return
                        }
                        if (key == 'creator') {
                            this.$message({
                                type: 'warning',
                                message: '请选择制单人'
                            })
                            return
                        }
                    }
                }
                if (!this.postData.list[0].itemId) {
                    this.$message({
                        type: 'warning',
                        message: '请选择商品'
                    })
                    return
                }
                // 调取新增出库单的接口
                API.addOutboundOrder(this.postData).then(res => {
                    this.$message({
                        type:'success',
                        message:'出库单编辑成功'
                    })
                    this.$router.push({ name: "出库列表" })
                }).catch(error => {

                })
            }
        },
        // 获取详情
        getboundDetail() {
            if (this.inbound) { // 入库单
                console.log("入库")
                API.getInboundDetail(this.$route.params.id).then(res => {
                    this.addFormData = ME.deepCopy(res.data)
                    // 数据转化
                    this.addFormData.storeTime = this.addFormData.storeTime * 1000
                    this.addFormData.storeType = this.$allEnumeration.storeType[this.addFormData.storeType]
                    this.MathRand(6)
                })

            } else if (this.outbound) { // 出库单
                console.log("出库")
                API.getOutboundDetail(this.$route.params.id).then(res => {
                    this.addFormData = ME.deepCopy(res.data)
                    this.addFormData.deliverTime = this.addFormData.deliverTime * 1000
                    this.addFormData.deliverType = this.$allEnumeration.deliverType[this.addFormData.deliverType]
                    this.MathRand(6)
                    console.log(this.addFormData, '数据')
                })
            }
        }
    },
    created(){},
    mounted(){
        // 获取采购单位列表
        this.getPurchaseList()
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
        console.log(this.inbound, this.outbound)
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
</style>
