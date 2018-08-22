<template>
    <section :style="{height: $store.state.home.modelContentHeight + 'px'}">
        <!-- 顶部 -->
        <header class="types_top">
            <p class='types_title'>包装类型</p>
            <el-button type="primary" size='small' style="height:30px;margin-top:-3px" @click='openAddtypes'>新增类型</el-button>
        </header>
        <section class="types_conent" >
             <div class='box_top' style="border:1px solid #e5e8e8;border-bottom:none">
                <el-input
                    size="small"
                    placeholder="请输入内容"
                    prefix-icon="el-icon-search"
                    v-model="page.unitMsg"
                    style="width:378px"
                    clearable
                    @clear="findthat"
                    @keyup.enter.native='findthat'>
                </el-input>
                <el-button type="primary" size='small' style="margin-left:10px" @click='findthat'>搜索</el-button>
            </div>
            <div class="types_box">
                <el-table
                    :data="types"
                    :height="$store.state.home.modelContentHeight - 90"
                    style="width: 100%">
                    <el-table-column
                        width="30"
                        >
                    </el-table-column>
                    <el-table-column
                        width="150"
                        prop="unitMsg"
                        label="包装名称"
                        >
                    </el-table-column>
                    <el-table-column
                        prop=""
                        label="规格值"
                        >
                        <template slot-scope="scope">
                            <span v-for="(date,index) in scope.row.itemSupplyPropertyVOs" :key="index">{{date.supplyMsg + ';' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        width="250"
                        label="备注"
                        >
                    </el-table-column>
                    <el-table-column
                        prop=""
                        width="150"
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-button type='text' @click='gotoEdit(scope.row.id)'><span style="font-size:12px" v-perss="'更新供货规格'">编辑</span></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </section>
        <footer class="types_footer">
            <!-- <div class="block">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 30, 50, 100]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalPage">
                </el-pagination>
            </div> -->
        </footer>
    </section>
</template>
<script>
import api from 'api/goods'
// import bus from '@/assets/eventBus.js'

export default {
    data() {
        return {
            dialogFormVisible: false,
            formLabelWidth: '120px',
            value1: true,
            value2: true,
            textarea: '',

            currentPage: 2,
            totalPage: 1,

            // 关联分类
            value: '',
            checked: false,
            // 删除
            del: false,

            page:{
                pageSize: 100,
                pageNo: 1,
                unitMsg: ''
            },

            types:[]
        }
    },
    methods: {

        openAddtypes() {
            this.$router.push('addTypes')
        },
        gotoEdit(data) {
            // bus.$emit('editTypes', data)
            this.$store.commit('setTypes', data)
            this.$router.push('editTypes')
            // console.log(data)

        },
        // handleSizeChange(val) {
        //     this.page.pageSize = val
        //     this.get()
        // },
        // handleCurrentChange(val) {
        //     this.page.pageNo = val
        //     this.get()
        // },
        // 搜索
        findthat() {
            api.getitemsupplyPropertylist(this.page).then((response)=>{

                this.types = response.data.list
                // console.log(response)
            }).catch((error)=>{
                console.log(error)
            })
        },

        get() {

            api.getitemsupplyPropertylist(this.page).then((response)=>{

                // console.log(response.data.list)
                this.types = response.data.list
            }).catch((error)=>{

                console.log(error)

            })


        }
    },
    created(){
        // console.log(this.form)
        this.get()

    },
    activated() {
        this.get()
    }

}
</script>
<style scoped>
/* 顶部 */
.types_top{
    display: flex;
    justify-content: space-between;
    height: 46px;
    padding: 10px;
    border-bottom: 1px solid #e5e8e8
}
.types_title{
    height: 25px;
    line-height: 25px;
    margin-left: 20px;
    font-size: 15px;
    color: #5e6161
}
.types_top .el-input{
    width: 40%;
}
/* 内容 */
.types_conent{
    padding: 10px;
    background: #f5f5f5;
}
.types_box{
    border: 1px solid #e6e9eb;
    color: #5e6161;
    background: white;
    overflow: auto;
}
.box_top{
    display: flex;
    background:white;
    padding: 16px
}
.box_top .el-input{
    width: 35%;
}
.types_list{
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    padding: 0 40px;
    margin: 0;
    font-weight: 600;
    border-bottom: 1px solid #e5e8e8;
    background: #f5f5f5
}
.types_text{
    background: white;
    font-weight: 500;
    border-color:  #e5e8e8;
}
/* 底部 */
.types_footer{
    border-top:1px solid #e5e8e8;
    position: relative;
    padding: 11px 30px;
    /* margin-top: -23px; */
    background: white;
}
.types_footer .block{
    position: absolute;
    right: 30px;
    top:0px
}
</style>
