import {v4 as uuidv4} from 'uuid'
import {MultiselectOptions} from 'components/fields/multiselectField/MultiselectField'
import {ImageType} from 'react-images-uploading'
import {InputFieldType} from 'components/fields/inputField/InputField'
import {SectionTypeList} from 'api/sectionRouter'

export enum TypeFields {
  invisibleField,
  descriptionField,
  inputField,
  multiselectField,
  imageUploadingField,
  datePikerField,
}

export interface InvisibleFieldInterface {
  type: TypeFields.invisibleField
  label: string
  initialValue?: any
}

export interface DescriptionFieldInterface {
  type: TypeFields.descriptionField
  label: string
  initialValue?: string
}

export interface InputFieldInterface {
  type: TypeFields.inputField
  inputType: InputFieldType
  label: string
  textarea?: boolean
  initialValue?: string
}

export interface MultiselectFieldInterface {
  type: TypeFields.multiselectField
  label: string
  options: MultiselectOptions[]
  initialValue?: MultiselectOptions[]
  singleSelect?: boolean
}

export interface ImageUploadingFieldInterface {
  type: TypeFields.imageUploadingField
  label: string
  initialValue?: ImageType
}

export interface DatePikerFieldInterface {
  type: TypeFields.datePikerField
  label: string
  initialValue?: Date | null
}

export interface FormSheme {
  title: string
  content: Array<
    | InvisibleFieldInterface
    | DescriptionFieldInterface
    | InputFieldInterface
    | MultiselectFieldInterface
    | ImageUploadingFieldInterface
    | DatePikerFieldInterface
  >
}

const invisibleField = (label: string, initialValue?: any) => {
  const field: InvisibleFieldInterface = {
    type: TypeFields.invisibleField,
    label: label,
    initialValue: initialValue,
  }

  return field
}

const descriptionField = (label: string, initialValue?: any) => {
  const field: DescriptionFieldInterface = {
    type: TypeFields.descriptionField,
    label: label,
    initialValue: initialValue,
  }

  return field
}

const inputField = (
  label: string,
  type: InputFieldType,
  initialValue: string = ''
) => {
  const field: InputFieldInterface = {
    type: TypeFields.inputField,
    label: label,
    inputType: type,
    initialValue: initialValue,
  }

  return field
}

const multiselectField = (
  label: string,
  options: MultiselectOptions[],
  initialValue: MultiselectOptions[] = [],
  singleSelect: boolean = false
) => {
  const field: MultiselectFieldInterface = {
    type: TypeFields.multiselectField,
    label: label,
    singleSelect: singleSelect,
    initialValue: initialValue,
    options: options,
  }

  return field
}

const imageField = (label: string, initialValue?: ImageType) => {
  const field: ImageUploadingFieldInterface = {
    type: TypeFields.imageUploadingField,
    label: label,
    initialValue: initialValue,
  }

  return field
}

const dateField = (label: string, initialValue: Date | null = null) => {
  const field: DatePikerFieldInterface = {
    type: TypeFields.datePikerField,
    label: label,
    initialValue: initialValue,
  }

  return field
}

export type ChildProfileDataType = {
  uuid: string
  Name: string
  Birthday: Date | undefined
  Sex: MultiselectOptions[]
  Photo: ImageType | undefined
  image_uuid: string | undefined
}

export type ChildProfileDataListType = ChildProfileDataType[]

const NewProfileSheme = (): FormSheme => {
  return {
    title: "New Child's Profile",
    content: [
      invisibleField('uuid', uuidv4()),
      invisibleField('image_uuid', ''),
      inputField('Name', InputFieldType.input, ''),
      dateField('Birthday', null),
      multiselectField(
        'Sex',
        [
          {name: 'Boy', uuid: 'sex-boy'},
          {name: 'Girl', uuid: 'sex-girl'},
        ],
        [],
        true
      ),
      descriptionField(
        'About Image',
        "After uploading the image, you will enter the image cropping mode.\
        Once you've selected the appropriate frame, please click the green checkmark in the top right corner. \
        Until you click it, the image will not be considered selected. If you want to delete the photo, you can \
        click the corresponding icon in the top right corner."
      ),
      imageField('Photo', undefined),
    ],
  }
}

const EditProfileSheme = (props: ChildProfileDataType): FormSheme => {
  return {
    title: "Edit Child's Profile",
    content: [
      invisibleField('uuid', props.uuid),
      invisibleField('image_uuid', props.image_uuid),
      inputField('Name', InputFieldType.input, props.Name),
      dateField('Birthday', props.Birthday),
      multiselectField(
        'Sex',
        [
          {name: 'Boy', uuid: 'sex-boy'},
          {name: 'Girl', uuid: 'sex-girl'},
        ],
        [
          {name: 'Boy', uuid: 'sex-boy'},
          {name: 'Girl', uuid: 'sex-girl'},
        ].filter((option) => {
          return option.uuid === props.Sex.at(0)?.uuid
        }),
        true
      ),
      descriptionField(
        'About Image',
        "After uploading the image, you will enter the image cropping mode.\
        Once you've selected the appropriate frame, please click the green checkmark in the top right corner. \
        Until you click it, the image will not be considered selected. If you want to delete the photo, you can \
        click the corresponding icon in the top right corner."
      ),
      imageField('Photo', props['Photo']),
    ],
  }
}

const NewTaskSheme = (
  profiles: ChildProfileDataType[],
  sections: SectionTypeList
): FormSheme => {
  return {
    title: 'New Task',
    content: [
      invisibleField('uuid', uuidv4()),
      inputField('Task title', InputFieldType.input, ''),
      multiselectField(
        'Section',
        sections.map((section) => {
          return {name: section.Title, uuid: section.uuid}
        }),
        [],
        true
      ),
      descriptionField(
        'About Revards',
        'You can leave the Reward field empty for the task to be worth 1✩, \
        or enter the amount the child will earn for completing the task, \
        for example, 2.50 will mean $2.50.'
      ),
      inputField('Revard', InputFieldType.input, ''),
      inputField('Description', InputFieldType.textarea, ''),
      dateField('Start date', null),
      multiselectField(
        'Repeat',
        [
          {name: 'One time', uuid: 'repeat-one-time'},
          {name: 'Every day', uuid: 'repeat-every-day'},
          {name: 'Every week', uuid: 'repeat-every-week'},
          {name: 'Every month', uuid: 'repeat-every-month'},
        ],
        [],
        true
      ),
      descriptionField(
        'About Image',
        "After uploading the image, you will enter the image cropping mode.\
        Once you've selected the appropriate frame, please click the green checkmark in the top right corner. \
        Until you click it, the image will not be considered selected. If you want to delete the photo, you can \
        click the corresponding icon in the top right corner."
      ),
      imageField('Task image', undefined),
      invisibleField('image_uuid', undefined),
      multiselectField(
        'Assigned to',
        profiles.map((profile) => {
          return {name: profile.Name, uuid: profile.uuid}
        }),
        [],
        false
      ),
    ],
  }
}

const EditTaskSheme = (
  profiles: ChildProfileDataType[],
  sections: SectionTypeList,
  props: TaskDataType
): FormSheme => {
  return {
    title: 'Edit Task',
    content:
      [
        invisibleField('uuid', props.uuid),
        inputField('Task title', InputFieldType.input, props['Task title']),
        multiselectField(
          'Section',
          sections.map((section) => {
            return {name: section.Title, uuid: section.uuid}
          }),
          sections
            .filter((section) => section.uuid === props.Section.at(0)?.uuid)
            .map((section) => {
              return {name: section.Title, uuid: section.uuid}
            }),
          true
        ),
        descriptionField(
          'About Revards',
          'You can leave the Reward field empty for the task to be worth 1✩, or enter the amount the child will earn for completing the task, for example, 2.50 will mean $2.50.'
        ),
        inputField('Revard', InputFieldType.input, props.Revard),
        inputField('Description', InputFieldType.textarea, props.Description),
        dateField('Start date', props['Start date'] ? new Date() : undefined),
        multiselectField(
          'Repeat',
          [
            {name: 'One time', uuid: 'repeat-one-time'},
            {name: 'Every day', uuid: 'repeat-every-day'},
            {name: 'Every week', uuid: 'repeat-every-week'},
            {name: 'Every month', uuid: 'repeat-every-month'},
          ],
          [
            {name: 'One time', uuid: 'repeat-one-time'},
            {name: 'Every day', uuid: 'repeat-every-day'},
            {name: 'Every week', uuid: 'repeat-every-week'},
            {name: 'Every month', uuid: 'repeat-every-month'},
          ].filter((option) => {
            return option.uuid === props.Repeat.at(0)?.uuid
          }),
          true
        ),
        descriptionField(
          'About Image',
          "After uploading the image, you will enter the image cropping mode.\
          Once you've selected the appropriate frame, please click the green checkmark in the top right corner. \
          Until you click it, the image will not be considered selected. If you want to delete the photo, you can \
          click the corresponding icon in the top right corner."
        ),
        imageField('Task image', props['Task image']),
        invisibleField('image_uuid', props.image_uuid),
        multiselectField(
          'Assigned to',
          profiles.map((profile) => {
            return {name: profile.Name, uuid: profile.uuid}
          }),
          profiles
            .map((profile) => {
              return {name: profile.Name, uuid: profile.uuid}
            })
            .filter((option) =>
              props['Assigned to'].some((value) => option.uuid === value.uuid)
            ),
          false
        ),
      ] || [],
  }
}

const SetupFormSheme = (): FormSheme => {
  return {
    title: 'Setup Form',
    content: [
      descriptionField(
        'Welcome',
        "Hello! We're glad to see you in Child's Assistant. \
        Before getting started, you need to create a parent profile. \
        Please fill in the fields below so we can proceed."
      ),
      inputField('Password', InputFieldType.password, ''),
      inputField('Secret question', InputFieldType.input, ''),
      inputField('Answer', InputFieldType.input, ''),
      descriptionField(
        'About Auto Delete',
        'You can select one of the options listed. \
        A task to remove outdated resources will be run daily. \
        Outdated resources will be considered those that have no matches in the database, \
        such as unused images or data older than the specified period, for example, older than 45 days.'
      ),
      multiselectField(
        'Auto Delete',
        [
          {name: 'Never', uuid: 'auto-delete-never'},
          {name: 'Older than 45 days', uuid: 'auto-delete-45'},
          {name: 'Older than 90 days', uuid: 'auto-delete-90'},
          {name: 'Older than 180 days', uuid: 'auto-delete-180'},
          {name: 'Older than 365 days', uuid: 'auto-delete-365'},
        ],
        [{name: 'Never', uuid: 'auto-delete-never'}],
        true
      ),
      descriptionField(
        'About Week Start',
        'This parameter will specify the day from which the week will start. \
        Starting from this day, statistics for the entire week will be calculated.'
      ),
      multiselectField(
        'Week Start',
        [
          {name: 'Monday', uuid: 'week-start-monday'},
          {name: 'Tuesday', uuid: 'week-start-tuesday'},
          {name: 'Wednesday', uuid: 'week-start-wednesday'},
          {name: 'Thursday', uuid: 'week-start-thurswday'},
          {name: 'Friday', uuid: 'week-start-friday'},
          {name: 'Saturday', uuid: 'week-start-saturday'},
          {name: 'Sunday', uuid: 'week-start-sunday'},
        ],
        [{name: 'Monday', uuid: 'week-start-monday'}],
        true
      ),
    ],
  }
}

const ResetSheme = (props: {question: string}): FormSheme => {
  return {
    title: 'Reset Password',
    content: [
      descriptionField(
        'About Resetting',
        'If you have forgotten your password and wish to recover it, \
        you need to correctly answer your secret question.'
      ),
      descriptionField('Secret question', props.question),
      inputField('Answer', InputFieldType.input, ''),
    ],
  }
}

const PasswordSettingsSheme = () => {
  return {
    title: 'Setup New Password',
    content: [
      descriptionField(
        'About Setup New Password',
        'This is the password reset form. Please enter your new password below.'
      ),
      inputField('Password', InputFieldType.password, ''),
    ],
  }
}

const SecretQuestionSettingsSheme = (props: SecretQuestionType) => {
  return {
    title: 'Secret Question Settings',
    content: [
      descriptionField(
        'About Secret Question Settings',
        'This is your current secret question and answer. Here you can change them.'
      ),
      inputField(
        'Secret question',
        InputFieldType.input,
        props['Secret question']
      ),
      inputField('Answer', InputFieldType.input, props['Answer']),
    ],
  }
}

const WeekStartSettingsSheme = (props: WeekStartType) => {
  return {
    title: 'Week Start Settings',
    content: [
      descriptionField(
        'About Week Start',
        'This parameter will specify the day from which the week will start. \
        Starting from this day, statistics for the entire week will be calculated.'
      ),
      multiselectField(
        'Week Start',
        [
          {name: 'Monday', uuid: 'week-start-monday'},
          {name: 'Tuesday', uuid: 'week-start-tuesday'},
          {name: 'Wednesday', uuid: 'week-start-wednesday'},
          {name: 'Thursday', uuid: 'week-start-thursday'},
          {name: 'Friday', uuid: 'week-start-friday'},
          {name: 'Saturday', uuid: 'week-start-saturday'},
          {name: 'Sunday', uuid: 'week-start-sunday'},
        ],
        props['Week Start'],
        true
      ),
    ],
  }
}

const NewSectionSheme = () => {
  return {
    title: 'New Section',
    content: [
      invisibleField('uuid', uuidv4()),
      inputField('Title', InputFieldType.input, ''),
      inputField('Start time', InputFieldType.time, 'appt=00:00'),
      inputField('End time', InputFieldType.time, 'appt=00:00'),
    ],
  }
}

const EditSectionSheme = (props: SectionType) => {
  return {
    title: 'Edit Section',
    content: [
      invisibleField('uuid', props.uuid),
      inputField('Title', InputFieldType.input, props.Title),
      inputField('Start time', InputFieldType.time, props['Start time']),
      inputField('End time', InputFieldType.time, props['End time']),
    ],
  }
}

const AutoDeleteSheme = (props: AutoDeleteType) => {
  return {
    title: 'Auto Delete Settings',
    content: [
      descriptionField(
        'About Auto Delete',
        'You can select one of the options listed. \
        A task to remove outdated resources will be run daily. \
        Outdated resources will be considered those that have no matches in the database, \
        such as unused images or data older than the specified period, for example, older than 45 days.'
      ),
      multiselectField(
        'Auto Delete',
        [
          {name: 'Never', uuid: 'auto-delete-never'},
          {name: 'Older than 45 days', uuid: 'auto-delete-45'},
          {name: 'Older than 90 days', uuid: 'auto-delete-90'},
          {name: 'Older than 180 days', uuid: 'auto-delete-180'},
          {name: 'Older than 365 days', uuid: 'auto-delete-365'},
        ],
        props['Auto Delete'],
        true
      ),
    ],
  }
}

export type AutoDeleteType = {
  ['Auto Delete']: MultiselectOptions[]
}

export type SectionType = {
  uuid: string
  Title: string
  'Start time': string
  'End time': string
}

export type SecretQuestionType = {
  'Secret question': string
  Answer: string
}

export type TaskDataType = {
  uuid: string
  'Task title': string
  Section: MultiselectOptions[]
  Revard: string
  Description: string
  'Start date'?: Date
  Repeat: MultiselectOptions[]
  'Task image': ImageType | undefined
  image_uuid: string | undefined
  'Assigned to': MultiselectOptions[]
}

export type SetupFormType = {
  Password: string
  'Secret question': string
  Answer: string
  'Auto Delete': MultiselectOptions[]
  'Week Start': MultiselectOptions[]
}

export type ResetType = {
  'Secret question': string
  Answer: string
}

export type PasswordSettingsType = {
  Password: string
}

export type WeekStartType = {
  'Week Start': MultiselectOptions[]
}

export {
  inputField,
  multiselectField,
  imageField,
  dateField,
  NewProfileSheme,
  EditProfileSheme,
  NewTaskSheme,
  EditTaskSheme,
  SetupFormSheme,
  ResetSheme,
  PasswordSettingsSheme,
  SecretQuestionSettingsSheme,
  NewSectionSheme,
  EditSectionSheme,
  AutoDeleteSheme,
  WeekStartSettingsSheme
}
