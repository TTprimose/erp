<template>
    <section :style="{height: $store.state.home.modelContentHeight + 'px'}">
        <!-- 顶部 -->
        <header class="configuration_top">
            <p class='configuration_title'>流程配置</p>
        </header>
        <section class="configuration_conent" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="configuration_box" :style="{height: $store.state.home.modelContentHeight-20 + 'px'}">
                <div class="box_title">{{this.shuname}}</div>
                <div class="add_box" v-for="(item,index) in num" :key="index">
                    <el-button icon="el-icon-plus" circle @click='addbox'></el-button>
                    <el-select
                        v-model="item.namelist"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        size='small'
                        style="width:388px;margin-left:20px"
                        @change="change()">
                        <el-option
                            v-for="date in name"
                            :key="date.id"
                            :label="date.userName"
                            :disabled="date.disabled"
                            :value="date.id">
                        </el-option>
                    </el-select>
                    <i class="el-icon-close closethat" style="margin-left:10px" @click="closethat(index)"></i>
                </div>
            </div>
        </section>
        <footer class="configuration_bottom">
            <el-button type="primary" size='small' style="margin:10px 0 0 30px ;width:90px" @click='trueconfim'>保存</el-button>
            <el-button  size='small' style="margin:10px 0 0 10px;width:90px" @click="returnprev">取消</el-button>
        </footer>
    </section>
</template>
<script>
import api from 'api/work'

export default {
    name: 'configuration',
    data() {
        return {
            name: [],
            // 流程ID
            shu: '',
            // 流程名称
            shuname: '',

            num: [
                {
                    namelist: []
                }
            ],

            update:[],

            upname:[
                {
                    idname:[]
                }
            ],

            date:[],

            options:[]

        }
    },
    methods: {
        addbox() {
            let obj = {
                namelist: []
            }

            let obje = {
                idname: []
            }

            this.num.push(obj)
            this.upname.push(obje)

            this.change()
        },
        closethat(data) {

            if (this.num[data].namelist.length != 0){
                this.options = []
                for (var i in this.num[data].namelist){
                    if (JSON.stringify(this.options).indexOf(this.num[data].namelist[i]) == -1){
                        this.options.push(this.num[data].namelist[i])
                    }
                }
                for (var a in this.name){
                    for (var b in this.options){
                        if (this.options[b] == this.name[a].id){
                            this.name[a].disabled = false
                        }
                    }
                }

            }

            if (this.num.length > 1){
                this.num.splice(data, 1)
            }
        },
        trueconfim() {

            for (var q in this.num){

                for (var w in this.num[q].namelist){

                    for (var e in this.name){

                        if (this.num[q].namelist[w] == this.name[e].id){

                            this.upname[q].idname.push(this.name[e].userName)

                        }

                    }
                }
            }

            var a = 0
            var b = 0

            for (var i in this.num){
                a++

                for (var k in this.num[i].namelist){

                    if (a == this.num.length){
                        b = 1
                    }
                    let obj = {
                        reviewProcessUserId: this.num[i].namelist[k],
                        reviewProcessUserName: this.upname[i].idname[k],
                        reviewProcessSort: a,
                        isFinal: b
                    }

                    this.update.push(obj)

                }

            }

            let obj = {
                reviewProcessId: this.shu,
                reviewProcessItems: JSON.stringify(this.update)
            }

            api.postprocesssetreview(obj).then((response)=>{
                this.num = [
                    {
                        namelist: []
                    }
                ]
                this.idname = [
                    {
                        idname: []
                    }
                ]
                this.update = []
                this.id = ''
                this.$router.go(-1)
                this.$message({
                    type: 'success',
                    message: '流程配置成功'
                });
            }).catch((error)=>{
                console.log(error)
            })
        },
        returnprev() {
            this.$router.go(-1)
        },
        get() {
            api.getuseruserList().then((response)=>{
                this.name = response.data
                console.log(response)
                for (var s in this.name){
                    this.name[s].disabled = false
                }

                // console.log(this.name)
            }).catch((error)=>{
                console.log(error)
            })


        },
        list() {
            api.getprocessmoreid(this.shu).then((response)=>{
                console.log(response, 1)
                this.num = [
                    {
                        namelist: []
                    }
                ]
                this.idname = [
                    {
                        idname: []
                    }
                ]
                this.update = []
                this.id = ''

                this.date = response.data

                for (let y in this.date){
                    for (let z in this.name){
                        if (this.date[y].reviewProcessUserId == this.name[z].id){
                            this.name[z].disabled = true
                        }
                    }

                }
                // console.log(this.date)
                var a = this.date[this.date.length - 1].reviewProcessSort

                for (var i = 0 ; i <= a - 1 ;i ++){
                    let obj = {
                        namelist: []
                    }

                    let obje = {
                        idname: []
                    }

                    this.num.push(obj)
                    this.upname.push(obje)

                    for (var k = 0 ; k < this.date.length; k ++){

                        if (this.date[k].reviewProcessSort == i + 1){

                            this.num[i].namelist.push(this.date[k].reviewProcessUserId)
                            this.upname[i].idname.push(this.date[k].reviewProcessUserName)

                        }
                    }

                }

                this.num.splice(this.num.length - 1, 1)


            }).catch((error)=>{
                console.log(error)
            })
        },
        change() {
            this.options = []
            for (var i in this.num){
                for (var k in this.num[i].namelist){
                    if (JSON.stringify(this.options).indexOf(this.num[i].namelist[k]) == -1){
                        this.options.push(this.num[i].namelist[k])
                    }
                }
            }
            for (var a in this.name){
                this.name[a].disabled = false
                for (var b in this.options){
                    if (this.options[b] == this.name[a].id){
                        this.name[a].disabled = true
                    }
                }
            }
        }

    },

    created() {
        this.shu = this.$store.state.home.flowId
        this.shuname = this.$store.state.home.flowName
        this.get()
        this.list()

    },
    activated() {
        this.shu = this.$store.state.home.flowId
        this.shuname = this.$store.state.home.flowName
        this.get()
        this.list()
    }
}
</script>
<style scoped>
/* 顶部 */
.configuration_top{
    display: flex;
    justify-content: space-between;
    height: 46px;
    padding: 10px;
    border-bottom: 1px solid #e5e8e8
}
.configuration_title{
    height: 25px;
    line-height: 25px;
    margin-left: 20px;
    font-size: 15px;
    color: #5e6161
}

/* 内容 */
.configuration_conent{
    padding: 10px;
    background: #f5f5f5
}
.configuration_box{
    border: 1px solid #e6e9eb;
    color: #5e6161;
    background: white
}
.box_title{
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    font-weight: 600;
    border-bottom: 1px solid #e5e8e8;
    background: #f5f5f5
}
.add_box{
    padding: 20px
}
.closethat:hover{
    font-size: 14px
}

/* 底部 */
.configuration_bottom{
    border-top:1px solid #e5e8e8;
    position: relative;

    background: white;
}
</style>
