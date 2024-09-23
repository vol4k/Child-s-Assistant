import './LargeInscription.css'

import 'fonts/KidDrawsFontRegular-3g3L.ttf'

export default function LargeInscription(props: {label:string}) {
  return <div className="largeInscription"><h1>{props.label}</h1></div>
}