import './Сarousel.css'

export enum Direction {
  horizontal = 'dir-horizontal',
  vertical = 'dir-vertical',
}

export enum Justify {
  start = 'just-start',
  center = 'just-center',
  end = 'just-end',
}

type Props = {
  children: JSX.Element | JSX.Element[]
  direction?: Direction
  justify?: Justify
}

export default function Carousel({
  children,
  direction = Direction.horizontal,
  justify = Justify.center,
}: Props) {
  const additionalClassNames = [direction, justify].join(' ')
  return (
    <div className='carousel-container'>
      <div className={`carousel ${additionalClassNames}`}>{children}</div>
    </div>
  )
}
