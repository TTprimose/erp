<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">盘点单</span>
            <span v-if="currentStep == 1"> - 上传导入文件</span>
            <span v-if="currentStep == 2"> - 导入完成</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <step-bar :step-texts="testText" :step-nums="stepNums" :current-step="currentStep"></step-bar>
                <div v-if="currentStep == 1" class="firstStep mt40">
                    <div class="import_wrap">
                    <p class="import_title">1.选择盘点仓库</p>
                    <div class="greyBg">
                        <el-select
                            v-model="houseId"
                            filterable
                            placeholder="请选择仓库">
                            <el-option
                                v-for="item in houseId_option"
                                :key="item.id"
                                :label="item.warehouseName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <el-button plain style="margin-left: 10px" icon="el-icon-download" @click="exportInventory">下载商品库存数据</el-button>
                    </div>
                </div>
                    <div class="import_wrap" v-perss="'盘点导入'">
                        <p class="import_title">2.添加盘点数据</p>
                        <div class="greyBg">
                            <el-upload
                                ref="upload"
                                :style="{width: '450px', display: 'inline-block'}"
                                :action.sync= upLoadUrl
                                :before-upload="beforeUpload"
                                :on-success="handleAvatarSuccess"
                                :auto-upload="false">
                                <el-input style="width: 280px" slot="trigger" placeholder="添加盘点数据" readonly="true"><i style="margin-top: 13px" slot="prefix" class="fa fa-paperclip fa-lg"></i></el-input>
                                <el-button slot="trigger" style="margin-left: 10px; width: 90px" type="primary">导入</el-button>
                            </el-upload>
                        </div>
                    </div>
                </div>
                <div v-if="currentStep == 2" class="secondStep mt40">
                    <div class="textCenter">
                        <h1 :class="status" v-text="receiveData.content"></h1>
                        <p style="font-size: 18px">共{{receiveData.totalNumber}}条数据，成功导入{{receiveData.successNumber}}条，导入失败{{receiveData.failNumber}}条。</p>
                        <div class="mt40">
                            <h2>导入失败的原因可能有</h2>
                            <p>1、系统中没有指定商品存在</p>
                            <p>2、盘点数量不能为空</p>
                            <p>3、商品编码、商品名称、商品规格完全相同的多条商品</p>
                            <el-button v-perss="'盘点异常数据导出'" plain icon="el-icon-download" style="padding: 8px 15px" @click="downLoadData">下载商品库存数据</el-button>
                            <p class="grey">按上述要求检查修改后，重新上传</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="model_footer" v-if="currentStep == 1">
            <el-button style="width: 90px" type="primary" size="small" @click="nextStep">下一步</el-button>
        </div>
        <div class="model_footer" v-if="currentStep == 2">
            <el-button style="width: 90px" type="primary" size="small" @click="goBack">重新上传</el-button>
        </div>
    </div>
</template>

<script>
import stepBar from 'components/stepBar'
import 'utils/allEnumeration'
// import ME from 'utils/base'
import API from 'api/depot'
export default {
    components: {
        stepBar
    },
    data(){
        return {
            testText: ['1. 上传导入文件', '2.导入完成'],
            stepNums: 2,
            currentStep: 1,
            houseId: null,
            houseId_option: '',
            loading: true,
            status: 'fail',
            receiveData: {
                content: '',
                failNumber: 0,
                successNumber: 0,
                totalNumber: 0,
                id: 0
            },
            reExportId: null,
            upLoadUrlCopy: process.env.API_ROOT + `/storage/stockCount/import/`,
            upLoadUrl: process.env.API_ROOT + `/storage/stockCount/import/`
        }
    },
    watch: {
        houseId() {
            if (!this.houseId == false) {
                this.upLoadUrl = this.upLoadUrlCopy + this.houseId
                console.log(this.upLoadUrl)
            }
        }
    },
    methods: {
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
        // 仓库列表获取
        getWareHouseList() {
            API.getWarehouseListActive().then(res => {
                this.houseId_option = res.data
            })
        },
        goBack() {
            this.$router.push({name: '库存盘点'})
            this.currentStep = 1
            this.houseId = null
        },
        nextStep() {

            if (!this.houseId) {
                this.$message({
                    type:'warning',
                    message:'请选择盘点仓库'
                })
                return
            }
            this.currentStep = 2
            this.$refs.upload.submit();
        },
        beforeUpload() {
            if (!this.houseId) {
                this.$message({
                    type:'warning',
                    message:'请选择盘点仓库'
                })
                return
            }
        },
        handleAvatarSuccess(data, data1) {
            if (data.result == 1) {
                this.reExportId = data.data.id
                this.receiveData = data.data
            }
            if (this.receiveData.content == '导入成功') {
                this.status = 'success'
            } else {
                this.status = 'fail'
            }
            console.log(data, data1, "返回的数据")
        },
        // 盘点异常数据导出
        downLoadData() {
            if (this.reExportId == 0) {
                this.$message({
                    type:'warning',
                    message:'暂无可导出数据'
                })
                return
            }
            window.open(process.env.API_ROOT + `/storage/stockCount/reExport/${this.reExportId}`)
        },
        // 下载商品库存
        exportInventory() {
            if (!this.houseId) {
                this.$message({
                    type:'warning',
                    message:'请选择盘点仓库'
                })
                return
            }
            window.open(process.env.API_ROOT + `storage/stockCount/export/${this.houseId}`)
        }
    },
    activated() {
        this.currentStep = 1
    },
    mounted() {
        this.getWareHouseList()
    }
}
</script>

<style scoped>
    .model_content_inner{
        position: relative;
        padding: 10px;
    }
    .model_footer{
        line-height: 50px;
        text-align: left;
        padding-left: 40px;
    }
    .mt40{
        margin-top: 40px;
    }
    .import_wrap{
        padding-top: 25px;
    }
    .import_wrap .import_title {
        font-size: 14px;
        line-height: 25px;
    }
    .import_wrap .greyBg{
        padding: 30px 0 30px 20px;
        background: #f8f8f8;
    }
    .textCenter{
        text-align: center;
        margin-top: 140px;
    }
    .textCenter h1{
        color: #606266;
        font-size: 40px;
    }
    .textCenter h1.success{
        color: #f66c6b;
    }
    .textCenter h2{
        color: #606266;
        font-weight: bold;
        font-size: 18px;
    }
    .textCenter p{
        font-size: 14px;
        color: #606266;
    }
    .textCenter p.grey{
        color: #999;
        font-size: 14px;
        line-height: 40px;
    }
</style>
