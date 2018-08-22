import HttpClient from 'utils/HttpClient';
export default {
    recallList(data){
        return HttpClient.put('/approval/creator/' + data.processType, data);
    },
    getWaitReviewList(data){
        return HttpClient.get('/approval/auditor/findByCondition', data);
    },
    getReviewRecord(data){
        return HttpClient.get('/approval/record', data);
    },
    getILaunchedList(data){
        return HttpClient.get('/approval/creator/findByCondition', data);
    },
    getIReviewList(data){
        return HttpClient.get('/approval/audited/findByCondition', data);
    },
    auditorReview(data){
        return HttpClient.post('/approval/auditor', data);
    },
    waitRe_look(processType, orderId){
        return HttpClient.get(`/approval/getOrder/${processType}/${orderId}`);
    },
    getProcessList(data){
        return HttpClient.get('/approval/admin/findByCondition', data);
    }
}
