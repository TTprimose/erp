<template>
    <div id="waitReview_Wrap">
        <div class="model_topcol">
            <span style="color: #409EFF">我已审批</span>
            <span v-if="$store.state.home.currentModelId.auditStatus == 0"> - 待审核</span>
            <span v-if="$store.state.home.currentModelId.auditStatus == 1"> - 审核中</span>
            <span v-if="$store.state.home.currentModelId.auditStatus == 2"> - 通过</span>
            <span v-if="$store.state.home.currentModelId.auditStatus == 3"> - 不通过</span>
            <span v-if="$store.state.home.currentModelId.auditStatus == 4"> - 撤回</span>
            <div>
                <el-button @click="lookBtnEvent" type="primary" size="small">查看订单</el-button>
            </div>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <div v-if="$store.state.home.currentModelId.processType == 1" class="content_title">
                    采购订单审核
                </div>
                <div v-if="$store.state.home.currentModelId.processType == 2" class="content_title">
                    退货单审核
                </div>
                <div v-if="$store.state.home.currentModelId.processType == 3" class="content_title">
                    入库单审核
                </div>
                <div v-if="$store.state.home.currentModelId.processType == 4" class="content_title">
                    出库单审核
                </div>
                <div v-if="$store.state.home.currentModelId.processType == 5" class="content_title">
                    调拨单审核
                </div>
                <div class="banner">
                    当前审核状态
                </div>
                <div class="base_info">
                    <span>提交人 : </span>
                    <span v-text="$store.state.home.currentModelId.creator"></span>
                    <br>
                    <span>提交时间 : </span>
                    <span>{{$store.state.home.currentModelId.created | time_m}}</span>
                </div>
                <div class="banner">

                </div>
                <div :style="{height: $store.state.home.modelContentHeight - 250 + 'px', overflow: 'auto'}" class="maincontent">
                    <div v-for="(item, index) in reviewRecordData" :key="item.id" class="item_wrap" :class="index == (reviewRecordData.length - 1) && $store.state.home.currentModelId.auditStatus != 0 && $store.state.home.currentModelId.auditStatus != 1 ? 'item_wrap_curr' : ''">
                        <span v-if="item.reviewProcessStatus == 0" class="item_state_pass back_gray"></span>
                        <span v-if="item.reviewProcessStatus == 1" class="item_state_pass back_brown"></span>
                        <span v-if="item.reviewProcessStatus == 2" class="item_state_pass back_gray"></span>
                        <span v-if="item.reviewProcessStatus == 3" class="item_state_pass back_red"></span>
                        <span class="color_brown" v-if="item.reviewProcessStatus == 0" style="margin-left: 15px">待审核</span>
                        <span class="color_brown" v-if="item.reviewProcessStatus == 1" style="margin-left: 15px">审核中</span>
                        <span v-if="item.reviewProcessStatus == 2" style="margin-left: 15px">审核通过</span>
                        <span class="color_red" v-if="item.reviewProcessStatus == 3" style="margin-left: 15px">审核不通过</span>
                        <br>
                        <span style="margin-left: 15px">审核人 : </span>
                        <span v-text="item.reviewProcessUserName"></span><br>
                        <span>审核时间 : </span>
                        <span>{{item.reviewProcessTime | time_m}}</span><br>
                        <span>审核意见 : </span>
                        <span v-text="item.reviewProcessRemark"></span>
                    </div>
                    <!-- <div class="item_wrap item_wrap_curr">
                        <span class="item_state_curr"></span>
                        <span class="color_brown" style="margin-left: 15px">审核中</span><br>
                        <span style="margin-left: 15px">审核人 : </span>
                        <span v-text="$store.state.home.userInfo.user.userName"> </span><br>
                        <span>审核时间 : </span>
                        <span>{{Date.parse(new Date()) / 1000 | time_m}}</span><br>
                        <el-form :inline="true" :model="formData" label-position="left" size="small" label-width="80px">
                            <el-form-item prop="maker" label="审核意见">
                                <el-input type="textarea" :rows="4" style="width: 404px" v-model="formData.maker" placeholder="请输入审核意见"></el-input>
                            </el-form-item>
                        </el-form>
                    </div> -->
                    <div v-if="$store.state.home.currentModelId.auditStatus == 0 || $store.state.home.currentModelId.auditStatus == 1" class="item_wrap item_wrap_curr">
                        <span class="item_state_pass back_brown"></span>
                        <span class="color_brown" style="margin-left: 15px">审核中</span><br>

                        <span style="margin-left: 15px" v-if="reviewManList.length != 0 && $store.state.home.currentModelId.auditStatus == 0 || $store.state.home.currentModelId.auditStatus == 1">审核人 :</span>
                        <span v-if="$store.state.home.currentModelId.auditStatus == 0 || $store.state.home.currentModelId.auditStatus == 1" v-for="item in reviewManList" :key="item.id" style="margin-left: 15px">{{item.userName}}</span>
                        <!-- <span style="margin-left: -15px" class="color_brown" v-if="reviewManList.length != 0 && $store.state.home.currentModelId.auditStatus == 0">)</span> -->
                        <br>
                        <span style="margin-left: 15px">等待时间 : </span>
                        <span style="margin-left: 15px" v-text="waitTime"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="model_footer">
            <el-button v-RouterBack size="small" style="width: 90px; margin-left: 25px;">返 回</el-button>
        </div>

    </div>

</template>

<script>
import api from 'api/review'
export default {
    data(){
        return {
            dialogVisible: false,
            reviewRecordData: [],
            localData: null, //缓存页面跳转数据,有待修改
            reviewManList: [],
            waitTime: '10: 10',
            formData: {
                maker: ''
            }
        }
    },
    computed:{},
    methods:{
        lookBtnEvent(){
            var idObj = this.localData
            var orderId = idObj.orderId

            if (idObj.processType == 1) { //采购
                this.$store.commit('setCurrentModelId', orderId)
                if (!this.myBase.isHasPerssion('采购单详情')) {
                    this.$message({
                        type: 'warning',
                        duration: 1500,
                        showClose: true,
                        message: '对不起,你没有权限,请联系管理员'
                    })
                    return
                }
                this.$router.push({
                    path: '/purchaseListDetail/' + '1'
                })
            }
            if (idObj.processType == 2) { //退货
                this.$store.commit('setCurrentModelId', orderId)
                if (!this.myBase.isHasPerssion('采购退货单详情')) {
                    this.$message({
                        type: 'warning',
                        duration: 1500,
                        showClose: true,
                        message: '对不起,你没有权限,请联系管理员'
                    })
                    return
                }
                this.$router.push({
                    path: '/lookPurchaseReject'
                })
            }
            if (idObj.processType == 3) { //入库
                if (!this.myBase.isHasPerssion('入库单详情')) {
                    this.$message({
                        type: 'warning',
                        duration: 1500,
                        showClose: true,
                        message: '对不起,你没有权限,请联系管理员'
                    })
                    return
                }
                this.$router.push({name: '出入库详情', params: {id: orderId, type: 'inbound'}})
            }
            if (idObj.processType == 4) { //出库
                if (!this.myBase.isHasPerssion('出库单详情')) {
                    this.$message({
                        type: 'warning',
                        duration: 1500,
                        showClose: true,
                        message: '对不起,你没有权限,请联系管理员'
                    })
                    return
                }
                this.$router.push({name: '出入库详情', params: {id: orderId, type: 'outbound'}})
            }
            if (idObj.processType == 5) { //调拨
                if (!this.myBase.isHasPerssion('调拨单详情')) {
                    this.$message({
                        type: 'warning',
                        duration: 1500,
                        showClose: true,
                        message: '对不起,你没有权限,请联系管理员'
                    })
                    return
                }
                this.$router.push({name: '调拨单详情', params: {id: orderId, type: '调拨'}})
            }
        },
        getReviewRecord(){
            var idObj = null

            if (this.$store.state.home.currentModelId.orderId) {
                idObj = this.$store.state.home.currentModelId
                this.localData = idObj
            } else {
                idObj = this.localData
            }

            var orderId = idObj.orderId
            var reviewProcessId = idObj.reviewProcessId
            var paramobj = {
                orderId: orderId,
                reviewProcessId: reviewProcessId
            }

            console.log(idObj)

            api.getReviewRecord(paramobj).then((response) => {
                this.reviewRecordData = response.data.list

                this.reviewManList = response.data.auditors

                var nowstamp = Date.parse(new Date()) / 1000;

                this.waitTime = this.myBase.computeTime(idObj.created, nowstamp)
                console.log(response)
            })
        }


    },
    activated(){
        this.getReviewRecord()
        this.formData.maker = ""
    },
    created(){},
    mounted(){}
}
</script>
<style scoped>
.model_content_inner{
    position: relative;
}

.model_footer{
    text-align: left;
    padding-top: 10px;
}
.content_title{
    height: 64px;
    color: #ff333f;
    line-height: 64px;
    font-weight: 600;
    padding-left: 20px;
}
.banner{
    height: 40px;
    background: #f5f5f5;
    line-height: 40px;
    color: #606266;
    font-weight: 600;
    padding-left: 10px;
}
.base_info{
    padding-left: 40px;
    padding-top: 10px;
    padding-bottom: 10px;
}
.base_info span{
    height: 30px;
    line-height: 30px;
}
.maincontent{
    padding-left: 40px;
    padding-top: 30px;
}
.maincontent .item_wrap{
    padding-left: 15px;
    border-left: 1px solid #E4E7ED;
    position: relative;
    padding-bottom: 40px;
}
.item_wrap span{
    display: inline-block;
    height: 27px;
    line-height: 27px;
}
.item_wrap .item_state_pass{
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: -8px;
}
.item_wrap .item_state_curr{
    width: 15px;
    height: 15px;
    border-radius: 50%;
    position: absolute;
    background: #ff8625;
    top: 2px;
    left: -8px;
}
.maincontent .item_wrap_curr{
    border-left: none;
}
.talkItem{
    border-left: 1px solid #E4E7ED;
    margin-bottom: 5px;
    padding-bottom: 10px;
}
.talkItem>div{
    /* border-left: 1px solid #E4E7ED; */
    margin-left: -9px;
}
.talkItem_title{
    position: relative;
}
.talkItem_title .badge_circle{
    display: inline-block;
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #606266;
    z-index: 9999;
    left: 3px;
}
.talkRecord{
    margin-top: 50px;
}
.talkItem_item{
    height: 27px;
    line-height: 27px;
    padding-left: 40px;
    position: relative;
}
.talkItem_item span{
    display: inline-block;
}
.talkItem_item_circle{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #606266;
    position: absolute;
    top: 9px;
    left: 5px;
}
.dialog_wrap{
    padding: 10px;
    overflow-y: auto;
}
</style>
