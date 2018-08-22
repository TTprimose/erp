<template>
    <section :style="{height: $store.state.home.modelContentHeight + 'px'}">
        <!-- 顶部 -->
        <header class="spec_top">
            <p class='spec_title'>商品规格</p>
            <el-button type="primary" size='small' style="height:30px;margin-top:-3px" @click='openAddspec' v-perss="'新增商品规格'">新增规格</el-button>
        </header>
        <section class="spec_conent" >
            <div class="spec_box" :style="{height: $store.state.home.modelContentHeight-23 + 'px'}">
                <div class='box_top'>
                     <el-input
                        size="small"
                        placeholder="请输入规格名称"
                        prefix-icon="el-icon-search"
                        v-model="page.skuPropertyName"
                        style="width:378px"
                        clearable
                        @clear="findthat"
                        @keyup.enter.native='findthat'>
                    </el-input>
                    <el-button type="primary" size='small' style="margin-left:10px" @click='findthat'>搜索</el-button>
                </div>
                <el-table
                    :data="spec"
                    style="width: 100%">
                    <el-table-column
                        width='30'>
                    </el-table-column>
                    <el-table-column
                        label="规格名称"
                        width="150"
                        prop="skuPropertyName">
                    </el-table-column>
                    <el-table-column
                        prop="propertyValueList"
                        label="规格值">
                        <template slot-scope="scope">
                            <span v-for="(date,index) in scope.row.propertyValueList" :key="index">{{date.skuPropertyValueName + ';' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        width="250"
                        label="备注">
                    </el-table-column>
                    <el-table-column
                        prop=""
                        label="操作"
                        width="150" >
                        <template slot-scope="scope">
                            <el-button type='text' @click='gotoEdit(scope.row.id)' v-perss="'更新商品规格'"><span style="font-size:12px">编辑</span></el-button>
                            <!-- <el-button type="text" @click="del = true" disabled><span style="font-size:12px">删除</span></el-button> -->
                            <el-dialog
                                title="温馨提示"
                                :visible.sync="del"
                                width="30%">
                                <span>此操作将永久删除该项</span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="del = false">取 消</el-button>
                                    <el-button type="primary" disabled>确 定</el-button>
                                </span>
                            </el-dialog>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </section>
        <footer class="spec_footer">
            <div class="block">
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
        </footer>
    </section>
</template>
<script>
import api from 'api/goods'
// import bus from '@/assets/eventBus.js'

export default {
    data() {
        return {

            currentPage: 2,
            totalPage: 1,


            value: '',
            checked: false,
            // 删除
            del: false,

            page: {
                pageSize: 10,
                pageNo: 1,
                skuPropertyName: ''
            },

            spec: []

        }
    },
    methods: {

        openAddspec() {
            this.$router.push({
                path: '/addSpec'
            })
        },
        gotoEdit(data) {
            this.$store.commit('setSpec', data)
            this.$router.push('editSpec')
        },
        handleSizeChange(val) {
            this.page.pageSize = val
            this.get()
        },
        handleCurrentChange(val) {
            this.page.pageNo = val
            this.get()
        },
        findthat() {

            api.getitemskuPropertylist(this.page).then((response)=>{
                this.spec = response.data.list

            }).catch((error)=>{
                console.log(error)
            })
        },
        get() {

            api.getitemskuPropertylist(this.page).then((response)=>{

                // console.log(response.data.list)
                this.spec = response.data.list
                this.totalPage = response.data.total
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
.spec_top{
    display: flex;
    justify-content: space-between;
    height: 46px;
    padding: 10px;
    border-bottom: 1px solid #e5e8e8
}
.spec_title{
    height: 25px;
    line-height: 25px;
    margin-left: 20px;
    font-size: 15px;
    color: #5e6161
}
.spec_top .el-input{
    width: 40%;
}
/* 内容 */
.spec_conent{
    padding: 10px;
    background: #f5f5f5
}
.spec_box{
    border: 1px solid #e6e9eb;
    color: #5e6161;
    background: white;
    overflow: auto
}
.box_top{
    display: flex;
    background:white;
    padding: 16px
}
.box_top .el-input{
    width: 35%;
}
.spec_list{
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
.spec_text{
    font-weight: 500;
    border-color:  #e5e8e8;
    background: white
}
.spec_text li{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
/* 底部 */
.spec_footer{
    border-top:1px solid #e5e8e8;
    position: relative;
    /* margin-top: -23px; */
    background: white;
    padding: 11px 30px;
}
.spec_footer .block{
    position: absolute;
    right: 30px;
    top:0
}
</style>

