<template>
    <div class="wrap">
        <div class="title_wrap">
            <div class="title">
                待入库商品清单
            </div>
            <span @click="isWrapShowEvent" class="el_icon" :class="[isWrapShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></span>
        </div>
        <el-form v-show="isWrapShow" class="myForm" :inline="true" label-position="right" :rules="rules" :model="formData" size="small" label-width="90px">
            <div class="btn_wrap">
                <el-form-item label="入库仓库">
                    <el-select filterable  @change="storeSelectEvent" v-model="formData.purchaseHouseId" placeholder="请选择入库仓库">
                    <el-option v-for="item in repositorySelectData" :key="item.id" :label="item.warehouseName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="采购单位">
                    <el-select filterable  @change="purchaseComSelectEvent" v-model="formData.buyerId" placeholder="请选择采购单位">
                    <el-option v-for="item in buyerNameSelectData" :key="item.id" :label="item.buyerCompanyName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :style="{float: 'right'}">
                    <el-button v-perss="'新增入库单'" @click="rukuBtnEvent" :style="{width: '90px'}" type="primary">入库</el-button>
                </el-form-item>
            </div>
            <div class="banner">
                商品信息
            </div>
            <div class="table_wrap">
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
                    prop="itemSku"
                    label="编号"
                    width="180">
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
                    prop="purchasingNumber"
                    label="采购数">
                    </el-table-column>
                    <el-table-column
                    prop="storeNumber"
                    label="已入库数">
                    </el-table-column>
                    <el-table-column
                    prop="currentStoreNumber"
                    label="本次入库数">
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip class="item" effect="dark" :content="'不得大于' + (scope.row.purchasingNumber - scope.row.storeNumber)" placement="top">
                                    <el-input size="small" @change.native="unitTatalEvent(scope)" @keyup.native="unitTatalEvent(scope)" v-model="scope.row.currentStoreNumber"></el-input>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="itemQuantifierUnit"
                    label="单位">
                    </el-table-column>
                </el-table>
            </div>
            <div class="table_bottom_form">
                <el-form-item prop="orderTime" label="入库时间">
                    <el-date-picker
                    v-model="formData.orderTime"
                    format="yyyy-MM-dd"
                    value-format="timestamp"
                    type="date"
                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="storeNo" label="入库单号">
                    <el-input :disabled="true" v-model="formData.storeNo" placeholder="请输入入库单号"></el-input>
                </el-form-item><br>
                <el-form-item prop="operator" label="经办人">
                    <el-input v-model="formData.operator" placeholder="请输入经办人"></el-input>
                </el-form-item>
                <el-form-item prop="storeType" label="入库类型">
                    <el-select :disabled="true" v-model="formData.storeType" placeholder="请选择采购单位">
                    <el-option label="采购" value="1"></el-option>
                    <!-- <el-option label="销售退货" value="2"></el-option>
                    <el-option label="其他" value="3"></el-option> -->
                    </el-select>
                </el-form-item><br>
                <el-form-item prop="remark" label="备注">
                    <el-input :style="{width: '490px'}" type="textarea" v-model="formData.remark" placeholder="请输入备注"></el-input>
                </el-form-item>
            </div>
            <div class="table_bottom color_gray fontWe_500">
                <div style="margin-bottom: 30px; line-height: 30px">
                    <span class="title_title">采购单号 : </span>
                    <span class="title_data" v-text="formData.purchaseOrderNo"></span>
                    <span class="title_title">采购员 : </span>
                    <span class="title_data" v-text="formData.purchasingAgent"></span>
                    <span class="title_title">制单人 : </span>
                    <span class="title_data" v-text="formData.creator"></span><br>
                    <span class="title_title">采购备注 : </span>
                    <span v-text="formData.purchaseRemark"></span>
                    <!-- <span class="title_title">采购时间 : </span>
                    <span class="title_data">2018-05-18 16:34</span> -->
                </div>
            </div>

        </el-form>


        <el-dialog
            title="入库确认"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="30%"
            >

            <div style="line-height: 30px">
                <span class="title_title">入库仓库 : </span>
                <span v-text="formData.purchaseHouseName" class="title_data"></span><br>
                <span class="title_title">商品种类 : </span>
                <span v-text="goodsInfoData.length" class="title_data"></span><br>
                <span class="title_title">商品数量 : </span>
                <span v-text="totalStoreNumber"></span>
            </div>


            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addStoreList">确 定</el-button>
            </span>
       </el-dialog>


    </div>
</template>

<script>
import api from 'api/purchase'
import capi from 'api/common'
export default {
    props: [
        'fatherValue'
    ],
    data(){
        return {
            isWrapShow: true,
            dialogVisible: false,
            repositorySelectData: [],
            buyerNameSelectData: [],
            totalStoreNumber: 0,
            formData: {},
            goodsInfoData: [{
                oper: '',
                selfNum: '11111',
                barCode: '',
                goodName: '',
                SKU: '',
                qualityDate: '',
                productData: '',
                purchaseNum: '',
                inRepositoryNum: '',
                itemRepositoryNum: '',
                unit: ''
            }],
            rules: {
                buyerId: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ],
                storeHouseId: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ],
                storeType: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ],
                storeTime: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ],
                storeNo: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ],
                creator: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ]

            }
        }
    },
    computed:{},
    methods:{
        unitTatalEvent (data){
            data.row.currentStoreNumber = data.row.currentStoreNumber.replace(/[^\d\.]/g, '')
            var purchasingNumber = parseFloat(data.row.purchasingNumber)
            var storeNumber = parseFloat(data.row.storeNumber)
            var currentStoreNumber = parseFloat(data.row.currentStoreNumber)

            if (currentStoreNumber > (purchasingNumber - storeNumber)) {
                data.row.currentStoreNumber = purchasingNumber - storeNumber
            }

        },
        rukuBtnEvent(){
            this.dialogVisible = true
            this.totalStoreNumber = 0
            this.goodsInfoData.forEach((item, index) => {
                if (!item.currentStoreNumber) {
                    item.currentStoreNumber = 0
                }
                this.totalStoreNumber += parseFloat(item.currentStoreNumber)
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
        addStoreList(){

            var paramobj = {
                purchaseOrderId: this.$store.state.home.currentModelId,
                purchaseOrderNo: this.formData.purchaseOrderNo,
                buyerId: this.formData.buyerId,
                // buyerId: '1',
                buyerName: this.formData.buyerName,
                storeHouseId: this.formData.purchaseHouseId,
                storeHouseName: this.formData.purchaseHouseName,
                storeType: this.formData.storeType,
                storeTime: Math.round(this.formData.orderTime / 1000),
                storeNo: this.formData.storeNo,
                operator: this.formData.operator,
                creator: this.formData.creator,
                creatorId: this.formData.creatorId,

                totalStoreNumber: this.totalStoreNumber,
                storeRemark: this.formData.remark
            }

            //过滤数量为零的商品数据
            var resListArr = []

            this.goodsInfoData.forEach((item, index) => {
                if (item.currentStoreNumber != '0') {
                    resListArr.push(item)
                }
            })

            paramobj.list = resListArr

            api.addStoreList(paramobj).then((response) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '入库成功'
                });
                this.dialogVisible = false
                this.$router.go(-1)
            })
        },
        storeSelectEvent(val){
            this.repositorySelectData.forEach((item, index) => {
                if (item.id == val) {
                    this.formData.purchaseHouseName = item.warehouseName
                }
            })
        },
        purchaseComSelectEvent(val){
            this.buyerNameSelectData.forEach((item, index) => {
                if (item.id == val) {
                    this.formData.buyerName = item.buyerCompanyName
                }
            })
        },
        getUserInfo(){
            capi.getUserInfo().then((response) => {
                this.formData.creator = response.data.userName
                this.formData.creatorId = response.data.id
            })
        },
        isWrapShowEvent(){
            this.isWrapShow = !this.isWrapShow
        }
    },
    watch: {
        fatherValue(newvalue){
            this.formData = this.myBase.deepCopy(this.fatherValue)
            this.formData.orderTime *= 1000
            this.formData.storeType = '1'
            this.goodsInfoData = this.fatherValue.list
            this.formData.storeNo = this.myBase.MathRand('IN')

            this.getRepositorySelectData()
            this.getBuyerComSelectData()
            this.getUserInfo()
        }
    },
    created(){
        this.formData = this.myBase.deepCopy(this.fatherValue)
        this.formData.orderTime *= 1000
        this.formData.storeType = '1'
        this.goodsInfoData = this.fatherValue.list
        this.formData.storeNo = this.myBase.MathRand('IN')

        this.getRepositorySelectData()
        this.getBuyerComSelectData()
        this.getUserInfo()
    },
    mounted(){

    }
}
</script>
<style scoped>
    .wrap{
        border: 1px solid #E4E7ED;
    }
    .title{
        height: 32px;
        line-height: 32px;
        color: #ffffff;
        font-weight: 600;
        padding-left: 10px;
        width: 150px;
        background: #efa738;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
    }
    .title_wrap{
        height: 49px;
        border-bottom: 1px solid #E4E7ED;
        padding-top: 8px;
        position: relative;
    }
    .btn_wrap{
        height: 66px;
        padding: 10px;
    }
    .el_icon{
        display: inline-block;
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
    }
    .banner{
        height: 40px;
        background: #f5f5f5;
        line-height: 40px;
        color: #606266;
        font-weight: 600;
        padding-left: 10px;
    }
    .table_wrap{
        padding: 10px;
    }
    .table_bottom_form{
        padding: 10px;
    }
    .table_bottom{
        padding-left: 10px;
    }
    .title_data{
        margin-right: 30px;
    }
</style>
