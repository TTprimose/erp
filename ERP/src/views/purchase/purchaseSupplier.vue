<template>
    <div>
        <div class="model_topcol">
            <span>供应商</span>
            <div>
                <el-button @click="addPurchaseSupplierEvent" v-perss="'新建供应商'" :style="{width: '90px'}" type="primary" size="small">新增</el-button>
            </div>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <div class="purchaseList_title">
                    <el-input
                        size="small"
                        placeholder="请输入供应商名称"
                        clearable
                        @clear="searchInputClear"
                        prefix-icon="el-icon-search"
                        :style="{width: '378px'}"
                        @keyup.enter.native="getTableData"
                        v-model="tableParam.sellerName">
                    </el-input>
                    <el-button @click="getTableData" :style="{margin: '0 10px'}" type="primary" size="small">搜索</el-button>
                </div>
                <el-table
                    :data="tableData"
                    :height="$store.state.home.modelContentHeight - 83"
                    ref="purchaseListTable"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                    <!-- <el-table-column
                    type="index"
                    label=" "
                    width="50">
                    </el-table-column> -->
                    <el-table-column
                        prop="sellerCompanyNo"
                        label="供应商编号"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="sellerCompanyName"
                        label="供应商名称">
                    </el-table-column>
                    <el-table-column
                        prop="sellerCompanyAddress"
                        label="地址">
                    </el-table-column>
                    <el-table-column
                        prop="contactPerson"
                        label="联系人">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="联系方式">
                    </el-table-column>
                    <el-table-column
                        prop="prop"
                        width="150"
                        label="操作">
                         <template slot-scope="scope">
                            <el-button
                            @click.native="tablePropEvent(scope.row.id, 1)"
                            type="text"
                            v-perss="'供应商详情'"
                            size="small">
                            详情
                            </el-button>
                            <el-button
                            @click.native="tablePropEvent(scope.row.id, 2)"
                            type="text"
                            v-perss="'修改供应商'"
                            size="small">
                            编辑
                            </el-button>
                            <el-button
                            @click.native="tablePropEvent(scope.row.id, 3)"
                            type="text"
                            v-perss="'删除供应商'"
                            size="small">
                            删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="model_footer">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
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
            currentPage: 2,
            selectTableData: [],
            tableHeight: 500,
            totalPage: 1,
            tableParam: {
                pageNo: 1,
                pageSize: 10,
                sellerName: ''
            },
            tableData: []
        }
    },
    computed:{},
    methods:{
        searchInputClear(){
            this.getTableData()
        },
        handleSizeChange(val){
            this.tableParam.pageSize = val
            this.getTableData()
        },
        handleCurrentChange(val){
            this.tableParam.pageNo = val
            this.getTableData()
        },
        getTableData(){
            api.getSupplierList(this.tableParam).then((response) => {
                this.totalPage = response.data.total
                this.tableData = response.data.list

            })
        },
        tablePropEvent(rowid, type){
            if (type == 1){
                this.$store.commit('setCurrentModelId', rowid)
                this.$router.push({
                    path: '/lookPurchaseSupplier'
                })
            }
            if (type == 2){
                this.$store.commit('setCurrentModelId', rowid)
                this.$router.push({
                    path: '/editPurchaseSupplier'
                })
            }
            if (type == 3){
                this.myBase.confirmDelet('你确定要永久删除此供应商信息?', () => {
                    api.deleteSupplier(rowid).then((response) => {
                        this.$message({
                            type: 'success',
                            duration: 1500,
                            showClose: true,
                            message: '删除成功'
                        })

                        this.tableParam.pageSize = 10
                        this.tableParam.pageNo = 1
                        this.getTableData()

                    })
                })
            }

        },

        handleSelectionChange(val){
        },
        addPurchaseSupplierEvent(){
            this.$router.push({
                path: '/addPurchaseSupplier'
            })
        }

    },
    activated(){
        this.tableParam.pageSize = 10
        this.tableParam.pageNo = 1
        this.getTableData()
    },
    created(){
        this.getTableData()
    },
    mounted(){}
}
</script>
<style scoped>
.purchaseList_title{
    height: 63px;
    line-height: 63px;
    padding-left: 17px;
}
.purchaseList_exportWrap{
    height: 63px;
    padding-top: 15px;
}
.purchaseList_title span{
    cursor: pointer;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 12px;
}
.purchaseList_exportWrap>ul{
    overflow: hidden;
    padding-left: 0;
}
.purchaseList_exportWrap>ul>li{
    float: left;
    padding: 0 20px;
    height: 33px;
    line-height: 32px;
}
.box_card{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 300px;
    z-index: 9;
}
.model_content_inner{
    position: relative;
}
.el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
    width: 390px;
}
.el-form{
    color: #636365;
}

</style>
