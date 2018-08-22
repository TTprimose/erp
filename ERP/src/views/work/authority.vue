<template>
    <section :style="{height: $store.state.home.modelContentHeight + 'px'}">
        <!-- 顶部 -->
        <header class="authority_top">
            <p class='authority_title'>权限管理</p>
        </header>
        <section class="authority_conent" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="authority_box" :style="{height: $store.state.home.modelContentHeight-20 + 'px'}">
                <div class="box_title">系统按钮</div>
                <div style="display:flex">
                    <div class="small_title">权限组名</div>
                    <div>
                        <p class="small_name">{{username}}</p>
                        <el-tree
                            ref='tree'
                            :data="item"
                            show-checkbox
                            node-key="id"
                            :props="defaultProps"
                            style="margin-top:-5px">
                        </el-tree>
                    </div>
                </div>
            </div>
        </section>
        <footer class="authority_bottom">
            <el-button type="primary" size='small' style="margin:10px 0 0 30px ;width:90px" @click="trueconfim">保存</el-button>
            <el-button size='small' style="margin:10px 0 0 10px ; width:90px" @click='prevuser'>取消</el-button>
        </footer>
    </section>
</template>
<script>
import api from 'api/work'

export default {
    data() {
        return {
            item: [],
            defaultProps: {
                children: 'childMenus',
                label: 'resourceName'
            },

            userid: '',
            username: ''
        }
    },
    methods: {
        prevuser() {
            this.$router.push('userManage')
        },
        trueconfim() {

            var resourceId = this.$refs.tree.getCheckedKeys()
            var resourceId2 = this.$refs.tree.getHalfCheckedKeys()
            // var resourceId3 = resourceId.concat(resourceId2)

            // console.log(resourceId, 1)
            // console.log(resourceId2, 2)

            let obj = {
                roleId: this.userid,
                roleName: this.username,
                selectResourceIds:resourceId.toString(),
                unSelectResourceIds: resourceId2.toString()
            }

            // console.log(obj)
            api.postrolesetaccess(obj).then((response)=>{
                this.$message({
                    type: 'success',
                    message: '配置权限成功！'
                });
                this.$router.go(-1)
            }).catch((error)=>{
                console.log(error)
            })

        },
        get() {
            api.getresourcelist().then((response)=>{
                // console.log(response.data)
                this.item = response.data
            }).catch((error)=>{
                console.log(error)
            })
        },
        have() {

            api.getuserstatus(this.userid).then((response)=>{
                // console.log(response)
                this.$refs.tree.setCheckedKeys(response.data.selectResourceIds);

            }).catch((error)=>{
                console.log(error)
            })
        }
    },
    created() {
        this.userid = this.$store.state.home.userId
        this.username = this.$store.state.home.userName
        this.get()
        this.have()
    },
    activated() {
        this.userid = this.$store.state.home.userId
        this.username = this.$store.state.home.userName
        this.get()
        this.have()
    }
}
</script>
<style scoped>
/* 顶部 */
.authority_top{
    display: flex;
    justify-content: space-between;
    height: 46px;
    padding: 10px;
    border-bottom: 1px solid #e5e8e8
}
.authority_title{
    height: 25px;
    line-height: 25px;
    margin-left: 20px;
    font-size: 15px;
    color: #5e6161
}

/* 内容 */
.authority_conent{
    padding: 10px;
    background: #f5f5f5
}
.authority_box{
    border: 1px solid #e6e9eb;
    color: #5e6161;
    background: white;
    overflow: auto
}
.box_title{
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    font-weight: 600;
    border-bottom: 1px solid #e5e8e8;
    background: #f5f5f5
}
.small_title{
    height: 40px;
    line-height: 40px;
    padding:0 20px;
    margin-top:15px;
}
.small_name{
    height: 40px;
    line-height: 40px;
    padding:0 20px;
    margin-top:15px;
    font-size: 15px;
    font-weight: 600
}
/* 底部 */
.authority_bottom{
    border-top:1px solid #e5e8e8;
    position: relative;

    background: white;
}
</style>
