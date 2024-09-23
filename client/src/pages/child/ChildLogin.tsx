import './ChildLogin.css'
import Child from 'images/child.png'

import LargeInscription from 'components/common/largeInscription/LargeInscription'
import {useNavigate} from 'react-router-dom'
import Block from 'components/common/block/Block'
import BackButton from 'components/backButton/BackButton'
import Carousel, {Direction, Justify} from 'components/common/сarousel/Сarousel'
import Avatar, {AvatarProps} from 'components/common/avatar/Avatar'
import {useEffect, useState} from 'react'
import {ChildProfileDataListType} from 'components/common/formField/formField'
import {
  AvatarsInterface,
  convertProfilesToAvatars,
} from 'pages/parent/ParentDashboard'
import {getChildren} from 'api/childProfileRouter'

export default function ChildLogin() {
  const nav = useNavigate()
  const [avatars, setAvatars] = useState<AvatarsInterface>([])

  useEffect(() => {
    getChildren().then((childProfiles: ChildProfileDataListType) => {
      setAvatars(convertProfilesToAvatars(childProfiles))
    })
  }, [])

  const generateAvatars = (avatars: AvatarProps[]) => {
    if (avatars.length)
      return (
        <>
          {avatars.map((props, i) => (
            <Avatar
              key={props.uuid}
              {...props}
              onClick={() => {
                nav(`dashboard/${props.uuid}`)
              }}
            />
          ))}
        </>
      )
    else
      return (
        <label className='empty_label'>
          {'So far there are no children. :)'}
        </label>
      )
  }

  const Avatars = () => {
    return <>{generateAvatars(avatars)}</>
  }

  return (
    <div className='childLogin'>
      <BackButton navTo='/choose' />
      <div className='rowWrapper'>
        <div className='childIconGrid'>
          <Block>
            <img src={Child} alt='child' />
            <div className='labelWrapper'>
              <label>Child</label>
            </div>
          </Block>
        </div>
        <div className='choose-wrapper'>
          <Block>
            {avatars.length ? <LargeInscription label='Choose' /> : <></>}
            <Carousel direction={Direction.horizontal} justify={Justify.start}>
              <Avatars />
            </Carousel>
          </Block>
        </div>
      </div>
    </div>
  )
}
