import HttpClient from 'utils/HttpClient';
export default {
    getOrderList(data){
        return HttpClient.get('/order/list', data);
    },
    addRemark(id, data){
        return HttpClient.post(`/order/oneselfRemark/${id}`, data);
    },
    receiveOrderList(secondaryOrderNo, distributionType){
        return HttpClient.put(`/order/receive/${secondaryOrderNo}/${distributionType}`);
    },
    getStoreList(data){
        return HttpClient.get('/shop/list', data);
    },
    getShopuseraddr(data){
        return HttpClient.get('/shopuseraddr/list', data);
    },
    getGoodsData(data){
        return HttpClient.get('/item/supplier-10028/list', data);
    },
    addShopuserAddr(data){
        return HttpClient.post('/shopuseraddr/add', data);
    },
    addOrderList(data){
        return HttpClient.postJSON('/replaceOrder/add', data);
    },
    // 合并订单
    mergeOrder(data) {
        return HttpClient.post('/order/merge', data);
    },
    // 拆分订单
    splitOrder(data) {
        return HttpClient.post('/order/split', data);
    },
    // 待合并订单列表
    getWaitmergeList(data) {
        return HttpClient.get('/order/wait/merge', data);
    },
    // 合并后的订单列表
    getOrdermergeList(data) {
        return HttpClient.get('/order/merge/list', data);
    }


}
