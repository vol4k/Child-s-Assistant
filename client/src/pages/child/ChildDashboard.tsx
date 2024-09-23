import {Tab, TabList, TabPanel, Tabs} from 'react-tabs'
import './ChildDashboard.css'
import BackButton from 'components/backButton/BackButton'
import Carousel, {Direction} from 'components/common/сarousel/Сarousel'
import SummaryDashboard from 'components/summaryDashboard/SummaryDashboard'
import ToDoPost from 'components/posts/toDoPost/ToDoPost'
import {useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import {
  ChildProfileDataType,
  TaskDataType,
} from 'components/common/formField/formField'
import {getChild} from 'api/childProfileRouter'
import {AvatarProps} from 'components/common/avatar/Avatar'
import {convertProfileToAvatar} from 'pages/parent/ParentDashboard'
import {getTasksWithFilters, TasksType} from 'api/taskRouter'
import EmptyToDoPost from 'components/posts/toDoPost/EmptyToDoPost'
import {getAllSections, SectionTypeList} from 'api/sectionRouter'
import {isActive} from 'components/posts/sectionPostContent/SectionPostContent'
import {convertISOtoLocaleISO} from 'api/makeRequest'

export default function ChildDashboard() {
  const {child_profile_uuid} = useParams()
  const [profile, setProfile] = useState<ChildProfileDataType>()
  const [avatar, setAvatar] = useState<AvatarProps | undefined>(undefined)
  const [starTasks, setStarTasks] = useState<TaskDataType[]>([])
  const [revardTasks, setRevardTasks] = useState<TaskDataType[]>([])
  const [sections, setSections] = useState<SectionTypeList>([])

  useEffect(() => {
    getChild(child_profile_uuid ?? '').then((profile) => {
      setProfile(profile)
      setAvatar(convertProfileToAvatar(profile))
    })
    getAllSections().then((sections) => {
      setSections(sections)

      const active_section_uuids = sections
        .filter((s) => isActive(s['Start time'], s['End time']))
        .map((s) => s.uuid)

      getTasksWithFilters({
        profile_uuid: child_profile_uuid,
        section_uuids: active_section_uuids,
        start_date: convertISOtoLocaleISO(new Date()),
        tasks_type: TasksType.star,
      }).then((tasks) => setStarTasks(tasks))
      getTasksWithFilters({
        profile_uuid: child_profile_uuid,
        start_date: convertISOtoLocaleISO(new Date()),
        section_uuids: active_section_uuids,
        tasks_type: TasksType.revard,
      }).then((tasks) => setRevardTasks(tasks))
    })
  }, [])

  const SummaryDashboardComponent = () => {
    if (profile)
      return (
        <SummaryDashboard
          selectedProfileUUID={child_profile_uuid}
          profiles={profile ? [profile] : []}
          avatars={avatar ? [avatar] : []}
          setProfiles={() => {}}
          setAvatars={() => {}}
          setSelectedProfileUUID={() => {}}
        />
      )
    else return <></>
  }

  const TaskPosts = (props: {tasks: TaskDataType[]}) => {
    if (props.tasks.length)
      return (
        <>
          {props.tasks.map((taskProps) => (
            <ToDoPost key={taskProps.uuid} taskProps={taskProps} />
          ))}
        </>
      )
    else return <EmptyToDoPost />
  }

  return (
    <Tabs
      disableUpDownKeys={true}
      className='tabs'
      selectedTabClassName='selectedTab'
    >
      <TabList className='tablist'>
        <Tab>Daily To-Do</Tab>
        <Tab>Money-Maker Tasks</Tab>
      </TabList>

      <TabPanel>
        <div className='childDashboard'>
          <div className='primary-content'>
            <BackButton navTo='/choose' />
            <SummaryDashboardComponent />
            <Carousel direction={Direction.vertical}>
              <TaskPosts tasks={starTasks} />
            </Carousel>
          </div>
          <div className='secondary-content'>
            <SummaryDashboardComponent />
          </div>
        </div>
      </TabPanel>
      <TabPanel>
        <div className='childDashboard'>
          <div className='primary-content'>
            <BackButton navTo='/choose' />
            <SummaryDashboardComponent />
            <Carousel direction={Direction.vertical}>
              <TaskPosts tasks={revardTasks} />
            </Carousel>
          </div>
          <div className='secondary-content'>
            <SummaryDashboardComponent />
          </div>
        </div>
      </TabPanel>
    </Tabs>
  )
}
