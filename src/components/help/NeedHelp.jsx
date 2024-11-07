import { Button } from 'primereact/button'

export default function NeedHelp() {

  return (
    <div className="p-10">
      Stuur een e-mail en onze Localbooker medewerkers zullen zo snel mogelijk antwoorden.
      <br />
      <br />
      Ook buiten kantoortijden is Localbooker bereikbaar (het kan dan wel iets langer duren voordat er geantwoord
      wordt).
      <br />
      <br />
      <a href="mailto:helpdesk@localbooker.nl">
        <Button icon="pi pi-envelope" outlined label="Stuur een e-mail" />
      </a>
    </div>
  )

}