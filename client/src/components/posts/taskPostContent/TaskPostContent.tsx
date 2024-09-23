import './TaskPostContent.css'

import {FaUsers} from 'react-icons/fa'
import {IoIosText} from 'react-icons/io'
import {MdEmojiEvents, MdDateRange} from 'react-icons/md'
import {
  ChildProfileDataListType,
  TaskDataType,
} from 'components/common/formField/formField'
import {getImageURI} from 'api/imageRouter'
import {SectionTypeList} from 'api/sectionRouter'

export default function TaskPostContent(props: {
  sections: SectionTypeList
  data: TaskDataType
  profiles: ChildProfileDataListType
}) {
  return (
    <div className='post-content'>
      <div className='post-header'>
        <div className='task-labels'>
          <span className='task-title'>{props.data['Task title']}</span>
          <span className='task-type'>
            {
              props.sections
                .filter(
                  (option) => option.uuid === props.data.Section.at(0)?.uuid
                )
                .at(0)?.Title
            }
          </span>
        </div>
      </div>
      {props.data.image_uuid && (
        <div className={`task-image-wrapper`}>
          <img src={getImageURI(props.data.image_uuid)} alt='task-image' />
        </div>
      )}
      <div className='task-labels'>
        <label>
          <MdEmojiEvents /> Revard:
          <span className='task-revard'>
            {props.data.Revard !== '' ? `$${props.data.Revard}` : '1 ✩'}
          </span>
        </label>
      </div>
      <div>
        <label>
          <MdDateRange /> Date:
          <span className='task-date'>
            {props.data['Start date']?.toLocaleDateString('es-CL')}
          </span>
        </label>
      </div>
      <div>
        <label>
          <FaUsers /> Assign to:
          {props.data['Assigned to'].map((v, i) => (
            <span key={v.uuid} className='task-assignment'>
              {props.profiles.find((option) => option.uuid === v.uuid)?.Name}
            </span>
          ))}
        </label>
      </div>
      {props.data.Description && (
        <div className={`description`}>
          <label>
            <IoIosText /> Task description
          </label>
          <p>{props.data.Description}</p>
        </div>
      )}
    </div>
  )
}
