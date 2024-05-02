import Stuff from './Stuff.jsx'

export default function Test() {
  return (
    <div>
      <div className="mt-2 w-1/6 @container">
        <Stuff />
      </div>
      <div className="mt-2 w-2/6 @container">
        <Stuff />
      </div>
      <div className="mt-2 w-3/6 @container">
        <Stuff />
      </div>
      <div className="mt-2 w-4/6 @container">
        <Stuff />
      </div>
      <div className="mt-2 w-5/6 @container">
        <Stuff />
      </div>
      <div className="mt-2 w-full @container">
        <Stuff />
      </div>
    </div>
  )
}
