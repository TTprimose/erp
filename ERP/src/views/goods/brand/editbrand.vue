<template>
    <section>
        <header class="addbrand_header">
            <div>
                <el-breadcrumb separator='-' style="line-height:45px;font-size:15px">
                    <el-breadcrumb-item :to="{ path: '/goodsBrand' }">商品品牌</el-breadcrumb-item>
                    <el-breadcrumb-item>编辑品牌</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </header>
        <section class="addbrand_conent">
            <div class="addbrand_box" :style="{height: $store.state.home.modelContentHeight-23 + 'px'}">
                <!-- conents -->
                <el-form ref="editbrand" :rules="rules" :model="from" >
                    <el-form-item prop='brandName' label='品牌名称' :label-width='formLabelWidth' >
                        <el-input type='text' suffix-text='0/15'  size='small' style="width:338px" v-model="from.brandName"></el-input>
                    </el-form-item>
                    <el-form-item label="关联分类" required :label-width="formLabelWidth" >
                        <el-select
                            placeholder="请选择"
                            size='small'
                            style="width:338px"
                            v-model="items"

                            multiple
                            filterable
                            allow-create
                            default-first-option>
                            <el-option
                                v-for="item in itemoptions"
                                :key="item.id"
                                :label="item.categoryName"
                                :value="item.categoryName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label='服务费率' required :label-width='formLabelWidth'  v-for="(date,index) in items" :key='index'>
                        <el-input type='text' @keyup.native="costInputEvent(index)" @change="costInputEvent(index)" size='small' style="width:338px" v-model="text[index]" :placeholder='date'>
                            <template slot="append"> ‰</template>
                        </el-input>
                    </el-form-item> -->
                    <el-form-item label="品牌LOGO" :label-width="formLabelWidth" class="img_up">
                        <el-upload
                            :action="this.upDateImgUrl"
                            :data='sentData'
                            :file-list='fileList'
                            list-type="picture-card"
                            :limit='1'
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-success='handleAvatarSuccess'>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <!-- action上传地址 -->
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="this.dialogImg" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="排序" prop='sort' :label-width="formLabelWidth" :rules="[
                        { type: 'number', message: '排序必须为数字值'}
                    ]" >
                        <el-input  placeholder="数值越大越靠前"  size='small' style="width:338px" v-model.number="from.sort"></el-input>
                    </el-form-item>
                    <el-form-item  label="控货品牌" :label-width="formLabelWidth" >
                        <el-checkbox v-model="from.isControl" @change="changes">勾选为控货品牌</el-checkbox>
                    </el-form-item>
                    <el-form-item label="控货门店" :label-width="formLabelWidth" v-if='showhiddden'>
                        <el-select
                            v-model="groupName"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            placeholder="请选择控货门店"
                            size='small'
                            style="width:338px">
                            <el-option
                            v-for="item in group"
                            :key="item.id"
                            :label="item.groupName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否推荐" required :label-width="formLabelWidth" >
                        <el-switch
                            v-model="from.isRecommended">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </div>
        </section>
        <footer class="addbrand_footer">
            <el-button type="primary" size='small' style="width:90px" @click='trueconfim' v-perss="'修改商品品牌'">保存</el-button>
            <el-button size='small' style="width:90px" @click="returnprev">返回</el-button>
        </footer>
    </section>
</template>
<script>
import api from 'api/goods'
export default {
    data() {
        return {
            // 上传
            dialogVisible: false,
            formLabelWidth: '120px',

            from: {},

            value: '',
            options: [],
            text:[],

            items:[],
            itemoptions:[],

            // 是否出现门店
            showhiddden: false,

            group: [],
            groupName: [],

            rules: {
                brandName: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' }
                ]
            },

            upDateImgUrl: process.env.API_ROOT + '/f/upload',
            sentData: {
                file: '',
                uploadType: 'erp'
            },
            fileList:[
                {
                    url:''
                }
            ],
            dialogImg:''

        }
    },
    methods: {
        // costInputEvent(index){
        //     if (typeof this.text[index] != 'undefined') {
        //         // this.$set(this.text, index, this.text[index].replace(/[^\d\.]/g, ''))
        //         // this.$set(this.text, index, this.text[index].replace(/\b(0+)/gi, ''))

        //         if (this.text[index] > 1000) {
        //             this.text[index] = 1000
        //         }
        //         if (this.text[index] < 0) {
        //             this.text[index] = 0
        //         }
        //     }
        // },
        // addbrandSelectChange(){
        //     // this.items.forEach((item, index) => {
        //     //     if (typeof this.text[index] == 'undefined') {
        //     //         this.text[index] = ''
        //     //     }
        //     // });
        // },
        // 上传
        handleRemove(file, fileList) {
            // console.log(file, fileList);
            for (var i in this.fileList){
                if (this.fileList[i].url == file.url){

                    this.fileList.splice(i, 1)
                }
            }
        },
        handlePictureCardPreview(file) {
            this.dialogImg = file.url;
            this.dialogVisible = true;
        },
        handleAvatarSuccess(file, fileList) {
            this.fileList.push(fileList.response.data)
        },
        trueconfim() {

            this.$refs['editbrand'].validate((valid)=>{
                if (valid){

                    if (this.from.isControl == true){
                        this.from.isControl = 1
                    } else {
                        this.from.isControl = 0
                    }

                    if (this.from.isRecommended == true){
                        this.from.isRecommended = 1
                    } else {
                        this.from.isRecommended = 0
                    }

                    this.from.itemBrandCategories = []

                    if (this.text.length >= this.from.itemBrandCategories.length){
                        for (var a = 0 ; a < this.text.length; a ++){
                            let obj = {
                                itemCategoryId:'',
                                categoryName:'',
                                rate:''
                            }

                            this.from.itemBrandCategories.push(obj)
                        }
                    }

                    // for (var i in this.items){
                    //     let reg = /^[0-9]+(.[0-9]{1,3})?$/;

                    //     if (!reg.test(this.text[i])) {
                    //         this.$message({
                    //             type: 'warning',
                    //             duration: 1500,
                    //             showClose: true,
                    //             message: '服务费率请输入数字'
                    //         })
                    //         return false;
                    //     }
                    //     if (this.text[i] == '' && this.text[i] != 0) {
                    //         this.$message({
                    //             type: 'warning',
                    //             duration: 1500,
                    //             showClose: true,
                    //             message: '服务费率不能为空'
                    //         })
                    //         return
                    //     }
                    //     this.from.itemBrandCategories[i].categoryName = this.items[i]
                    //     this.from.itemBrandCategories[i].rate = this.text[i]
                    // }

                    for (var y in this.itemoptions){
                        for (var x in this.from.itemBrandCategories){
                            if (this.from.itemBrandCategories[x].categoryName == this.itemoptions[y].categoryName){
                                this.from.itemBrandCategories[x].itemCategoryId = this.itemoptions[y].id
                            }
                        }
                    }

                    var imgurl = []

                    for (var b in this.fileList){
                        imgurl.push(this.fileList[b].url)
                    }

                    let obj = {
                        id: this.from.id,
                        brandName: this.from.brandName,
                        isControl: this.from.isControl,
                        rateList: JSON.stringify(this.from.itemBrandCategories),
                        brandImg: imgurl.toString(),
                        sort: this.from.sort,
                        isRecommended: this.from.isRecommended,
                        shopGroupIds:this.groupName.toString()
                    }

                    api.putitemitemBrandupdate(obj).then((response)=>{
                        this.group = []
                        this.groupName = []
                        this.options = []
                        this.from = {}
                        this.$message({
                            type: 'success',
                            message: '更新商品品牌成功！'
                        });
                        this.$router.go(-1)
                    }).catch((error)=>{
                        console.log(error)
                    })
                }

            })

        },
        returnprev() {
            this.$router.go(-1)
        },
        changes() {
            if (this.from.isControl == true){
                this.showhiddden = true
            } else {
                this.showhiddden = false
            }
        },
        get() {
            var id = this.$store.state.home.brandId

            api.getcategorylist().then((response)=>{

                this.itemoptions = response.data
            }).catch((error)=>{
                console.log(error)
            })

            api.getitemBrandid(id).then((response)=>{
                // console.log(response)
                this.from = response.data
                this.items = []
                this.text = []
                this.groupName = []
                this.fileList = [
                    {
                        url: ''
                    }
                ]
                if (this.from.isRecommended == 1){
                    this.from.isRecommended = true
                } else {
                    this.from.isRecommended = false
                }
                if (this.from.isControl == 1){
                    this.from.isControl = true
                    this.showhiddden = true
                } else {
                    this.from.isControl = false
                    this.showhiddden = false
                }
                // for (var i in this.from.itemBrandCategories){
                //     this.text.push(this.from.itemBrandCategories[i].rate)
                // }
                for (var y in this.from.itemBrandCategories){
                    this.items.push(this.from.itemBrandCategories[y].categoryName)
                }
                for (var z in this.from.itemBrandShopGroups){
                    this.groupName.push(this.from.itemBrandShopGroups[z].groupId)
                }

                if (this.from.brandImg.length > this.fileList.length.length){
                    for (var a = 0 ; a < this.from.brandImg.length ; a ++){
                        let obj = {
                            url:''
                        }

                        this.fileList.push(obj)
                    }
                }

                // for (var t in this.fileList){
                this.fileList[0].url = this.from.brandImg
                // }
            }).catch((error)=>{
                console.log(error)
            })

            let obj = {
                pageNo:1,
                pageSize:50
            }

            api.getshopgrouplist(obj).then((response)=>{
                // console.log(response)
                this.group = response.data.list
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
        // this.$refs['editbrand'].resetFields();
    }
}
</script>
<style scoped>
/* 顶部 */
.addbrand_header{
    height: 45px;
    width: 100%;
    padding: 0 30px;
    display: flex;
    justify-content: space-between
}
.addbrand_conent{
    padding:10px;
    background: #f5f5f5;
    border-top:1px solid #e6e9e9
}
.addbrand_box{
    border: 1px solid #e6e9eb;
    color: #5e6161;
    background: white;
    padding: 48px 20px 0 20px;
    overflow: auto
}
/* 底部 */
.addbrand_footer{
    border-top:1px solid #e5e8e8;
    padding: 12px 30px;
    background: white
}
</style>
