<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">采购单位</span>
            <span> - 新增</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <div class="banner">
                    新建采购单位
                </div>
                <div class="form_wrap">
                    <el-form :inline="true" ref="addPurComForm" :rules="rules" :model="purchaseComFormData" label-position="right" size="small" label-width="120px">
                        <el-form-item prop="buyerCompanyNo" label="采购单位编码">
                            <el-input v-model="purchaseComFormData.buyerCompanyNo" placeholder="请输入采购单位编码"></el-input>
                        </el-form-item>
                        <el-form-item prop="buyerCompanyName" label="采购单位名称">
                            <el-input v-model="purchaseComFormData.buyerCompanyName" placeholder="请输入采购单位名称"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="法定代表人">
                            <el-input v-model="purchaseComFormData.legalRepresentative" placeholder="请输入法定代表人"></el-input>
                        </el-form-item>
                        <el-form-item label="注册资本">
                            <el-input v-model="purchaseComFormData.registeredCapital" placeholder="请输入注册资本"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item prop="foundingTime" label="成立时间">
                            <el-date-picker
                            v-model="purchaseComFormData.foundingTime"
                            value-format="timestamp"
                            type="date"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="电话">
                            <el-input v-model="purchaseComFormData.phone" placeholder="请输入电话"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="邮箱">
                            <el-input v-model="purchaseComFormData.mailBox" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="所在地区">
                            <area-cader ref="purchaseComArea" v-on:areaFromChild="areaCallBack"></area-cader>
                        </el-form-item>
                        <br>
                        <el-form-item label="详细地址">
                            <el-input :style="{width: '540px'}" v-model="purchaseComFormData.buyerCompanyAddress" placeholder="请输入详细地址"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="状态">
                            <el-switch :inactive-value="0" :active-value="1" v-model="purchaseComFormData.enableStatus"></el-switch>
                        </el-form-item>
                        <br>
                        <el-form-item label="备注">
                            <el-input :style="{width: '540px'}" :rows="4" type="textarea" v-model="purchaseComFormData.remark" placeholder="请输入备注"></el-input>
                        </el-form-item>
                    </el-form>
                </div>


            </div>
        </div>
        <div class="model_footer">
            <el-button type="primary" @click="addDataSaveEvent" size="small" style="width: 90px; margin-left: 25px;">保存</el-button>
            <el-button v-RouterBack size="small" style="width: 90px; margin-left: 25px;">取消</el-button>
        </div>
    </div>
</template>

<script>
import areaCader from 'components/areaCascader'
import api from 'api/purchase'
export default {
    components: {
        areaCader
    },
    data(){
        return {
            purchaseComFormData: {
                buyerCompanyNo: '',
                buyerCompanyName: '',
                legalRepresentative: '',
                registeredCapital: '',
                setTime: '',
                telphone: '',
                email: '',
                address: '',
                detailAddress: '',
                state: '',
                addrProvinceId: '',
                addrCityId: '',
                addrAreaId: '',
                foundingTime: '',
                maker: ''
            },
            rules: {
                buyerCompanyNo: [
                    { required: true, message: '请输入采购单位编码', trigger: 'blur' }
                ],
                buyerCompanyName: [
                    { required: true, message: '请输入采购单位名称', trigger: 'blur' }
                ],
                foundingTime: [
                    { required: true, message: '请选择成立时间', trigger: 'blur' }
                ]
            }
        }
    },
    computed:{},
    methods:{
        areaCallBack(data){
            this.purchaseComFormData.addrProvinceId = data[0]
            this.purchaseComFormData.addrCityId = data[1]
            this.purchaseComFormData.addrAreaId = data[2]
        },
        addDataSaveEvent(){
            this.$refs['addPurComForm'].validate((valid) => {
                if (valid) {
                    this.purchaseComFormData.foundingTime = Math.round(this.purchaseComFormData.foundingTime / 1000)
                    api.addPurchaseComItem(this.purchaseComFormData).then((response) => {
                        this.$message({
                            type: 'success',
                            duration: 1500,
                            showClose: true,
                            message: '新增成功'
                        });
                        this.$router.go(-1)
                    })
                }
            })
        },
        resetFormData(){
            for (var kk in this.purchaseComFormData) {
                this.purchaseComFormData[kk] = ""
            }
        }
    },
    created(){},
    activated(){
        this.resetFormData()
        this.purchaseComFormData.foundingTime = Date.parse(new Date())
        this.purchaseComFormData.buyerCompanyNo = this.myBase.MathRand2('BUY')
        this.$refs.purchaseComArea.modelValue = []
    },
    mounted(){}
}
</script>
<style scoped>
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
.form_wrap{
    padding-top: 30px;
}
.form_wrap .el-form-item__content input{
    width: 194px;
}
.form_wrap .el-date-editor{
    width: 200px;
}
</style>
