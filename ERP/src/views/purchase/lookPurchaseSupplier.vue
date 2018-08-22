<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">供应商</span>
            <span> - 详情</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner form_wrap">
                <el-form id="supplier_form" :inline="true" :disabled="true" ref="lookSupplierForm" :model="formData" label-position="right" size="small" label-width="120px">
                    <div class="banner">
                        供应商信息
                    </div>
                    <div style="margin-top: 20px">
                        <el-form-item prop="sellerCompanyNo" label="供应商编号">
                            <el-input style="width: 194px" v-model="formData.sellerCompanyNo" placeholder="请输入供应商编号"></el-input>
                        </el-form-item>
                        <el-form-item prop="sellerCompanyName" label="公司名称">
                            <el-input style="width: 194px" v-model="formData.sellerCompanyName" placeholder="请输入公司名称"></el-input>
                        </el-form-item>

                    </div>
                    <div>
                        <el-form-item prop="provinceId" label="区域">
                            <area-cader :fatherValue="fatherValue" v-on:areaFromChild="areaCallBack"></area-cader>
                        </el-form-item>
                        <el-form-item label="详细地址">
                            <el-input style="width: 194px" v-model="formData.sellerCompanyAddress" placeholder="请输入详细地址"></el-input>
                        </el-form-item>
                    </div>
                    <div class="banner">
                        个人信息
                    </div>
                    <div style="margin-top: 20px">
                        <el-form-item prop="contactPerson" label="联系人">
                            <el-input style="width: 194px" v-model="formData.contactPerson" placeholder="请输入联系人"></el-input>
                        </el-form-item>
                        <el-form-item prop="phone" label="联系方式">
                            <el-input style="width: 194px" v-model="formData.phone" placeholder="请输入联系方式"></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="身份证">
                            <div style="display: inline-block">
                                <el-upload
                                :action="uploadURL"
                                :data="sendData"
                                list-type="picture-card"
                                :show-file-list="false"
                                >
                                <img style="width: 80px; height: 80px;" v-if="imageUrl1" :src="imageUrl1" class="avatar">
                                <i v-if="!imageUrl1" class="el-icon-plus"></i>
                                </el-upload>
                                <span class="card_tip">经营者身份证<br>正面照</span>
                            </div>
                            <div style="display: inline-block; margin-left: 30px;">
                                <el-upload
                                :action="uploadURL"
                                :data="sendData"
                                list-type="picture-card"
                                :show-file-list="false"
                                >
                                <img style="width: 80px; height: 80px;" v-if="imageUrl2" :src="imageUrl2" class="avatar">
                                <i v-if="!imageUrl2" class="el-icon-plus"></i>
                                </el-upload>
                                <span class="card_tip">经营者身份证<br>反面照</span>
                            </div>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="经营许可类证书">
                            <span slot="label">
                                经营许可<br>类证书
                            </span>
                            <div style="display: inline-block">
                                <el-upload
                                :action="uploadURL"
                                :data="sendData"
                                list-type="picture-card"
                                :show-file-list="false"
                                >
                                <img style="width: 80px; height: 80px;" v-if="imageUrl3" :src="imageUrl3" class="avatar">
                                <i v-if="!imageUrl3" class="el-icon-plus"></i>
                                </el-upload>
                                <span class="card_tip">经营者身份证<br>正面照</span>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="banner">
                        银行信息
                    </div>
                    <div style="margin-top: 20px">
                        <el-form-item label="开户名称">
                            <el-input style="width: 194px" v-model="formData.accountName" placeholder="请输入开户名称"></el-input>
                        </el-form-item>
                        <el-form-item label="开户银行">
                            <el-input style="width: 194px" v-model="formData.bankName" placeholder="请输入开户银行"></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="银行账户">
                            <el-input style="width: 194px" v-model="formData.accountNumber" placeholder="请输入银行账户"></el-input>
                        </el-form-item>
                    </div>
                    <div class="banner">
                        其他信息
                    </div>
                    <div style="margin-top: 20px">
                        <el-form-item label="备注">
                            <el-input type="textarea" :rows="4" style="width: 524px" v-model="formData.remark" placeholder="请输入备注"></el-input>
                        </el-form-item>
                    </div>

                </el-form>



            </div>
        </div>
        <div class="model_footer">
            <el-button v-RouterBack size="small" style="width: 90px; margin-left: 25px;">返回</el-button>
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
            uploadURL: process.env.API_ROOT + '/f/upload',
            sendData: {
                file: "",
                uploadType: 'erp'
            },
            imageUrl3: '',
            imageUrl2: '',
            imageUrl1: '',
            formData: {
                sellerCompanyName: '',
                sellerCompanyNo: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                sellerCompanyAddress: '',
                contactPerson: '',
                phone: '',
                faceIdcard: '',
                frontIdcard: '',
                imgLicense: '',
                accountName: '',
                bankName: '',
                accountNumber: '',
                remark: ''

            },
            fatherValue: ['10000', '10000', '100000'],
            dialogImageUrl: '',
            dialogVisible: false
        }
    },
    computed:{},
    methods:{
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        areaCallBack(){

        },
        getFormData(){
            var id = this.$store.state.home.currentModelId

            api.getItemSupplierData(id).then((response) => {
                this.formData = response.data
                this.imageUrl1 = response.data.faceIdcard
                this.imageUrl2 = response.data.frontIdcard
                this.imageUrl3 = response.data.imgLicense

                this.fatherValue = []
                this.fatherValue.push(this.formData.provinceId)
                this.fatherValue.push(this.formData.cityId)
                this.fatherValue.push(this.formData.areaId)

            })

        }


    },
    activated(){
        this.getFormData()
    },
    created(){

    },
    mounted(){}
}
</script>
<style scoped>
.model_content_inner{
    position: relative;
    overflow: auto;
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
.card_tip{
    display: inline-block;
    text-align: center;
    width: 88px;
}
</style>
