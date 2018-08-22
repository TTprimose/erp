<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">采购单</span>
            <span> - 导入采购单</span>
            <div>
                <el-button type="primary" size="small">下载模板</el-button>
            </div>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <step-bar :step-texts="testText" :step-nums="stepNums" :current-step="currentStep"></step-bar>

                <div class="import_wrap">
                    <el-upload
                        ref="upload"
                        :style="{width: '350px', display: 'inline-block'}"
                        action=""
                        :auto-upload="false">
                        <el-button style="width: 150px" slot="trigger" size="small">选取文件</el-button>

                        <el-button style="margin-left: 10px; width: 90px" size="small" type="primary">导入</el-button>
                    </el-upload>
                </div>
                <div class="info_wrap">
                    <i class="el-icon-warning"></i>
                    <span>商品小计和应付金额不需要填写,采购时间默认为导入时间</span>
                </div>
            </div>
        </div>
        <div class="model_footer">
            <el-button v-RouterBack size="small" style="width: 90px; margin-left: 25px;">返 回</el-button>
        </div>
    </div>
</template>

<script>
import stepBar from 'components/stepBar'
export default {
    components: {
        stepBar
    },
    data(){
        return {
            testText: ['1. 上传数据', '2. 完成'],
            stepNums: 2,
            currentStep: 1
        }
    },
    computed:{},
    methods:{


    },
    created(){},
    mounted(){

    }
}
</script>
<style scoped>
.model_content_inner{
    position: relative;
    padding: 10px;
}

.model_footer{
    text-align: left;
    padding-top: 10px;
}
.import_wrap{
    height: 370px;
    margin-top: 90px;
    border: 1px dashed #e4e8eb;
    text-align: center;
    padding-top: 150px
}
.el-icon-warning{
    color: #f7b65d;
}
.info_wrap{
    color: #b1b1b2;
    margin-top: 30px;
}
</style>
