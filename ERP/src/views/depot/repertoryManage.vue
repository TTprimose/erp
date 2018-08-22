<template>
    <div>
        <div class="model_topcol">
            <span>仓库管理</span>
            <div>
                <el-button type="primary" @click="purchaseAddEvent" size="small" v-perss="'新增仓库'">新建仓库</el-button>
            </div>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 50  + 'px'}">
            <div class="model_content_inner">
                <div class="purchaseList_title">
                    <el-input
                        size="small"
                        placeholder="请输入要查询的关键词"
                        clearable
                        @clear="searchInputClear"
                        prefix-icon="el-icon-search"
                        :style="{width: '378px'}"
                        @keyup.enter.native='search'
                        v-model="searchText">
                    </el-input>
                    <el-button :style="{margin: '0 10px'}" type="primary" size="small" @click="search">搜索</el-button>
                </div>
                <el-table
                    :data="warehouseList"
                    :height="$store.state.home.modelContentHeight - 33"
                    ref="purchaseListTable"
                    style="width: 100%">
                    <el-table-column
                        width="100"
                        prop="warehouseNo"
                        label="编码"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="warehouseName"
                        label="名称"
                    >
                    </el-table-column>
                    <el-table-column
                        label="状态">
                        <template slot-scope="scope">
                            <el-switch
                                :disabled="switchPerss"
                                v-model="scope.row.activateState"
                                @change="changeWarehouseState(scope.$index, scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="personResponsible"
                        label="负责人">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="负责人手机号">
                    </el-table-column>
                    <el-table-column
                        prop="warehouseAddress"
                        label="详细地址">
                    </el-table-column>
                    <el-table-column
                        prop="acreage"
                        label="面积(㎡)">
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="备注">
                    </el-table-column>
                    <el-table-column
                        width="150"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                                @click.native.prevent="inRepDetail(scope.$index, scope.row)"
                                type="text"
                                v-perss="'仓库详情'"
                                size="small">
                                详情
                            </el-button>
                            <el-button
                                v-perss="'修改仓库'"
                                @click.native.prevent="editTable(scope.$index, scope.row)"
                                type="text"
                                size="small">
                                编辑
                            </el-button>
                            <el-button
                                v-perss="'删除仓库'"
                                @click.native.prevent="deleteTable(scope.$index, scope.row)"
                                type="text"
                                size="small">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import 'utils/allEnumeration'
import API from 'api/depot'
import myBase from 'utils/base'
export default {
    data(){
        return {
            warnState: '',
            searchText: '',
            currentPage: 2,
            selectTableData: [],
            isSupperBoxShow: false,
            tableHeight: 500,
            isExportShow: false,
            warehouseList: []
        }
    },
    computed:{
        switchPerss() {
            return !myBase.isHasPerssion('设置仓库状态')
        }
    },
    methods:{
        searchInputClear(){
            this.search()
        },
        handleSizeChange(data){
            this.currentPage = 1
            this.searchFormData.pageNo = this.currentPage
            this.searchFormData.pageSize = data
            this.getWarehouseList(this.searchFormData)
        },
        handleCurrentChange(data){
            this.searchFormData.pageNo = data
            this.getWarehouseList(this.searchFormData)
        },
        // 进入详情
        inRepDetail(index, data){
            this.$router.push({name: '编辑仓库', params: {id: data.id, type: 'detail'}})
        },
        // 获取列表数据
        getWarehouseList(data) {
            API.getWarehouseList(data).then(res => {
                this.warehouseList = res.data.list
                this.warehouseList.forEach((rs) => {
                    rs.activateState = this.$allEnumeration.bool[rs.activateState]
                })
            })
        },
        // 修改仓库状态
        changeWarehouseState(index, data) {
            API.editWarehouseState({id: data.id, activateState: this.$allEnumeration.notBool[data.activateState]}).then(res => {
                if (res.result == 1) {
                    this.$message({
                        type: 'success',
                        message: '状态修改成功!'
                    });
                }
            })


        },
        // 编辑数据
        editTable(index, data) {
            this.$router.push({
                name: '编辑仓库',
                params: {type: 'edit', data: data, id: data.id}
            })
        },
        // 删除仓库
        deleteTable(index, data) {
            if (data.activateState) {
                this.$message({
                    type: 'warning',
                    message: '该仓库正在使用，禁止删除！'
                });
                return
            }
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                API.deleteWarehouse(data.id).then(res => {
                    if (res.result == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getWarehouseList()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 搜索仓库
        search() {
            this.getWarehouseList({warehouseName: this.searchText})
        },
        supperBoxShow(){
            this.isSupperBoxShow = !this.isSupperBoxShow
        },
        purchaseAddEvent(){
            this.$router.push({
                name: '新增仓库',
                params: {type: '新增'}
            })
        }
    },
    created(){},
    mounted(){

    },
    activated() {
        this.getWarehouseList()
    }
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
    .el-form, .el-table{
        color: #636365;
    }
    .el-table .cell .auditStatus_0, .el-table .cell .auditStatus_1{
        color: #e6a23c;
    }
    .el-table .cell .auditStatus_2{
        color: #606266;
    }
    .el-table .cell .auditStatus_3{
        color: #f56c6c;
    }

</style>
