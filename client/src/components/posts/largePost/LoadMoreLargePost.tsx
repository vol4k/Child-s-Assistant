import './LargePost.css'

import Block from 'components/common/block/Block'

export default function LoadMoreLargePost(props: {onClick: () => void}) {
  return (
    <div className='post'>
      <Block onClick={props.onClick}>
        <div className='post-wrapper'>
          <label className='empty_label'>Load more...</label>
        </div>
      </Block>
    </div>
  )
}
