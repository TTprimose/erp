<template>
    <section :style="{height: $store.state.home.modelContentHeight + 'px'}">
        <header class="addSpec_header">
            <el-breadcrumb separator='-' style="line-height:45px;font-size:15px">
                <el-breadcrumb-item :to="{ path: '/goodsSpec' }">商品规格</el-breadcrumb-item>
                <el-breadcrumb-item>新增规格</el-breadcrumb-item>
            </el-breadcrumb>
        </header>
        <section class="addSpec_conent" >
            <div class="addSpec_box AEgoods_box" :style="{height: $store.state.home.modelContentHeight-23 + 'px', overflow: 'hidden'}">
                <el-form ref="spec"  label-width="100px">
                    <el-form-item label="规格名称" required :model="specNum">
                        <el-input v-model="skuPropertyName" style="width:338px" size='small'></el-input>
                    </el-form-item>
                    <el-form-item label="规格值" required :style="{height: (specNum.length)*50 + 'px'}">
                        <el-table
                            :data='specNum'
                            border
                            style="width:538px">
                            <el-table-column
                                width='55'>
                                <template slot-scope="scope">
                                    <div class="icon_box" style="height:50px;line-height:50px">
                                        <i class="el-icon-plus" style="font-weight:700;cursor: pointer;" @click="addSpecnum(scope)"></i>
                                        <i class="el-icon-minus" style="margin-left:5px;font-weight:700;cursor: pointer;" @click="removeSpecnum(scope)"></i>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="skuPropertyValueName"
                                label="规格值"
                                >
                                <template slot-scope="scope">
                                    <div>
                                        <el-input v-model="scope.row.skuPropertyValueName" placeholder="输入规格值" size='small' style="width:388px"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column
                                prop='enableStatus'
                                label='是否启用'>
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
                    <el-form-item :style="{height: '145px', overflow: 'hidden'}" label="备注">
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
        <footer class="addSpec_footer">
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
            text: '',
            // 规格值
            skuPropertyName:'',
            specNum: [
                {
                    skuPropertyValueName: '',
                    enableStatus: 1
                }
            ]

        }
    },
    methods: {
        addSpecnum() {
            let obj = {
                skuPropertyValueName: '',
                enableStatus: 1
            }

            this.specNum.push(obj)

        },
        removeSpecnum(data) {
            if (this.specNum.length > 1){
                this.specNum.splice(data.$index, 1)
            }
        },
        returnPrev() {
            this.specNum = [
                {
                    skuPropertyValueName: '',
                    enableStatus: 1
                }
            ]
            this.skuPropertyName = ''
            this.text = ''
            this.$router.go(-1)
        },
        trueconfim() {
            var skuPropertyNameFlg = false

            for (var i in this.specNum){
                // if (this.specNum[i].enableStatus == false){
                //     this.specNum[i].enableStatus = 0
                // }
                // if (this.specNum[i].enableStatus == true){
                //     this.specNum[i].enableStatus = 1
                // }

                if (this.specNum[i].skuPropertyValueName == "") {
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
                skuPropertyName: this.skuPropertyName,
                remark: this.text,
                itemSkuPropertyValueDTOS: this.specNum
            }

            console.log(obj)
            api.postitemskuPropertyadd(obj).then((response)=>{
                this.clear()
                this.$message({
                    type: 'success',
                    message: '新增商品规格成功！'
                });
                this.$router.go(-1)
            }).catch((error)=>{
                console.log(error)
            })

        },
        clear() {
            this.specNum = [
                {
                    skuPropertyValueName: '',
                    enableStatus: 1
                }
            ]
            this.skuPropertyName = ''
            this.text = ''
        }
    },
    created() {
        this.clear()

    },
    activated() {
        this.clear()

    }

}
</script>
<style scoped>
/* 顶部 */
.addSpec_header{
    height: 45px;
    width: 100%;
    padding: 0 30px;

}
/* 内容 */
.addSpec_conent{
    padding:10px;
    background: #f5f5f5;
    border-top:1px solid #e6e9e9;
    overflow: hidden;
}
.addSpec_box{
    border: 1px solid #e6e9eb;
    color: #5e6161;
    background: white;
    padding: 30px;
}
.addSpec_box .el-form-item{
    height: 50px
}
.addSpec_box .el-form-item:nth-child(3){
    margin-top:60px
}

/* 底部 */
.addSpec_footer{
    border-top:1px solid #e5e8e8;
    padding: 11px 30px;
    /* margin-top: -23px; */
    background: white
}

</style>
