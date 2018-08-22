import HttpClient from '../utils/HttpClient';
export default {
    /********** 仓库管理 *********/
    // 获取仓库列表
    getWarehouseList(data) {
        return HttpClient.get('/warehouse/list', data);
    },
    // 获取过滤后仓库列表
    getWarehouseListActive(data) {
        return HttpClient.get('/warehouse/findAll', data);
    },
    // 新增仓库
    addWarehouse(data) {
        return HttpClient.post('/warehouse/add', data);
    },
    // 修改仓库
    editWarehouse(data) {
        return HttpClient.put('/warehouse/update', data);
    },
    // 删除仓库
    deleteWarehouse(id) {
        return HttpClient.delete(`/warehouse/delete/${id}`);
    },
    // 仓库详情
    getWarehouseDetail(id) {
        return HttpClient.get(`/warehouse/${id}`);
    },
    // 修改仓库状态
    editWarehouseState(data) {
        return HttpClient.put('/warehouse/change/status', data);
    },
    /********** 入库 *********/
    // 新增入库单
    addInboundOrder(data) {
        return HttpClient.postJSON('/store/insertOrder', data);
    },
    // 查询入库单列表
    getInboundList(data) {
        return HttpClient.get('/store/findByCondition', data);
    },
    // 入库单详情
    getInboundDetail(id) {
        return HttpClient.get(`/store/${id}`);
    },
    // 删除入库单
    delInboundOrder(id) {
        return HttpClient.delete(`/store/${id}`);
    },
    // 作废入库单
    invalidInbound(data) {
        return HttpClient.put('/store/invalidOrder', data);
    },
    // 作废入库单列表
    getInvalidInboundList(data) {
        return HttpClient.get('/store/findByInvalidCondition', data);
    },
    /********** 出库 *********/
    // 新增出库单
    addOutboundOrder(data) {
        return HttpClient.postJSON('/deliver/insertOrder', data);
    },
    // 修改出库单
    editOutboundOrder(data) {
        return HttpClient.put('/deliver/updateOrder', data);
    },
    // 出库单列表
    getOutboundList(data) {
        return HttpClient.get('/deliver/findByCondition', data);
    },
    // 出库单详情
    getOutboundDetail(id) {
        return HttpClient.get(`/deliver/${id}`);
    },
    // 删除出库单
    delOutboundOrder(id) {
        return HttpClient.delete(`/deliver/${id}`);
    },
    // 撤销审核
    undoAudit(type, data) {
        return HttpClient.put(`/approval/creator/${type}`, data);
    },
    /********** 库存 *********/
    // 库存列表
    getInventoryList(data) {
        return HttpClient.get('/storage/inventory/findByCondition', data);
    },
    // 修改库存
    editInventory(data) {
        return HttpClient.put('/storage/inventory/update', data);
    },
    // 出入库记录
    inoutBound(data) {
        return HttpClient.get('/storage/inventory/findItemByCondition', data);

    },
    // 出入库订单详情
    inoutBoundDetail(data) {
        return HttpClient.get('/storage/inventory/findOrder', data);
    },
    /********** 调拨单*********/
    // 新增调拨单
    addAllotOrder(data) {
        return HttpClient.postJSON('/storage/allocation/insert', data);
    },
    // 调拨单列表
    getAllotList(data) {
        return HttpClient.get('/storage/allocation/findByCondition', data);
    },
    // 调拨单详情
    getAllotDetail(id) {
        return HttpClient.get(`/storage/allocation/${id}`);
    },
    // 删除调拨单
    delAllotOrder(id) {
        return HttpClient.delete(`/storage/allocation/${id}`);
    },
    // 获取采购单列表
    getPurchaseAll() {
        return HttpClient.get(`/buyer/findAll`);
    },
    // 获取商品类目
    getItemAll() {
        return HttpClient.get(`/item/category/list`);
    },
    // 盘点导出
    exportInventory(id, data) {
        return HttpClient.get(`/storage/stockCount/export/${id}`, data)
    },
    // 盘点导入
    importInventory(data) {
        return HttpClient.post(`/storage/stockCount/import`, data)
    },
    // 盘点异常导出
    reExportInventory(id) {
        return HttpClient.get(`/storage/stockCount/reExport/${id}`)
    },
    // 查询SKU属性列表
    searchSkuList(data) {
        return HttpClient.get(`/item/sku/list`, data)
    },
    // 获取采购单列表(待入库和部分入库)
    getPurchaseList(data) {
        return HttpClient.get(`/purchase/findByConditionForStore`, data)
    },
    // 根据采购单获取详情
    getPurchaseDetail(id) {
        return HttpClient.get(`/purchase/${id}`)
    },
    // 根据采购退货单获取详情
    getReturnOrderDetail(id) {
        return HttpClient.get(`/returnOrder/${id}`)
    },
    // 出库时获取库存
    getInventoryOutbound(data) {
        return HttpClient.get(`/storage/inventory/getCount`, data)
    }
}
