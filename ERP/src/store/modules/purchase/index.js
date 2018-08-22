export default {
    state: {
        supplierId: '',
        buyerId: '',
        purchaseId: '',
        goodsInfoData: [{
            oper: '',
            itemCode: '',
            barCode: '',
            title: '',
            SKU: '',
            expirationDate: '',
            productData: '',
            purchaseNum: '',
            unit: '',
            unitPrice: '',
            unitTotal: '',
            skuGroups: [""]
        }]
    },
    mutations: {
        setSupplierId(state, value){
            state.supplierId = value
        },
        setBuyerId(state, value){
            state.buyerId = value
        },
        setPurchaseId(state, value){
            state.purchaseId = value
        },
        setGoodsInfoData(state, value){
            state.goodsInfoData = value
        }

    }
};
