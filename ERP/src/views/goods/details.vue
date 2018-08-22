<template>
    <section>
        <header class="details_header">
            <div>
                <el-breadcrumb separator='-' style="line-height:45px;font-size:15px">
                    <el-breadcrumb-item :to="{ path: '/goodsList' }">商品列表</el-breadcrumb-item>
                    <el-breadcrumb-item>商品详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </header>
        <section class="details_conent">
            <div class="details_box" :style="{height: $store.state.home.modelContentHeight-23 + 'px'}">
                <div class="details_text">
                    <!-- 轮播图 -->
                    <div id="box">
                        <div class="topbox">
                            <ul class="bigbox">
                                <li v-for='(item, index) in imglist' :key='index'><img :src="item.imgUrl" alt="" /></li>
                            </ul>
                        </div>

                        <div class="bottomshow">
                            <i class="el-icon-arrow-left" @click="prev()" style="font-size:50px;color:blue;cursor: pointer"></i>
                            <div style="width:378px;overflow:hidden">
                                <div class="bottombox">
                                    <ul class="smallbox">
                                        <li v-for='(item, index) in imglist' :key='index' @click='imgLi(index)'><img :src="item.imgUrl" alt="" /></li>
                                    </ul>
                                </div>
                            </div>
                            <i class="el-icon-arrow-right" @click="next()" style="font-size:50px;color:blue;cursor: pointer"></i>
                        </div>

                    </div>
                    <!-- 右侧详细内容 -->
                    <ul class="recommend">
                        <li class="list_title"><h2>{{ goodconent.title }}</h2></li>
                        <li class="list_recommend" style="margin-top:5px" v-if='goodconent.sellingPoint'>{{ goodconent.sellingPoint }}</li>
                        <li class="list_import" v-if='goodconent.buyRemind'>
                            <span style="line-height:38px">购买提醒：</span>
                            <div><i class="el-icon-warning" style="line-height:38px" ></i> &nbsp; &nbsp;{{ goodconent.buyRemind }}</div>
                        </li>
                        <li class="list_money"><span style="margin-left:40px">建议零售价：</span><span style="color:#fe7673;">￥</span> &nbsp;<h2 style="color:#fe7673;margin-top:12px">{{ goodconent.suggestedPrice }}</h2></li>
                        <!-- 规格尺寸 -->
                        <li v-for='(item, index) in skulist' :key='index'>
                            <span  style="line-height:33px;margin-left:40px">{{ item.skuPropertyName }}：</span>
                            <div class="displaybox">
                                <p v-for="(date, index) in item.propertyValueList" :key='index'>{{ date.skuPropertyValueName }}</p>
                            </div>

                        </li>
                        <li class="list_dl">
                            <dl>
                                <dd>
                                    <span>分类：</span>
                                    <span>{{ goodconent.categoryName }}</span>
                                </dd>
                                <dd><span>贸易类型：</span>{{ goodconent.sendWayName }}</dd>
                                <dd><span>商品条码：</span>{{ goodconent.barCode }}</dd>
                                <dd><span>保质期：</span>{{ goodconent.expirationDateName }}</dd>
                            </dl>
                            <dl style="margin-left:100px">
                                <dd><span>品牌：</span>{{ goodconent.brandName }}</dd>
                                <dd><span>商品编码：</span>{{ goodconent.itemCode }}</dd>
                                <!-- 计量单位 -->
                                <dd><span>计量单位：</span>{{goodconent.unit}}</dd>
                            </dl>
                        </li>
                    </ul>
                </div>
                <div class="more_img">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="商品详情" name="first" style='font-size:16px'>
                            <div class="htmlconent"></div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </section>
        <footer class="details_footer">
            <el-button size='small' @click="returnPrev" style="width:90px">返回</el-button>
        </footer>
    </section>
</template>
<script>
import api from 'api/goods'


export default {
    data() {
        return {

            activeName: 'first',

            goodconent:{},

            skulist:{},

            imglist: [],

            num: 0
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        returnPrev() {
            this.$router.push('goodsList')
        },
        get() {
            var id = this.$store.state.home.currentModelId

            api.getitemitemId(id).then((response)=>{
                this.goodconent = response.data.item
                this.skulist = response.data.itemSkuPropertyList
                this.imglist = response.data.itemImgs
                var htmlStr = response.data.item.description.replace(/<img/g, "<br><img")

                $('.htmlconent').html(htmlStr)
                $('.htmlconent>p').css('text-align', 'left')
                $('.htmlconent>p>img').css('width', '800px')
            })
        },
        next() {
            this.num ++;
            let len = $('.bigbox li').length

            if (this.num > len - 1){
                this.num = len - 1
            } else {
                $('.bigbox').animate({left: -this.num * 418 + 'px'}, 100)
                $('.smallbox').animate({left: -this.num * 60 + 'px'}, 100)
                $('.smallbox li img').removeClass('active').eq(this.num).addClass('active')
            }
        },
        prev() {
            this.num --;

            if (this.num < 0){
                this.num = 0
            } else {
                $('.bigbox').animate({left: -this.num * 418 + 'px'}, 100)
                $('.smallbox').animate({left: -this.num * 60 + 'px'}, 100)
                $('.smallbox li img').removeClass('active').eq(this.num).addClass('active')
            }
        },
        imgLi(index) {
            this.num = index
            $('.bigbox').animate({left: -index * 418 + 'px'}, 100)
            $('.smallbox').animate({left: -index * 60 + 'px'}, 100)
        }
    },

    activated() {
        this.get()
        $('.bigbox').css({'left': '0'})
        $('.smallbox').css({'left': '0'})
        $('.smallbox li img').eq(0).addClass('active')
    },
    mounted() {
        this.get()
    }
}
</script>
<style scoped>
    /* 轮播 */
    .bigbox{
        padding: 0;
        display: flex;
        position: absolute;
    }
    .bigbox li img{
        width: 418px;
        height: 418px
    }
    .smallbox{
        padding: 0;
        display: flex;
        position: absolute;
    }
    .smallbox li img{
        width: 50px;
        height: 50px;
        margin-right: 10px;
        border: 1px solid #ccc;
        cursor: pointer;
    }
    .topbox{
        width: 418px;
        margin: auto;
        overflow: hidden;
        position: relative;
        height: 418px;
    }
    .bottombox{
        width: 52px;
        height: 52px;
        margin: auto;
        position: relative;
        border: 1px solid red
    }
    .bottomshow{
        margin-top:20px;
        width: 418px;
        overflow: hidden;
        display: flex
    }

    /* 顶部 */
    .details_header{
        height: 45px;
        width: 100%;
        padding: 0 30px;
        display: flex;
        justify-content: space-between
    }
    .details_conent{
        padding:10px;
        background: #f5f5f5;
        border-top:1px solid #e6e9e9
    }
    .details_box{
        border: 1px solid #e6e9eb;
        color: #5e6161;
        background: white;
        padding: 50px;
        overflow: auto
    }
    /* 内容 */
    .details_text{
        display: flex;

    }
    .recommend{
        margin-left: 50px;
        margin-top: -40px
    }
    .recommend li{
        display: flex;
        margin-top: 20px
    }
    .recommend li p{
        padding: 5px 18px;
        border: 1px solid #e1e1e1;
        margin-left: 20px
    }
    .list_title{
        color: #525252;
    }
    .list_recommend{
        width: 644px;
        color: #888
    }
    .list_import>div{
        width: 660px;
        height: 38px;
        border: 1px  dashed #fbba42;
        background: #fffbef;
        color: #fe7673;
        line-height: 38px;
        text-indent: 10px
    }
    .list_money{
        width: 730px;
        height: 67px;
        background: #f8f8f8;
        color:#888;
        line-height: 67px
    }
    .list_dl{
        width: 730px;
        border-top: 1px solid #e7e7e7;
        padding: 10px 40px;
    }
    .list_dl dl dd{
        color: #888;
        margin-top: 10px
    }
    .more_img{
        margin-top: 40px
    }
    .displaybox{
        display: flex;
        flex-wrap: wrap;
        width: 620px;
    }

    /* 底部 */
    .details_footer{
        border-top:1px solid #e5e8e8;
        padding: 12px 30px;
        /* margin-top: -23px; */
        background: white
    }
</style>


