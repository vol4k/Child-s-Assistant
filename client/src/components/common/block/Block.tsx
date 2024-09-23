import './Block.css'

type Props = {
  children: string | JSX.Element | JSX.Element[]
  onClick?: () => void
  blockRef?: React.LegacyRef<HTMLDivElement>
}

export default function Block({children, onClick, blockRef}: Props) {
  const onClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (onClick) onClick()
  }
  return (
    <div className='block-div' onClick={onClickHandler} ref={blockRef}>
      {children}
    </div>
  )
}
