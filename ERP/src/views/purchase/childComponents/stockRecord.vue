<template>
    <div class="wrap">
        <div class="title_wrap">
            <div class="title">
            入库记录
            </div>
            <span class="el_icon el-icon-arrow-down"></span>
        </div>
        <div class="btn_wrap">
            <div style="float: left">
                <span>入库时间 : </span>
                <span>{{formData.storeTime | time_m}}</span>
            </div>
            <div style="float: right">
                <!-- <el-button size="small" :style="{width: '90px'}">导出</el-button> -->
                <!-- <el-button size="small" :style="{width: '90px'}">打印</el-button> -->
                <el-button v-if="formData.enableStatus == 1" size="small" @click="invalidBtnEvent" :style="{width: '90px'}" type="primary">作废</el-button>
            </div>
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
                label="保质期">
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
                <span v-text="formData.storeNo" class="title_data"></span>
                <span class="title_title">入库仓库 : </span>
                <span v-text="formData.storeHouseName" class="title_data"></span>
                <span class="title_title">经办人 : </span>
                <span v-text="formData.operator" class="title_data"></span><br>
                <span class="title_title">入库备注 : </span>
                <span v-text="formData.storeRemark"></span>
                <!-- <span class="title_title">采购时间 : </span>
                <span class="title_data">2018-05-18 16:34</span> -->
            </div>
            <div style="margin-bottom: 30px; line-height: 30px">
                <span class="title_title">采购单号 : </span>
                <span v-text="formData.purchaseOrderNo" class="title_data"></span>
                <span class="title_title">采购员 : </span>
                <span v-text="baseInfoData.purchasingAgent" class="title_data"></span>
                <span class="title_title">制单人 : </span>
                <span v-text="baseInfoData.creator" class="title_data"></span><br>
                <span class="title_title">采购备注 : </span>
                <span v-text="baseInfoData.purchaseRemark"></span>
                <!-- <span class="title_title">采购时间 : </span>
                <span class="title_data">2018-05-18 16:34</span> -->
            </div>
        </div>
        <el-dialog
            title="作废记录"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            @close="dialogCancelEvent"
            width="30%"
            >
            <div>
                <el-input
                    type="textarea"
                    placeholder="请填写作废原因,最多200字"
                    :maxlength="200"
                    v-model="invalidRecord">
                </el-input>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogCancelEvent">取 消</el-button>
                <el-button size="small" type="primary" @click="invalidRecodeEvent">确 定</el-button>
            </span>
       </el-dialog>



    </div>
</template>

<script>
import api from 'api/purchase'
export default {
    props: [
        'fatherValue',
        'baseInfo'
    ],
    data(){
        return {
            dialogVisible: false,
            invalidRecord: '',
            formData: {},
            baseInfoData: {},
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
        invalidRecodeEvent(){
            var paramobj = {
                id: this.fatherValue.id,
                invalidReason: this.invalidRecord
            }

            api.invalidStoreRecode(paramobj).then((res) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '作废成功'
                })
                this.dialogVisible = false
            })
        },
        dialogCancelEvent(){
            this.invalidRecord = ""
            this.dialogVisible = false
        }
    },
    created(){
        this.formData = this.fatherValue
        this.goodsInfoData = this.fatherValue.list
        this.baseInfoData = this.baseInfo
    },
    mounted(){

    },
    watch: {
        fatherValue(newvalue){
            this.formData = newvalue
            this.goodsInfoData = newvalue.list
        },
        baseInfo(newvalue){
            this.baseInfoData = newvalue
        }
    }
}
</script>
<style scoped>
    .wrap{
        border: 1px solid #E4E7ED;
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
</style>
