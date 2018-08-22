import HttpClient from 'utils/HttpClient'

export default {
    // 配置流程！
    // 获取流程名称
    getprocessname(data){
        return HttpClient.get('/process/list', data)
    },
    // 根据ID获取名称
    getprocessid(id){
        return HttpClient.get(`/process/name/${id}`)
    },
    // 新增流程名称
    postprocessadd(data){
        return HttpClient.post('/process/add', data)
    },
    // 修改流程
    putprocessupdate(data){
        return HttpClient.put('/process/update', data)
    },
    // 删除流程
    delprocessid(id){
        return HttpClient.delete(`/process/delete/${id}`)
    },
    // 设置审批流程
    postprocesssetreview(data){
        return HttpClient.post('/process/setreview', data)
    },
    // 查询流程审批详情
    getprocessmoreid(id){
        return HttpClient.get(`/process/${id}`)
    },
    // 获取流程配置用户
    getuseruserList(data) {
        return HttpClient.get('/user/userList', data)
    },
    // 用户列表
    // 获取用户列表
    getuserlist(data) {
        return HttpClient.get('/user/list', data)
    },
    // 新增用户
    postuseradd(data) {
        return HttpClient.post('/user/add', data)
    },
    // 删除用户
    deleteuserdeleteuserId(userId) {
        return HttpClient.delete(`/user/delete/${userId}`)
    },
    // 修改用户信息
    putuserchangeusername(data) {
        return HttpClient.put('/user/changeusername', data)
    },
    // 权限组列表!
    // 获取权限组列表
    getrolelist(data){
        return HttpClient.get('/role/list', data)
    },
    // 新增权限组
    postroleadd(data){
        return HttpClient.post('/role/add', data)
    },
    // 修改权限组
    putroleupdate(data){
        return HttpClient.put('/role/update', data)
    },
    // 删除权限组
    deleteroleid(id){
        return HttpClient.delete(`/role/${id}`)
    },

    // 工作日志
    getactionloglist(data){
        return HttpClient.get('/actionlog/list', data)
    },

    // 权限配置
    getresourcelist(data) {
        return HttpClient.get('/resource/list', data)
    },
    // 获取权限
    getuserstatus(id) {
        return HttpClient.get(`user/status/${id}`)
    },
    // 设置权限
    postrolesetaccess(data) {
        return HttpClient.post('/role/set/access', data)
    },
    //修改密码
    editPassword(data){
        return HttpClient.put('/user/password/edit', data)
    },
    // 重置密码
    putuserresetpassword(data) {
        return HttpClient.put('/user/resetpassword', data)
    }
}
