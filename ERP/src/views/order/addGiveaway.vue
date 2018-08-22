<template>
    <div id="chooseGoodWrap">
         <div class="model_topcol">
            <span v-if="$route.params.type == 1" style="color: #409EFF">订单列表</span>
            <span v-if="$route.params.type == 2" style="color: #409EFF">合并订单</span>
            <span> - 添加赠品</span>
        </div>
        <div class="head color_gray">
            选择赠品
            <i v-RouterBack style="float: right; line-height: 60px" class="el-icon-close"></i>
        </div>
        <div class="banner">
            <el-form :inline="true" :model="tableParam" label-position="right" size="small" label-width="80px">
                <el-form-item label="商品分类">
                    <el-select @change="getTableData" v-model="tableParam.categoryId" placeholder="请选择商品分类">
                        <el-option v-for="item in goodsItemSelectData" :key="item.id" :label="item.categoryName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input
                        size="small"
                        placeholder="请输入商品名称/编号/条码"
                        clearable
                        @clear="searchInputClear"
                        @keyup.enter.native='getTableData'
                        prefix-icon="el-icon-search"
                        :style="{width: '378px'}"
                        v-model="tableParam.searchWord">
                    </el-input>
                    <el-button @click="getTableData" :style="{margin: '0 10px'}" type="primary" size="small">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content">
            <el-table
            ref="giveAwayTable"
            :height="$store.state.home.modelContentHeight - 138"
            @selection-change="tableChangeEvent"
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="good"
                    label="商品"
                    >
                    <template slot-scope="scope">
                        <img v-if="scope.row.itemImg" :src="scope.row.itemImg" style="float: left;width: 40px; height: 45px; margin-right: 10px">
                        <span v-text="scope.row.itemName"></span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="skuNameCommon"
                    label="规格-SKU">
                </el-table-column>
                <el-table-column
                    prop="inventory"
                    width="200"
                    label="商品库存">
                </el-table-column>
                <el-table-column
                    prop="quantity"
                    width="200"
                    label="数量">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="'不得大于' + scope.row.inventory" placement="top">
                            <el-input @change.native="mountFormat(scope)" @keyup.native="mountFormat(scope)" v-model="scope.row.quantity" size="small"></el-input>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    prop="unit"
                    label="单位">
                </el-table-column> -->
            </el-table>
        </div>
        <div class="model_footer">
            <el-button @click="sureBtnEvent" style="width: 90px" type="primary" size="small">确定</el-button>
            <el-button @click="cancelBtnEvent" style="width: 90px" size="small">取消</el-button>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="tableParam.pageNo"
                :page-sizes="[10, 30, 50, 100]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import oapi from 'api/order'
import api from 'api/purchase'
export default {
    data(){
        return {
            SKUSelectvalue: [],
            totalPage: 1,
            goodsItemSelectData: [],
            tableParam: {
                pageSize: 10,
                pageNo: 1,
                searchWord: ''
            },
            tableData: [],
            selectTableData: []
        }
    },
    computed:{},
    methods:{
        searchInputClear(){
            this.getTableData()
        },
        handleCurrentChange(val){
            this.tableParam.pageNo = val
            this.getTableData()
        },
        handleSizeChange(val){
            this.tableParam.pageSize = val
            this.getTableData()
        },
        mountFormat(data){
            data.row.quantity = data.row.quantity.replace(/\D/g, '')
            data.row.quantity = data.row.quantity.replace(/\b(0+)/gi, '')
            if (data.row.quantity == '') {
                data.row.quantity = '0'
                this.$refs.giveAwayTable.toggleRowSelection(data.row, false)
            } else {
                this.$refs.giveAwayTable.toggleRowSelection(data.row, true)
            }
            if (data.row.quantity >= data.row.inventory) {
                data.row.quantity = data.row.inventory
            }
        },
        getTableData(){
            return oapi.getGiveawayList(this.tableParam).then((response) => {
                this.totalPage = response.data.total
                this.tableData = response.data.mapList
                this.tableData.forEach((item, index) => {
                    this.$set(item, 'quantity', '')
                })
            })
        },
        getGoodsItemSelect(){
            var param = {
                pageNo: 1,
                pageSize: 1000
            }

            api.getGoodSItemSelectData(param).then((response) => {
                this.goodsItemSelectData = response.data
                this.goodsItemSelectData.unshift({
                    id: '',
                    categoryName: '全部'
                })
            })
        },
        tableChangeEvent(rowarr){
            this.selectTableData = rowarr
        },
        sureBtnEvent(){
            var countFlg = false

            if (this.selectTableData && this.selectTableData.length == 0) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '请选择商品'
                })
                return
            } else {
                for (var item of this.selectTableData){
                    if (item.quantity == '' || item.quantity == '0') {
                        countFlg = true
                        break
                    }
                }

                if (countFlg) {
                    this.$message({
                        type: 'warning',
                        duration: 1500,
                        showClose: true,
                        message: '请填写赠品数量！'
                    })
                    return
                }
            }

            var paramobj = {
                secondaryOrderNo: this.$store.state.home.currentModelId,
                itemList: JSON.stringify(this.selectTableData)
            }

            oapi.addGiveaway(paramobj).then((response) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '新增赠品成功！'
                })
                this.$router.go(-1)
            })

        },
        cancelBtnEvent(){
            this.$router.go(-1)
        }
    },
    activated(){
        this.getTableData()
        this.getGoodsItemSelect()
    },
    created(){},
    mounted(){}
}
</script>
<style scoped>
.head{
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    padding: 0 20px;
}
.banner{
    height: 56px;
    background: #f5f5f5;
    padding-top: 11px;
}
.model_footer{
    text-align: left;
    padding-top: 11px;
    padding-left: 20px;
}
.content{
    padding: 10px;
}
.el-table{
    border: 1px solid #E4E7ED;
}
.el-pagination{
    float: right;
    padding-top: 0;
}
</style>
