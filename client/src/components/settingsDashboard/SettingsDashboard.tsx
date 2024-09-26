import {
  getAutoDelete,
  getSecret,
  getWeekStart,
  updateAutoDelete,
  updatePassword,
  updateSecret,
  updateWeekStart,
} from 'api/parentProfileRouter'
import './SettingsDashboard.css'
import Avatar, {AvatarProps} from 'components/common/avatar/Avatar'
import {
  AutoDeleteSheme,
  AutoDeleteType,
  NewSectionSheme,
  PasswordSettingsSheme,
  PasswordSettingsType,
  ResetType,
  SecretQuestionSettingsSheme,
  SecretQuestionType,
  SectionType,
  WeekStartSettingsSheme,
  WeekStartType,
} from 'components/common/formField/formField'
import Carousel, {Justify} from 'components/common/carousel/Carousel'
import ModalComponent from 'components/modalComponent/ModalComponent'
import SectionPost from 'components/posts/sectionPost/SectionPost'

import LockImage from 'images/lock.png'
import QuestionImage from 'images/question.png'
import SectionImage from 'images/section.png'
import DeleteImage from 'images/trash_basket.png'
import WeekImage from 'images/week.png'

import {useEffect, useState} from 'react'
import {
  addOrupdateSection,
  getAllSections,
  SectionTypeList,
} from 'api/sectionRouter'
import EmptySectionPost from 'components/posts/sectionPost/EmptySectionPost'

export default function SettingsDashboard(props: {
  newTaskProps: AvatarProps
  sections: SectionTypeList
  setSections: React.Dispatch<React.SetStateAction<SectionTypeList>>
}) {
  const [passwordModal, setPasswordModal] = useState<boolean>(false)
  const [questionModal, setQuestionModal] = useState<boolean>(false)
  const [newSectionModal, setNewSectionModal] = useState<boolean>(false)
  const [autoDeleteModal, setAutoDeleteModal] = useState<boolean>(false)
  const [weekStartModal, setWeekStartModal] = useState(false)

  const [sec_props, setSecProps] = useState<SecretQuestionType>({
    'Secret question': '',
    Answer: '',
  })
  const [auto_delete_props, setAutoDeleteProps] = useState<AutoDeleteType>({
    'Auto Delete': [{name: 'Never', uuid: 'auto-delete-never'}],
  })
  const [week_start_props, setWeekStartProps] = useState<WeekStartType>({
    'Week Start': [{name: 'Monday', uuid: 'week-start-monday'}],
  })

  useEffect(() => {
    getAllSections().then((sections: SectionTypeList) =>
      props.setSections(sections)
    )
    getSecret().then((res: SecretQuestionType) => setSecProps(res))
    getAutoDelete().then((res: AutoDeleteType) => setAutoDeleteProps(res))
    getWeekStart().then((res: WeekStartType) => setWeekStartProps(res))
  }, [])

  const PasswordSettingsProps: AvatarProps = {
    uuid: 'password-settings-button',
    name: 'Password Settings',
    image: LockImage,
    showLabel: true,
    onClick: () => setPasswordModal(!passwordModal),
  }

  const QuestionSettingsProps: AvatarProps = {
    uuid: 'secret-question-button',
    name: 'Secret Question',
    image: QuestionImage,
    showLabel: true,
    onClick: () => setQuestionModal(!questionModal),
  }

  const NewSectionProps: AvatarProps = {
    uuid: 'new-section-button',
    name: 'New Section',
    image: SectionImage,
    showLabel: true,
    onClick: () => setNewSectionModal(!newSectionModal),
  }

  const AutoDeleteProps: AvatarProps = {
    uuid: 'auto-delete-button',
    name: 'Auto Delete',
    image: DeleteImage,
    showLabel: true,
    onClick: () => setAutoDeleteModal(!autoDeleteModal),
  }

  const WeekStartProps: AvatarProps = {
    uuid: 'week-start-button',
    name: 'Week Start',
    image: WeekImage,
    showLabel: true,
    onClick: () => setWeekStartModal(!weekStartModal),
  }

  const SettingsCarousel = () => {
    return (
      <Carousel justify={Justify.start}>
        <Avatar {...PasswordSettingsProps} />
        <Avatar {...QuestionSettingsProps} />
        <Avatar {...AutoDeleteProps} />
        <Avatar {...WeekStartProps} />
        <Avatar {...NewSectionProps} />
        <Avatar {...props.newTaskProps} />
      </Carousel>
    )
  }

  const Modals = () => {
    return (
      <>
        <ModalComponent
          formSheme={PasswordSettingsSheme()}
          modalIsOpen={passwordModal}
          setIsOpen={() => setPasswordModal(!passwordModal)}
          onSubmitEvent={(formState: PasswordSettingsType) => {
            updatePassword(formState)
          }}
        />
        <ModalComponent
          formSheme={SecretQuestionSettingsSheme(sec_props)}
          modalIsOpen={questionModal}
          setIsOpen={setQuestionModal}
          onSubmitEvent={(formState: ResetType) => {
            updateSecret(formState).then(() =>
              getSecret().then((res: SecretQuestionType) => setSecProps(res))
            )
          }}
        />
        <ModalComponent
          formSheme={NewSectionSheme()}
          modalIsOpen={newSectionModal}
          setIsOpen={setNewSectionModal}
          onSubmitEvent={(formState: any) => {
            addOrupdateSection(formState).then(() =>
              getAllSections().then((sections) => props.setSections(sections))
            )
          }}
        />
        <ModalComponent
          formSheme={AutoDeleteSheme(auto_delete_props)}
          modalIsOpen={autoDeleteModal}
          setIsOpen={setAutoDeleteModal}
          onSubmitEvent={(formState: any) => {
            updateAutoDelete(formState).then(() =>
              getAutoDelete().then((res: AutoDeleteType) =>
                setAutoDeleteProps(res)
              )
            )
          }}
        />
        <ModalComponent
          formSheme={WeekStartSettingsSheme(week_start_props)}
          modalIsOpen={weekStartModal}
          setIsOpen={setWeekStartModal}
          onSubmitEvent={(formState: any) => {
            updateWeekStart(formState).then(() =>
              getWeekStart().then((res: WeekStartType) =>
                setWeekStartProps(res)
              )
            )
          }}
        />
      </>
    )
  }

  const SectionPosts = () => {
    return (
      <div className='sections'>
        <label className='sections-title'>Sections</label>
        {props.sections.length ? (
          props.sections.map((sectionProps: SectionType) => (
            <SectionPost
              key={sectionProps.uuid}
              sectionProps={sectionProps}
              setSections={props.setSections}
            />
          ))
        ) : (
          <EmptySectionPost />
        )}
      </div>
    )
  }

  return (
    <div className='settings-dashboard'>
      <SettingsCarousel />
      <SectionPosts />
      <Modals />
    </div>
  )
}
