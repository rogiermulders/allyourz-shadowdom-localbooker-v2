import LiContent from './LiContent.jsx'

export default function SpecialFacilities({specialFacilities}) {

  return <ul className="ul-none m-0 p-0">
    {specialFacilities.map((e, i) => {
      return <li key={i} className="lb-tooltip li-vert pl-2 pr-2">
        <LiContent
          color={'text-color'}
          icon={e.icon}
          label={e.name}
        />
      </li>
    })}
  </ul>

}
