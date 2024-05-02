import Icon from "../../molecules/Icon.jsx";

const Props = ({bookable}) => <>
  <ul className="ul-none m-0 p-0 text-color-secondary">
    <li className="mt-4 flex">
      <Icon name="users-alt" size="1.5em" color="text-color-secondary"/>
      <div className="mt-2 ml-2">
        {bookable.maxGuests} pers. {bookable.type}
      </div>
    </li>
  </ul>

  {(bookable.bedTypes.length > 0) && <ul className="ul-none m-0 mt-1 p-0 text-color-secondary">
    <li className="flex">
      <Icon name="bed-double" size="1.5em" color="text-color-secondary"/>
      <div className="mt-2 ml-2">
        {bookable.bedTypes.map((e, i) => {
          return <div key={i} className="mb-3">
            {e.quantity} {e.type}
          </div>
        })}
      </div>
    </li>
  </ul>}
</>

export default Props
