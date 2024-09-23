import './SectionPost.css'
import Block from 'components/common/block/Block'

export default function EmptySectionPost() {
  return (
    <div className='section-post empty_post'>
      <Block>
        <div className='post-wrapper'>
          <label className='empty_label'>There are no sections yet!</label>
        </div>
      </Block>
    </div>
  )
}
