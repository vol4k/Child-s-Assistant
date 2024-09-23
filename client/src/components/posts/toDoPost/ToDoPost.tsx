import './ToDoPost.css'
import Block from 'components/common/block/Block'

import {FaStar} from 'react-icons/fa6'
import {useEffect, useState} from 'react'
import {MdEmojiEvents} from 'react-icons/md'
import {IoIosText} from 'react-icons/io'
import {SectionType, TaskDataType} from 'components/common/formField/formField'
import {getImageURI} from 'api/imageRouter'
import {getSection} from 'api/sectionRouter'
import {
  getEventByKeys,
  EventRest,
  deleteEvent,
  addOrUpdateEvent,
} from 'api/eventRouter'
import {useParams} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import {convertISOtoLocaleISO} from 'api/makeRequest'

type Props = {
  taskProps: TaskDataType
}

export default function ToDoPost(props: Props) {
  const [thisSection, setThisSection] = useState<SectionType | undefined>(
    undefined
  )
  const [event, setEvent] = useState<EventRest | undefined>(undefined)
  const {child_profile_uuid} = useParams()

  useEffect(() => {
    const section_uuid = props.taskProps.Section.at(0)?.uuid
    if (section_uuid)
      getSection(section_uuid).then((section) => setThisSection(section))
    getEventByKeys(child_profile_uuid!, props.taskProps.uuid).then(
      (event: EventRest) => setEvent(event)
    )
  }, [])

  const OptionsBlock = () => {
    return (
      <div className='optionsBlock'>
        <Block
          onClick={() => {
            if (event)
              deleteEvent(event.uuid).then(() => {
                setEvent(undefined)
              })
            else {
              addOrUpdateEvent(
                uuidv4(),
                child_profile_uuid!,
                props.taskProps.uuid,
                convertISOtoLocaleISO(new Date())
              ).then(() =>
                getEventByKeys(child_profile_uuid!, props.taskProps.uuid).then(
                  (event: EventRest) => setEvent(event)
                )
              )
            }
          }}
        >
          <FaStar color={event ? 'goldenrod' : 'darkgray'} />
        </Block>
      </div>
    )
  }

  return (
    <div className={`todo-post ${event ? 'checked' : ''}`}>
      <Block>
        <div className='post-content'>
          <div className='post-wrapper'>
            <OptionsBlock />
            <div className='post-header'>
              <div className='task-labels'>
                <span className='task-title'>
                  {props.taskProps['Task title']}
                </span>
                <span className='task-type'>
                  {thisSection ? thisSection.Title : undefined}
                </span>
              </div>
            </div>
          </div>
          {props.taskProps.image_uuid !== '' && (
            <div className={`task-image-wrapper`}>
              <img
                src={
                  props.taskProps.image_uuid
                    ? getImageURI(props.taskProps.image_uuid)
                    : ''
                }
                alt='task-image'
              />
            </div>
          )}
          <div className='task-labels'>
            <label>
              <MdEmojiEvents /> Revard:
              <span className='task-revard'>
                {props.taskProps.Revard ? `$${props.taskProps.Revard}` : '1 ✩'}
              </span>
            </label>
          </div>
          <div className={`description`}>
            <label>
              <IoIosText /> Task description
            </label>
            <p>{props.taskProps.Description}</p>
          </div>
        </div>
      </Block>
    </div>
  )
}
