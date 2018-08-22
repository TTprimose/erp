<template>
    <div id="chooseGoodWrap">
         <div class="model_topcol">
            <span style="color: #409EFF">采购单</span>
            <span> - 新增采购单</span>
        </div>
        <div class="head color_gray">
            选择商品
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
            ref="purchaseChooseGoodsTable"
            :height="$store.state.home.modelContentHeight - 138"
            @select="tableItemSelectEvent"
            @selection-change="tableChangeEvent"
            :row-key="getRowKeys"
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    type="selection"
                    :reserve-selection="true"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="good"
                    label="商品"
                    width="280">
                    <template slot-scope="scope">
                        <img v-if="scope.row.mainImg" :src="scope.row.mainImg" style="float: left;width: 40px; height: 45px; margin-right: 10px">
                        <span v-text="scope.row.title"></span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="itemCode"
                    label="编号"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="barCode"
                    label="条码">
                </el-table-column>
                <el-table-column
                    prop="size_sku"
                    label="规格-SKU">
                    <template slot-scope="scope">
                        <el-popover
                        placement="bottom"
                        width="240"
                        @show="elPopoerShowEvent"
                        popper-class="goods_popover"
                        trigger="click"
                        >
                        <el-select
                            v-model="scope.row.SKUSelectvalue"
                            @change="skuSelectChange(scope.row, scope.$index)"
                            multiple
                            size="small"
                            collapse-tags
                            placeholder="请选择规格">
                            <el-option
                            v-for="item in scope.row.SKUSelectData"
                            :key="item.id"
                            :label="item.skuPropertyNames"
                            :value="item.id">
                            </el-option>
                        </el-select>
                        <span @click="getPopoverData(scope.row, scope.$index)" slot="reference" class="color_blue myCur">选择规格</span>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="expirationDateName"
                    label="保质期">
                </el-table-column>
                <!-- <el-table-column
                    prop="mount"
                    width="90"
                    label="数量">
                    <template slot-scope="scope">
                        <el-input @change.native="mountFormat(scope)" @keyup.native="mountFormat(scope)" v-model="scope.row.mount" size="small"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
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
import api from 'api/purchase'
export default {
    data(){
        return {
            SKUSelectvalue: [],
            totalPage: 1,
            goodsItemSelectData: [],
            goodsInfoData: [{
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
            }],
            SKUSelectData: [],
            tableParam: {
                pageSize: 10,
                pageNo: 1,
                searchWord: '',
                mainImg: '',
                title: '',
                itemCode: '',
                categoryId: '',
                brandName: '',
                barCode: ''
            },
            tableData: [],
            selectTableData: []
        }
    },
    computed:{},
    methods:{
        getRowKeys(row){
            return row.id
        },
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
            data.row.mount = data.row.mount.replace(/[^\d\.]/g, '')

            if (data.row.mount == "" || data.row.mount == '0') {
                this.$refs.purchaseChooseGoodsTable.toggleRowSelection(data.row, false)
            } else {
                this.$refs.purchaseChooseGoodsTable.toggleRowSelection(data.row, true)
            }
        },
        getTableData(){
            return api.getChooseGoodsList(this.tableParam).then((response) => {
                this.totalPage = response.data.total
                this.tableData = response.data.list
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
        skuSelectChange(data, index){
            let arr = []

            if (data.SKUSelectvalue.length == 0) {
                this.$refs.purchaseChooseGoodsTable.toggleRowSelection(data, false)
            } else {
                this.$refs.purchaseChooseGoodsTable.toggleRowSelection(data, true)
            }

            data.SKUSelectData.forEach((res) => {
                data.SKUSelectvalue.forEach((item) => {
                    if (res.id == item) {
                        arr.push({
                            id: item,
                            skuPropertyNames: res.skuPropertyNames
                        })
                    }
                })
            })
            data.skuGroups = arr

        },
        elPopoerShowEvent(){
            this.SKUSelectvalue = []
        },
        getPopoverData(data, index){
            var param = {
                itemId: data.id,
                skuProperties: ''
            }

            if (!this.tableData[index].SKUSelectData) {
                api.getSKUData(param).then((response) => {
                    this.$set(this.tableData[index], 'SKUSelectData', response.data.list)
                    if (!this.tableData[index].SKUSelectvalue) {
                        this.$set(this.tableData[index], 'SKUSelectvalue', [])
                    }
                })
            }
        },
        tableChangeEvent(rowarr){

            this.selectTableData = rowarr
            this.$store.commit('setGoodsInfoData', rowarr)

        },
        tableItemSelectEvent(selection, row){
            var isHave = false

            selection.forEach((item, index) => {
                if (item.id == row.id) {
                    isHave = true
                }
            })

            if (isHave) {
                row.mount = '1'
            } else {
                row.mount = '0'
            }

        },
        sureBtnEvent(){
            var flg = true;

            if (this.selectTableData.length == 0) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '请选择商品'
                })
                return
            }

            this.selectTableData.forEach((item, index) => {
                if (item.skuGroups == "" || item.skuGroups.length == 0) {
                    flg = false
                    return;  //只能跳出本次循环,待修改
                }
            })

            if (!flg) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '请选择商品规格'
                })
            } else {
                this.$router.push({
                    path: '/addPurchaseList/' + '2'
                })
            }
        },
        cancelBtnEvent(){
            this.$store.commit('setGoodsInfoData', this.goodsInfoData)
            this.$router.go(-1)
        }
    },
    activated(){
        this.getTableData()
        this.getGoodsItemSelect()
        this.SKUSelectData = []
        this.SKUSelectvalue = []
        this.selectTableData.forEach((item, index) => {
            item.skuGroups = ""
        })
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
