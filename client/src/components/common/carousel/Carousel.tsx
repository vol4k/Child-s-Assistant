import './Carousel.css'

export enum Direction {
  horizontal = 'dir-horizontal',
  vertical = 'dir-vertical',
}

export enum Justify {
  start = 'just-start',
  center = 'just-center',
  end = 'just-end',
}

export enum ScrollVisibility {
  visible = "scroll-visible",
  invisible = "scroll-invisible"
}

type Props = {
  children: JSX.Element | JSX.Element[]
  direction?: Direction
  justify?: Justify
  scrollVisibility? :ScrollVisibility
}

export default function Carousel({
  children,
  direction = Direction.horizontal,
  justify = Justify.center,
  scrollVisibility = ScrollVisibility.invisible
}: Props) {
  const additionalClassNames = [direction, justify, scrollVisibility].join(' ')
  return (
    <div className='carousel-container'>
      <div className={`carousel ${additionalClassNames}`}>{children}</div>
    </div>
  )
}
