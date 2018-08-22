<template>
    <section :style="{height: $store.state.home.modelContentHeight + 'px'}">
        <header class="addTypes_header">
            <el-breadcrumb separator='-' style="line-height:45px;font-size:15px">
                <el-breadcrumb-item :to="{ path: '/goodsTypes' }">包装类型</el-breadcrumb-item>
                <el-breadcrumb-item>新增类型</el-breadcrumb-item>
            </el-breadcrumb>
        </header>
        <section class="addTypes_conent" >
            <div class="addTypes_box AEgoods_box" :style="{height: $store.state.home.modelContentHeight-23 + 'px'}">
                <el-form ref="types"  label-width="100px">
                    <el-form-item label="规格名称" required v-model="unitId" >
                        <el-select v-model="unitId" placeholder="请选择" style="width:338px" size='small'>
                            <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.unitMsg"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规格值" required :style="{height: (typesNum.length)*50 + 'px'}">
                        <el-table
                            :data='typesNum'
                            border
                            style="width:578px">
                            <el-table-column
                                width='55'>
                                <template slot-scope="scope">
                                    <div class="icon_box" style="height:50px;line-height:50px">
                                        <i class="el-icon-plus" style="font-weight:700" @click="addTypesnum(scope)"></i>
                                        <i class="el-icon-minus" style="margin-left:5px;font-weight:700" @click="removeTypesnum(scope)"></i>
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- 规格值 -->
                            <el-table-column
                                prop="supplyMsg"
                                label="规格值"
                                width="410">
                                <template slot-scope="scope">
                                    <div>
                                        <el-input @change="supplyMsgInputEvent" v-model="scope.row.supplyMsg" placeholder="输入规格名称" size='small' style="width:388px"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- 商品数量 -->
                            <el-table-column
                                prop="skuNumber"
                                label="含商品数量">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.skuNumber" size='small'></el-input>
                                </template>
                            </el-table-column>
                            <!-- 是否启用 -->
                            <!-- <el-table-column
                                prop='enableStatus'
                                label='是否启用'
                                width="80">
                                <template slot-scope="scope">
                                    <el-switch
                                        :active-value="1"
                                        :inactive-value="0"
                                        v-model="scope.row.enableStatus">
                                    </el-switch>
                                </template>
                            </el-table-column> -->
                        </el-table>
                    </el-form-item>
                    <el-form-item label="备注" class="other_text" >
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 4}"
                            style="width:658px"
                            v-model="text">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </section>
        <footer class="addTypes_footer">
            <el-button type="primary" size='small' @click='trueconfim' style="width:90px">保存</el-button>
            <el-button size='small' @click='returnPrev' style="width:90px">取消</el-button>
        </footer>
    </section>
</template>
<script>
import api from 'api/goods'

export default {
    data() {
        return {
            // 规格值
            typesNum: [

                {
                    skuNumber: '',
                    supplyMsg: '',
                    enableStatus: 0,
                    id:''
                }
            ],
            options: [],
            value: '',
            text: '',
            unitId: []
        }
    },
    methods: {
        supplyMsgInputEvent(value){
            var i = 0

            this.typesNum.forEach((item, index) => {
                if (item.supplyMsg == value) {
                    i++
                }
            });

            if (i >= 2) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '规格值重复!'
                })
            }
        },
        addTypesnum() {
            let obj = {
                skuNumber: '',
                supplyMsg: '',
                enableStatus: 0
            }

            this.typesNum.push(obj)
        },
        removeTypesnum(data) {
            if (this.typesNum.length > 1){
                this.typesNum.splice(data.$index, 1)
            }
        },
        returnPrev() {
            this.typesNum = [
                {
                    skuNumber: '',
                    unitMsg: '',
                    enableStatus: 0
                }
            ]
            this.typesNum.unitId = ''
            this.typesNum.remark = ''
            this.value = ''
            this.$router.go(-1)
        },
        trueconfim() {

            // console.log(num)
            let obj = {
                unitId: this.unitId,
                remark: this.text,
                itemSupplyPropertyValueForms: JSON.stringify(this.typesNum)
            }

            api.postitemsupplyPropertyadd(obj).then((response)=>{
                this.typesNum = [
                    {
                        skuNumber: '',
                        supplyMsg: '',
                        enableStatus: 0,
                        id:''
                    }
                ]
                this.text = ''
                this.value = ''
                this.$message({
                    type: 'success',
                    message: '新增包装类型成功！'
                });
                this.$router.go(-1)
            }).catch((error)=>{
                console.log(error)
            })

        },

        get() {
            api.getitemunitlist().then((response)=>{
                this.options = response.data.list
                // console.log(response)
            }).catch((error)=>{
                console.log(error)
            })

            this.typesNum = [
                {
                    skuNumber: '',
                    supplyMsg: '',
                    enableStatus: 0,
                    id:''
                }
            ]
            this.text = ''
            this.value = ''
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
.addTypes_header{
    height: 45px;
    width: 100%;
    padding: 0 30px;

}
/* 内容 */
.addTypes_conent{
    padding:10px;
    background: #f5f5f5;
    border-top:1px solid #e6e9e9;
    overflow: hidden;
}
.addTypes_box{
    border: 1px solid #e6e9eb;
    color: #5e6161;
    background: white;
    padding: 30px;
}
.addTypes_box .el-form-item{
    height: 50px
}
.addTypes_box .el-form-item:nth-child(3){
    margin-top:60px
}


/* 底部 */
.addTypes_footer{
    border-top:1px solid #e5e8e8;
    padding: 11px 30px;
    /* margin-top: -23px; */
    background: white
}

</style>
