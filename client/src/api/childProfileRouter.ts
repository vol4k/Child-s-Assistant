import makeRequest, {convertISOtoLocaleISO} from 'api/makeRequest'
import {
  ChildProfileDataListType,
  ChildProfileDataType,
} from 'components/common/formField/formField'
import {getImageURI, uploadImageFile} from './imageRouter'
import {ImageType} from 'react-images-uploading'

const SERVER_ADDRESS = `http://${window.location.hostname}/api`

export type ChildProfileRest = {
  uuid: string
  name: string
  birthday?: string
  sex?: string
  image_uuid: string
}
type ChildProfileRestList = ChildProfileRest[]
export function convertChildProfileRestToChildProfileDataType(
  profile: ChildProfileRest
): ChildProfileDataType {
  return {
    uuid: profile.uuid,
    Name: profile.name,
    Birthday: profile.birthday ? new Date(profile.birthday) : undefined,
    Sex: [{uuid: profile.sex}],
    Photo:
      profile.image_uuid !== ''
        ? ({dataURL: getImageURI(profile.image_uuid)} as ImageType)
        : undefined,
    image_uuid: profile.image_uuid !== '' ? profile.image_uuid : undefined,
  }
}
function convertChildProfileRestListToChildProfileDataListType(
  dataset: ChildProfileRestList
): ChildProfileDataListType {
  return dataset.map((v) => convertChildProfileRestToChildProfileDataType(v))
}
function getChildren(): Promise<ChildProfileDataListType> {
  const API = '/child-profile/all'

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return makeRequest(endpoint, options).then((res) =>
    convertChildProfileRestListToChildProfileDataListType(res)
  )
}

function getChild(uuid: string): Promise<ChildProfileDataType> {
  const API = '/child-profile/get'
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
    convertChildProfileRestToChildProfileDataType(res)
  )
}

function convertChildProfileDataTypeToChildProfileRest(
  profile: ChildProfileDataType
): ChildProfileRest {
  const sex = profile.Sex.at(0)
  return {
    uuid: profile.uuid,
    name: profile.Name,
    birthday: profile.Birthday
      ? convertISOtoLocaleISO(profile.Birthday)
      : undefined,
    sex: sex ? sex.uuid : undefined,
    image_uuid: profile.image_uuid ?? '',
  }
}
function addOrUpdateChildQuery(formState: ChildProfileDataType): Promise<void> {
  const API = '/child-profile'

  const bodyEntry = JSON.stringify(
    convertChildProfileDataTypeToChildProfileRest(formState)
  )

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
function addOrUpdateChild(formState: ChildProfileDataType): Promise<void> {
  if (formState.Photo) {
    if (formState.Photo.file)
      return uploadImageFile(formState.Photo.file).then((image_uuid) => {
        formState.image_uuid = image_uuid
        return addOrUpdateChildQuery(formState)
      })
    else return addOrUpdateChildQuery(formState)
  } else {
    formState.image_uuid = undefined
    return addOrUpdateChildQuery(formState)
  }
}

function deleteChild(uuid: string): Promise<ChildProfileDataType> {
  const API = '/child-profile'
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
type StarStatisticType = {
  section_title: string
  earned_stars: number
  total_stars: number
}
type StatisticRest = {
  day: string
  stars: StarStatisticType[]
  total_earned: number
}
type StatisticRestList = StatisticRest[]
export type StatisticDataType = {
  stars: StarStatisticType[]
  total_earned: number
}
export type StatisticDataTypePair = {
  today: StatisticDataType
  week: StatisticDataType
}
function convertStatisticRestToStatisticDataType(
  statistic: StatisticRest
): StatisticDataType {
  return {
    stars: [...statistic.stars],
    total_earned: statistic.total_earned,
  }
}
function accumulateStatisticDataType(
  accumulator: StatisticDataType,
  item: StatisticDataType
): StatisticDataType {
  const newAccumulator: StatisticDataType = {stars: [], total_earned: 0}
  accumulator.stars.forEach((a_star: StarStatisticType) => {
    newAccumulator.stars.push({...a_star})
  })

  item.stars.forEach((i_star: StarStatisticType) => {
    const existingStar = newAccumulator.stars.find(
      (s) => s.section_title === i_star.section_title
    )
    if (existingStar) {
      existingStar.earned_stars += i_star.earned_stars
      existingStar.total_stars += i_star.total_stars
    } else {
      newAccumulator.stars.push({...i_star})
    }
  })

  newAccumulator.total_earned = accumulator.total_earned + item.total_earned
  return newAccumulator
}
function convertStatisticRestListToStatisticDataTypePair(
  dataset: StatisticRestList
): StatisticDataTypePair {
  const todayRest = dataset.pop()
  const today: StatisticDataType = convertStatisticRestToStatisticDataType(
    todayRest!
  )
  var week: StatisticDataType = today
  dataset.forEach((statistic) => {
    week = accumulateStatisticDataType(
      week,
      convertStatisticRestToStatisticDataType(statistic)
    )
  })
  return {today: {...today}, week: {...week}}
}
function getStatistic(uuid: string): Promise<StatisticDataTypePair> {
  const API = '/child-profile/statistic'

  const bodyEntry = JSON.stringify({
    uuid: uuid,
    today: convertISOtoLocaleISO(new Date()),
  })

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options).then((res) =>
    convertStatisticRestListToStatisticDataTypePair(res)
  )
}

function getFullStatistic(): Promise<StatisticDataTypePair> {
  return getChildren()
    .then((children) => {
      return Promise.all(children.map((child) => getStatistic(child.uuid)))
    })
    .then((stats: StatisticDataTypePair[]) => {
      const accumulatedStats = stats.reduce(
        (
          accumulator: StatisticDataTypePair,
          currentValue: StatisticDataTypePair
        ) => {
          return {
            today: accumulateStatisticDataType(
              accumulator.today,
              currentValue.today
            ),
            week: accumulateStatisticDataType(
              accumulator.week,
              currentValue.week
            ),
          }
        },
        {
          today: {stars: [], total_earned: 0},
          week: {stars: [], total_earned: 0},
        }
      )

      return accumulatedStats
    })
}

export {
  getChildren,
  getChild,
  addOrUpdateChild,
  deleteChild,
  getStatistic,
  getFullStatistic,
}
