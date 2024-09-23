import './ParentLogin.css'
import parent from 'images/parent.png'

import {useNavigate} from 'react-router-dom'
import Block from 'components/common/block/Block'
import PasswordField from 'components/fields/passwordField/PasswordField'
import BackButton from 'components/backButton/BackButton'
import {Dispatch, useEffect, useState} from 'react'
import ModalComponent from 'components/modalComponent/ModalComponent'
import {
  PasswordSettingsSheme,
  PasswordSettingsType,
  ResetSheme,
  ResetType,
  SetupFormSheme,
  SetupFormType,
} from 'components/common/formField/formField'
import {
  checkAnswer,
  checkParentUserIsExist,
  checkPassword,
  getSecurityQuestion,
  updateCred,
  updatePassword,
} from 'api/parentProfileRouter'

export default function ParentLogin(props: {
  setAuthState: Dispatch<React.SetStateAction<boolean>>
}) {
  const nav = useNavigate()

  const [secretQuestion, setSecretQuestion] = useState<string>('')
  const [setupFormModal, setSetupFormModal] = useState<boolean>(false)
  const [resetFormModal, setResetFormModal] = useState<boolean>(false)
  const [resetPasswordFormModal, setResetPasswordFormModal] =
    useState<boolean>(false)
  const [accountIsExist, setAccountIsExist] = useState<boolean>(false)

  useEffect(() => {
    checkParentUserIsExist().then((res) => {
      setAccountIsExist(res)
      setSetupFormModal(!res)
      if (res)
        getSecurityQuestion().then((sec_q: string) => setSecretQuestion(sec_q))
    })
  })

  const trySetSetupFormModal = () => {
    if (accountIsExist) setSetupFormModal(!setupFormModal)
  }

  const tryCreateProfile = (formState: SetupFormType) => {
    updateCred(formState).then(() => {
      checkParentUserIsExist().then((res: boolean) => {
        setAccountIsExist(res)
        setSetupFormModal(!res)
        getSecurityQuestion().then((sec_q: string) => setSecretQuestion(sec_q))
      })
    })
  }

  const tryAuth = (password: string) => {
    checkPassword(password).then((success: boolean) => {
      props.setAuthState(success)
      if (success) nav('/parent/dashboard')
    })
  }

  const tryResetPassword = (formField: ResetType) => {
    checkAnswer(formField).then((success: boolean) => {
      if (success) {
        setResetFormModal(false)
        setResetPasswordFormModal(true)
      } else alert('Wrong answer!')
    })
  }

  const tryUpdatePassword = (formField: PasswordSettingsType) => {
    updatePassword(formField).then(() => {
      setResetPasswordFormModal(false)
    })
  }

  return (
    <div className='parentLogin'>
      <BackButton navTo='/choose' />
      <div className='rowWrapper'>
        <div className='parentIconGrid'>
          <Block>
            <img src={parent} alt='parent' />
            <div className='labelWrapper'>
              <label>Parent</label>
            </div>
          </Block>
        </div>
        <ModalComponent
          formSheme={SetupFormSheme()}
          modalIsOpen={setupFormModal}
          setIsOpen={trySetSetupFormModal}
          onSubmitEvent={tryCreateProfile}
          hideCancel
        />
        <ModalComponent
          formSheme={ResetSheme({question: secretQuestion})}
          modalIsOpen={resetFormModal}
          setIsOpen={() => setResetFormModal(!resetFormModal)}
          onSubmitEvent={tryResetPassword}
          hideCancel
        />
        <ModalComponent
          formSheme={PasswordSettingsSheme()}
          modalIsOpen={resetPasswordFormModal}
          setIsOpen={() => setResetPasswordFormModal(!resetPasswordFormModal)}
          onSubmitEvent={tryUpdatePassword}
        />
        <PasswordField
          onSubmit={tryAuth}
          onReset={() => setResetFormModal(!resetFormModal)}
        />
      </div>
    </div>
  )
}
