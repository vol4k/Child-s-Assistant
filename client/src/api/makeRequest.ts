export default function makeRequest(
  endpoint: string,
  options: any
): Promise<any> {
  return fetch(endpoint, options)
    .then((res) => {
      if (!res.ok) {
        return Promise.reject({status: res.status, statusText: res.statusText})
      }
      return res.json()
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

export function convertISOtoLocaleISO(localDate: Date): string {
  const localISO = localDate.toISOString().replace('Z', '')
  const offset = localDate.getTimezoneOffset() * 60000
  const localDateWithOffset = new Date(new Date(localISO).getTime() - offset)

  return localDateWithOffset.toISOString().replace('Z', '')
}
