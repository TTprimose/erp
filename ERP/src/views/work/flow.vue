<template>
    <section :style="{height: $store.state.home.modelContentHeight + 'px'}">
        <!-- 顶部 -->
        <header class="flow_top">
            <p class='flow_title'>流程配置</p>
            <el-button type="primary" size='small' style="height:30px;margin-top:-3px;width:90px" @click='addflow' v-perss="'新增流程名称'">新增流程</el-button>
            <el-dialog
                title="新增流程"
                :visible.sync="addopen"
                width="30%">
                <div>
                    <span style="width:80px;text-align:center;display:inline-block">流程名</span>
                    <el-input v-model="addtext" size='small' style="width:388px"></el-input>
                </div>
                <div style="margin-top:20px">
                    <span style="width:80px;text-align:center;display:inline-block">流程类型</span>
                    <el-select v-model="value" placeholder="请选择" size='small' style="width:388px">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addopen = false" size='small'>取 消</el-button>
                    <el-button type="primary" @click="addtrue" size='small'>确 定</el-button>
                </span>
            </el-dialog>
        </header>
        <section class="flow_conent" :style="{height: $store.state.home.modelContentHeight+54 + 'px'}">
            <div class="flow_box" :style="{height: $store.state.home.modelContentHeight-8 + 'px'}">
                <el-table
                    :data='flow'
                    style="width:100%">
                    <el-table-column
                        prop=""
                        width="50">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="流程名称">
                    </el-table-column>
                    <el-table-column
                        prop="processType"
                        label="流程类型">
                    </el-table-column>
                    <el-table-column
                        prop="other"
                        label="操作"
                        width="200">
                        <template  slot-scope="scope">
                            <el-button type="text" size="small" @click="writeflow(scope)" style="margin-right:10px" v-perss="'设置审批流程'">配置</el-button>
                            <el-button type="text" size="small" @click="edittrue(scope)" style="margin-right:10px" v-perss="'修改流程名称'">重命名</el-button>
                            <el-button type="text" size="small" @click='deltrue(scope)' v-perss="'删除流程名称'">删除</el-button>
                            <!-- 编辑 -->
                            <el-dialog
                                title="编辑流程"
                                :visible.sync="editflow"
                                :close-on-click-modal='false'
                                width="30%">
                                <div>
                                    <span style="width:80px;text-align:center;display:inline-block">流程名</span>
                                    <el-input v-model="edittext" size='small' style="width:388px"></el-input>
                                </div>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="editflow = false" size='small'>取 消</el-button>
                                    <el-button type="primary" @click="editconfirm" size='small'>确 定</el-button>
                                </span>
                            </el-dialog>
                            <!-- 删除 -->
                            <el-dialog
                                title="提示"
                                :visible.sync="delflow"
                                :close-on-click-modal='false'
                                width="30%">
                                <span>确定删除此项流程？</span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="delflow = false" size='small'>取 消</el-button>
                                    <el-button type="primary" @click="delconfirm" size='small'>确 定</el-button>
                                </span>
                            </el-dialog>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </section>
    </section>
</template>
<script>
import api from 'api/work'

export default {
    data() {
        return {
            addopen: false,
            delflow: false,
            editflow: false,
            setflow: false,
            addtext: '',
            edittext: '',
            // flow: [
            //     {
            //         id: '1',
            //         name: '采购订单',
            //         other: ''
            //     },
            //     {
            //         id: '2',
            //         name: '采购退货',
            //         other: ''
            //     }
            // ],
            flow : [],
            text: '',
            index: '',
            formData:{
                id: '',
                name: '',
                processType: ''
            },
            options: [
                {
                    value: '1',
                    label: '采购流程'
                },
                {
                    value: '2',
                    label: '采购退货流程'
                },
                {
                    value: '3',
                    label: '入库流程'
                },
                {
                    value: '4',
                    label: '出库流程'
                },
                {
                    value: '5',
                    label: '调拨流程'
                },
                {
                    value: '6',
                    label: '盘点流程'
                }
            ],
            value: ''
        }
    },
    methods: {
        addflow() {
            this.addopen = true
            this.value = ''
        },
        addtrue() {
            this.addopen = false

            let obj = {
                name: this.addtext,
                processType: this.value
            }

            // this.flow.push(obj)
            // var a = JSON.stringify(obj)

            api.postprocessadd(obj).then((response)=>{
                this.get()
                // console.log(response)
                this.$message({
                    type: 'success',
                    message: '新增流程成功！'
                });
            }).catch((error)=>{
                console.log(error)
            })
            this.addtext = ''
        },
        deltrue(data) {
            this.delflow = true
            this.index = data.row.id
            // console.log(this.index)
        },
        edittrue(data) {
            this.editflow = true
            this.edittext = data.row.name
            this.index = data.row.id
            // console.log(data.row)
        },
        writeflow(data) {
            this.$store.commit('setFlow', data.row.id)
            this.$store.commit('setFlowN', data.row.name)
            this.$router.push('configuration')
        },
        editconfirm() {
            this.editflow = false
            for (var i in this.flow){

                if (this.flow[i].id == this.index){
                    // this.flow[i].name = this.edittext
                    this.formData.id = this.index
                    this.formData.name = this.edittext
                    api.putprocessupdate(this.formData).then((response)=>{
                        this.get()
                        // console.log(response)
                        this.$message({
                            type: 'success',
                            message: '流程名称编辑成功！'
                        });
                    }).catch((error)=>{
                        console.log(error)
                    })
                }
            }
            this.index = ''
            this.edittext = ''

        },
        delconfirm() {
            this.delflow = false
            for (var i in this.flow){
                if (this.flow[i].id == this.index){
                    if (this.flow.length >= 1){
                        // this.flow.splice(i, 1)
                        api.delprocessid(this.flow[i].id).then((response)=>{
                            this.get()
                            // console.log(response)
                            this.$message({
                                type: 'success',
                                message: '流程删除成功！'
                            });
                        }).catch((error)=>{
                            console.log(error)
                        })

                    }
                }

            }
            this.index = ''

        },
        get() {
            api.getprocessname().then((response) => {
                // console.log(response.data.list)
                this.flow = response.data.list
                for (let i in this.flow){
                    if (this.flow[i].processType == 1){
                        this.flow[i].processType = '采购流程'
                    }
                    if (this.flow[i].processType == 2){
                        this.flow[i].processType = '采购退货流程'
                    }
                    if (this.flow[i].processType == 3){
                        this.flow[i].processType = '入库流程'
                    }
                    if (this.flow[i].processType == 4){
                        this.flow[i].processType = '出库流程'
                    }
                    if (this.flow[i].processType == 5){
                        this.flow[i].processType = '调拨流程'
                    }
                    if (this.flow[i].processType == 6){
                        this.flow[i].processType = '盘点流程'
                    }
                }
            }).catch((error)=>{
                console.log(error)
            })
        }
    },
    created() {
        this.get()
    },
    activated() {
        this.get()
    }
}
</script>
<style scoped>
/* 顶部 */
.flow_top{
    display: flex;
    justify-content: space-between;
    height: 46px;
    padding: 10px;
    border-bottom: 1px solid #e5e8e8
}
.flow_title{
    height: 25px;
    line-height: 25px;
    margin-left: 20px;
    font-size: 15px;
    color: #5e6161;
}
.flow_top .el-input{
    width: 40%;
}
/* 内容 */
.flow_conent{
    padding: 10px;
    background: #f5f5f5
}
.flow_box{
    border: 1px solid #e6e9eb;
    color: #5e6161;
    background: white;
    overflow: auto
}
</style>
