<template>
    <section id='add' >
        <!-- 顶部面包屑 -->
        <header class="add_top">
            <el-breadcrumb separator='-' style="line-height:45px;font-size:15px">
                <el-breadcrumb-item :to="{ path: '/goodsList' }">商品列表</el-breadcrumb-item>
                <el-breadcrumb-item>新增商品</el-breadcrumb-item>
            </el-breadcrumb>
        </header>
        <!-- 主体内容 -->
        <div class="add_conent" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="conent_box">
                <!-- 内容 -->
                <el-form style='margin:0' >
                    <!-- 商品title -->
                    <el-form-item class="good_title" >
                        <p class="goodtitle_p">商品类型</p>
                    </el-form-item>
                    <!-- 商品类型 -->
                    <el-form-item class="good_type">
                        <el-button
                            plain
                            @click="option($event)"
                            style="position:relative"
                            class="border">
                            <div class='goodbutton'>
                                <p>实物类商品</p>
                                <span style='color:#8f9294'>（物流发货）</span>
                                <em class="jiao active"><i class="el-icon-check" style="position:absolute;bottom:-20px;right:0"></i></em>
                            </div>
                        </el-button>
                        <el-button
                            plain
                            @click="option($event)"
                            style="position:relative">
                            <div class='goodbutton'>
                                <p>服务类商品</p>
                                <span style='color:#8f9294'>（无需物流）</span>
                                <em class="jiao"><i class="el-icon-check" style="position:absolute;bottom:-20px;right:0"></i></em>
                            </div>
                        </el-button>
                        <el-button
                            plain
                            @click="option($event)"
                            style="position:relative">
                            <div class='goodbutton'>
                                <p>赠品</p>
                                <span style='color:#8f9294'>（非售商品）</span>
                                <em class="jiao"><i class="el-icon-check" style="position:absolute;bottom:-20px;right:0"></i></em>
                            </div>
                        </el-button>
                    </el-form-item>
                    <!-- 信息title -->
                    <el-form-item class="good_title">
                        <p class="goodtitle_p">基本信息</p>
                    </el-form-item>
                    <!-- 信息内容 -->
                    <el-form-item class="msg_conent" >
                        <el-form ref="addGoodsForm" :model="form" label-width="100px" :rules="rules">
                            <el-form-item label="商品名称" prop='title'  style="margin-bottom:25px">
                                <el-input v-model="form.title" size="small" placeholder="请输入商品名称" style="width:688px"></el-input>
                            </el-form-item>
                            <el-form-item label="商品卖点" style="margin-bottom:25px">
                                <el-input type="textarea" v-model="form.sellingPoint" size="small" placeholder="请输入商品卖点，长度<300" rows='2'></el-input>
                            </el-form-item>
                            <el-form-item label="购买提醒" style="margin-bottom:25px">
                                <el-input type="textarea" v-model="form.buyRemind" size="small" placeholder="请输入购买提醒，长度<300" rows='2'></el-input>
                            </el-form-item>
                            <el-form-item style="margin-left:-100px;margin-bottom:25px">
                                <div style="display:flex">
                                    <!-- <el-form-item label="商品条码" >
                                        <el-input v-model="form.barCode" size="small" placeholder="请输入商品条码" ></el-input>
                                    </el-form-item> -->
                                    <el-form-item label="商品编码">
                                        <el-input v-model="form.itemCode" size="small" placeholder="请输入商品编码" ></el-input>
                                    </el-form-item>
                                    <el-checkbox @change="checkboxChangeEvent" class="position" v-model="form.expirationDateStatus" ></el-checkbox>
                                    <el-form-item ref="addGoodsExpReset" :required="requshow" label="有无保质期" prop='expirationDateName' style="margin-left:70px" class="elinputappend" >
                                        <el-input v-model="form.expirationDateName" size="small" :disabled="inputdis"  placeholder="请输入保质期限" >
                                            <template slot="append">月</template>
                                        </el-input>
                                    </el-form-item>
                                </div>
                            </el-form-item>
                            <el-form-item style="margin-left:-100px;margin-bottom:25px">
                                <div style="display:flex">
                                    <el-form-item label="商品品牌" prop='brandId' >
                                        <el-select filterable v-model="form.brandId" placeholder="请选择商品品牌"  size='small' @change="brandChange">
                                            <el-option
                                                v-for="item in brandIdoptions"
                                                :key="item.id"
                                                :label="item.brandName"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="商品分类" prop='categoryId' style="margin-left:70px">
                                        <el-cascader
                                            placeholder="请选择商品分类"
                                            v-model="form.categoryId"
                                            :options="categoryIdoptions"
                                            :show-all-levels="false"
                                            :clearable='true'
                                            :props='props'
                                            size='small'
                                            style="width:258px">
                                        </el-cascader>
                                    </el-form-item>
                                </div>
                            </el-form-item>
                            <el-form-item style="margin-left:-100px;margin-bottom:25px">
                                <div style="display:flex">
                                    <el-form-item label="贸易类型" prop='sendWay' >
                                        <el-select v-model="form.sendWay" placeholder="请选择贸易类型"  size='small'>
                                            <el-option
                                                v-for="item in sendWayoptions"
                                                :key="item.id"
                                                :label="item.categoryName"
                                                :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="建议零售价"  class="money elinputappend" style="margin-left:70px" >
                                        <el-input v-model="form.suggestedPrice" size="small" placeholder="请输入建议零售价" :maxlength="10"  @change="moneyinputchange(form.suggestedPrice)">
                                            <template slot="append">元</template>
                                        </el-input>
                                    </el-form-item>
                                </div>
                            </el-form-item>
                            <el-form-item style="margin-left:-100px;margin-bottom:25px">
                                <div style="display:flex">
                                    <el-form-item label="库存最小单位" >
                                        <el-select v-model="form.unitId" placeholder="请选择库存最小单位"  size='small'>
                                            <el-option
                                                v-for="item in unitIdoptions"
                                                :key="item.id"
                                                :label="item.unit"
                                                :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="商品费率" style="margin-left:70px" class="elinputappend" prop='rate'>
                                        <el-input v-model="form.rate" size="small" placeholder="请输入商品费率( >= 0)" >
                                            <template slot="append">‰</template>
                                        </el-input>
                                    </el-form-item>
                                </div>
                            </el-form-item>

                        </el-form>
                    </el-form-item>
                    <!-- 规格title -->
                    <el-form-item required class="good_title ">
                        <p class="goodtitle_p">商品规格</p>
                    </el-form-item>
                    <!-- 商品规格 -->
                    <el-form-item class="standard">
                        <el-form label-width="100px">
                            <div>
                                <!-- 商品规格 -->
                                <el-form-item label="商品规格"  v-model="skuProperty">
                                    <div class="add_standard">
                                        <div v-for="(item, index) in skuProperty" :key="index">
                                            <div class="add_small_standard" >
                                                <el-form-item label="规格名" style="margin-left:-20px" >
                                                    <el-select filterable v-model="item.skuPropertyName" @change="changeSku(item, index, skuList)" placeholder="请选择规格名" size='small' style="width:138px" :disabled='selectdis[index].dis' >
                                                        <el-option
                                                            v-for="item2 in skuList"
                                                            :key="item2.id"
                                                            :label="item2.skuPropertyName"
                                                            :value="item2.skuPropertyName"
                                                            :disabled="item2.disabled">
                                                        </el-option>
                                                    </el-select>
                                                    <!-- <el-checkbox v-model="checked" style="margin-left:10px"  @change="changeupload" v-if='index == 0'>添加规格图片</el-checkbox> -->
                                                    <i  class="el-icon-circle-close"  style='float:right;margin-top:15px;font-size:16px;cursor:pointer' @click="delskuproperty(index)"></i>
                                                </el-form-item>
                                            </div>
                                            <el-form-item label='规格值' style="margin-left:-10px;margin-top:5px" >
                                                <span v-for="(itemName, i) in item.itemSkuPropertyValueDTOS" :key='i'>
                                                    <el-select filterable @change="changeSKUname(item, index)" placeholder="请选择规格值" size='small'  v-model="itemName.skuPropertyValueName" style="width:138px;margin-right:20px">
                                                        <el-option
                                                            v-for="item3 in item.itemSkuDTOS"
                                                            :key="item3.id"
                                                            :label="item3.skuPropertyValueName"
                                                            :value="item3.skuPropertyValueName"
                                                            :disabled="item3.disabled || item3.enableStatus == 0">
                                                        </el-option>
                                                    </el-select>
                                                    <i class="el-icon-circle-close"  @click="delskuname(index, i)" style="position:relative;right:33px;top:-15px;font-size:16px;cursor: pointer"></i>
                                                </span>
                                                <el-button type='text' @click="addSpec(index)">添加规格值</el-button>
                                                <!-- <div style="display:flex" class="smallupload">
                                                    <div style="width:158px;margin-right:20px" v-for='(itemImg, indexs) in item.itemSkuPropertyValueDTOS' :key='indexs'>
                                                        <div v-if='uploadshow' v-show='index == 0' >
                                                            <el-upload
                                                                :action="upDateImgUrl"
                                                                :data='sentData'
                                                                :file-list='imgfileList'
                                                                list-type="picture-card"
                                                                :on-preview="smallPictureCardPreview"
                                                                :on-success='smallAvatarSuccess'
                                                                :on-remove="smallRemove"
                                                                :limit= 1>
                                                                <i class="el-icon-plus"></i>
                                                            </el-upload> -->
                                                            <!-- action上传地址 -->
                                                            <!-- <el-dialog :visible.sync="dialogVisible2">
                                                                <img width="100%" :src="dialogImageUrl2" alt="">
                                                            </el-dialog>
                                                        </div>
                                                    </div>
                                                </div> -->
                                                <!-- <p style="color:#888;font-size:12px;margin-top:30px">仅支持为第一组规格设置图片（最多40张图），买家选择不同规格会看到对应图片，建议尺寸：640 X 640 像素</p> -->
                                            </el-form-item>
                                        </div>
                                        <el-form-item>
                                            <div>
                                                <div class="add_small_standard">
                                                    <el-button type="primary" size='small' @click="addSpecItem"  :disabled="adddisabled">添加规格项目</el-button>
                                                    <span style="font-size:12px;margin-left:10px" v-if='adddisabled'>最多添加三条规格</span>
                                                </div>
                                            </div>
                                        </el-form-item>
                                    </div>
                                    <p class="standard_p">如有颜色、尺码等多种规格，请添加商品规格</p>
                                </el-form-item>

                                <el-form-item required label="包装类型">
                                    <div class="add_standard">
                                        <div class="add_small_standard add_standard">
                                            <el-form-item  label="类型名" label-width="70px">
                                                <el-select v-model="typesname"  placeholder="选择类型名" size='small'  @change='gettypevalue()' filterable>
                                                    <el-option
                                                        v-for="item in typenameoptions"
                                                        :key="item.id"
                                                        :label="item.unitMsg"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                        <div style="padding:10px;display:flex" class="supply_check">
                                            <el-form-item label="类型值" label-width="70px">
                                                <span style="position:relative;margin-right:20px" v-for="(items, index) in typesvalue" :key="index" >
                                                    <el-select v-model="items.id" placeholder="选择类型值" size='small' @change="typechange(index)" filterable >
                                                        <el-option
                                                            v-for="item in typevalueoptions"
                                                            :key="item.id"
                                                            :label="item.supplyMsg"
                                                            :value="item.id"
                                                            :disabled="item.disabled || item.enableStatus == 0">
                                                            <span style="float: left">{{ item.supplyMsg }}</span>
                                                            <span style="float: right; color: #8492a6; font-size: 13px">(数量: {{ item.skuNumber }})</span>
                                                        </el-option>
                                                    </el-select>
                                                    <i class="el-icon-circle-close" @click="delet(index)" style="position:relative;right:13px;top:-15px;font-size:16px;cursor: pointer"></i>
                                                </span>
                                            </el-form-item>
                                            <el-button type="text"  style="position: relative;z-index: 20;" @click="add">添加规格值</el-button>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item label="规格明细">
                                    <!-- 规格明细 -->
                                    <table class='skuTable' style="width: 100%;margin-top:10px">
                                        <tr>
                                            <th width='50%'>
                                                <div class="">
                                                    商品规格
                                                </div>
                                                <div class="tableBox">
                                                    <span :key="index" v-for="(item, index) in skuProperty">{{item.skuPropertyName}}</span>
                                                </div>
                                            </th>
                                            <!-- <th width='25%'>
                                                <el-popover
                                                    placement="bottom"
                                                    width="300"
                                                    v-model="visible1">
                                                    <div style="display:flex">
                                                        <p style="font-size:12px;width:50px;line-height:32px">条形码:</p>
                                                        <el-input size="small" v-model="allgoodscode"></el-input>
                                                    </div>
                                                    <div style="text-align: right; margin: 0">
                                                        <el-button size="mini" type="text" @click="codereturn">取消</el-button>
                                                        <el-button type="primary" size="mini" @click="codeconfim">应用到全部列</el-button>
                                                    </div>
                                                    <i slot="reference" class="el-icon-setting" @click="visible1 = true" style="cursor: pointer;color:#999"></i>
                                                </el-popover>
                                                <span style="margin-left:10px">商品条码</span>
                                            </th> -->
                                            <th width='25%'>包装类型</th>
                                        </tr>
                                        <tr  :key="indexTable" v-for="(itemName, indexTable) in showSkuArr">
                                            <td>
                                                <div class="tableBox2">
                                                    <span :key="i" v-for='(skuName, i) in itemName'>
                                                        {{skuName}}
                                                    </span>
                                                </div>
                                            </td>
                                            <!-- <td>
                                                <div class="tableBox2" style="padding:0 10px">
                                                    <el-input  v-model="code[indexTable].goodscode" placeholder="请输入商品条码" size="small"></el-input>
                                                </div>
                                            </td> -->
                                            <td>
                                                <div :key="k" v-for='(supName, k) in typesvalue'>
                                                    <span >{{supName.supName}}</span>
                                                </div>
                                            </td>
                                        </tr>

                                    </table>
                                </el-form-item>
                            </div>
                        </el-form>
                    </el-form-item>
                    <!-- 商品属性title -->
                    <el-form-item class="good_title ">
                        <p class="goodtitle_p">商品属性</p>
                        <span class="position" style="width:470px">商品属性是对商品的补充说明，如材质、产地、储存方法等，最多添加50条</span>
                    </el-form-item>
                    <!-- 商品属性 -->
                    <el-form-item class="good_attr">
                        <div class="add_attr" >
                            <el-form ref="attr" label-width="100px" >
                                <el-form-item label="">
                                    <el-col :span="24"  v-for='(attrnum,index) in property' :key="index" >
                                        <el-col :span="4">
                                            <el-input size="small" placeholder="属性名" v-model="attrnum.propertyName" ></el-input>
                                        </el-col>
                                        <el-col :span="16" style="margin-left:10px">
                                            <el-input size="small" placeholder="属性值" v-model="attrnum.propertyValue" ></el-input>
                                        </el-col>
                                        <i class="el-icon-close" style="margin-left:10px" @click="removeattr(index, attrnum)"></i>
                                    </el-col>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="add_button">
                            <el-button type="text" @click="pushAttr">添加属性</el-button>
                        </div>
                    </el-form-item>
                    <!-- 商品主图 -->
                    <el-form-item required class="good_title isrequiredClass">
                        <p class="goodtitle_p">商品图片</p>
                        <span class="position" style="width:470px">主图大小不能超过1MB;尺寸：700*700px;最多5张</span>
                    </el-form-item>
                    <!-- 图片上传 -->
                    <el-form-item label="" class="pic_up">
                        <div class="updata_box">
                            <el-upload
                                :action="upDateImgUrl"
                                :data='sentData'
                                :file-list='fileList'
                                multiple
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove"
                                :on-success='handleAvatarSuccess'
                                :limit= 5>
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <!-- action上传地址 -->
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </div>
                    </el-form-item>
                    <!-- 商品详情title -->
                    <el-form-item class="good_title isrequiredClass">
                        <p class="goodtitle_p">商品详情</p>
                    </el-form-item>
                    <!-- 富编辑器 -->
                    <el-form-item :style="{background: '#ffffff'}">
                        <div style="padding:10px;background:white;width:80%;" class="wangdiv">
                            <div id='editorE' style="max-height:1000px"></div>
                        </div>
                    </el-form-item>
                    <!-- 其他设置title -->
                    <el-form-item class="good_title">
                        <p class="goodtitle_p">其他设置</p>
                    </el-form-item>
                    <!-- 其他设置 -->
                    <el-form-item class="other">
                        <el-form  label-width="100px" v-model="form">
                            <el-form-item label="报价设置"  style="margin:0 0 10px 0" class="eltag">
                                <!-- <el-select v-model="setmoneny" placeholder="选择类型" size='small'>
                                    <el-option
                                        v-for="item in setmonenyoptions"
                                        :key="item.id"
                                        :label="item.groupName"
                                        :value="item.groupName">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item >
                                <el-tag size="small"  style="font-size:12px;background:#409EFF;color:white" v-if='setmoneny'>{{setmoneny}}</el-tag> -->
                                <el-select
                                    v-model="setmoneny"
                                    multiple
                                    filterable
                                    placeholder="请选择报价类型"
                                    size='small'>
                                    <el-option
                                        v-for="item in setmonenyoptions"
                                        :key="item.id"
                                        :label="item.groupName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="购买设置"  style="margin:0 0 10px 0" class="eltag">
                                <el-select
                                    v-model="shopnum"
                                    multiple
                                    filterable
                                    placeholder="请选择购买分店"
                                    size='small'>
                                    <el-option
                                        v-for="item in shopnumoptions"
                                        :key="item.id"
                                        :label="item.groupName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="商品热度" >
                                <el-input v-model="pageView" size='small' style="width:215px"></el-input>
                            </el-form-item>
                            <el-form-item label="允许竞价">
                                <el-radio-group v-model="form.isBidding">
                                    <el-radio label = '1' >允许</el-radio>
                                    <el-radio label = '0' >不允许</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="出售状态">
                                <el-radio-group v-model="form.onShelf">
                                    <el-radio label = '1' >出售</el-radio>
                                    <el-radio label = '0' >禁售</el-radio>
                                </el-radio-group>
                                <span style="font-size:12px;color:red;margin-left:20px">禁售状态的商品将导致所有在售的商品都会下架，供应商也不能对此商品进行报价</span>
                            </el-form-item>
                            <el-form-item label="减库存设置">
                                <el-radio-group v-model="form.stockWay">
                                    <el-radio label = '0'>下单减库存</el-radio>
                                    <el-radio label = '1'>支付减库存</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="提成设置">
                                <el-select
                                    @change="choosePromote" v-model="promoteGroupId" placeholder="选择类型" size='small'>
                                    <el-option
                                        v-for="item in deductoptions"
                                        :key="item.promoteGroupId"
                                        :label="item.promoteGroupName"
                                        :value="item.promoteGroupId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- 控制步骤 -->
        <footer class="add_bottom">
            <!-- <el-button @click="reset" size='small' style="width:90px">重置</el-button> -->
            <el-button @click="next" size='small' type="primary" style="width:90px">保存</el-button>
            <el-button  size='small' style="width:90px" @click="returnprev">取消</el-button>
        </footer>
    </section>

</template>
<script>
// import updata from '@/components/updata'
import api from 'api/goods'
import E from 'wangeditor'
import axios from 'axios'

export default {
    name: 'addGoods',
    data () {
        return {
            value: '',
            editor: null,
            // 验证
            rules: {
                title: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                brandId: [
                    { required: true, message: '请选择商品品牌', trigger: 'blur' }
                ],
                categoryId: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ],
                sendWay: [
                    { required: true, message: '请选择贸易类型', trigger: 'blur' }
                ],
                rate: [
                    { required: true, message: '请输入商品费率( >= 0)', trigger: 'blur' },
                    {pattern: /^(\d|[1-9]\d+)(\.\d+)?$/, message:'请输入正确的商品费率'}
                ]
            },

            // 商品主图
            dialogImageUrl: '',
            dialogVisible: false,
            // 规格添加图
            dialogImageUrl2: '',
            dialogVisible2: false,

            upDateImgUrl: process.env.API_ROOT + '/f/upload',
            sentData: {
                file: '',
                uploadType: 'erp'
            },
            fileList:[],
            fileListAdd: [],
            conTinue:[],
            imgfileList:[],

            // 信息内容
            form: {
                itemType: 1,
                isPresent: 0,
                title: '',
                sellingPoint: '',
                buyRemind: '',
                barCode: '',
                itemCode: '',
                brandId: [],
                categoryId: [],
                sendWay: [],
                suggestedPrice: '',
                unitId: [],
                expirationDateName: '',
                expirationDateStatus: false,
                stockWay: '0',
                isBidding: '1',
                onShelf:'1',
                description:'',
                rate:''
            },
            props: {
                label:'categoryName',
                value:'id',
                children: 'itemCategories'
            },
            // 信息表单选项
            brandIdoptions:[],
            categoryIdoptions:[],
            sendWayoptions:[
                {
                    id:1,
                    categoryName: '国内贸易'
                },
                {
                    id:2,
                    categoryName: '保税区直供'
                },
                {
                    id:3,
                    categoryName: '海外直邮'
                }
            ],
            unitIdoptions:[],
            itemImgs1:[],

            // 商品规格
            checked: false,
            // 规格值
            uploadshow: false,
            skuList: [],
            skuListF:[],
            showSkuArr: [],
            skucode:[],
            allList_0: [],
            allList_1: [],
            allList_2: [],
            skuProperty: [],

            // 属性表单
            property: [
                {
                    propertyName: '',
                    propertyValue: ''
                }
            ],

            // 内容2

            // 包装类型
            typenameoptions:[],
            typesname: '',
            typevalueoptions:[],
            typesvalue: [
                // {
                //     id:''
                // }
            ],

            // 报价提成
            setmonenyoptions: [],
            setmoneny:[],
            shopnumoptions:[],
            shopnum:[],
            deductoptions:[],
            deduct: '',

            // 其他设置

            promoteGroupId: '',
            promoteGroupName: '',
            pageView: '',
            adddisabled: false,
            requshow: false,

            // 商品规格条码
            visible1:false,
            code:[
                {
                    goodscode:''
                }
            ],
            allgoodscode:'',

            visible2:false,

            // 保质期
            inputdis:true,
            selectdis: [
                {
                    dis:false
                },
                {
                    dis:false
                },
                {
                    dis:false
                }
            ]

        }
    },
    methods:{
        //保质期下拉框
        checkboxChangeEvent(data){
            this.$refs.addGoodsExpReset.clearValidate()  //清空保质期验证
            if (data == true && this.skuProperty.length == 3){
                this.$message({
                    type: 'warning',
                    message: '规格已满！请先删除一项规格！'
                })
                this.form.expirationDateStatus = false
            } else {
                this.form.expirationDateStatus = data
                //是否显示必填项图标
                if (data == true){
                    this.rules.expirationDateName = [
                        { required: true, message: '请输入保质期限' }
                    ]
                    // console.log(this.rules)
                    this.requshow = true
                    this.inputdis = false

                    if (this.skuProperty.length < 3){
                        let obj = {
                            skuPropertyName: "",
                            itemSkuPropertyValueDTOS :[
                                {
                                    skuPropertyValueName: "",
                                    skuImg: '',
                                    id: ''
                                }
                            ]
                        }

                        this.skuProperty.push(obj)

                        this.skuList = [
                            {
                                skuPropertyName:'生产日期'
                            },
                            {
                                skuPropertyName:'效期'
                            }
                        ]
                    }

                    this.adddisabled = true

                } else {
                    this.adddisabled = false
                    this.rules.expirationDateName = []
                    this.requshow = false
                    this.inputdis = true
                    let fleg = false

                    this.skuProperty.forEach((res, index) => {
                        if (res.skuPropertyName == '生产日期' || res.skuPropertyName == '效期') {
                            this.skuProperty.splice(index, 1)
                            this.selectdis.forEach((item) => {
                                item.dis = false
                            })
                            fleg = true
                        }
                    })
                    if (!fleg){
                        for (let i of this.skuProperty){
                            if (i.skuPropertyName == '') {
                                this.skuProperty.splice(i, 1)
                                this.skuList = this.skuListF
                                this.selectdis.forEach((item) => {
                                    item.dis = false
                                })
                                return
                            }
                        }

                    }
                    this.skuList.forEach((res) => {
                        if (res.skuPropertyName == '生产日期' || res.skuPropertyName == '效期'){
                            res.disabled = true
                        }
                    })

                }
            }

        },
        // 零售价
        moneyinputchange(date) {

            if (date != ''){
                let num  = Number(date)

                this.form.suggestedPrice = num.toFixed(2)
            }

        },
        // 下一步保存数据请求接口
        next() {
            //保存前初始化代码开始   author: wwb
            this.itemImgs1 = []

            //保存前初始化代码结束   author: wwb
            if (this.form.expirationDateStatus == true){  //有无保质期表单校验
                this.rules.expirationDateName = [
                    { required: true, message: '请输入保质期限' }
                ]

            } else {
                this.rules.expirationDateName = []

            }

            console.log(this.form)
            this.post()

        },
        // 上传图片
        // 移除
        handleRemove(file, fileList) {
            this.fileListAdd = JSON.parse(JSON.stringify(fileList))
            // this.fileList = JSON.parse(JSON.stringify(fileList))
            if (this.fileListAdd.length < 5){
                $('.el-upload--picture-card').css('display', 'inline-block')
            }
        },
        // 变大查看
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 成功回调
        handleAvatarSuccess(file, fileList) {
            this.fileListAdd.push(fileList.response.data)
            if (this.fileListAdd.length == 5){
                $('.el-upload--picture-card').css('display', 'none')
            }

        },
        // 规格图片移除
        smallRemove(file, fileList) {
            for (var i in this.conTinue){
                if (this.conTinue[i].url == file.url){

                    this.conTinue.splice(i, 1)
                }
            }
        },
        // 变大查看
        smallPictureCardPreview(file) {
            this.dialogImageUrl2 = file.url;
            this.dialogVisible2 = true;
        },
        // 成功回调
        smallAvatarSuccess(file, fileList) {
            this.conTinue.push(fileList.response.data)
            // console.log(this.conTinue)
        },
        // 重置
        reset() {
            this.clear()
            this.$refs['addGoodsForm'].resetFields();
        },
        returnprev() {
            this.clear()
            this.$refs['addGoodsForm'].resetFields();
            this.$router.go(-1)
        },
        // 包装类型添加规格
        add() {
            if (this.typevalueoptions.length > this.typesvalue.length){
                let obj = {
                    id:''
                }

                for (var e in this.typevalueoptions){
                    this.typevalueoptions[e].disabled = false
                }

                for (var i in this.typesvalue){
                    for (var j in this.typevalueoptions){
                        if (this.typesvalue[i].id == this.typevalueoptions[j].id){

                            this.typevalueoptions[j].disabled = true
                        }
                    }
                }
                this.typesvalue.push(obj)
            }


        },
        // 包装类型删除规格
        delet(index){
            for (var j in this.typevalueoptions){
                if (this.typesvalue[index].id == this.typevalueoptions[j].id){
                    this.typevalueoptions[j].disabled = false
                }
            }
            // if (this.typesvalue.length != 1) {
            this.typesvalue.splice(index, 1)
            // }

        },
        typechange(index) {
            let arr = []

            for (var j in this.typevalueoptions){
                if (this.typesvalue[index].id == this.typevalueoptions[j].id){
                    this.typevalueoptions[j].disabled = true
                    this.typesvalue[index].supName = this.typevalueoptions[j].supplyMsg
                }
            }
            // 规格排序
            this.typevalueoptions.forEach((obj) => {
                this.typesvalue.forEach((res) => {
                    if (res.id == obj.id) {
                        arr.push(res)
                    }
                })
            })

            this.typesvalue = arr
            this.updateShowArr()
            // console.log(this.typevalueoptions, "包装类型规格")

        },

        // 添加属性
        pushAttr() {
            let obj = {
                propertyName: '',
                propertyValue: ''
            }

            this.property.push(obj)
        },
        // 移除属性
        removeattr(index, data) {
            if (this.property.length == 1){
                data.propertyName = ''
                data.propertyValue = ''
            }
            if (this.property.length > 1){
                this.property.splice(index, 1)
            }
        },
        // 顶部分类样式
        option($event) {
            var type = $event.currentTarget

            $(type).siblings().removeClass('border').find('.jiao').removeClass('active')
            $(type).addClass('border').find('.jiao').addClass('active')
        },
        // 表格数据

        // 添加规格项目
        addSpecItem() {
            this.skuList = this.skuListF
            this.skuList.forEach((res) => {
                if (res.skuPropertyName == '生产日期' || res.skuPropertyName == '效期'){
                    res.disabled = true
                }
            })
            if (this.skuProperty.length < 3){
                let obj = {
                    skuPropertyName: "",
                    itemSkuPropertyValueDTOS :[
                        {
                            skuPropertyValueName: "",
                            skuImg: '',
                            id: ''
                        }
                    ]
                }

                this.skuProperty.push(obj)
            }
            if (this.skuProperty.length == 3){
                this.adddisabled = true
            }

        },
        // 删除规格名
        delskuproperty(index) {
            this.skuList.forEach((res) => {
                if (res.skuPropertyName == this.skuProperty[index].skuPropertyName){
                    res.disabled = false
                }
                if (res.skuPropertyName == '生产日期' || res.skuPropertyName == '效期'){
                    res.disabled = true
                }
            })
            this.adddisabled = false
            if (this.skuProperty[index].skuPropertyName == '生产日期' || this.skuProperty[index].skuPropertyName == '效期'){
                this.$message({
                    type: 'warning',
                    message: '无法删除已选择保质期的规格！'
                })
            } else {
                this.rules.expirationDateName = []
                this.$refs.addGoodsExpReset.clearValidate()
                this.skuProperty.splice(index, 1)
            }
            if (this.skuProperty.length == 0){
                this.form.expirationDateStatus = false
                this.inputdis = true
                this.requshow = false
            }

            this.updateShowArr()
        },
        // 添加规格值
        addSpec(index) {
            let obj = {
                skuPropertyValueName: '',
                skuImg: '',
                id: ''
            }

            this.skuProperty[index].itemSkuPropertyValueDTOS.push(obj)

        },
        // 删除规格值
        delskuname(index, i) {

            this.skuProperty[index].itemSkuDTOS.forEach((item) => {
                if (this.skuProperty[index].itemSkuPropertyValueDTOS[i].id == item.id){
                    item.disabled = false
                }
            })

            this.skuProperty[index].itemSkuPropertyValueDTOS.splice(i, 1)

            this.updateShowArr()

            let num = this.code.length - this.skucode.length

            this.code.splice(i, num)


        },
        // 更新规格展示
        updateShowArr() {
            this.allList_0 = []
            this.allList_1 = []
            this.allList_2 = []
            if (this.skuProperty[0]) {
                this.skuProperty[0].itemSkuPropertyValueDTOS.forEach((res) => {
                    this.allList_0.push({'id': res.id, 'name': res.skuPropertyValueName})
                })
            }
            if (this.skuProperty[1]) {
                this.skuProperty[1].itemSkuPropertyValueDTOS.forEach((res) => {
                    this.allList_1.push({'id': res.id, 'name': res.skuPropertyValueName})
                })
            }
            if (this.skuProperty[2]) {
                this.skuProperty[2].itemSkuPropertyValueDTOS.forEach((res) => {
                    this.allList_2.push({'id': res.id, 'name': res.skuPropertyValueName})
                })
            }
            this.showSkuArr = []
            this.skucode = []
            if (this.allList_2.length > 0) {
                for (let i = 0; i < this.allList_0.length; i++) {
                    for (let j = 0; j < this.allList_1.length; j++) {
                        for (let k = 0; k < this.allList_2.length; k++) {
                            this.showSkuArr.push([this.allList_0[i].name, this.allList_1[j].name, this.allList_2[k].name])
                            this.skucode.push({'skuGroup':[this.allList_0[i].id, this.allList_1[j].id, this.allList_2[k].id], 'barCode': ''})
                        }
                    }
                }
            } else if (this.allList_1.length > 0) {
                for (let i = 0; i < this.allList_0.length; i++) {
                    for (let j = 0; j < this.allList_1.length; j++) {
                        this.showSkuArr.push([this.allList_0[i].name, this.allList_1[j].name])
                        this.skucode.push({'skuGroup':[this.allList_0[i].id, this.allList_1[j].id], 'barCode': ''})
                    }
                }
            } else if (this.allList_0.length > 0) {
                for (let i = 0; i < this.allList_0.length; i++) {
                    this.showSkuArr.push([this.allList_0[i].name])
                    this.skucode.push({'skuGroup':[this.allList_0[i].id], 'barCode': ''})
                }
            }

            // console.log(this.showSkuArr)
            if (this.showSkuArr.length == 0) {
                let obj = {}

                this.showSkuArr.push(obj)
            }

            for (let k in this.skucode){
                this.skucode[k].barCode = this.code[k].goodscode
            }


        },
        // 修改规格值
        changeSKUname(data, index) {
            data.itemSkuDTOS.forEach((obj) => {
                obj.disabled = false
            })
            // 已经选择的规格值
            data.itemSkuPropertyValueDTOS.forEach((res) => {
                data.itemSkuDTOS.forEach((obj) => {
                    if (res.skuPropertyValueName == obj.skuPropertyValueName) {
                        res.id = obj.id
                        obj.disabled = true
                    }
                })
            })

            if (index == 0) {
                this.allList_0 = []
                data.itemSkuPropertyValueDTOS.forEach((res) => {
                    this.allList_0.push({'id': res.id, 'name': res.skuPropertyValueName})
                })
            } else if (index == 1) {
                this.allList_1 = []
                data.itemSkuPropertyValueDTOS.forEach((res) => {
                    this.allList_1.push({'id': res.id, 'name': res.skuPropertyValueName})
                })
            } else if (index == 2) {
                this.allList_2 = []
                data.itemSkuPropertyValueDTOS.forEach((res) => {
                    this.allList_2.push({'id': res.id, 'name': res.skuPropertyValueName})
                })
            }
            this.showSkuArr = []
            this.skucode = []
            if (this.allList_2.length > 0) {
                for (let i = 0; i < this.allList_0.length; i++) {
                    for (let j = 0; j < this.allList_1.length; j++) {
                        for (let k = 0; k < this.allList_2.length; k++) {
                            this.showSkuArr.push([this.allList_0[i].name, this.allList_1[j].name, this.allList_2[k].name])
                            this.skucode.push({'skuGroup':[this.allList_0[i].id, this.allList_1[j].id, this.allList_2[k].id], 'barCode': ''})
                        }
                    }
                }
            } else if (this.allList_1.length > 0) {
                for (let i = 0; i < this.allList_0.length; i++) {
                    for (let j = 0; j < this.allList_1.length; j++) {
                        this.showSkuArr.push([this.allList_0[i].name, this.allList_1[j].name])
                        this.skucode.push({'skuGroup':[this.allList_0[i].id, this.allList_1[j].id], 'barCode': ''})
                    }
                }
            } else if (this.allList_0.length > 0) {
                for (let i = 0; i < this.allList_0.length; i++) {
                    this.showSkuArr.push([this.allList_0[i].name])
                    this.skucode.push({'skuGroup':[this.allList_0[i].id], 'barCode': ''})
                }
            }


            if (this.skucode.length > this.code.length){
                for (let m = this.code.length; m < this.skucode.length; m ++){
                    let obj = {
                        goodscode:''
                    }


                    this.code.push(obj)
                }
            }

            this.adddisabled = false
            this.updateShowArr()

            // console.log(this.showSkuArr, 'sku总列表展示')
            // console.log(this.skuProperty, 'sku传递给后台数据')
        },
        // 规格名下拉框change事件
        changeSku(data, index, skuList) {
            this.skuList = this.skuListF

            if (data.skuPropertyName == '生产日期' || data.skuPropertyName == '效期') {
                this.selectdis[index].dis = true
            }

            this.skuList.forEach((res) => {   //清除规格名下拉数据禁用设置
                res.disabled = false

            })
            // console.log(this.skuProperty)
            this.skuList.forEach((res) => {  //设置重复规格名禁用
                this.skuProperty.forEach((obj) => {
                    if (res.skuPropertyName == obj.skuPropertyName) {
                        res.disabled = true
                    }
                })
            })

            data.itemSkuPropertyValueDTOS = [{  //保存规格值信息
                id: '',
                skuImg: '',
                skuPropertyValueName: ''
            }]

            this.$set(data, 'itemSkuDTOS', []) //初始化对应规格名,规格值下拉数据

            let num = ''

            for (let y in this.skuList){  //获取规格名ID
                if (data.skuPropertyName == this.skuList[y].skuPropertyName){
                    num = this.skuList[y].id
                }
            }
            api.getitemskuPropertylist({id: num, mark: 1}).then((res) => { //根据规格ID获取设置对应规格名的规格值数据
                res.data.list[0].propertyValueList.forEach(re => {
                    let obj = {
                        skuPropertyValueName: re.skuPropertyValueName,
                        skuImg: '',
                        enableStatus: re.enableStatus,
                        id: re.id
                    }

                    data.itemSkuDTOS.push(obj)
                })
            })


        },
        // 批量更改条码
        codereturn() {
            this.allgoodscode = ''
            this.visible1 = false
        },
        codeconfim() {
            this.code.forEach((res) => {
                res.goodscode = this.allgoodscode
            })
            this.allgoodscode = ''
            this.visible1 = false
        },

        // 获取规格列表
        getSkuList() {
            let obj = {
                post:'post'
            }

            api.getitemskuPropertylist(obj).then((res) => {
                this.skuList = res.data.list
                this.skuListF = res.data.list

                // console.log(this.skuList, "商品规格")
            })
        },

        changeupload() {
            this.uploadshow = !this.uploadshow
        },

        // 获取商品品牌选项
        getbrandId() {
            let obj = {
                pageNo: 1,
                pageSize: 999999
            }

            api.getitemBrandlist(obj).then((response)=>{
                // console.log(response)
                this.brandIdoptions = response.data.list
            }).catch((error)=>{
                console.log(error)
            })
        },
        // 获取商品分类选项
        getcategoryId() {
            api.getcategorylist().then((response)=>{
                // console.log(response)
                this.categoryIdoptions = response.data

            }).catch((error)=>{
                console.log(error)
            })
        },
        // 获取单位选项
        getunitId() {
            api.getitemunitlist().then((response)=>{
                this.unitIdoptions = response.data.list
                // console.log(response)
            }).catch((error)=>{
                console.log(error)
            })
        },
        // 获取包装类型规格
        gettypename() {
            let obj = {
                post:'post'
            }

            api.getitemsupplyPropertylist(obj).then((response)=>{
                // console.log(response)
                this.typenameoptions = response.data.list
            }).catch((error)=>{
                console.log(error)
            })
        },
        gettypevalue() {
            this.typesvalue = [
                {
                    id:''
                }
            ]
            api.getitemsupplyPropertyunitId(this.typesname.toString(), {mark: 1}).then((response)=>{
                // console.log(response)
                this.typevalueoptions = response.data.itemSupplyPropertyVOs
            }).catch((error)=>{
                console.log(error)
            })
        },
        // 选择提成设置
        choosePromote() {
            this.deductoptions.forEach((res) => {
                if (res.promoteGroupId == this.promoteGroupId) {
                    this.promoteGroupName = res.promoteGroupName
                }
            })
        },
        // 获取提成设置
        getPromotesList() {
            api.getitempromotes().then(res => {
                this.deductoptions = res.data.list
            })
        },
        // 获取报价设置
        getgroup() {
            let page = {
                pageNo: 1,
                pageSize: 99
            }

            api.getsuppliergrouplist(page).then((response)=>{
                // console.log(response)
                this.setmonenyoptions = response.data.list
            }).catch((error)=>{
                console.log(error)
            })
        },
        // 获取门店列表
        brandChange() {
            // console.log(this.form.brandId)
            this.shopnumoptions = []
            this.shopnum = []
            api.getitemBrandid(this.form.brandId).then((response) => {
                // console.log(response)

                if (response.data.itemBrandShopGroups.length == 0){
                    let page = {
                        pageNo: 1,
                        pageSize: 99
                    }

                    api.getshopgrouplist(page).then((res)=>{
                        // console.log(response)
                        this.shopnumoptions = res.data.list
                    }).catch((error)=>{
                        console.log(error)
                    })
                } else {
                    this.shopnumoptions = response.data.itemBrandShopGroups
                }
            })
        },
        // getshopgrouplist() {
        //     let page = {
        //         pageNo: 1,
        //         pageSize: 99
        //     }

        //     api.getshopgrouplist(page).then((response)=>{
        //         // console.log(response)
        //         this.shopnumoptions = response.data.list
        //     }).catch((error)=>{
        //         console.log(error)
        //     })
        // },
        clear() {
            this.form = {
                itemType: 1,
                isPresent: 0,
                title: '',
                sellingPoint: '',
                buyRemind: '',
                barCode: '',
                itemCode: '',
                money: '',
                expirationDateName: '',
                expirationDateStatus: false,
                goodhot:'',
                stockWay: '0',
                isBidding: '1',
                onShelf:'1',
                description:'',
                rate:''
            }
            this.property = [
                {
                    propertyName: '',
                    propertyValue: ''
                }
            ]
            this.typesvalue = [
                // {
                //     id:''
                // }
            ]
            this.typesname = ''
            this.setmoneny = []
            this.shopnum = []
            this.deduct = ''
            this.skuProperty = []
            this.fileList = []
            this.fileListAdd = []
            this.checked = false
            this.uploadshow = false
            this.skuList = []
            this.showSkuArr = []
            this.allList_0 = []
            this.allList_1 = []
            this.allList_2 = []
            this.adddisabled = false
            this.requshow = false
            this.code = [
                {
                    goodscode:''
                }
            ]
            this.allgoodscode = ''
            this.deductoptions = []
            this.pageView = ''
            this.inputdis = true
            this.rules.expirationDateName = []
            this.selectdis = [
                {
                    dis:false
                },
                {
                    dis:false
                },
                {
                    dis:false
                }
            ]

        },
        post() {
            this.$refs['addGoodsForm'].validate((valid) => {
                if (valid) {

                    // 判断商品类型
                    var that = this

                    $(".goodbutton").each(function(i){
                        if ($(".goodbutton").eq(i).find('.jiao').hasClass('active')){
                            if ($(".goodbutton").eq(i).find('p').text() == '实物类商品'){
                                // alert(1)
                                that.form.itemType = 0
                                that.form.isPresent = 0
                            }
                            if ($(".goodbutton").eq(i).find('p').text() == '服务类商品'){
                                // alert(2)
                                that.form.itemType = 1
                                that.form.isPresent = 0
                            }
                            if ($(".goodbutton").eq(i).find('p').text() == '赠品'){
                                // alert(3)
                                that.form.itemType = 0
                                that.form.isPresent = 1
                            }
                        }
                    });

                    //转化商品图片数据,每次保存itemImgs1初始化为空
                    if (this.fileListAdd.length > this.itemImgs1.length){
                        for (var s = 0 ; s < this.fileListAdd.length ; s ++){
                            let obj = {
                                imgUrl:this.fileListAdd[s].url
                            }

                            this.itemImgs1.push(obj)
                        }
                    }

                    // 列表数据赋值
                    if (this.skuProperty.length == 0){
                        this.skucode = []
                        let obj = {
                            skuGroup:[],
                            barCode:''
                        }

                        this.skucode.push(obj)
                        this.skucode[0].barCode = this.code[0].goodscode

                    } else {
                        this.updateShowArr()
                        var skuProperty = [
                            {
                                id: '',
                                skuPropertyName: '',
                                itemSkuPropertyValueDTOS: [
                                    {
                                        id:'',
                                        skuImg:'',
                                        skuPropertyValueName: ''
                                    }
                                ]
                            }
                        ]

                        if (this.skuProperty.length >= skuProperty.length){
                            for (var v = 0 ; v < this.skuProperty.length - 1 ; v ++){
                                let obj = {
                                    id: '',
                                    skuPropertyName: '',
                                    itemSkuPropertyValueDTOS: [
                                        {
                                            id:'',
                                            skuImg:'',
                                            skuPropertyValueName: ''
                                        }
                                    ]
                                }

                                skuProperty.push(obj)
                            }
                        }

                        for (let r in this.skuProperty){
                            if (this.skuProperty[r].itemSkuPropertyValueDTOS.length >= skuProperty[r].itemSkuPropertyValueDTOS.length){
                                for (var f = 0 ; f < this.skuProperty[r].itemSkuPropertyValueDTOS.length - 1 ; f ++){
                                    let obj = {
                                        id:'',
                                        skuImg:'',
                                        skuPropertyValueName: ''
                                    }

                                    skuProperty[r].itemSkuPropertyValueDTOS.push(obj)
                                }
                            }
                        }

                        for (var t in skuProperty){
                            skuProperty[t].skuPropertyName = this.skuProperty[t].skuPropertyName
                            // if (skuProperty[t].skuPropertyName == '') {
                            //     skuPropertyFlg = true
                            // }
                            for (var c in skuProperty[t].itemSkuPropertyValueDTOS){
                                skuProperty[t].itemSkuPropertyValueDTOS[c].skuPropertyValueName = this.skuProperty[t].itemSkuPropertyValueDTOS[c].skuPropertyValueName
                            }
                        }

                        for (var m in this.skuList){
                            for (var l in skuProperty){
                                if (skuProperty[l].skuPropertyName == this.skuList[m].skuPropertyName){
                                    skuProperty[l].id = this.skuList[m].id
                                    for (let p in this.skuList[m].propertyValueList){
                                        for (let y in skuProperty[l].itemSkuPropertyValueDTOS){
                                            if (skuProperty[l].itemSkuPropertyValueDTOS[y].skuPropertyValueName == this.skuList[m].propertyValueList[p].skuPropertyValueName){
                                                skuProperty[l].itemSkuPropertyValueDTOS[y].id = this.skuList[m].propertyValueList[p].id
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    }

                    // console.log(JSON.stringify(this.skucode))
                    // for (let z in this.conTinue){

                    //     skuProperty[0].itemSkuPropertyValueDTOS[z].skuImg = this.conTinue[z].url

                    // }

                    // var skuPropertyFlg = false

                    // if (skuPropertyFlg) {
                    //     this.$message({
                    //         type: 'warning',
                    //         duration: 1500,
                    //         showClose: true,
                    //         message: '请选择商品规格!'
                    //     });
                    //     return
                    // }

                    var supplyProperty = [
                        {
                            id: this.typesname,
                            itemSupplyPropertyDTOS: [
                                {
                                    id:''
                                }
                            ]
                        }
                    ]

                    if (this.typesvalue.length >= supplyProperty[0].itemSupplyPropertyDTOS.length){
                        for (let r = 0 ; r < this.typesvalue.length - 1 ; r ++){
                            let obj =  {
                                id: ''
                            }

                            supplyProperty[0].itemSupplyPropertyDTOS.push(obj)
                        }
                    }
                    var supplyPropertyFlg = false

                    for (let u in this.typesvalue){
                        supplyProperty[0].itemSupplyPropertyDTOS[u].id = this.typesvalue[u].id
                        if (this.typesvalue[u].id == '') {
                            supplyPropertyFlg = true
                        }
                    }

                    if (supplyPropertyFlg) {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '请选择商品包装类型!'
                        });
                        return
                    }

                    if (this.itemImgs1.length == 0) {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '请选择商品图片!'
                        });
                        return
                    }

                    if (this.form.expirationDateStatus == false){
                        this.form.expirationDateStatus = 0
                    } else {
                        this.form.expirationDateStatus = 1
                    }
                    // var propertyFlg = false

                    // this.property.forEach((item, index) => {
                    //     if (item.propertyName == '' || item.propertyValue == '') {
                    //         propertyFlg = true
                    //     }
                    // })

                    // if (propertyFlg) {
                    //     this.$message({
                    //         type: 'warning',
                    //         duration: 1500,
                    //         showClose: true,
                    //         message: '请填写商品属性!'
                    //     });
                    //     return
                    // }

                    let obj = {
                        // 商品信息
                        title: this.form.title,
                        itemCode: this.form.itemCode,
                        skuList: JSON.stringify(this.skucode),
                        mainImg: this.itemImgs1[0].imgUrl,
                        // 商品属性
                        property: JSON.stringify(this.property),
                        // 商品描述
                        description: this.form.description,
                        sellingPoint: this.form.sellingPoint,
                        buyRemind: this.form.buyRemind,
                        expirationDate: this.form.expirationDateName,
                        expirationDateStatus: this.form.expirationDateStatus,
                        tags:'',
                        brandId: this.form.brandId,
                        categoryId: this.form.categoryId[this.form.categoryId.length - 1],
                        unitId: this.form.unitId,
                        onShelf:this.form.onShelf,
                        itemType: this.form.itemType,
                        isPresent: this.form.isPresent,
                        sendWay: this.form.sendWay,
                        rate:this.form.rate,
                        // 商品图片
                        itemImgs: JSON.stringify(this.itemImgs1),
                        // 商品规格
                        skuProperty: JSON.stringify(skuProperty),
                        supplyProperty:JSON.stringify(supplyProperty),
                        suggestedPrice: this.form.suggestedPrice,
                        isBidding:this.form.isBidding,
                        // 其他设置
                        promoteGroupId: this.promoteGroupId,
                        promoteGroupName: this.promoteGroupName,
                        pageView: this.pageView,
                        // 报价
                        supplierAccess:this.setmoneny.toString(),
                        shopAccess:this.shopnum.toString(),
                        // 减少形式
                        stockWay:this.form.stockWay
                    }

                    api.postitemadd(obj).then((response)=>{

                        this.$message({
                            type: 'success',
                            message: '新增商品成功！'
                        })
                        this.$refs['addGoodsForm'].resetFields();
                        this.$router.push({
                            path: '/goodsList'
                        })
                        this.clear()
                    }).catch((error)=>{
                        console.log(error)
                        if (this.form.expirationDateStatus == 1){
                            this.form.expirationDateStatus = true
                        } else {
                            this.form.expirationDateStatus = false
                        }
                    })

                }
            })
        },
        get() {
            this.getbrandId()
            this.getcategoryId()
            this.gettypename()
            this.getunitId()
            this.getSkuList()
            this.getgroup()
            // this.getshopgrouplist()
            this.getPromotesList()
        }
    },
    activated() {
        this.$refs['addGoodsForm'].resetFields();
        this.get()
        this.clear()
        this.editor.txt.clear()
        $('.el-upload--picture-card').css('display', 'inline-block')
    },
    mounted() {
        this.editor = new E('#editorE')
        this.editor.customConfig.customUploadImg = function(files, insert) {
            let formData = new FormData()

            formData.append('uploadType', 'erp')

            formData.append('file', files[0])

            axios.post('/f/upload', formData).then(res => {
                insert(res.data.data.url)

            })

        }
        this.editor.customConfig.onchange = (html) => {
            this.form.description = html
            // console.log(html, 1)
        }
        this.editor.create()

        $('.w-e-text-container').height(600)
    }
}
</script>
<style scoped>
    .jiao{
        position: absolute;
        height: 0px;
        width: 0px;
        border-top: 0px solid transparent;
        border-right: 0px solid #3ea0fc;
        border-bottom: 20px solid #3ea0fc;
        border-left: 20px solid transparent;
        right: 0;
        bottom: 0;
        color: white;
        display: none;
    }
    .active{
        display: block;
    }
    .border{
        border: 1px solid #3ea0fc;
        color: #3ea0fc
    }
    #add{
        position: relative;
    }
    /* 商品通用标题 */
    .good_title{
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: #5f6264;
        display: flex;
        margin: 0
    }
    .position{
        position: absolute;
        left: 420px;
        top:0;
        font-size: 12px
    }
    .goodtitle_p{
        margin-left: 10px;
        font-weight: 600
    }
    /* 面包屑 */
    .add_top{
        height: 45px;
        width: 100%;
        padding: 0 30px;
    }
    /* 主体 */
    .add_conent{
        padding:10px;
        background: #f5f5f5;
        border-top:1px solid #e6e9e9;
        overflow: auto;
        width: 100%
    }
    .conent_box{
        border: 1px solid #e6e9e9
    }
    .conent_box .el-form-item{
        margin: 0
    }
    /* 步骤 */
    .step{
        padding: 20px 10px;
        background: white;
    }

    /* 第一步 */

    /* 商品类型 */
    .good_type{
        width: 100%;
        background: white;
        padding: 15px 20px;
        position: relative
    }
    .color{
        color: #5f6264
    }
    /* 信息内容 */
    .msg_conent{
        background: white;
        padding: 10px 40px;
    }
    .msg_conent .el-textarea{
        width: 688px;
    }
    .msg_conent .el-input{
        width: 258px;
    }
    .msg_conent .el-select{
        width: 258px;
    }
    /* 商品规格 */
    .standard{
        background: white;
        padding: 10px 40px;
    }
    .add_standard{
        border: 1px solid #dce0e6;
        width: 100%;
        padding: 10px;
    }
    .add_small_standard{
        background: #f5f5f5;
        height: 50px;
        padding: 3px 10px;
    }
    .el-upload__input{
        display: none
    }
    .standard_p{
        margin-left: 10px;
        color: #5f6264;
    }
    .updata{
        width: 88px;
        height: 88px;
        line-height: 88px;
        border: 1px dashed #888888;
        text-align: center;
        font-size: 26px
    }

    /* 商品属性 */
    .good_attr{
        background: white;
        padding: 10px 40px;
    }
    .add_button{
        margin:0 0 0 100px
    }
    /* 商品主图 */
    .pic_up{
        background: white;
        padding: 10px 40px;
    }

    /* 控制步骤 */
    .add_bottom{
        height: 50px;
        padding: 10px 25px;
        background: white;
        border-top:1px solid #e5e8e8;
    }

    /* 内容2 */

    /* 供货设置 */
    .supply{
        background: white;
        padding: 10px 40px;
        height: 300px
    }
    .supply_check .el-tag{
        background: none;
        border: none;
        padding: 0;
    }
    /* 分享 */
    .share{
        background: white;
        padding: 10px 40px;
        height: 600px
    }
    /* 其他 */
    .other{
        background: white;
        padding: 10px 40px 100px 40px;
    }
    .share .el-upload--picture-card{
        width: 78px;
        height: 78px;
        line-height: 78px;
    }
    .other .el-tag{
        background: none;
        color: black;
        border: none;
        font-size: 14px
    }
    .other .el-icon-close{
        background: #c0c4ca;
        color: white;
        width: 18px;
        height: 18px;
        line-height: 18px
    }
    .other .el-icon-close:hover{
        font-size: 6px;
        background: #c0c4ca;
    }
    .share .el-form-item {
        margin-bottom: 0;
        height: 140px;
    }
    .skuTable {
        text-align: center;
        font-size: 14px;
        margin-top: 20px;
        margin-bottom: 20px;
        border: 1px solid #eee;
        width: 100%;
    }
    .skuTable .el-input__inner {
        width: 80%;
        height: 30px;
        margin: 5%;
    }
    .skuTable .tableBox {
        display: flex;
        border-top: 1px solid #eee;
    }
    .skuTable .tableBox span {

        flex: 1;
        display: inline-block;
    }
    .skuTable .tableBox tr {
        text-align: center;
        border: 1px solid #eee;
    }
    .skuTable div {
        text-align: center;
        line-height: 50px;
        height: 50px
    }
    .skuTable td {
        border: 1px solid #eee;
        font-weight: 400;
    }
    .skuTable .tableBox2 {
        display: flex;
    }
    .skuTable .tableBox2 span {
        flex: 1;
    }
    .skuTable th {
        text-align: center;
        font-weight: 400;
        height: 50px;
        border: 1px solid #eee;
    }
    .isrequiredClass::before{
        content: "*";
        color: #f56c6c;
        margin-right: -5px;
        margin-left: 5px;
    }

</style>

