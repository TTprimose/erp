<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">采购单</span>
            <span> - 编辑采购单</span>
        </div>
        <div class="content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <el-form class="myForm" :inline="true" :model="addFormData" :rules="rules" label-position="right" size="small" label-width="90px">
                <div class="banner">
                    基本信息
                </div>
                <div class="baseInfoBox">
                    <el-form-item prop="supplier" label="供应商">
                        <el-select v-model="addFormData.supplier" placeholder="请输入供应商">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="inRepository" label="入库仓库">
                        <el-select v-model="addFormData.inRepository" placeholder="请输入入库仓库">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="purchaseCompany" label="采购单位">
                        <el-select v-model="addFormData.purchaseCompany" placeholder="请输入采购单位">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
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
                        prop="selfNum"
                        label="编号"
                        width="180">
                        <template slot-scope="scope">
                            <div v-if="scope.row.selfNum === ''">
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
                            <div v-if="scope.row.selfNum !== ''">
                                <span v-text="scope.row.selfNum"></span>
                            </div>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="barCode"
                        label="条码">
                        </el-table-column>
                        <el-table-column
                        prop="goodName"
                        label="商品">
                        </el-table-column>
                        <el-table-column
                        prop="SKU"
                        label="规格-SKU">
                        </el-table-column>
                        <el-table-column
                        prop="qualityDate"
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
                        prop="purchaseNum"
                        label="采购数">
                            <template slot-scope="scope">
                                <div v-if="scope.row.selfNum === ''">
                                    <span></span>
                                </div>
                                <div v-if="scope.row.selfNum !== ''">
                                    <el-input @change.native="unitTatalEvent(scope)" @keyup.native="unitTatalEvent(scope)" v-model="scope.row.purchaseNum"></el-input>
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
                                <div v-if="scope.row.selfNum === ''">
                                    <span></span>
                                </div>
                                <div v-if="scope.row.selfNum !== ''">
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
                            <el-form-item prop="carriage" label="运费">
                                <el-input v-model="addFormData.carriage" placeholder="请输入运费"></el-input>
                            </el-form-item>
                            <el-form-item prop="extraCost" label="其他费用">
                                <el-input v-model="addFormData.extraCost" placeholder="请输入其他费用"></el-input>
                            </el-form-item>
                            <el-form-item prop="totalCost" label="应付金额">
                                <span style="color: #f56c6b" v-text="addFormData.totalCost"></span>
                            </el-form-item>
                        </div>
                    </div>
                </div>

                <div class="goodInfoBox" style="width: 650px">
                    <el-form-item prop="purchaseDate" label="采购时间">
                        <el-date-picker
                        v-model="addFormData.purchaseDate"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="purchaseList" label="采购单号">
                        <el-input v-model="addFormData.purchaseList" placeholder="请输入采购单号"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item prop="purchaseMan" label="采购员">
                        <el-input v-model="addFormData.purchaseMan" placeholder="请输入采购员"></el-input>
                    </el-form-item>
                    <el-form-item prop="makeListMan" label="制单人">
                        <el-input v-model="addFormData.makeListMan" placeholder="请输入制单人"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item class="marker" :style="{width: '100%'}" prop="maker" label="备注">
                        <el-input type="textarea" :rows="4" v-model="addFormData.maker" placeholder="请输入制单人"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="model_footer">
            <el-button style="width: 90px" type="primary" size="small">保存</el-button>
            <el-button @click="canselBtnEvent" style="width: 90px" size="small">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            querySearchText: '',
            goodsInfoData: [{
                oper: '',
                selfNum: '11111',
                barCode: '',
                goodName: '',
                SKU: '',
                qualityDate: '',
                productData: '',
                purchaseNum: '',
                unit: '',
                unitPrice: '',
                unitTotal: ''
            }],
            addFormData: {
                supplier: '',
                inRepository: '',
                purchaseCompany: '',
                purchaseDate: '',
                purchaseList: '',
                purchaseMan: '',
                makeListMan: '',
                maker: '',
                carriage: '0',
                extraCost: '0',
                totalCost: '00'
            },
            rules: {
                supplier: [
                    { required: true, message: '请选择供应商', trigger: 'blur' }
                ],
                inRepository: [
                    { required: true, message: '请选择入库仓库', trigger: 'blur' }
                ],
                purchaseCompany: [
                    { required: true, message: '请选择采购单位', trigger: 'blur' }
                ],
                purchaseDate: [
                    { required: true, message: '请选择采购时间', trigger: 'blur' }
                ],
                purchaseList: [
                    { required: true, message: '请输入采购单号', trigger: 'blur' }
                ],
                makeListMan: [
                    { required: true, message: '请输入制单人', trigger: 'blur' }
                ]
            }
        }
    },
    computed:{},
    methods:{
        goodTableAddEvent(){
            var itemobj = {
                oper: '',
                selfNum: '',
                barCode: '',
                goodName: '',
                SKU: '',
                qualityDate: '',
                productData: '',
                purchaseNum: '',
                unit: '',
                unitPrice: '',
                unitTotal: ''
            }

            this.goodsInfoData.push(itemobj)
        },
        goodTableReduceEvent(data){
            if (this.goodsInfoData.length > 1){
                this.goodsInfoData.splice(data.$index, 1)
            }
        },
        arraySpanMethod({row, column, rowIndex, columnIndex}) {
            if (columnIndex === 2) {
                if (row.selfNum == ""){
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

            data.row.unitTotal = (price * num).toFixed(2)
        },
        chooseGoodEvent(){
            this.$router.push({
                path: '/chooseGood'
            });
        }
    },
    created(){},
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
