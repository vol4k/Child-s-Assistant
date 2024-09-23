import Child from 'images/child.png'
import Boy from 'images/boy.png'
import Girl from 'images/girl.png'
import Block from 'components/common/block/Block'
import './Avatar.css'

export type AvatarProps = {
  uuid: string
  name: string
  sex?: string
  image?: string
  showLabel?: boolean
  isSelected?: boolean
  onClick?: () => void
}

export default function Avatar(props: AvatarProps) {
  const AvatarPicture = () => {
    let src
    switch (props.sex) {
      case 'Boy':
        src = Boy
        break
      case 'Girl':
        src = Girl
        break
      default:
        src = Child
    }

    src = props.image ?? src

    return <img src={src} alt='avatar' />
  }

  return (
    <div className={`avatar ${props.isSelected ? 'selected' : ''}`}>
      <Block onClick={props.onClick}>
        <AvatarPicture />
      </Block>
      {props.showLabel && <label>{props.name}</label>}
    </div>
  )
}
