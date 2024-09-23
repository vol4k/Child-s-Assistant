import './LargePost.css'

import Block from 'components/common/block/Block'
import Avatar from 'components/common/avatar/Avatar'
import {useState} from 'react'
import {getImageURI} from 'api/imageRouter'
import {EventTaskData} from 'api/eventRouter'
import {format} from 'date-fns'

export type PostProps = {
  unfolded?: boolean
  data: EventTaskData
}

export default function LargePost(props: PostProps) {
  const [is_unfolded, unfoldTogle] = useState(props.unfolded)

  const PostHeader = () => {
    return (
      <div className='post-header'>
        <Avatar
          uuid={props.data.child_profile_data.uuid}
          name={props.data.child_profile_data.Name}
          image={getImageURI(props.data.child_profile_data.image_uuid)}
        />
        <div className='event-labels'>
          <span className='event-title'>{`${props.data.child_profile_data.Name} complete the task!`}</span>
          <span className='event-date'>
            {props.data.timestamp
              ? format(props.data.timestamp, 'EEEE h:mm a',)
              : ''}
          </span>
          <span className='event-revard'>
            Revard:{' '}
            {props.data.task_data.Revard
              ? `$${props.data.task_data.Revard}`
              : '1 ✩'}
          </span>
        </div>
      </div>
    )
  }

  const PostContent = () => {
    return (
      <div className='post-content'>
        {props.data.task_data.image_uuid && (
          <div
            className={`task-image-wrapper ${
              is_unfolded ? 'showed' : 'hidden'
            }`}
          >
            <img
              src={getImageURI(props.data.task_data.image_uuid)}
              alt='task-image'
            />
          </div>
        )}
        <div className='task-labels'>
          <span className='task-title'>
            {props.data.task_data['Task title']}
          </span>
        </div>
        {props.data.task_data.Description && (
          <div className={`description ${is_unfolded ? 'showed' : 'hidden'}`}>
            <p>{props.data.task_data.Description}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='post'>
      <Block onClick={() => unfoldTogle(!is_unfolded)}>
        <div className='post-wrapper'>
          <PostHeader />
          <PostContent />
        </div>
      </Block>
    </div>
  )
}
