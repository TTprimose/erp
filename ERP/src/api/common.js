import HttpClient from 'utils/HttpClient';

export default {
    /************************获取区域地区数据****************************** */
    getProviceData(){
        return HttpClient.get('/address/province');
    },
    getCityData(data){
        return HttpClient.get('/address/' + data + '/city');
    },
    getAreaData(data){
        return HttpClient.get('/address/' + data + '/area');
    },
    getUserInfo(){
        return HttpClient.get('/user/info');
    },
    getUserPerssion(){
        return HttpClient.get('/user/status');
    }
}
