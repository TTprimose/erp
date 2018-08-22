<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">调拨单</span>
            <span> - 新增调拨单</span>
        </div>
        <div class="model_content" >
            <div class="content" :style="{height: $store.state.home.modelContentHeight - 20 + 'px'}">
                <el-form class="myForm" :inline="true" :model="addFormData" :rules="rules" label-position="right" size="small" label-width="110px">
                    <div class="banner">
                        基本信息
                    </div>
                    <div class="baseInfoBox">
                        <el-form-item prop="warehouseName" label="调拨仓库">
                            <el-select
                                v-model="addFormData.warehouseName"
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
                        <el-form-item prop="inventoryOutName" label="调出单位">
                            <el-select v-model="addFormData.inventoryOutName" placeholder="请选择">
                                <el-option
                                    v-for="item in buyerId_option"
                                    :key="item.id"
                                    :label="item.buyerCompanyName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="inventoryInName" label="调入单位">
                            <el-select v-model="addFormData.inventoryInName" placeholder="请选择">
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
                            :data="addFormData.list"
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
                                            :disabled="true"
                                        >
                                        </el-autocomplete>

                                        <span @click="chooseGoodEvent" class="el-icon-more"></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
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
                                label="保质期">
                            </el-table-column>
                            <el-table-column
                                prop="productionDate"
                                label="生产日期">
                            </el-table-column>
                            <el-table-column
                                prop="inventoryNumber"
                                label="调拨数">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.itemId === ''">
                                        <span></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
                                        <el-input @change.native="unitTatalEvent(scope)" @keyup.native="unitTatalEvent(scope)" v-model="scope.row.inventoryNumber"></el-input>
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
                    { required: true, message: '请选择入库仓库', trigger: 'blur' }
                ],
                inventoryInId: [
                    { required: true, message: '请选择调入单位', trigger: 'blur' }
                ],
                inventoryOutId: [
                    { required: true, message: '请选择调出单位', trigger: 'blur' }
                ],
                inventoryAllocationNo: [
                    { required: true, message: '请输入调拨单号', trigger: 'blur' }
                ],
                inventoryAllocationTime: [
                    {required: true, message: '请输入调拨时间', trigger: 'blur'}
                ],
                creator: [
                    { required: true, message: '请输入制单人', trigger: 'blur' }
                ]
            },
            loading: true
        }
    },
    computed:{},
    methods:{
        goodTableAddEvent(){
            var itemobj = {
                oper: '',
                itemSku: '',
                itemId: '',
                itemSpec: '',
                remark: '',
                inventoryNumber: ''
            }

            this.addFormData.list.push(itemobj)
        },
        goodTableReduceEvent(data){
            if (this.addFormData.list.length > 1){
                this.addFormData.list.splice(data.$index, 1)
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
                if (column.property == 'inventoryNumber'){
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
                            return item.warehouseName.toLowerCase().indexOf(query.toLowerCase()) > -1;
                        });
                        console.log(res, "请求来仓库")
                    })
                }, 200);
            } else {
                this.houseId_option = [];
            }
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
            this.addFormData.totalInventoryNumber = 0
            // 将表中商品信息添加到addFormData
            this.addFormData.list.forEach(res => {
                this.addFormData.totalInventoryNumber += parseInt(res.inventoryNumber, 10)
            })
            this.addFormData.creatorId = '12346'
            if (!isNaN(this.addFormData.warehouseName)) {
                this.addFormData.warehouseId = this.addFormData.warehouseName
            }
            if (!isNaN(this.addFormData.inventoryOutName)) {
                this.addFormData.inventoryOutId = this.addFormData.inventoryOutName
            }
            if (!isNaN(this.addFormData.inventoryInName)) {
                this.addFormData.inventoryInId = this.addFormData.inventoryInName
            }

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
            // 数据判空
            for (let key in this.postData) {
                if (!this.postData[key]) {
                    if (key == 'warehouseId') {
                        this.$message({
                            type: 'warning',
                            message: '请选择调拨仓库'
                        })
                        return
                    }
                    if (key == 'inventoryOutId') {
                        this.$message({
                            type: 'warning',
                            message: '请选择调出单位'
                        })
                        return
                    }
                    if (key == 'inventoryInId') {
                        this.$message({
                            type: 'warning',
                            message: '请选择调入单位'
                        })
                        return
                    }
                    if (key == 'inventoryAllocationTime') {
                        this.$message({
                            type: 'warning',
                            message: '请选择调拨时间'
                        })
                        return
                    }
                    if (key == 'list') {
                        this.$message({
                            type: 'warning',
                            message: '请选择商品'
                        })
                        return
                    }
                }
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
            this.$router.push({
                path: '/chooseGood'
            });
        },
        // 获取调拨单详情
        getTableData() {
            let id = this.$route.params.id

            API.getAllotDetail(id).then(res => {
                this.addFormData = ME.deepCopy(res.data)
                // 数据转化
                this.addFormData.inventoryAllocationTime = this.addFormData.inventoryAllocationTime * 1000

                console.log(this.addFormData, "测试数据")
            })
        }
    },
    created(){},
    mounted(){

        this.getPurchaseList()
    },
    activated() {
        this.getTableData()
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
</style>
