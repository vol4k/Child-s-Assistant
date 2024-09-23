import makeRequest from 'api/makeRequest'
import {
  ChildProfileDataType,
  TaskDataType,
} from 'components/common/formField/formField'
import {
  ChildProfileRest,
  convertChildProfileRestToChildProfileDataType,
} from './childProfileRouter'
import {convertTaskDataRestToTaskDataType, TaskDataRest} from './taskRouter'

const SERVER_ADDRESS = `http://${window.location.hostname}/api`

export type EventRest = {
  uuid: string
  child_profile_uuid: string
  task_uuid: string
  date: string
}
function getAllEventsWithFilters(filters?: {
  child_profile_uuid?: string
  date?: string
}): Promise<EventRest[]> {
  const API = '/event/all'

  const bodyEntry = JSON.stringify({
    child_profile_uuid: filters?.child_profile_uuid,
    date: filters?.date,
  })

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options)
}

function getEvent(uuid: string): Promise<EventRest> {
  const API = '/event/get'

  const bodyEntry = JSON.stringify({
    uuid: uuid,
  })

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options)
}

function deleteEvent(uuid: string): Promise<void> {
  const API = '/event'

  const bodyEntry = JSON.stringify({
    uuid: uuid,
  })

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options)
}

function addOrUpdateEvent(
  uuid: string,
  child_profile_uuid: string,
  task_uuid: string,
  date: string
): Promise<void> {
  const API = '/event'

  const bodyEntry = JSON.stringify({
    uuid: uuid,
    child_profile_uuid: child_profile_uuid,
    task_uuid: task_uuid,
    date: date,
  })

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options)
}

export type EventTaskRest = {
  timestamp: string
  child_profile_data: ChildProfileRest
  task_data: TaskDataRest
}
export type EventTaskData = {
  timestamp?: Date
  child_profile_data: ChildProfileDataType
  task_data: TaskDataType
}
export type EventTaskRestList = EventTaskRest[]
export type EventTaskDataList = EventTaskData[]
function convertEventTaskRestToEventTaskData(
  data: EventTaskRest
): EventTaskData {
  return {
    timestamp: data.timestamp ? new Date(data.timestamp) : undefined,
    child_profile_data: convertChildProfileRestToChildProfileDataType(
      data.child_profile_data
    ),
    task_data: convertTaskDataRestToTaskDataType(data.task_data),
  }
}
function convertEventTaskRestListToEventTaskDataList(
  dataset: EventTaskRestList
): EventTaskDataList {
  return dataset.map((data) => convertEventTaskRestToEventTaskData(data))
}
function getEventTasks(uuids: string[]): Promise<EventTaskDataList> {
  const API = '/event/tasks'

  const bodyEntry = JSON.stringify({uuids: uuids})
  
  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options).then((dataset) =>
    convertEventTaskRestListToEventTaskDataList(dataset)
  )
}

function getEventByKeys(
  child_profile_uuid: string,
  task_uuid: string
): Promise<EventRest> {
  const API = '/event/by_keys'

  const bodyEntry = JSON.stringify({
    child_profile_uuid: child_profile_uuid,
    task_uuid: task_uuid,
  })

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options).then((response) => response.event)
}

export {
  getAllEventsWithFilters,
  getEvent,
  deleteEvent,
  addOrUpdateEvent,
  getEventTasks,
  getEventByKeys,
}
