<template>
    <div class="wrap">
        <div class="check_wrap fontwe_500">
            <el-checkbox :style="{color: '#f37069'}" v-model="totalChecked">作废原因</el-checkbox>
            <span v-text="invalidRecord.invalidReason" class="color_gray">商品入库时,核对错误,并未实际入库</span>
        </div>
        <div class="content_wrap">
            <div class="content">
                <div class="title_wrap">
                    <div class="title">
                    作废记录
                    </div>
                    <span @click="isWrapShowEvent" class="el_icon el-icon-arrow-down"></span>

                </div>
                <div v-show="isWrapShow">
                    <div class="btn_wrap">
                        <div class="tab_title fontWe_600">
                            <span class="title_title">作废时间 : </span>
                            <span class="title_data">{{invalidRecord.invalidTime | time_m}}</span>
                            <!-- <span class="title_title">采购单号 : </span>
                            <span v-text="invalidRecord.purchaseOrderNo" class="title_data"></span> -->
                            <!-- <span class="title_title">供应商 : </span>
                            <span v-text="invalidRecord.buyerName" class="title_data"></span> -->
                            <span class="title_title">采购单位 : </span>
                            <span v-text="invalidRecord.buyerName" class="title_data"></span>
                            <!-- <span class="title_title">入库仓库 : </span>
                            <span v-text="invalidRecord.storeHouseName" class="title_data"></span> -->
                            <!-- <span class="title_title">采购时间 : </span>
                            <span class="title_data">2018-05-18 16:34</span> -->
                        </div>
                    </div>
                    <div class="banner">
                        商品信息
                    </div>
                    <div class="table_wrap">
                        <el-table
                            :data="invalidRecord.list"
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
                            prop="inventoryNumber"
                            label="已入库数">
                            </el-table-column>
                            <el-table-column
                            prop="currentStoreNumber"
                            label="本次入库数">
                            </el-table-column>
                            <el-table-column
                            prop="itemQuantifierUnit"
                            label="单位">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="table_bottom color_gray fontWe_500">
                        <div style="margin-bottom: 30px; line-height: 30px">
                            <span class="title_title">入库单号 : </span>
                            <span v-text="invalidRecord.storeNo" class="title_data"></span>
                            <span class="title_title">入库仓库 : </span>
                            <span v-text="invalidRecord.storeHouseName" class="title_data"></span>
                            <span class="title_title">经办人 : </span>
                            <span v-text="invalidRecord.operator" class="title_data"></span><br>
                            <span class="title_title">入库备注 : </span>
                            <span v-text="invalidRecord.storeRemark"></span>
                            <!-- <span class="title_title">采购时间 : </span>
                            <span class="title_data">2018-05-18 16:34</span> -->
                        </div>
                        <div style="margin-bottom: 30px; line-height: 30px">
                            <span class="title_title">采购单号 : </span>
                            <span v-text="invalidRecord.purchaseOrderNo" class="title_data"></span>
                            <span class="title_title">采购员 : </span>
                            <span v-text="invalidRecord.operator" class="title_data"></span>
                            <span class="title_title">制单人 : </span>
                            <span v-text="invalidRecord.creator" class="title_data"></span><br>
                            <span class="title_title">采购备注 : </span>
                            <span v-text="invalidRecord.creator"></span>
                            <!-- <span class="title_title">采购时间 : </span>
                            <span class="title_data">2018-05-18 16:34</span> -->
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
export default {
    props: ['fatherValue'],
    data(){
        return {
            dialogVisible: false,
            invalidRecord: {},
            totalChecked: "",
            isWrapShow: true,
            formData: {
                inrepository: '',
                purchaseCom: '',
                inRepositoryDate: '',
                repositoryNo: '8558558',
                makerMan: 'wwb',
                repositoryType: '',
                marker: ''

            },
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
            }]
        }
    },
    computed:{},
    methods:{
        unitTatalEvent (data){
            data.row.itemRepositoryNum = data.row.itemRepositoryNum.replace(/[^\d\.]/g, '')
        },
        invalidBtnEvent(){
            this.dialogVisible = true
        },
        dialogSureEvent(){
            this.$router.push({
                path: '/invalidRecord'
            })
            this.dialogVisible = false
        },
        isWrapShowEvent(){
            this.isWrapShow = !this.isWrapShow
        }
    },
    created(){
        this.invalidRecord = this.fatherValue
    },
    watch: {
        fatherValue(newvalue){
            this.invalidRecord = newvalue
        }
    },
    mounted(){

    }
}
</script>
<style scoped>
    .wrap{
        margin-top: 10px;
    }
    .title{
        height: 32px;
        line-height: 32px;
        color: #ffffff;
        font-weight: 600;
        padding-left: 10px;
        width: 100px;
        background: #909498;
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
    .check_wrap{
        background: #fff2ef;
        height: 64px;
        line-height: 64px;
        padding-left: 17px;
    }
    .check_wrap span{
        display: inline-block;
        margin-left: 40px;
    }
    .content_wrap{
       padding: 10px;
    }
    .content{
        border: 1px solid #E4E7ED;
    }
    .tab_title{
        font-size: 15px;
    }
    .title_title{
        color: #929597;
    }
    .title_data{
        color: #5f6264;
        margin-right: 40px;
    }
</style>
