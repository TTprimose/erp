export default {
    state: {
        showAddGoods: {
            id: 0
        },
        showPurchase: {
            id: 0
        },
        goodsInfoBound: []

    },
    mutations: {
        hideChooseGoods(state, value){
            state.showAddGoods.id = 0
        },
        setGoodsInfoBound(state, value){
            state.goodsInfoBound = value
        },
        showAddGoods(state){
            state.showAddGoods.id = 1
        },
        showPurchase(state){
            state.showPurchase.id = 1
        },
        hidePurchase(state){
            state.showPurchase.id = 0
        }
    }
};
