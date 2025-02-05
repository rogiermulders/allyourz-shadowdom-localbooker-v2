import { Card } from 'primereact/card'
import { imageResize } from '../../services/imageResize.ts'

export default function Quote({ admin }) {

  const { quote } = admin

  // Sometimes only the name is there... thats not what we want to see
  if(!quote.description) return null

  return <Card className="p-0" style={{ backgroundColor: 'var(--surface-b)' }}>
    <div style={{ lineHeight: '1.5' }}>
      {quote.description}
    </div>
    <div className="mt-4 flex align-center">
      {quote.image && <div style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden' }}>
        <div className="ar-box-inside-1-1">
          <img
            className="ar-image"
            src={imageResize(quote.image.url, 96)}
            alt={quote.image.alt} />
        </div>
      </div>}
      <div className="ml-4 h3 font-caveat">{quote.name}</div>
    </div>

  </Card>


}