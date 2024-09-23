import './ParentDashboard.css'

import Child from 'images/child.png'
import TaskImage from 'images/task.png'

import LargePost from 'components/posts/largePost/LargePost'
import Carousel, {Direction, Justify} from 'components/common/сarousel/Сarousel'
import Avatar, {AvatarProps} from 'components/common/avatar/Avatar'
import BackButton from 'components/backButton/BackButton'
import SummaryDashboard from 'components/summaryDashboard/SummaryDashboard'
import {useEffect, useState} from 'react'

import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import TaskPost from 'components/posts/taskPost/TaskPost'
import ModalComponent from 'components/modalComponent/ModalComponent'
import {
  EditTaskSheme,
  NewProfileSheme,
  NewTaskSheme,
  ChildProfileDataListType,
  ChildProfileDataType,
  TaskDataType,
} from 'components/common/formField/formField'
import SettingsDashboard from 'components/settingsDashboard/SettingsDashboard'
import {addOrUpdateChild, getChildren} from 'api/childProfileRouter'
import {getAllSections, SectionTypeList} from 'api/sectionRouter'
import {addOrUpdateTask, deleteTask, getTasksWithFilters} from 'api/taskRouter'
import {
  EventTaskDataList,
  getAllEventsWithFilters,
  getEventTasks,
} from 'api/eventRouter'
import EmptyLargePost from 'components/posts/largePost/EmptyLargePost'
import EmptyTaskPost from 'components/posts/taskPost/EmptyTaskPost'
import {convertISOtoLocaleISO} from 'api/makeRequest'
import LoadMoreLargePost from 'components/posts/largePost/LoadMoreLargePost'

export type AvatarsInterface = AvatarProps[]
type EventTasksBlock = {
  day: Date
  posts: EventTaskDataList
}
type EventTasksBlockList = EventTasksBlock[]

export function convertProfileToAvatar(
  profile: ChildProfileDataType
): AvatarProps {
  return {
    uuid: profile.uuid,
    name: profile['Name'],
    sex: profile.Sex.at(0) ? profile.Sex.at(0)!.name : undefined,
    image: profile['Photo']?.dataURL ?? undefined,
    showLabel: true,
  } as AvatarProps
}

export function convertProfilesToAvatars(
  dataset: ChildProfileDataType[]
): AvatarsInterface {
  return dataset.map((profile: ChildProfileDataType): AvatarProps => {
    return convertProfileToAvatar(profile)
  })
}

export default function ParentDashboard() {
  const [selectedProfileUUID, setSelectedProfileUUID] = useState<
    string | undefined
  >(undefined)
  const [selectedTaskUUID, setSelectedTaskUUID] = useState<string | undefined>(
    undefined
  )

  const [sections, setSections] = useState<SectionTypeList>([])
  const [profiles, setProfiles] = useState<ChildProfileDataListType>([])
  const [avatars, setAvatars] = useState<AvatarsInterface>([])
  const [eventTasksBlocks, setEventTasksBlocks] = useState<EventTasksBlockList>(
    []
  )
  const [taskPosts, setTaskPosts] = useState<TaskDataType[]>([])

  const [openNewProfileModal, setOpenNewProfileModal] = useState(false)
  const [openNewTaskModal, setOpenNewTaskModal] = useState(false)
  const [openEditTaskModal, setOpenEditTaskModal] = useState(false)
  
  function loadMoreEventTasks(eventTasksBlocks: EventTasksBlockList) {
    var day = eventTasksBlocks.slice(-1)[0]?.day
    if (day) {
      day = new Date(day)
      day.setDate(day.getDate() - 1)
    } else day = new Date()

    getAllEventsWithFilters({
      child_profile_uuid: selectedProfileUUID,
      date: convertISOtoLocaleISO(day),
    }).then((events) => {
      getEventTasks(events.map((e) => e.uuid)).then((eventTasks) => {
        setEventTasksBlocks(
          [...eventTasksBlocks, {day: day, posts: eventTasks}].sort((v) =>
            v.day.getTime()
          )
        )
      })
    })
  }

  useEffect(() => {
    getChildren().then((childProfiles: ChildProfileDataListType) => {
      setProfiles(childProfiles)
      setAvatars(convertProfilesToAvatars(childProfiles))
    })
    getAllSections()
      .then((response: SectionTypeList) => {
        setSections(response)
        return response
      })
      .then((response) =>
        getTasksWithFilters({section_uuids: response.map((s) => s.uuid)}).then(
          (tasks) => setTaskPosts(tasks)
        )
      )
    loadMoreEventTasks([])
  }, [])

  useEffect(() => {
    loadMoreEventTasks([])
  }, [selectedProfileUUID])

  const checkSelectedProfileUUID = (
    newUUID: string,
    odlUUID: string | undefined
  ) => {
    if (newUUID === odlUUID) setSelectedProfileUUID(undefined)
    else setSelectedProfileUUID(newUUID)
  }

  const dateLabel = (postDate: Date) => {
    const differenceInDays = new Date().getDate() - postDate.getDate()

    switch (differenceInDays) {
      case 0:
        return 'Today'
      case 1:
        return 'Yesterday'
      default:
        return postDate.toLocaleDateString('es-CL')
    }
  }

  const generateDailyPosts = (posts: EventTasksBlockList) => {
    if (posts.length !== 0)
      return (
        <>
          {posts.map((dataset) => {
            return (
              <div key={dataset.day.getTime()}>
                <div className='post-date'>
                  <label>{dateLabel(dataset.day)}</label>
                </div>
                {dataset.posts.length ? (
                  dataset.posts.map((postData, i) => (
                    <LargePost
                      key={`${postData.task_data.uuid}${postData.child_profile_data.uuid}`}
                      unfolded={!i}
                      data={postData}
                    />
                  ))
                ) : (
                  <EmptyLargePost />
                )}
              </div>
            )
          })}
          <LoadMoreLargePost
            onClick={() => {
              loadMoreEventTasks(eventTasksBlocks)
            }}
          />
        </>
      )
    else return <EmptyLargePost />
  }

  const generateTaskPosts = (tasks: TaskDataType[]) => {
    if (tasks.length !== 0)
      return (
        <>
          {tasks.map((taskProps, i) => (
            <TaskPost
              key={taskProps.uuid}
              sections={sections}
              onEdit={() => {
                setSelectedTaskUUID(taskProps.uuid)
                setEventTasksBlocks([])
                setOpenEditTaskModal(true)
              }}
              onDelete={() => {
                deleteTask(taskProps.uuid).then(() =>
                  getTasksWithFilters({
                    section_uuids: sections.map((s) => s.uuid),
                  }).then((tasks) => setTaskPosts(tasks))
                )
              }}
              taskProps={taskProps}
              profiles={profiles}
            />
          ))}
        </>
      )
    else return <EmptyTaskPost />
  }

  const generateAvatars = (avatars: AvatarProps[]) => {
    return (
      <>
        {avatars.map((props, i) => (
          <Avatar
            key={props.uuid ?? `avatar-${i}`}
            {...props}
            isSelected={props.uuid === selectedProfileUUID}
            onClick={() => {
              checkSelectedProfileUUID(props.uuid, selectedProfileUUID)
            }}
          />
        ))}
      </>
    )
  }

  const newChildProps: AvatarProps = {
    uuid: 'new-child-button',
    name: 'New child',
    image: Child,
    showLabel: true,
    onClick: () => setOpenNewProfileModal(!openNewProfileModal),
  }

  const newTaskProps: AvatarProps = {
    uuid: 'new-task-button',
    name: 'New task',
    image: TaskImage,
    showLabel: true,
    onClick: () => setOpenNewTaskModal(!openNewTaskModal),
  }

  const DailyPosts = () => {
    return generateDailyPosts(eventTasksBlocks)
  }

  const TaskPosts = () => {
    return generateTaskPosts(taskPosts)
  }

  const Avatars = () => {
    return <>{generateAvatars(avatars)}</>
  }

  const SummaryDashboardComponent = () => {
    return (
      <SummaryDashboard
        showOptions
        selectedProfileUUID={selectedProfileUUID}
        profiles={profiles}
        avatars={avatars}
        setProfiles={setProfiles}
        setAvatars={setAvatars}
        setSelectedProfileUUID={setSelectedProfileUUID}
      />
    )
  }

  return (
    <Tabs
      disableUpDownKeys={true}
      className='tabs'
      selectedTabClassName='selectedTab'
    >
      <TabList className='tablist'>
        <Tab>Childs</Tab>
        <Tab>Tasks</Tab>
      </TabList>

      <TabPanel>
        <div className='parentDashboard'>
          <div className='primary-content'>
            <BackButton navTo='/choose' />
            <Carousel direction={Direction.horizontal} justify={Justify.start}>
              <Avatars />
              {newChildProps && <Avatar {...newChildProps} />}
            </Carousel>
            <SummaryDashboardComponent />
            <Carousel direction={Direction.vertical}>
              <DailyPosts />
            </Carousel>
          </div>
          <div className='secondary-content'>
            <SummaryDashboardComponent />
          </div>
        </div>
        <ModalComponent
          formSheme={NewProfileSheme()}
          modalIsOpen={openNewProfileModal}
          setIsOpen={setOpenNewProfileModal}
          onSubmitEvent={(formState: ChildProfileDataType) => {
            addOrUpdateChild(formState).then(() =>
              getChildren().then((childProfiles: ChildProfileDataListType) => {
                setProfiles(childProfiles)
                setAvatars(convertProfilesToAvatars(childProfiles))
              })
            )
          }}
        />
      </TabPanel>
      <TabPanel>
        <div className='parentDashboard'>
          <div className='primary-content'>
            <BackButton navTo='/choose' />
            <SettingsDashboard
              newTaskProps={newTaskProps}
              sections={sections}
              setSections={setSections}
            />
            <Carousel direction={Direction.vertical}>
              <TaskPosts />
            </Carousel>
          </div>
          <div className='secondary-content'>
            <SettingsDashboard
              newTaskProps={newTaskProps}
              sections={sections}
              setSections={setSections}
            />
          </div>
        </div>
      </TabPanel>
      <ModalComponent
        formSheme={NewTaskSheme(profiles, sections)}
        modalIsOpen={openNewTaskModal}
        setIsOpen={setOpenNewTaskModal}
        onSubmitEvent={(formState: TaskDataType) => {
          addOrUpdateTask(formState).then(() =>
            getTasksWithFilters({
              section_uuids: sections.map((s) => s.uuid),
            }).then((tasks) => setTaskPosts(tasks))
          )
        }}
      />
      {selectedTaskUUID !== undefined ? (
        <ModalComponent
          formSheme={EditTaskSheme(
            profiles,
            sections,
            taskPosts.filter((task) => task.uuid === selectedTaskUUID).at(0)!
          )}
          modalIsOpen={openEditTaskModal}
          setIsOpen={setOpenEditTaskModal}
          onSubmitEvent={(formState: TaskDataType) => {
            addOrUpdateTask(formState).then(() =>
              getTasksWithFilters({
                section_uuids: sections.map((s) => s.uuid),
              }).then((tasks) => setTaskPosts(tasks))
            )
          }}
        />
      ) : (
        <></>
      )}
    </Tabs>
  )
}
