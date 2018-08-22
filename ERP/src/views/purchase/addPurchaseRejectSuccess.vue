<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">采购退货</span>
            <span> - 新增退货单</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <div class="content_top">
                    <div class="tab_title fontWe_600" style="border-bottom: 1px solid #E4E7ED;">
                        <span class="title_states">已完成</span>
                        <span style="margin-left: 30px" class="title_title">采购退货单号 : </span>
                        <span class="title_data">456655222222222222522</span>
                        <span class="title_title">关联采购单号 : </span>
                        <span class="title_data">852225555544454</span>
                    </div>
                    <div class="tab_title fontWe_600">
                        <span class="title_title">供应商 : </span>
                        <span class="title_data">杭州苏雅诗贸易有限公司</span>
                        <span class="title_title">采购单位 : </span>
                        <span class="title_data">妈妈去哪儿</span>
                        <span class="title_title">退货仓库 : </span>
                        <span class="title_data">默认仓库</span>
                        <span class="title_title">退货时间 : </span>
                        <span class="title_data">2018-05-18 16:34</span>
                    </div>
                </div>
                <div class="banner">
                    商品信息
                </div>
                <div class="table_wrap" :style="{height: $store.state.home.modelContentHeight - 145 + 'px'}">
                    <el-table
                        :data="goodsInfoData"
                        show-summary
                        border
                    style="width: 100%">
                        <el-table-column
                        label=" "
                        type="index"
                        width="50">
                        </el-table-column>
                        <el-table-column
                        prop="selfNum"
                        label="编号"
                        width="180">
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
                        </el-table-column>
                        <el-table-column
                        prop="unit"
                        label="单位">
                        </el-table-column>
                        <el-table-column
                        prop="unitPrice"
                        label="采购单价(元)">
                        </el-table-column>
                        <el-table-column
                        prop="unitTotal"
                        label="小计(元)">
                        </el-table-column>
                    </el-table>
                    <div class="table_bottom">
                        <div class="table_bottom_item">
                            <span class="table_bottom_title">备注 : </span>
                            <span></span>
                        </div>
                        <div class="table_bottom_item">
                            <span class="table_bottom_title">制单人 : </span>
                            <span>浩克</span>
                        </div>
                        <div class="table_bottom_item">
                            <span class="table_bottom_title">经办人 : </span>
                            <span>托尼</span>
                        </div>
                    </div>
                </div>

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
.content_top{
    padding: 0 10px;
}
.tab_title{
    height: 65px;
    line-height: 65px;
    padding-left: 20px;
    font-size: 15px;
}
.title_title{
    color: #929597;
}
.title_data{
    color: #5f6264;
    margin-right: 40px;
}
.title_states{
    color: #ec706b;
    font-size: 18px;
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
    overflow: auto;
}
.table_bottom{
    margin-top: 20px;
}
.table_bottom_item{
    height: 35px;
    line-height: 35px;
    font-weight: 600;
    color: #606365;
}
.table_bottom_title{
    display: inline-block;
    width: 70px;
    text-align: right;
}
</style>
