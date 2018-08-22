<template>
    <section class="authorityList_conent" :style="{height: $store.state.home.modelContentHeight+53 + 'px'}">
        <div class="authorityList_box" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <el-table
                :data='authority'
                style="width:100%">
                <el-table-column
                    prop=""
                    width="30">
                </el-table-column>
                <el-table-column
                    prop="roleName"
                    label="权限组名">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="操作"
                    width="200">
                    <template  slot-scope="scope">
                        <el-button type="text" size="small" @click="gotoAuthority(scope.row.id, scope.row.roleName)" v-perss="'权限管理'">权限管理</el-button>
                        <el-button type="text" size="small" @click="edittrue(scope)" v-perss="'修改用户名或角色'">重命名</el-button>
                        <el-button type="text" size="small" @click='deltrue(scope)' >删除</el-button>
                    </template>
                    <!-- 编辑 -->
                    <el-dialog
                        title="编辑权限组名"
                        :visible.sync="editauthorit"
                        width="30%"
                        :close-on-click-modal='false'
                        append-to-body>
                        <div>
                            <span style="width:80px;text-align:center;display:inline-block">权限组名</span>
                            <el-input v-model="text" size='small' style="width:388px"></el-input>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="editauthorit = false" size='small'>取 消</el-button>
                            <el-button type="primary" @click="editconfirm" size='small'>确 定</el-button>
                        </span>
                    </el-dialog>
                    <!-- 删除 -->
                    <el-dialog
                        title="提示"
                        :visible.sync="delauthorit"
                        width="30%"
                        :close-on-click-modal='false'
                        append-to-body>
                        <span>确定删除该权限组？</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="delauthorit = false" size='small'>取 消</el-button>
                            <el-button type="primary" @click="delconfirm" size='small'>确 定</el-button>
                        </span>
                    </el-dialog>
                </el-table-column>
            </el-table>
        </div>

    </section>
</template>
<script>
import api from 'api/work'


export default {
    name: 'authorityList',
    data() {
        return {
            authority: [
                // {
                //     id: '1',
                //     name: '超级管理员',
                //     oteher: ''
                // },
                // {
                //     id: '2',
                //     name: '产品',
                //     oteher: ''
                // },
                // {
                //     id: '3',
                //     name: '采购',
                //     oteher: ''
                // }
            ],
            editauthorit: false,
            delauthorit: false,
            text: '',
            index: ''
        }
    },
    methods: {
        edittrue(data) {
            this.editauthorit = true
            this.text = data.row.roleName
            this.index = data.row.id
            // console.log(this.index)
        },
        editconfirm() {
            this.editauthorit = false
            for (var i in this.authority){

                if (this.authority[i].id == this.index){
                    this.authority[i].name = this.text
                    let obj = {
                        roleId: this.index,
                        roleName: this.text
                    }

                    api.putroleupdate(obj).then((response)=>{
                        this.get()
                        // console.log(response)
                        this.$message({
                            type: 'success',
                            message: '编辑权限组成功！'
                        });
                    }).catch((error)=>{
                        console.log(error)
                    })

                }
            }
            this.index = ''
            this.text = ''
        },
        deltrue(data) {
            this.delauthorit = true
            this.index = data.row.id
        },
        delconfirm() {
            this.delauthorit = false
            for (var i in this.authority){

                if (this.authority[i].id == this.index){
                    // if (this.authority.length > 1){
                    //     this.authority.splice(i, 1)
                    // }
                    api.deleteroleid(this.authority[i].id).then((response)=>{
                        this.get()
                        this.$message({
                            type: 'success',
                            message: '删除权限组成功！'
                        });
                    }).catch((error)=>{
                        console.log(error)
                    })

                }
            }
            this.index = ''
        },
        gotoAuthority(data, name) {
            this.$store.commit('setUserid', data)
            this.$store.commit('setRoleName', name)
            this.$router.push('permissionManage')
        },

        get() {
            api.getrolelist().then((response) => {
                // console.log(response)
                this.authority = response.data.list
                // console.log(this.authority)
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
.authorityList_conent{
    padding: 10px;
    background: #f5f5f5;
    width: 100%;
}
.authorityList_box{
    border: 1px solid #e6e9eb;
    color: #5e6161;
    background: white;
    overflow: auto
}
</style>

