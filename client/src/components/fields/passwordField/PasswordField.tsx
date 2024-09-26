import './PasswordField.css'

import Block from 'components/common/block/Block'
import LargeInscription from 'components/common/largeInscription/LargeInscription'
import {ChangeEvent, FormEvent, useState} from 'react'
import {FaEye, FaEyeSlash} from 'react-icons/fa'

type Props = {
  onSubmit?: (password: string) => void
  onReset?: () => void
}

export default function PasswordField({onSubmit, onReset}: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (error) return
    if (onSubmit) onSubmit(password)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  return (
    <Block>
      <form onSubmit={onSubmitHandler}>
        <div className='passwordGrid'>
          <LargeInscription label='Password' />

          <div className='passwordInput'>
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
          <button type='submit'>Submit</button>
          <label onClick={onReset} className='reset-password'>
            Reset password
          </label>
        </div>
      </form>
    </Block>
  )
}
