import './ToDoPost.css'
import Block from 'components/common/block/Block'

export default function EmptyToDoPost() {
  return (
    <div className={`todo-post`}>
      <Block>
        <div className='post-content'>
          <div className='post-wrapper'>
            <label className='empty_label'>
              No tasks have been added so far, have a good day!
            </label>
          </div>
        </div>
      </Block>
    </div>
  )
}
