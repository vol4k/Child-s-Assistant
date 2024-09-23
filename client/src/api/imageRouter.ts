import makeRequest from 'api/makeRequest'
import {ImageListType} from 'react-images-uploading'

const SERVER_ADDRESS = `http://${window.location.hostname}/api`

function convertImageListTypeToImageFile(
  imageField: ImageListType
): File | undefined {
  return imageField.at(0)?.file
}
function uploadImage(imageField: ImageListType): Promise<string> {
  const API = '/media'
  const bodyEntry = new FormData()
  const media = convertImageListTypeToImageFile(imageField)
  if (media) bodyEntry.append('media', media)

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'POST',
    body: bodyEntry,
  }

  return makeRequest(endpoint, options).then((res) => res.uuid)
}

function uploadImageFile(image: File): Promise<string> {
  const API = '/media'
  const bodyEntry = new FormData()
  if (image) bodyEntry.append('media', image)

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'POST',
    body: bodyEntry,
  }

  return makeRequest(endpoint, options).then((res) => res.uuid)
}

function deleteImage(uuid: string): Promise<void> {
  const API = `/media/${uuid}`

  const endpoint = `${SERVER_ADDRESS}${API}`
  const options = {
    method: 'DELETE',
  }

  return makeRequest(endpoint, options)
}

function getImageURI(uuid?: string): string | undefined {
  const API = `/media/${uuid}`
  return uuid ? `${SERVER_ADDRESS}${API}` : undefined
}

export {uploadImage, uploadImageFile, deleteImage, getImageURI}
