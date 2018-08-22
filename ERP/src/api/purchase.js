import HttpClient from 'utils/HttpClient';

export default {
    /************************通用接口****************************** */
    recallList(data){
        return HttpClient.put('/approval/creator/' + data.processType, data);
    },
    /************************供应商****************************** */
    getSupplierSelectData(){
        return HttpClient.get('/seller/findAll');
    },
    getSupplierList(data){
        return HttpClient.get('/seller/findByCondition', data);
    },
    addSupplier(data){
        return HttpClient.post('/seller/insertSeller', data);
    },
    editSupplier(data){
        return HttpClient.put('/seller/updateSeller', data);
    },
    deleteSupplier(data){
        return HttpClient.delete('/seller/' + data);
    },
    getItemSupplierData(data){
        return HttpClient.get('/seller/' + data);
    },
    /************************采购单****************************** */
    getPurchaseList(data){
        return HttpClient.get('/purchase/findByCondition', data);
    },
    getPurchaseByStoreStatus(data){
        return HttpClient.get('/purchase/findByConditionByStoreStatus', data);
    },
    getPurchaseListItem(data){
        return HttpClient.get('/purchase/' + data);
    },
    getStoreRecord(data){
        return HttpClient.get('/store/list/' + data);
    },
    addPurchaseList(data){
        return HttpClient.postJSON('/purchase/insertOrder', data);
    },
    deletePurchaseList(data){
        return HttpClient.delete('/purchase/' + data);
    },
    addStoreList(data){
        return HttpClient.postJSON('/store/insertOrder', data);
    },
    getRepoSelectData(){
        return HttpClient.get('/warehouse/findAll');
    },
    getBuyerComSelectData(){
        return HttpClient.get('/buyer/findAll');
    },
    getChooseGoodsList(data){
        return HttpClient.get('/item/list', data);
    },
    getGoodSItemSelectData(data){
        return HttpClient.get('/item/category/list', data);
    },
    getSKUData(data){
        return HttpClient.get('/item/sku/list', data);
    },
    addInStoreList(data){
        return HttpClient.post('/store/insertOrder', data);
    },
    invalidStoreRecode(data){
        return HttpClient.put('/store/invalidOrder', data);
    },
    getInvalidRecordList(data){
        return HttpClient.get('/store/findByInvalidCondition', data);
    },
    /************************采购单位****************************** */
    getPurchaseComList(data){
        return HttpClient.get('/buyer/list', data);
    },
    getPurchaseComItem(data){
        return HttpClient.get('/buyer/' + data);
    },
    addPurchaseComItem(data){
        return HttpClient.post('/buyer/add', data);
    },
    editPurchaseComItem(data){
        return HttpClient.put('/buyer/update', data);
    },
    onOffPurchaseComItem(data){
        return HttpClient.put('/buyer/status', data);
    },
    /************************采购退货****************************** */
    getRejectListData(data){
        return HttpClient.get('/returnOrder/findByCondition', data);
    },
    addRejectList(data){
        return HttpClient.postJSON('/returnOrder/insertOrder', data);
    },
    getRejectItemData(data){
        return HttpClient.get('/returnOrder/' + data);
    },
    deleteRejectItem(data){
        return HttpClient.delete('/returnOrder/' + data);
    }
}
