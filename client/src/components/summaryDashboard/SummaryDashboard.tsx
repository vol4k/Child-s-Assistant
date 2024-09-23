import {PieChart} from 'react-minimal-pie-chart'
import {v4 as uuid4} from 'uuid'
import {MdEdit, MdDelete} from 'react-icons/md'
import Block from 'components/common/block/Block'
import './SummaryDashboard.css'
import money_bag_img from 'images/money bag.png'
import title_img from 'images/title.png'
import Avatar from 'components/common/avatar/Avatar'
import {Dispatch, useEffect, useState} from 'react'
import ModalComponent from 'components/modalComponent/ModalComponent'
import {
  EditProfileSheme,
  ChildProfileDataType,
  ChildProfileDataListType,
} from 'components/common/formField/formField'
import {
  AvatarsInterface,
  convertProfilesToAvatars,
} from 'pages/parent/ParentDashboard'
import {differenceInYears} from 'date-fns'
import {
  addOrUpdateChild,
  deleteChild,
  getChildren,
  getFullStatistic,
  getStatistic,
  StatisticDataType,
  StatisticDataTypePair,
} from 'api/childProfileRouter'
import {profile} from 'console'

type ModalProps = {
  selectedProfileUUID?: string
  profiles: ChildProfileDataType[]
  avatars: AvatarsInterface
  setProfiles: Dispatch<React.SetStateAction<ChildProfileDataType[]>>
  setAvatars: Dispatch<React.SetStateAction<AvatarsInterface>>
  openEditProfileModal: boolean
  setOpenEditProfileModal: Dispatch<React.SetStateAction<boolean>>
}

function Modals(props: ModalProps) {
  if (props.selectedProfileUUID !== undefined)
    return (
      <ModalComponent
        formSheme={EditProfileSheme(
          props.profiles
            .filter((profile) => profile.uuid === props.selectedProfileUUID)
            .at(0)!
        )}
        modalIsOpen={props.openEditProfileModal}
        setIsOpen={props.setOpenEditProfileModal}
        onSubmitEvent={(formState: ChildProfileDataType) => {
          addOrUpdateChild(formState).then(() =>
            getChildren().then((childProfiles: ChildProfileDataListType) => {
              props.setProfiles(childProfiles)
              props.setAvatars(convertProfilesToAvatars(childProfiles))
            })
          )
        }}
      />
    )
  else return <></>
}

export default function SummaryDashboard(props: {
  selectedProfileUUID?: string
  profiles: ChildProfileDataType[]
  avatars: AvatarsInterface
  setProfiles: Dispatch<React.SetStateAction<ChildProfileDataType[]>>
  setAvatars: Dispatch<React.SetStateAction<AvatarsInterface>>
  setSelectedProfileUUID: Dispatch<React.SetStateAction<string | undefined>>
  showOptions?: boolean
}) {
  type PieData = {
    title: string
    value: number
    max_value: number
    money: number
    color: string
  }[]
  const [openEditProfileModal, setOpenEditProfileModal] =
    useState<boolean>(false)
  const [statistic, setStatistic] = useState<StatisticDataTypePair>({
    today: {
      stars: [],
      total_earned: 0,
    },
    week: {
      stars: [],
      total_earned: 0,
    },
  })

  useEffect(() => {
    if (props.selectedProfileUUID)
      getStatistic(props.selectedProfileUUID).then((response) =>
        setStatistic(response)
      )
    else getFullStatistic().then((response) => setStatistic(response))
  }, [])

  const getPieData = (statistic: StatisticDataType): PieData => {
    const earnedStars = statistic.stars.reduce(
      (accumulator, currentValue) => accumulator + currentValue.earned_stars,
      0
    )

    const allStars = statistic.stars.reduce(
      (accumulator, currentValue) => accumulator + currentValue.total_stars,
      0
    )

    return [
      {
        title: props.selectedProfileUUID
          ? props.profiles.find((p) => p.uuid === props.selectedProfileUUID)
              ?.Name!
          : 'All children',
        value: earnedStars || 0,
        max_value: allStars || 0,
        money: statistic.total_earned || 0,
        color: 'gold',
      },
    ]
  }

  const OptionsBlock = (props: {
    selectedProfileUUID?: string
    onEdit: () => void
    onDelete: () => void
    showOptions?: boolean
  }) => {
    if (props.showOptions && props.selectedProfileUUID !== undefined)
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
    else return <div></div>
  }

  const TitleBlock = (props: {name?: string}) => {
    return (
      <div className='titleWrapper'>
        <img src={title_img} alt='title backstage' />
        <h1>{props.name ?? 'All children'}</h1>
      </div>
    )
  }

  const Profile = (props: {profile?: ChildProfileDataType}) => {
    const getLabel = () => {
      let sex = undefined
      let ages = undefined
      if (props.profile?.Sex.at(0)) {
        sex = [
          {name: 'Boy', uuid: 'sex-boy'},
          {name: 'Girl', uuid: 'sex-girl'},
        ]
          .filter((option) => option.uuid === props.profile?.Sex.at(0)?.uuid)
          .at(0)?.name
      }
      if (props.profile?.Birthday)
        ages = [
          differenceInYears(new Date(), props.profile!.Birthday),
          'years old',
        ].join(' ')

      if (sex && ages) return [sex, ages].join(', ')
      else if (sex) return sex
      else if (ages) return ages
      else return ''
    }

    if (props.profile !== undefined)
      return (
        <div className='profileWrapper'>
          <div className='profileImage'>
            <Avatar
              uuid={props.profile.uuid}
              name={props.profile.Name ?? ''}
              sex={
                props.profile.Sex.at(0)
                  ? props.profile.Sex.at(0)!.name
                  : undefined
              }
              image={props.profile['Photo']?.dataURL}
            />
          </div>
          <label>{getLabel()}</label>
        </div>
      )
    else return <div></div>
  }

  const Pie = (props: {data: PieData}) => {
    return (
      <PieChart
        totalValue={props.data.at(0)?.max_value}
        lineWidth={20}
        data={props.data}
        animate={true}
        rounded={true}
        background='whitesmoke'
        radius={45}
        startAngle={180}
        viewBoxSize={[100, 100]}
        labelStyle={{
          fontSize: '16px',
          fontFamily: 'sans-serif',
          fill: 'gold',
        }}
        labelPosition={0}
        label={({dataEntry}) => `${Math.round(dataEntry.value)}✩`}
      />
    )
  }

  const StarsBlock = (props: {title: string; cur: number; max: number}) => {
    return (
      <div className='starsWrapper'>
        <h1>{props.title}</h1>
        <div className='starsContainer'>
          <label>
            <span style={{color: 'gold'}}>{`${props.cur}✩`}</span>
            {` out of ${props.max}✩`}
          </label>
        </div>
      </div>
    )
  }

  const MoneyBlock = (props: {total_earned: number}) => {
    return (
      <div className='moneyBagWrapper'>
        <img src={money_bag_img} alt='money bag' />
        <span>${props.total_earned}</span>
      </div>
    )
  }

  const GoalBlock = (props: {title: string; data: StatisticDataType}) => {
    return (
      <div className='goalWapper' key={`GoalBlock-${uuid4()}`}>
        <h1>{props.title}</h1>
        <Pie data={getPieData(props.data)} />
        {props.data.stars.map((v) => {
          return (
            <StarsBlock
              key={`StarsBlock-${uuid4()}`}
              title={v.section_title}
              cur={v.earned_stars}
              max={v.total_stars}
            />
          )
        })}
        <MoneyBlock total_earned={props.data.total_earned} />
      </div>
    )
  }

  return (
    <div className='summaryDashboard' id='dashboard'>
      <Block>
        <div className='contentWrapper'>
          <OptionsBlock
            showOptions={props.showOptions}
            selectedProfileUUID={props.selectedProfileUUID}
            onEdit={() => setOpenEditProfileModal(!openEditProfileModal)}
            onDelete={() => {
              const selectedProfileUUID = props.selectedProfileUUID!
              const uuid = props.profiles
                .filter((profile) => profile.uuid === selectedProfileUUID)
                .at(0)?.uuid
              props.setSelectedProfileUUID(undefined)

              deleteChild(uuid ?? '').then(() =>
                getChildren().then(
                  (childProfiles: ChildProfileDataListType) => {
                    props.setProfiles(childProfiles)
                    props.setAvatars(convertProfilesToAvatars(childProfiles))
                  }
                )
              )
            }}
          />
          <TitleBlock
            name={
              props.profiles.find((p) => p.uuid === props.selectedProfileUUID)
                ?.Name
            }
          />
          <Profile
            profile={
              props.selectedProfileUUID !== undefined
                ? props.profiles
                    .filter(
                      (profile) => profile.uuid === props.selectedProfileUUID
                    )
                    .at(0)
                : undefined
            }
          />
          <div className='contentContainer'>
            <GoalBlock title="Today's goal" data={statistic?.today!} />
            <GoalBlock title="Week's goal" data={statistic?.week!} />
          </div>
        </div>
      </Block>
      <Modals
        profiles={props.profiles}
        avatars={props.avatars}
        selectedProfileUUID={props.selectedProfileUUID}
        setProfiles={props.setProfiles}
        setAvatars={props.setAvatars}
        openEditProfileModal={openEditProfileModal}
        setOpenEditProfileModal={setOpenEditProfileModal}
      />
    </div>
  )
}
