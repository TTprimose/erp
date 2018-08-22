<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">订单</span>
            <span> - 发货单</span>
            <div>
                <!-- <el-button size="small">导出订单</el-button> -->
            </div>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <div class="invoiceList_title">
                    <el-select size="small" @change="getTableData" style="margin-right: 10px" v-model="tableParam.status" placeholder="订单状态">
                        <el-option :label="'全部订单'" :value="''"> </el-option>
                        <el-option :label="'未收货'" :value="'0'"> </el-option>
                        <el-option :label="'已收货'" :value="'1'"> </el-option>
                    </el-select>
                    <el-input
                        size="small"
                        placeholder="请输入发货单号/订单编号"
                        prefix-icon="el-icon-search"
                        clearable
                        @clear="getTableData"
                        :style="{width: '378px'}"
                        @keyup.enter.native="getTableData"
                        v-model="tableParam.logisticNo">
                    </el-input>
                    <el-button :style="{margin: '0 30px 0 10px'}" type="primary" size="small" @click='getTableData'>搜索</el-button>
                </div>

                <el-table
                    :data="tableData"
                    :height="$store.state.home.modelContentHeight - 83"
                    ref="invoiceListTable"
                    style="width: 100%">
                    <el-table-column
                        prop="logisticNo"
                        width="180"
                        label="物流单号"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="logisticsName"
                        label="物流公司">
                    </el-table-column>
                    <el-table-column
                        prop="secondaryOrderNo"
                        width="250"
                        label="订单编号">
                    </el-table-column>
                    <el-table-column
                        prop="created"
                        width="150"
                        label="发货时间">
                        <template slot-scope="scope">
                            {{scope.row.created | time_m}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="orderPrice"
                        width="100"
                        label="订单金额(元)">
                    </el-table-column>
                    <el-table-column
                        prop="sendName"
                        label="发货人">
                    </el-table-column>
                    <el-table-column
                        prop="receiveUserName"
                        label="收货方">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        width="150"
                        label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 0" class="color_brown">未收货</span>
                            <span v-if="scope.row.status == 1" class="color_brown">已收货</span>
                        </template>
                    </el-table-column>
                </el-table>


            </div>
        </div>
        <div class="model_footer">
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
import api from 'api/order'
export default {
    data(){
        return {
            tableParam: {
                pageNo: 1,
                pageSize: 10,
                logisticNo: '',
                status: ''
            },
            totalPage: 1,
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
        getTableData(){
            api.getLogisticsSendList(this.tableParam).then((response) => {

                this.tableData = response.data.list
                this.totalPage = response.data.total
                // console.log(this.tableData)
            })
        },
        resetBtnEvent () {
            for (var key in this.tableParam) {
                this.tableParam[key] = ''
            }
            this.tableParam.pageNo = 1
            this.tableParam.pageSize = 10
        }

    },
    created(){},
    mounted(){},
    activated() {
        this.resetBtnEvent()
        this.getTableData()
    }
}
</script>
<style scoped>
.model_content_inner{
    position: relative;
}

/* .model_footer{
    text-align: left;
    padding-top: 10px;
} */
.invoiceList_title{
    height: 63px;
    line-height: 63px;
    padding-left: 17px;
}
</style>
