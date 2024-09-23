import './ImageUploadingField.css'

import {useState} from 'react'
import ImageUploading, {ImageListType, ImageType} from 'react-images-uploading'
import {
  MdDelete,
  MdOutlineCloudUpload,
  MdFileDownloadDone,
} from 'react-icons/md'
import Block from 'components/common/block/Block'
import Cropper, {Area, Point} from 'react-easy-crop'

interface ImageUploadingFieldProps {
  label: string
  value?: ImageType
  onChange: CallableFunction
}

const getCroppedImg = (imageSrc: string, crop: Area): Promise<ImageType> => {
  const image = new Image()
  image.src = imageSrc

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      canvas.width = crop.width
      canvas.height = crop.height

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      )

      const dataURL = canvas.toDataURL('image/jpeg')

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'))
          return
        }
        const file = new File([blob], 'cropped-image.jpg', {type: 'image/jpeg'})

        resolve({
          dataURL,
          file,
        })
      }, 'image/jpeg')
    }
    image.onerror = reject
  })
}

function CropperMode(props: {
  image: string | undefined
  resolver: (cropped_image: ImageType) => void
}) {
  const [crop, setCrop] = useState<Point>({x: 0, y: 0})
  const [cropArea, setCropArea] = useState<Area>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCropArea(croppedAreaPixels)
  }

  const onCropSave = () => {
    getCroppedImg(props.image!, cropArea!).then((cropped_image: ImageType) => {
      props.resolver(cropped_image)
    })
  }

  return (
    <div className='uploadingImageWrapper'>
      <Block>
        <Cropper
          image={props.image}
          crop={crop}
          aspect={1}
          classes={{containerClassName: 'cropperContainer'}}
          objectFit='contain'
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
        />
      </Block>
      <div className='optionsBlock'>
        <Block onClick={onCropSave}>
          <MdFileDownloadDone color='green' />
        </Block>
      </div>
    </div>
  )
}

export default function ImageUploadingField({
  label,
  value,
  onChange,
}: ImageUploadingFieldProps) {
  const [image, setImage] = useState<ImageType | undefined>(value)
  const [cropMode, setCropMode] = useState<boolean>(false)
  const maxNumber = 1

  const onChangeHandler = (images: ImageListType) => {
    const image = images.shift()
    setImage(image)
    setCropMode(true)
  }

  function UploadingMode() {
    return (
      <ImageUploading
        value={image ? [image] : []}
        maxNumber={maxNumber}
        onChange={onChangeHandler}
      >
        {({imageList, onImageUpload, onImageUpdate, onImageRemove}) => {
          const onTryImageUpload = () => {
            imageList.length ? onImageUpdate(0) : onImageUpload()
          }

          return (
            <div className='uploadingImageWrapper'>
              <Block onClick={onTryImageUpload}>
                {imageList.length ? (
                  <img src={imageList[0].dataURL} alt='uploadedImage' />
                ) : (
                  <MdOutlineCloudUpload size={150} />
                )}
              </Block>
              {imageList.length !== 0 && (
                <div className='optionsBlock'>
                  <Block
                    onClick={() => {
                      onImageRemove(0)
                      onChange(undefined)
                      setCropMode(false)
                    }}
                  >
                    <MdDelete color='lightcoral' />
                  </Block>
                </div>
              )}
            </div>
          )
        }}
      </ImageUploading>
    )
  }

  function SwitchModeImageField() {
    return cropMode ? (
      <CropperMode
        image={image?.dataURL}
        resolver={(cropped_image: ImageType) => {
          setImage(cropped_image)
          onChange(cropped_image)
          setCropMode(false)
        }}
      />
    ) : (
      <UploadingMode />
    )
  }

  return (
    <div className='imageUploadingField'>
      <label>{label}</label>
      <SwitchModeImageField />
    </div>
  )
}
