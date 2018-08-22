<template>
    <div id="editPassWordWrap">
        <div class="model_topcol">
            <span>修改密码</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <el-form ref="passwordForm" status-icon :model="formData" :rules="rules" label-position="right" size="small" label-width="90px">
                    <el-form-item prop="oldWord" label="原密码">
                        <el-input type="password" style="width: 350px" v-model="formData.oldWord" placeholder="请输入原密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="newWord" label="新密码">
                        <el-input type="password" style="width: 350px" v-model="formData.newWord" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="newWord2" label="确认新密码">
                        <el-input type="password" style="width: 350px" v-model="formData.newWord2" placeholder="请确认新密码"></el-input>
                    </el-form-item>
                </el-form>


            </div>
        </div>
        <div class="model_footer">
            <el-button @click="saveEvent" type="primary" size="small" style="width: 90px; margin-left: 25px;">确认修改</el-button>
            <el-button v-RouterBack size="small" style="width: 90px; margin-left: 25px;">取 消</el-button>
        </div>
    </div>
</template>

<script>
import api from 'api/work'
export default {
    data() {
        var checkOldWord = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("请输入密码"));
            } else {
                return callback()
            }
        };

        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入新密码"));
            } else {
                if (this.formData.newWord !== "") {
                    this.$refs.passwordForm.validateField("newWord2");
                }
                callback();
            }
        };

        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请确认新密码"));
            } else if (value !== this.formData.newWord) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };

        return {
            formData: {
                oldWord: "",
                newWord: "",
                newWord2: ""
            },
            rules: {
                newWord: [{ validator: validatePass, trigger: "blur" }],
                newWord2: [{ validator: validatePass2, trigger: "blur" }],
                oldWord: [{ validator: checkOldWord, trigger: "blur" }]
            }
        };
    },
    computed: {},
    methods: {
        saveEvent(){
            this.$refs['passwordForm'].validate((valid) => {
                if (valid) {
                    var paramobj = {
                        o: this.formData.oldWord,
                        n: this.formData.newWord
                    }

                    api.editPassword(paramobj).then(() => {
                        this.$message({
                            type: 'success',
                            showClose: true,
                            duration: 1500,
                            message: '修改密码成功!'
                        });
                        this.$router.go(-1)
                    })
                }
            })
        }
    },
    created() {},
    activated(){
        this.$refs['passwordForm'].resetFields();
    },
    mounted() {}
};
</script>
<style scoped>
.model_content_inner {
  padding-top: 30px;
  padding-left: 30px;
}

.model_footer {
  text-align: left;
  padding-top: 10px;
}
</style>
