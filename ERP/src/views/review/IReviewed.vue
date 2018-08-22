<template>
    <div>
        <div class="model_topcol">
            <span>我已审批</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <div class="purchaseList_title">
                    <el-select size="small" @change="getTableData" v-model="tableParam.auditStatus" placeholder="审核状态">
                        <el-option :label="'全部'" :value="''"> </el-option>
                        <el-option v-for="(value, key) in $allEnumeration.auditStatus" :key="key" :label="value" :value="key"> </el-option>
                    </el-select>
                    <el-date-picker
                        size="small"
                        v-model="searchTime"
                        :style="{margin: '0px 20px'}"
                        value-format="timestamp"
                        @change="datePickerChange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                    <el-input
                        size="small"
                        placeholder="请输入关键词"
                        clearable
                        @clear="getTableData"
                        prefix-icon="el-icon-search"
                        :style="{width: '378px'}"
                        @keyup.enter.native="getTableData"
                        v-model="tableParam.searchStr">
                    </el-input>
                    <el-button @click="getTableData" :style="{margin: '0 30px 0 10px'}" type="primary" size="small">搜索</el-button>


                </div>
                <el-table
                    :data="tableData"
                    :height="$store.state.home.modelContentHeight - 83"
                    ref="purchaseListTable"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                    <el-table-column
                    type="index"
                    label=" "
                    width="50">
                    </el-table-column>
                    <el-table-column
                        prop="processName"
                        label="流程名称"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="creator"
                        label="创建人">
                    </el-table-column>
                    <el-table-column
                        prop="setTime"
                        label="创建时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.created | time_m}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="state"
                        label="审核状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.auditStatus == 0" class="color_brown">待审核</span>
                            <span v-if="scope.row.auditStatus == 1" class="color_brown">审核中</span>
                            <span v-if="scope.row.auditStatus == 2" class="color_gray">通过</span>
                            <span v-if="scope.row.auditStatus == 3" class="color_red">不通过</span>
                            <span v-if="scope.row.auditStatus == 4" class="color_gray">撤销</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="prop"
                        width="150"
                        label="操作">
                         <template slot-scope="scope">
                            <el-button
                            @click.native="tablePropEvent(scope.row)"
                            type="text"
                            size="small">
                            详情
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
                :current-page="1"
                :page-sizes="[10, 30, 50, 100]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import api from 'api/review'
export default {
    data(){
        return {
            searchText: '',
            searchTime: '',
            searState: '',
            totalPage: 1,
            tableParam: {
                auditorId: this.$store.state.home.userInfo.user.id,
                startTime: '',
                endTime: '',
                pageNo: 1,
                pageSize: 10,
                searchStr: '',
                auditStatus: ''
            },
            currentPage: 2,
            selectTableData: [],
            tableHeight: 500,
            tableData: []
        }
    },
    computed:{},
    methods:{
        handleSizeChange(val){
            this.tableParam.pageSize = val
            this.getTableData()
        },
        handleCurrentChange(val){
            this.tableParam.pageNo = val
            this.getTableData()
        },
        tablePropEvent(rowData){
            this.$store.commit('setCurrentModelId', rowData)
            this.$router.push({
                path: '/IReviewDetail'
            })
        },

        handleSelectionChange(val){

        },
        datePickerChange(data){
            this.tableParam.startTime = Math.round(data[0] / 1000)
            this.tableParam.endTime = Math.round(data[1] / 1000)
        },
        getTableData(){
            api.getIReviewList(this.tableParam).then((res) => {
                console.log(res)
                this.tableData = res.data.list
                this.totalPage = res.data.total
            })
        }
    },
    activated(){
        this.pageNo = 1
        this.pageSize = 10
        this.getTableData()
    },
    created(){},
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
