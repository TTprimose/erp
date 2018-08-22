<template>
    <section>
        <header class="edititems_header">
            <div>
                <el-breadcrumb separator='-' style="line-height:45px;font-size:15px">
                    <el-breadcrumb-item :to="{ path: '/goodsItems' }">商品分类</el-breadcrumb-item>
                    <el-breadcrumb-item>编辑分类</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </header>
        <section class="edititems_conent">
            <div class="edititems_box" :style="{height: $store.state.home.modelContentHeight-23 + 'px'}">
                <!-- conents -->
                <el-form :model="msg" ref="numberValidateForm">
                    <el-form-item label="分类名称" required :label-width="formLabelWidth">
                        <el-input v-model="msg.categoryName" type='text' suffix-text='0/15' size='small' style="width:338px"></el-input>
                    </el-form-item>
                    <el-form-item label="分类图片" :label-width="formLabelWidth" class="img_up">
                        <el-upload
                            :action="upDateImgUrl"
                            :data='sentData'
                            :limit='1'
                            :file-list='fileList'
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-success='handleAvatarSuccess'>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <!-- action上传地址 -->
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item required label="排序" prop='sort' :label-width="formLabelWidth"  :rules="[
                        { type: 'number', message: '排序必须为数字值'}
                    ]">
                        <el-input v-model.number="msg.sort" placeholder="数值越大越靠前"  size='small' style="width:338px"></el-input>
                    </el-form-item>
                    <el-form-item label="是否显示" required :label-width="formLabelWidth"  >
                        <el-switch
                            v-model="msg.isDisplay">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </div>
        </section>
        <footer class="edititems_footer">
            <el-button size='small' type='primary' style="width:90px" @click="trueconfim">保存</el-button>
            <el-button size='small' style="width:90px" @click='returnitems'>返回</el-button>
        </footer>
    </section>
</template>
<script>
import api from 'api/goods'

export default {
    data() {
        return {
            msg: {
                id: '',
                parentId: '',
                categoryName: '',
                isDisplay: '',
                sort: ''
            },
            fileList:[
                {
                    url:''
                }
            ],
            formLabelWidth: '120px',
            // 上传
            dialogVisible: false,
            dialogImageUrl: '',
            upDateImgUrl: process.env.API_ROOT + '/f/upload',
            sentData: {
                file: '',
                uploadType: 'erp'
            }

        }
    },
    methods: {
        handleRemove(file, fileList) {
            // console.log(file, fileList);
            for (var i in this.fileList){
                if (this.fileList[i].url == file.url){

                    this.fileList.splice(i, 1)
                }
            }
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleAvatarSuccess(file, fileList) {
            this.fileList.push(fileList.response.data)
            // console.log(fileList)
        },
        returnitems() {
            this.msg = {
                id: '',
                parentId: '',
                categoryName: '',
                isDisplay: '',
                sort: ''
            }
            this.$router.go(-1)
        },
        trueconfim() {
            if (this.msg.isDisplay == true){
                this.msg.isDisplay = 1
            } else {
                this.msg.isDisplay = 0
            }
            var imgurl = []

            for (var i in this.fileList){
                imgurl.push(this.fileList[i].url)
            }

            let obj = {
                id: this.msg.id,
                parentId: this.msg.parentId,
                categoryImg: imgurl.toString(),
                categoryName: this.msg.categoryName,
                isDisplay: this.msg.isDisplay,
                sort: this.msg.sort
            }

            api.putitemcategoryupdate(obj).then((response)=>{
                this.msg = {}
                this.$message({
                    type: 'success',
                    message: '更新商品分类成功！'
                });
                this.$router.go(-1)
            }).catch((error)=>{
                console.log(error)
            })
        },

        get() {
            var id = this.$store.state.home.itemId

            api.getcategoryid(id).then((response)=>{
                // console.log(response)
                this.msg = response.data[0]
                if (this.msg.isDisplay == 1){
                    this.msg.isDisplay = true
                } else {
                    this.msg.isDisplay = false
                }
                // console.log(this.msg)

                if (this.msg.categoryImg.length >= this.fileList.length.length){
                    for (var a = 0 ; a < this.msg.categoryImg.length - 1; a ++){
                        let obj = {
                            url:''
                        }

                        this.fileList.push(obj)
                    }
                }


                for (var i in this.fileList){
                    this.fileList[i].url = this.msg.categoryImg
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
.edititems_header{
    height: 45px;
    width: 100%;
    padding: 0 30px;
    display: flex;
    justify-content: space-between
}
.edititems_conent{
    padding:10px;
    background: #f5f5f5;
    border-top:1px solid #e6e9e9
}
.edititems_box{
    border: 1px solid #e6e9eb;
    color: #5e6161;
    background: white;
    padding: 48px 20px 0 20px;
    overflow: auto
}

/* 底部 */
.edititems_footer{
    border-top:1px solid #e5e8e8;
    padding: 12px 30px;
    background: white
}
</style>
