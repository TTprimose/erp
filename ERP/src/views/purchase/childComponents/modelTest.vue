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



            </div>
        </div>
        <div class="model_footer">
            <el-button size="small" style="width: 90px; margin-left: 25px;">返 回</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    computed:{},
    methods:{


    },
    created(){},
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
</style>
