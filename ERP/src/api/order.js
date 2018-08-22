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
    getGoodsData(id, data){
        return HttpClient.get(`/item/supplier-${id}/list`, data);
    },
    addShopuserAddr(data){
        return HttpClient.post('/shopuseraddr/add', data);
    },
    addOrderList(data){
        return HttpClient.post('/replaceOrder/add', data);
    },
    //获取当前用户供应商ID
    getSupplierId(){
        return HttpClient.get('/supplier/supplierId');
    },
    // 发货单
    getLogisticsSendList(data) {
        return HttpClient.get('/logisticsSend/list', data);
    },
    // 订单列表异常提交
    postOrderError(secondaryOrderNo, data) {
        return HttpClient.post(`/order/errorSubmit/${secondaryOrderNo}`, data);
    },
    // 售后管理列表
    getRefundList(data) {
        return HttpClient.get('/refund/list', data);
    },
    // 售后详情
    getRefundRefundMsgRefundNo(refundNo) {
        return HttpClient.get(`/refund/refundMsg/${refundNo}`);
    },
    // 订单详情
    getOrderOrderMsg(secondaryOrderNo) {
        return HttpClient.get(`/order/orderMsg/${secondaryOrderNo}`);
    },
    // 订单列表 发货
    orderListSend(data){
        return HttpClient.put('/order/send', data);
    },
    //修改订单
    editOrderList(data){
        return HttpClient.put('/order/update', data);
    },
    //添加赠品
    addGiveaway(data){
        return HttpClient.post('/order/receive/giving', data);
    },
    //删除赠品
    remGiveaway(data){
        return HttpClient.delete(`/order/deleted/giving/${data}`);
    },
    // 获取赠品列表
    getGiveawayList(data){
        return HttpClient.get('/item/gifts', data);
    },
    //同意退款
    agreeRefund(refundNo){
        return HttpClient.put(`/refund/agreeRefund/${refundNo}`);
    },
    //同意退货
    refundCosts(refundNo, data){
        return HttpClient.put(`/refund/sendAddress/${refundNo}`, data);
    },
    //同意退货地址
    getRefundAddressList(){
        return HttpClient.get('/supplieruseraddr/list');
    },
    //拒绝退款
    declineRefund(refundNo, data){
        return HttpClient.put(`/refund/declineRefund/${refundNo}`, data);
    },
    splitOrderList(data){
        return HttpClient.post('/order/separate', data);
    },
    canselSplitOrderList(data){
        return HttpClient.put('/order/cancel', data);
    }


}

