import {checkPassword} from 'api/parentProfileRouter'
import './PasswordField.css'

import Block from 'components/common/block/Block'
import LargeInscription from 'components/common/largeInscription/LargeInscription'
import {ChangeEvent, FormEvent, useState} from 'react'
import {FaEye, FaEyeSlash} from 'react-icons/fa'
import {useNavigate} from 'react-router-dom'

type Props = {
  setAuthState: (success: boolean) => void
  onReset?: () => void
}

export default function PasswordField({setAuthState, onReset}: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const nav = useNavigate()

  const tryAuth = (password: string) => {
    checkPassword(password).then((success: boolean) => {
      setAuthState(success)
      if (success) nav('/parent/dashboard')
      else {
        setError('Invalid password')
        setPassword('')
      }
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!error) tryAuth(password)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setError('')
  }

  return (
    <Block>
      <form onSubmit={onSubmitHandler}>
        <div className='passwordGrid'>
          <LargeInscription label='Password' />

          <div>
            <div className={`passwordInput ${error ? 'error' : ''}`}>
              <input
                value={password}
                onChange={onChange}
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                aria-label='Toggle password visibility'
              >
                {showPassword ? (
                  <FaEyeSlash color='gray' />
                ) : (
                  <FaEye color='gray' />
                )}
              </button>
            </div>
            <span className={`error-message ${error ? 'visible' : ''}`}>
              {error}
            </span>
          </div>
          <button type='submit'>Submit</button>
          <label onClick={onReset} className='reset-password'>
            Reset password
          </label>
        </div>
      </form>
    </Block>
  )
}
