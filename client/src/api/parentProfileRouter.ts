import {
  AutoDeleteType,
  PasswordSettingsType,
  ResetType,
  SetupFormType,
  WeekStartType,
} from '../components/common/formField/formField'
import makeRequest from 'api/makeRequest'

const SERVER_ADDRESS = `http://${window.location.hostname}/api`

function checkParentUserIsExist(): Promise<boolean> {
  const API = '/parent-profile/exist'

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return makeRequest(endpoint, options).then((res) => res.exists)
}

type CredentialsRest = {
  password?: string
  sec_q?: string
  sec_a?: string
  auto_delete?: string
  week_start?: string
}
function convertSetupFormTypeToCredentialsRest(
  formState: SetupFormType
): CredentialsRest {
  return {
    password: formState.Password,
    sec_q: formState['Secret question'],
    sec_a: formState.Answer,
    auto_delete: formState['Auto Delete'].at(0)?.uuid,
    week_start: formState['Week Start'].at(0)?.uuid,
  }
}
function updateCred(formState: SetupFormType): Promise<void> {
  const API = '/parent-profile/update'
  const endpoint = `${SERVER_ADDRESS}${API}`
  const bodyEntry = JSON.stringify(
    convertSetupFormTypeToCredentialsRest(formState)
  )

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options)
}

type PasswordRest = {
  password: string
}
function convertPasswordSettingsTypeToPasswordRest(
  formField: PasswordSettingsType
): PasswordRest {
  return {
    password: formField.Password,
  }
}
function updatePassword(formField: PasswordSettingsType): Promise<void> {
  const API = '/parent-profile/password'
  const endpoint = `${SERVER_ADDRESS}${API}`
  const bodyEntry = JSON.stringify(
    convertPasswordSettingsTypeToPasswordRest(formField)
  )

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options)
}

function checkPassword(password: string): Promise<boolean> {
  const API = '/parent-profile/password/check'
  const endpoint = `${SERVER_ADDRESS}${API}`

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({password: password}),
  }

  return makeRequest(endpoint, options)
    .then((res) => res.status)
    .catch((res) => false)
}

type ResetRest = {
  sec_q: string
  sec_a: string
}
function convertResetTypeToResetRest(formField: ResetType): ResetRest {
  return {
    sec_q: formField['Secret question'],
    sec_a: formField['Answer'],
  }
}
function checkAnswer(formField: ResetType): Promise<boolean> {
  const API = '/parent-profile/security/check'
  const endpoint = `${SERVER_ADDRESS}${API}`
  const bodyEntry = JSON.stringify(convertResetTypeToResetRest(formField))

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options).then((res) => res.status)
}

function updateSecret(formField: ResetType): Promise<void> {
  const API = '/parent-profile/security'
  const endpoint = `${SERVER_ADDRESS}${API}`
  const bodyEntry = JSON.stringify(convertResetTypeToResetRest(formField))

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyEntry,
  }

  return makeRequest(endpoint, options)
}

function convertResetRestToResetType(response: ResetRest): ResetType {
  return {
    'Secret question': response.sec_q,
    Answer: response.sec_a,
  }
}

function getSecret(): Promise<ResetType> {
  const API = '/parent-profile/security'
  const endpoint = `${SERVER_ADDRESS}${API}`

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return makeRequest(endpoint, options).then((res) =>
    convertResetRestToResetType(res)
  )
}

function getSecurityQuestion(): Promise<string> {
  const API = '/parent-profile/security/question'

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return makeRequest(endpoint, options).then((res) => res.question)
}

type AutoDeleteRest = {
  auto_delete: string
}
function convertAutoDeleteTypeToAutoDeleteRest(
  formField: AutoDeleteType
): AutoDeleteRest {
  const auto_delete = formField['Auto Delete'].at(0)

  return {
    auto_delete: auto_delete?.uuid ?? 'auto-delete-never',
  }
}
function updateAutoDelete(formField: AutoDeleteType): Promise<void> {
  const API = '/parent-profile/auto_delete'
  const bodyEntry = JSON.stringify(
    convertAutoDeleteTypeToAutoDeleteRest(formField)
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

function convertAutoDeleteRestToAutoDeleteType(
  response: AutoDeleteRest
): AutoDeleteType {
  switch (response.auto_delete) {
    case 'auto-delete-45':
      return {
        'Auto Delete': [{name: 'Older than 45 days', uuid: 'auto-delete-45'}],
      }
    case 'auto-delete-90':
      return {
        'Auto Delete': [{name: 'Older than 90 days', uuid: 'auto-delete-90'}],
      }
    case 'auto-delete-180':
      return {
        'Auto Delete': [{name: 'Older than 180 days', uuid: 'auto-delete-180'}],
      }
    case 'auto-delete-365':
      return {
        'Auto Delete': [{name: 'Older than 365 days', uuid: 'auto-delete-365'}],
      }
    default:
      return {'Auto Delete': [{name: 'Never', uuid: 'auto-delete-never'}]}
  }
}

function getAutoDelete(): Promise<AutoDeleteType> {
  const API = '/parent-profile/auto_delete'

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return makeRequest(endpoint, options).then((res) =>
    convertAutoDeleteRestToAutoDeleteType(res)
  )
}

type WeekStartRest = {
  week_start: string
}
function convertWeekStartTypeToWeekStartRest(
  formField: WeekStartType
): WeekStartRest {
  const week_start = formField['Week Start'].at(0)

  return {
    week_start: week_start?.uuid ?? 'week-start-monday',
  }
}
function updateWeekStart(formField: WeekStartType): Promise<void> {
  const API = '/parent-profile/week'
  const bodyEntry = JSON.stringify(
    convertWeekStartTypeToWeekStartRest(formField)
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

function convertWeekStartRestToWeekStartType(
  response: WeekStartRest
): WeekStartType {
  switch (response.week_start) {
    case 'week-start-monday':
      return {
        'Week Start': [{name: 'Monday', uuid: 'week-start-monday'}],
      }
    case 'week-start-tuesday':
      return {
        'Week Start': [{name: 'Tuesday', uuid: 'week-start-tuesday'}],
      }
    case 'week-start-wednesday':
      return {
        'Week Start': [{name: 'Wednesday', uuid: 'week-start-wednesday'}],
      }
    case 'week-start-thursday':
      return {
        'Week Start': [{name: 'Thursday', uuid: 'week-start-thursday'}],
      }
    case 'week-start-friday':
      return {
        'Week Start': [{name: 'Friday', uuid: 'week-start-friday'}],
      }
    case 'week-start-saturday':
      return {
        'Week Start': [{name: 'Saturday', uuid: 'week-start-saturday'}],
      }
    case 'week-start-sunday':
      return {
        'Week Start': [{name: 'Sunday', uuid: 'week-start-sunday'}],
      }
    default:
      return {
        'Week Start': [{name: 'Monday', uuid: 'week-start-monday'}],
      }
  }
}

function getWeekStart(): Promise<WeekStartType> {
  const API = '/parent-profile/week'

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return makeRequest(endpoint, options).then((res) =>
    convertWeekStartRestToWeekStartType(res)
  )
}

export {
  checkParentUserIsExist,
  updateCred,
  updatePassword,
  checkPassword,
  checkAnswer,
  getSecurityQuestion,
  updateSecret,
  getSecret,
  updateAutoDelete,
  getAutoDelete,
  updateWeekStart,
  getWeekStart,
}
