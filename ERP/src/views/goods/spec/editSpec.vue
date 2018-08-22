<template>
    <section :style="{height: $store.state.home.modelContentHeight + 'px'}">
        <header class="edit_header">
            <el-breadcrumb separator='-' style="line-height:45px;font-size:15px">
                <el-breadcrumb-item :to="{ path: '/goodsSpec' }">商品规格</el-breadcrumb-item>
                <el-breadcrumb-item>编辑规格</el-breadcrumb-item>
            </el-breadcrumb>
        </header>
        <section class="edit_conent" >
            <div class="edit_box AEgoods_box" :style="{height: $store.state.home.modelContentHeight-23 + 'px'}">
                <el-form ref="edit" label-width="100px">
                    <el-form-item v-model="editNum" label="规格名称" required>
                        <el-input v-model="editNum.skuPropertyName" style="width:338px" size='small'></el-input>
                    </el-form-item>
                    <el-form-item label="规格值" required :style="{height: (this.length)*51 + 'px'}" >
                        <el-table
                            :data='editNum.propertyValueList'
                            border
                            style="width:658px">
                            <el-table-column
                                width='55'>
                                <template slot-scope="scope">
                                    <div class="icon_box" style="height:50px;line-height:50px;margin-left:10px">
                                        <i class="el-icon-plus" style="font-weight:700" @click="addEditnum"></i>
                                        <!-- <i class="el-icon-minus" style="margin-left:5px;font-weight:700" @click="removeTypesnum(edit)"></i> -->
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="skuPropertyValueName"
                                label="规格值"
                                width="425">
                                <template slot-scope="scope">
                                    <div>
                                        <el-input v-model="scope.row.skuPropertyValueName" placeholder="输入规格名称" size='small' style="width:388px"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop='enableStatus'
                                label='是否启用'>
                                <template slot-scope="scope">
                                    <el-switch
                                        @change="switchChangeEvent(scope.row)"
                                        :active-value="1"
                                        :inactive-value="0"
                                        v-model="scope.row.enableStatus">
                                    </el-switch>
                                </template>
                            </el-table-column>
                        </el-table>

                    </el-form-item>
                    <el-form-item label="备注" class="other_text" v-model="editNum">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 4}"
                            style="width:658px"
                            v-model="editNum.remark">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </section>
        <footer class="edit_footer">
            <el-button type="primary" size='small' @click='trueconfim' style="width:90px">保存</el-button>
            <el-button size='small' @click='returnPrev' style="width:90px">取消</el-button>
        </footer>
    </section>
</template>
<script>
import api from 'api/goods'
// import bus from '@/assets/eventBus.js'

export default {
    data() {
        return {
            // 规格值
            editNum: [
                // {
                //     editname: '',
                //     bolean: '',
                //     value1: true,
                //     value2: true
                // }
            ],

            length: '1'

        }
    },
    methods: {
        switchChangeEvent(row){
            var obj = {
                id: row.id,
                enableStatus: row.enableStatus
            }

            api.setSkuPropertyStatus(obj).then((response) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '商品规格状态修改成功!'
                })

            })
        },
        addEditnum() {
            let obj = {
                skuPropertyValueName: '',
                enableStatus: 0
            }

            this.editNum.propertyValueList.push(obj)
            this.length = this.editNum.propertyValueList.length
        },
        // removeEditnum(data) {
        //     if (this.editNum.length > 1){
        //         this.editNum.splice(data.$index, 1)
        //     }
        // },
        returnPrev() {
            this.editNum = []
            this.$router.go(-1)
        },
        trueconfim() {
            var skuPropertyNameFlg = false

            for (var i in this.editNum.propertyValueList){
                // if (this.editNum.propertyValueList[i].enableStatus == true){
                //     this.editNum.propertyValueList[i].enableStatus = 1
                // } else {
                //     this.editNum.propertyValueList[i].enableStatus = 0
                // }

                if (this.editNum.propertyValueList[i].skuPropertyValueName == "") {
                    skuPropertyNameFlg = true
                }
            }

            if (skuPropertyNameFlg) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '规格值不能为空'
                });
                return
            }

            let obj = {
                id: this.editNum.id,
                skuPropertyName: this.editNum.skuPropertyName,
                remark: this.editNum.remark,
                itemSkuPropertyValueDTOS: this.editNum.propertyValueList
            }

            api.putitemskuPropertyupdate(obj).then((response)=>{
                this.editNum = []
                this.$message({
                    type: 'success',
                    message: '更新商品规格成功！'
                });
                this.$router.go(-1)
            }).catch((error)=>{
                console.log(error)
            })

        }
    },
    created() {
        var msg = this.$store.state.home.specMsg


        api.getitemskupropertyid(msg).then((response)=>{

            this.editNum = response.data
            this.length = this.editNum.propertyValueList.length
            // for (var i in this.editNum.propertyValueList){
            //     if (this.editNum.propertyValueList[i].enableStatus == 1){
            //         this.editNum.propertyValueList[i].enableStatus = true
            //     } else {
            //         this.editNum.propertyValueList[i].enableStatus = false
            //     }
            // }
            // console.log(response.data)
        }).catch((error)=>{
            console.log(error)
        })
    },
    activated() {
        var msg = this.$store.state.home.specMsg

        api.getitemskupropertyid(msg).then((response)=>{
            // console.log(response)
            this.editNum = response.data
            this.length = this.editNum.propertyValueList.length
            // alert(this.length)
            // for (var i in this.editNum.propertyValueList){
            //     if (this.editNum.propertyValueList[i].enableStatus == 1){
            //         this.editNum.propertyValueList[i].enableStatus = true
            //     } else {
            //         this.editNum.propertyValueList[i].enableStatus = false
            //     }
            // }

        }).catch((error)=>{
            console.log(error)
        })
    }

}
</script>
<style scoped>
/* 顶部 */
.edit_header{
    height: 45px;
    width: 100%;
    padding: 0 30px;

}
/* 内容 */
.edit_conent{
    padding:10px;
    background: #f5f5f5;
    border-top:1px solid #e6e9e9;
    overflow: hidden;
}
.edit_box{
    border: 1px solid #e6e9eb;
    color: #5e6161;
    background: white;
    padding: 30px;
    overflow: auto;
}
.edit_box .el-form-item{
    height: 50px
}
.edit_box .el-form-item:nth-child(3){
    margin-top:60px
}

/* 底部 */
.edit_footer{
    border-top:1px solid #e5e8e8;
    padding: 11px 30px;
    /* margin-top: -23px; */
    background: white
}

</style>
