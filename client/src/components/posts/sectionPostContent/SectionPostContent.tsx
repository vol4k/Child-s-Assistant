import {IoMdTime} from 'react-icons/io'
import './SectionPostContent.css'
import {SectionType} from 'components/common/formField/formField'
import {FaHourglassStart} from 'react-icons/fa'

export function isActive(startTimeStr: string, endTimeStr: string): boolean {
  const now = new Date()

  const startTime = new Date(now)
  const endTime = new Date(now)

  const [startHour, startMinute] = startTimeStr.split(':').map(Number)
  const [endHour, endMinute] = endTimeStr.split(':').map(Number)

  startTime.setHours(startHour, startMinute, 0, 0)
  endTime.setHours(endHour, endMinute, 0, 0)
  return now >= startTime && now <= endTime
}

const convertTime = (timeString: string) => {
  let [hours, minutes] = timeString.split(':').map(Number)
  let period = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12 || 12
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export default function TaskPostContent(props: SectionType) {
  return (
    <div className='post-content'>
      <div className='post-header'>
        <div className='section-labels'>
          <label className='section-title'>
            <span>{props.Title}</span>
          </label>
        </div>
      </div>
      <div className='section-labels'>
        <label>
          <FaHourglassStart /> Status:{' '}
          <span>
            {isActive(props['Start time'], props['End time'])
              ? 'Active'
              : 'Inactive'}
          </span>
        </label>
      </div>
      <div className='section-labels'>
        <label>
          <IoMdTime /> From{' '}
          <span className='section-time'>
            {convertTime(props['Start time'])}
          </span>{' '}
          to{' '}
          <span className='section-time'>{convertTime(props['End time'])}</span>
        </label>
      </div>
    </div>
  )
}
