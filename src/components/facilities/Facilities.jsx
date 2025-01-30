import Icon from '../../molecules/Icon.jsx'

export default function Facilities({ facilityGroups }) {

  return <div className="mt-4 pb-16">

    {facilityGroups.map((fg, i) => {

      return <div key={i}>
        <div key={i} className="flex mt-8">
          <Icon name={fg.icon} size={'1.2em'} />
          <div className="ml-6 font-bold">{fg.name}</div>
        </div>
        {/*FACILITY*/}
        <div className="mt-4">
          {fg.facilities.map((f, j) => {
            return <div key={j}>
              <div key={j} className="flex pt-1 pb-1">
                <i className="pi pi-check mr-6" />
                <div>{f.name}</div>
              </div>
              {f.description && <>
                <div className="ml-13 p-3 h01" style={{lineHeight:'1.4em'}}>
                  {f.description}
                </div>
              </>}
            </div>
          })}
        </div>
      </div>
    })}

  </div>
}