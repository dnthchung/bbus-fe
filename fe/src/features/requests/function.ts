//path :  fe/src/features/requests/function
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'

//get all request
//result : [ { "requestId": "2083c6b2-7b9d-4651-b9ee-f63f34778d2e", "requestTypeId": "a9f42863-57b4-4b82-91fb-227f82ecaa20", "requestTypeName": "Yêu cầu đổi điểm đón/trả cho học sinh", "studentId": null, "studentName": null, "sendByUserId": "ad16b132-4da0-42c3-8e73-21a8b00eded5", "checkpointId": "080e0ee6-a265-48c1-a8d5-f00cc28fbe47", "checkpointName": "test", "approvedByUserId": "a9ce782b-15ae-4610-b541-e4ef71f9cfef", "approvedByName": "sysadmin", "fromDate": null, "toDate": null, "reason": "Xin đổi điểm đón cho con tôi vì tôi chuyển nhà!", "reply": "Đã chuyển checkpoint và xe mới cho toàn bộ học sinh. Vui lòng kiểm tra lại thông tin tại trang quản lý học sinh.", "status": "APPROVED" }, { "requestId": "645fefa7-1271-47b2-8356-66cc164f780b", "requestTypeId": "a9f42863-57b4-4b82-91fb-227f82ecaa20", "requestTypeName": "Yêu cầu đổi điểm đón/trả cho học sinh", "studentId": null, "studentName": null, "sendByUserId": "680c2fc8-8d94-4ad4-9ceb-4d1921c4210a", "checkpointId": "987ac0dd-4864-4f09-a165-caa41f52ec71", "checkpointName": "Bến xe Mỹ Đình", "approvedByUserId": null, "approvedByName": null, "fromDate": null, "toDate": null, "reason": "Xin đổi điểm đón cho con tôi vì tôi chuyển nhà!", "reply": null, "status": "PENDING" }, { "requestId": "d0e59605-5edb-43d8-a774-fdc83f703cd3", "requestTypeId": "7fba6d6c-137f-428c-958f-fe6160469be8", "requestTypeName": "Đơn xin nghỉ học", "studentId": "d1796768-ac1e-4ddb-b63b-773afd6dde5d", "studentName": "Lý Khánh Hạnh", "sendByUserId": "ad16b132-4da0-42c3-8e73-21a8b00eded5", "checkpointId": null, "checkpointName": null, "approvedByUserId": null, "approvedByName": null, "fromDate": "2025-05-11", "toDate": "2025-05-14", "reason": "Xin đổi điểm đón cho con tôi vì tôi chuyển nhà!", "reply": null, "status": "PENDING" }, { "requestId": "e94ca716-2f1e-40b4-b812-592d8fc2cad8", "requestTypeId": "a9f42863-57b4-4b82-91fb-227f82ecaa20", "requestTypeName": "Yêu cầu đổi điểm đón/trả cho học sinh", "studentId": null, "studentName": null, "sendByUserId": "dfc39200-7004-45da-aedd-722dae618920", "checkpointId": "987ac0dd-4864-4f09-a165-caa41f52ec71", "checkpointName": "Bến xe Mỹ Đình", "approvedByUserId": "2fc4b89f-1b77-4060-80e6-d685d2d4b499", "approvedByName": "teacher", "fromDate": null, "toDate": null, "reason": "Xin đổi điểm đón cho con tôi vì tôi chuyển nhà!", "reply": "Đã xác nhận", "status": "APPROVED" } ]
export async function getAllRequest() {
  try {
    const response = await API_SERVICES.requests.get_all_request()
    const requests = response.data.data.requests || response.data.requests
    console.log('All requests:', requests)
    return requests
  } catch (error) {
    console.error('Error fetching all requests:', error)
    toast({
      title: 'Error',
      description: 'Failed to fetch requests',
      variant: 'deny',
    })
    throw error
  }
}

//get all request type
//[ { "requestTypeId": "5c8da669-43e7-4e20-91a2-d53234ddd2f0", "requestTypeName": "Đơn khác" }, { "requestTypeId": "7fba6d6c-137f-428c-958f-fe6160469be8", "requestTypeName": "Đơn xin nghỉ học" }, { "requestTypeId": "a9f42863-57b4-4b82-91fb-227f82ecaa20", "requestTypeName": "Yêu cầu đổi điểm đón/trả cho học sinh" } ]
export async function getAllRequestType() {
  try {
    const response = await API_SERVICES.requests.get_all_request_type()
    const requestTypes = response.data.data.requestTypes || response.data.requestTypes
    console.log('All request types:', requestTypes)
    return requestTypes
  } catch (error) {
    console.error('Error fetching request types:', error)
    toast({
      title: 'Error',
      description: 'Failed to fetch request types',
      variant: 'deny',
    })
    throw error
  }
}

// get request by id
//url - /request/e94ca716-2f1e-40b4-b812-592d8fc2cad8
//result : { "requestId": "e94ca716-2f1e-40b4-b812-592d8fc2cad8", "requestTypeId": "a9f42863-57b4-4b82-91fb-227f82ecaa20", "requestTypeName": "Yêu cầu đổi điểm đón/trả cho học sinh", "studentId": null, "studentName": null, "sendByUserId": "dfc39200-7004-45da-aedd-722dae618920", "checkpointId": "987ac0dd-4864-4f09-a165-caa41f52ec71", "checkpointName": "Bến xe Mỹ Đình", "approvedByUserId": "2fc4b89f-1b77-4060-80e6-d685d2d4b499", "approvedByName": "teacher", "fromDate": null, "toDate": null, "reason": "Xin đổi điểm đón cho con tôi vì tôi chuyển nhà!", "reply": "Đã xác nhận", "status": "APPROVED" }
export async function getRequestById(requestId: string) {
  try {
    const response = await API_SERVICES.requests.get_a_request_details_by_request_id(requestId)
    const requestDetails = response.data.data || response.data
    console.log('Request details:', requestDetails)
    return requestDetails
  } catch (error) {
    console.error('Error fetching request details:', error)
    toast({
      title: 'Error',
      description: 'Failed to fetch request details',
      variant: 'deny',
    })
    throw error
  }
}

//reply request
//url - /request/reply
//body : {"requestId": "e94ca716-2f1e-40b4-b812-592d8fc2cad8", "reply": "Đã xác nhận", "status": "APPROVED"}
export async function processChangeCheckpoint(requestId: string) {
  try {
    const response = await API_SERVICES.requests.process_change_checkpoint(requestId)
    console.log('Process change checkpoint response:', response.data)

    toast({
      title: 'Success',
      description: 'Checkpoint change processed successfully',
      variant: 'default',
    })

    return response.data
  } catch (error) {
    console.error('Error processing checkpoint change:', error)
    toast({
      title: 'Error',
      description: 'Failed to process checkpoint change',
      variant: 'deny',
    })
    throw error
  }
}
//process change checkpoint
//url - /request/process-change-checkpoint/c1bea58b-27fb-43a2-bf2b-22b1aef7afaf
export async function replyRequest(requestId: string, reply: string, status: 'APPROVED' | 'REJECTED') {
  try {
    const requestData = {
      requestId,
      reply,
      status,
    }

    const response = await API_SERVICES.requests.reply_request(requestData)
    console.log('Reply request response:', response.data)

    toast({
      title: 'Success',
      description: `Request ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully`,
      variant: 'default',
    })

    return response.data
  } catch (error) {
    console.error('Error replying to request:', error)
    toast({
      title: 'Error',
      description: 'Failed to reply to request',
      variant: 'deny',
    })
    throw error
  }
}
