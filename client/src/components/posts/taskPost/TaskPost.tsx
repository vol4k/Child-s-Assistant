import './TaskPost.css'
import Block from 'components/common/block/Block'

import {MdDelete, MdEdit} from 'react-icons/md'
import TaskPostContent from 'components/posts/taskPostContent/TaskPostContent'
import {
  ChildProfileDataListType,
  TaskDataType,
} from 'components/common/formField/formField'
import { SectionTypeList } from 'api/sectionRouter'

type Props = {
  sections: SectionTypeList
  onEdit: () => void
  onDelete: () => void
  taskProps: TaskDataType
  profiles: ChildProfileDataListType
}

export default function TaskPost(props: Props) {
  const OptionsBlock = () => {
    return (
      <div className='optionsBlock'>
        <Block onClick={props.onEdit}>
          <MdEdit color='lightblue' />
        </Block>
        <Block onClick={props.onDelete}>
          <MdDelete color='lightcoral' />
        </Block>
      </div>
    )
  }

  return (
    <div className='task-post'>
      <Block>
        <div className='post-wrapper'>
          <OptionsBlock />
          <TaskPostContent sections={props.sections} data={props.taskProps} profiles={props.profiles} />
        </div>
      </Block>
    </div>
  )
}
