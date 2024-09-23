import {reject} from 'lodash'

export default function makeRequest(
  endpoint: string,
  options: any
): Promise<any> {
  return fetch(endpoint, options)
    .then((res) => {
      if (!res.ok) {
        switch (res.status) {
          case 403:
            reject(
              new Error(
                'Forbidden: You do not have permission to access this resource.'
              )
            )
            break
          case 404:
            reject(
              new Error('Not Found: The requested resource could not be found.')
            )
            break
          case 500:
            reject(
              new Error(
                'Internal Server Error: An error occurred on the server.'
              )
            )
            break
          default:
            reject(new Error(`HTTP error! Status: ${res.status}`))
        }
      }
      return res.json()
    })
    .catch((reason) => console.error(reason))
}

export function convertISOtoLocaleISO(localDate: Date): string {
  const localISO = localDate.toISOString().replace('Z', '')
  const offset = localDate.getTimezoneOffset() * 60000
  const localDateWithOffset = new Date(new Date(localISO).getTime() - offset)

  return localDateWithOffset.toISOString().replace('Z', '')
}
