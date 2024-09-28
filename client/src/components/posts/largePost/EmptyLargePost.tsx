import './LargePost.css'

import Block from 'components/common/block/Block'

export default function EmptyLargePost() {
  return (
    <div className='post secondary'>
      <Block>
        <div className='post-wrapper'>
          <label className='empty_label'>
            Nothing has happened so far, have a good day!
          </label>
        </div>
      </Block>
    </div>
  )
}
