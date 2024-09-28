import makeRequest, {convertISOtoLocaleISO} from 'api/makeRequest'
import {TaskDataType} from 'components/common/formField/formField'
import {getImageURI, uploadImageFile} from './imageRouter'
import {ImageType} from 'react-images-uploading'
import {parse} from 'date-fns'

const SERVER_ADDRESS = `http://${window.location.hostname}/api`

export type TaskDataRest = {
  uuid: string
  title: string
  section_uuid?: string
  revard: string
  repeat?: string
  start_date?: string
  image_uuid: string
  description: string
  child_uuids: (string | undefined)[]
}
type TaskDataRestList = TaskDataRest[]
type TaskDataTypeList = TaskDataType[]
function convertTaskDataTypeToTaskDataRest(
  formField: TaskDataType
): TaskDataRest {
  const section = formField.Section.at(0)
  const repeat = formField.Repeat.at(0)
  return {
    uuid: formField.uuid,
    title: formField['Task title'],
    section_uuid: section ? section.uuid : undefined,
    revard: formField.Revard,
    repeat: repeat ? repeat.uuid : undefined,
    start_date: formField['Start date']
      ? convertISOtoLocaleISO(formField['Start date'])
      : undefined,
    image_uuid: formField.image_uuid ?? '',
    description: formField.Description,
    child_uuids: formField['Assigned to'].map((assignment) => assignment.uuid),
  }
}
function addOrUpdateTaskQuery(formState: TaskDataType): Promise<void> {
  const API = '/task'

  const bodyEntry = JSON.stringify(convertTaskDataTypeToTaskDataRest(formState))

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

function addOrUpdateTask(formState: TaskDataType): Promise<void> {
  if (formState['Task image']) {
    if (formState['Task image'].file)
      return uploadImageFile(formState['Task image'].file).then(
        (image_uuid) => {
          formState.image_uuid = image_uuid
          return addOrUpdateTaskQuery(formState)
        }
      )
    else return addOrUpdateTaskQuery(formState)
  } else {
    formState.image_uuid = undefined
    return addOrUpdateTaskQuery(formState)
  }
}

export function convertTaskDataRestToTaskDataType(
  response: TaskDataRest
): TaskDataType {
  return {
    uuid: response.uuid,
    'Task title': response.title,
    Section: response.section_uuid ? [{uuid: response.section_uuid}] : [],
    Revard: response.revard,
    Repeat: response.repeat ? [{uuid: response.repeat}] : [],
    'Task image':
      response.image_uuid !== ''
        ? ({dataURL: getImageURI(response.image_uuid)} as ImageType)
        : undefined,
    image_uuid: response.image_uuid,
    'Assigned to': response.child_uuids.map((uuid) => {
      return {uuid: uuid}
    }),
    Description: response.description,
    'Start date': response.start_date
      ? new Date(response.start_date)
      : undefined,
  }
}
function convertTaskDataRestListToTaskDataTypeList(
  response: TaskDataRestList
): TaskDataTypeList {
  return response
    ? response.map((resp) => convertTaskDataRestToTaskDataType(resp))
    : []
}
export enum TasksType {
  star = 'star',
  revard = 'revard',
}
function getTasksWithFilters(filters?: {
  profile_uuid?: string
  section_uuids?: string[]
  start_date?: string
  tasks_type?: TasksType
}): Promise<TaskDataTypeList> {
  const API = '/task/all'
  const endpoint = `${SERVER_ADDRESS}${API}`

  const bodyEntry = JSON.stringify({
    profile_uuid: filters?.profile_uuid,
    section_uuids: filters?.section_uuids ?? [],
    start_date: filters?.start_date,
    tasks_type: filters?.tasks_type,
  })

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  console.log(bodyEntry)

  return makeRequest(endpoint, options).then((response: TaskDataRestList) =>
    convertTaskDataRestListToTaskDataTypeList(response)
  )
}

function getTask(uuid: string): Promise<TaskDataType> {
  const API = '/task/get'
  const endpoint = `${SERVER_ADDRESS}${API}`
  const bodyEntry = JSON.stringify({uuid: uuid})

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options).then((response: TaskDataRest) =>
    convertTaskDataRestToTaskDataType(response)
  )
}

function deleteTask(uuid: string): Promise<void> {
  const API = '/task'
  const endpoint = `${SERVER_ADDRESS}${API}`
  const bodyEntry = JSON.stringify({uuid: uuid})

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options)
}

export {addOrUpdateTask, getTasksWithFilters, getTask, deleteTask}
