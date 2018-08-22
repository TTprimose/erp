<template>
    <section class="uesr_box">
        <!-- 顶部 -->
        <header class="user_top" >
            <el-tabs v-model="activeName" @tab-click="clickTab">
                <el-tab-pane label="用户列表" name="first" >
                    <userlist ref="userList"></userlist>
                </el-tab-pane>
                <el-tab-pane label="权限组" name="second"  >
                    <autohority ref='authorityList'></autohority>
                </el-tab-pane>
            </el-tabs>

        </header>
        <div class="button_box">
            <el-button type='primary' size='small' style="margin-right:10px:width:90px" v-if='first' @click='openadduser' v-perss="'增加用户'" >新增用户</el-button>
            <el-button type='primary' size='small' style="margin-right:10px:width:90px" v-if="second" @click="openaddautohority">新增权限</el-button>
        </div>

        <!-- 新增用户 -->
        <el-dialog
            title="新增用户"
            :visible.sync="adduser"
            width="30%"
            append-to-body
            :close-on-click-modal='false'
            style="margin-right:10px">
            <div>
                <span style="width:80px;text-align:center;display:inline-block">用户名</span>
                <el-input v-model="addusertext" size='small' style="width:388px"></el-input>
            </div>
            <div style="margin-top:20px">
                <span style="width:80px;text-align:center;display:inline-block">权限组</span>
                <el-select
                    v-model="addlist"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    size='small'
                    style="width:388px">
                    <el-option
                        v-for="item in add"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="adduser = false" size='small' style="margin-right:10px">取 消</el-button>
                <el-button type="primary" @click="addconfirm" size='small' style="margin-right:10px">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新增权限组 -->
        <el-dialog
            title="新增权限组"
            :visible.sync="addautohority"
            width="30%"
            :close-on-click-modal='false'   
            append-to-body>
            <div>
                <span style="width:80px;text-align:center;display:inline-block">权限组名</span>
                <el-input v-model="addautohoritytext" size='small' style="width:388px"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addautohority = false" size='small'>取 消</el-button>
                <el-button type="primary" @click="addautohorityconfirm" size='small'>确 定</el-button>
            </span>
        </el-dialog>

    </section>
</template>
<script>
import userlist from 'views/work/user/userList'
import autohority from 'views/work/user/authorityList'
import api from 'api/work'


export default {
    name: 'user',
    data() {
        return {
            activeName: 'first',
            first: true,
            second: false,
            addusertext: '',
            addautohoritytext: '',
            addautohority: false,
            adduser: false,
            add: [
                // {
                //     value: 'HTML',
                //     label: 'HTML'
                // },
                // {
                //     value: 'CSS',
                //     label: 'CSS'
                // },
                // {
                //     value: 'JavaScript',
                //     label: 'JavaScript'
                // }
            ],
            addlist: [],
            role: {
                roleName: ''
            }

        }
    },
    methods: {
        clickTab(data) {
            if (data.name == 'first'){
                this.first = true
                this.second = false
            }
            if (data.name == 'second'){
                this.second = true
                this.first = false
            }
        },
        openadduser() {
            this.adduser = true
            this.addusertext = ''
            this.addlist = []

        },
        addconfirm() {
            this.adduser = false

            // console.log(this.addlist)
            let obj = {
                userName: this.addusertext,
                roleIds: this.addlist.toString()
            }

            api.postuseradd(obj).then((response)=>{
                this.getP()
                this.$refs.userList.get();
                this.$message({
                    type: 'success',
                    message: '新增用户成功！'
                });
            }).catch((error)=>{
                console.log(error)
            })
            this.activeName = 'first'
            this.$router.push('userManage')
            this.addusertext = ''
            this.addlist = []

        },
        openaddautohority() {
            this.addautohority = true
            this.addautohoritytext = ''
        },
        addautohorityconfirm() {
            this.addautohority = false

            this.role.roleName = this.addautohoritytext
            api.postroleadd(this.role).then((response)=>{
                this.addautohoritytext = ''
                this.getP()
                this.$refs.authorityList.get();
                this.$message({
                    type: 'success',
                    message: '新增权限组成功！'
                });
            }).catch((error)=>{
                console.log(error)
            })
            this.activeName = 'second'
            this.$router.push('userManage')

        },
        getP() {
            api.getrolelist().then((response) => {
                // console.log(response.data.list)
                this.add = response.data.list
                // console.log(this.authority)
            })
        }
    },
    components: {
        userlist,
        autohority
    },
    created() {
        this.getP()
    }

}
</script>
<style scoped>
    /* 顶部 */
    .uesr_box{
        display: flex;
        justify-content: space-between;
        position: relative;
        border-bottom: 1px solid #e5e8e8;
        z-index: 10
    }
    .button_box{
        position: absolute;
        right: 10px;
        top:6px
    }
    .user_top{
        height: 46px;
        padding: 8px 0;
        width: 100%;
    }
    .user_title{
        height: 25px;
        line-height: 25px;
        margin-left: 20px;
        font-size: 15px;
        color: #5e6161
    }


</style>
