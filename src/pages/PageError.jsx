export default function PageError({ messages }) {

  return <div className="p-8">
    <div className="h4">One or more errors occurred:</div>
    <ul className="h6 ul-none p-0">
      {messages.map((e, i) => {
        return <li key={i}>{e}</li>
      })}
    </ul>
  </div>

}
