import './TaskPost.css'
import Block from 'components/common/block/Block'

export default function EmptyTaskPost() {
  return (
    <div className='task-post'>
      <Block>
        <div className='post-wrapper'>
          <label className='empty_label'>
            No tasks have been added so far, have a good day!
          </label>
        </div>
      </Block>
    </div>
  )
}
