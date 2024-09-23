import {MdDelete, MdEdit} from 'react-icons/md'
import './SectionPost.css'
import Block from 'components/common/block/Block'
import SectionPostContent from 'components/posts/sectionPostContent/SectionPostContent'
import {
  EditSectionSheme,
  SectionType,
} from 'components/common/formField/formField'
import ModalComponent from 'components/modalComponent/ModalComponent'
import {useState} from 'react'
import {
  addOrupdateSection,
  deleteSection,
  getAllSections,
  SectionTypeList,
} from 'api/sectionRouter'

type Props = {
  sectionProps: SectionType
  setSections: React.Dispatch<React.SetStateAction<SectionTypeList>>
}

export default function SectionPost(props: Props) {
  const [sectionModal, setSectionModal] = useState<boolean>(false)

  const OptionsBlock = () => {
    return (
      <div className='optionsBlock'>
        <Block onClick={() => setSectionModal(!sectionModal)}>
          <MdEdit color='lightblue' />
        </Block>
        <Block
          onClick={() =>
            deleteSection(props.sectionProps.uuid).then(() =>
              getAllSections().then((sections: SectionTypeList) =>
                props.setSections(sections)
              )
            )
          }
        >
          <MdDelete color='lightcoral' />
        </Block>
      </div>
    )
  }

  return (
    <div className='section-post'>
      <Block>
        <div className='post-wrapper'>
          <OptionsBlock />
          <SectionPostContent {...props.sectionProps} />
        </div>
      </Block>
      <ModalComponent
        formSheme={EditSectionSheme(props.sectionProps)}
        modalIsOpen={sectionModal}
        setIsOpen={setSectionModal}
        onSubmitEvent={(formState: any) => {
          addOrupdateSection(formState).then(() =>
            getAllSections().then((sections) => props.setSections(sections))
          )
        }}
      />
    </div>
  )
}
