import makeRequest from 'api/makeRequest'
import {SectionType} from 'components/common/formField/formField'

const SERVER_ADDRESS = `http://${window.location.hostname}/api`

type SectionRest = {
  uuid: string
  title: string
  start_time: string
  end_time: string
}
type SectionRestList = SectionRest[]
export type SectionTypeList = SectionType[]
function convertSectionRestToSectionType(response: SectionRest): SectionType {
  return {
    uuid: response.uuid,
    Title: response.title,
    'Start time': response.start_time,
    'End time': response.end_time,
  }
}
function convertSectionRestListToSectionTypeList(
  dataset: SectionRestList
): SectionTypeList {
  return dataset.map((data) => convertSectionRestToSectionType(data))
}
function getAllSections(): Promise<SectionTypeList> {
  const API = '/section/all'

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return makeRequest(endpoint, options).then((res) =>
    convertSectionRestListToSectionTypeList(res)
  )
}

function getSection(uuid: string): Promise<SectionType> {
  const API = '/section/get'

  const bodyEntry = JSON.stringify({uuid: uuid})
  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options).then((res) =>
    convertSectionRestToSectionType(res)
  )
}

function convertSectionTypeToSectionRest(formState: SectionType): SectionRest {
  return {
    uuid: formState.uuid,
    title: formState.Title,
    start_time: formState['Start time'],
    end_time: formState['End time'],
  }
}
function addOrupdateSection(formState: SectionType): Promise<void> {
  const API = '/section'

  const bodyEntry = JSON.stringify(convertSectionTypeToSectionRest(formState))
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

function deleteSection(uuid: string): Promise<void> {
  const API = '/section'

  const bodyEntry = JSON.stringify({uuid: uuid})
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

export {
  getAllSections, 
  getSection, 
  addOrupdateSection, 
  deleteSection
}
