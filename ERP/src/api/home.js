import HttpClient from 'utils/HttpClient';
export default {
    getHomeInfo(){
        return HttpClient.get('/storage/inventory/index')
    }
}
