import HttpClient from 'utils/HttpClient'

export default {
    // 商品分类！
    // 查询商品分类列表
    getcategorylist(data){
        return HttpClient.get('/item/category/list', data)
    },
    // 查看商品分类详情
    getcategoryid(id){
        return HttpClient.get(`/item/category/${id}`)
    },
    // 增加商品分类
    postitemcategoryadd(data) {
        return HttpClient.post('/item/category/add', data)
    },
    // 修改商品分类
    putitemcategoryupdate(data) {
        return HttpClient.put('/item/category/update', data)
    },
    // 显示隐藏商品分类
    putitemcategoryisDisplay(data) {
        return HttpClient.put('/item/category/isDisplay', data)
    },
    // 通过商品分类id删除商品分类
    deleteitemcategorydeleteid(id) {
        return HttpClient.delete(`/item/category/delete/${id}`)
    },

    // 商品品牌
    // 查询商品品牌列表
    getitemBrandlist(data) {
        return HttpClient.get('/item/brand/list', data)
    },
    // 根据ID获取商品品牌详情
    getitemBrandid(id) {
        return HttpClient.get(`/item/brand/${id}`)
    },
    // 增加商品品牌
    postitemBrandadd(data) {
        return HttpClient.post('/item/brand/add', data)
    },
    // 修改商品品牌
    putitemitemBrandupdate(data) {
        return HttpClient.put('/item/brand/update', data)
    },
    // 显示隐藏商品品牌
    putitemBrandisRecommended(data) {
        return HttpClient.put('/item/brand/isRecommended', data)
    },
    // 通过商品品牌id删除商品品牌
    deleteitemBranddeleteid(id) {
        return HttpClient.delete(`/item/brand/delete/${id}`)
    },
    // 获取门店分组列表
    getshopgrouplist(data) {
        return HttpClient.get('/shop/group/list', data)
    },
    // 通过商品品牌id查询门店分组
    getitemitemBrandShopGroupitemBrandId(itemBrandId) {
        return HttpClient.get(`/item/itemBrandShopGroup/${itemBrandId}`)
    },

    // 商品规格！
    // 获取商品规格列表
    getitemskuPropertylist(data) {
        return HttpClient.get('/item/skuProperty/list', data)
    },
    // 获取商品规格详情
    getitemskupropertyid(id) {
        return HttpClient.get(`/item/skuProperty/${id}`)
    },
    // 新增商品规格
    postitemskuPropertyadd(data) {
        return HttpClient.postJSON('/item/skuProperty/add', data)
    },
    // 批量更新商品规格选项!
    putitemskuPropertyupdate(data) {
        return HttpClient.putJSON('/item/skuProperty/update', data)
    },

    // 供货规格！
    // 查询商品单位列表(商品添加单位和新增包装规格下拉框)
    getitemunitlist(data) {
        return HttpClient.get('/item/unit/list', data)
    },
    // 新增单位
    postitemunitadd(data) {
        return HttpClient.post('/item/unit/add', data)
    },
    // 供货规格列表
    getitemsupplyPropertylist(data) {
        return HttpClient.get('/item/supplyProperty/list', data)
    },
    // 供货规格详情
    getitemsupplyPropertyunitId(unitId, data) {
        return HttpClient.get(`/item/supplyProperty/${unitId}`, data)
    },
    // 新增包装类型
    postitemsupplyPropertyadd(data) {
        return HttpClient.post('/item/supplyProperty/add', data)
    },
    // 更新包装类型
    putitemsupplyPropertyupdate(data) {
        return HttpClient.put('/item/supplyProperty/update', data)
    },

    // 商品列表!!!
    // 根据条件查询商品列表
    getitemlist(data){
        return HttpClient.get('/item/list', data)
    },
    // 查询sku属性列表
    getitemskuProperty(data) {
        return HttpClient.get('/item/sku/list', data)
    },
    // 添加商品
    postitemadd(data) {
        return HttpClient.post('/item/add', data)
    },
    // 编辑商品
    putitemupdate(data) {
        return HttpClient.putform('/item/update', data)
    },
    // 根据商品id获取商品信息
    getitemitemId(itemId) {
        return HttpClient.get(`/item/${itemId}`)
    },
    // 根据商品ID获取编辑信息
    getitemedititemId(itemId) {
        return HttpClient.get(`/item/edit/${itemId}`)
    },
    // 批量更新
    putitembatchUpdate(data) {
        return HttpClient.put('/item/batchUpdate', data)
    },
    // 商品提成设置
    getitempromotes() {
        return HttpClient.get('/item/promotes')
    },
    // 供应商选择
    getsellerfindAll(data) {
        return HttpClient.get('/seller/findAll', data)
    },
    // 供应商更改
    putsellerupdateSeller(data) {
        return HttpClient.put('/seller/updateSeller', data)
    },
    // 报价设置
    getsuppliergrouplist(data) {
        return HttpClient.get('/supplier/group/list', data)
    },
    // 加价详情
    getitempriceitemId(itemId) {
        return HttpClient.get(`/item/price/${itemId}`)
    },
    // 添加加价
    postitemaddpriceAndBarCode(data) {
        return HttpClient.post('/item/add/priceAndBarCode', data)
    },
    // 更新加价
    putitemupdatepriceAndBarCode(data) {
        return HttpClient.put('/item/update/priceAndBarCode', data)
    },
    // 商品规格的启用禁用
    setSkuPropertyStatus(data){
        return HttpClient.put('/item/skuProperty/set/status', data)
    },
    //商品包装类型的启用禁用
    setSupplyPropertyStatus(data){
        return HttpClient.put('/item/supplyProperty/set/status', data)
    }
}
