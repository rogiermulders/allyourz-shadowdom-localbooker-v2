import { Card } from 'primereact/card'
import { imageResize } from '../../services/imageResize.ts'

export default function Quote({ admin }) {

  const { quote } = admin

  return <Card className="p-8" style={{ backgroundColor: 'var(--surface-b)' }}>
      <span>
        {quote.description}
      </span>
    <span className="h3 font-caveat">{quote.name}</span>

    <div style={{ width: '96px', height: '96px', borderRadius: '50%', overflow: 'hidden' }}>
      <div className="ar-box-inside-1-1">
        <img
          className="ar-image border-radius"
          src={imageResize(quote.image.url, 128)}
          alt={quote.image.alt} />
      </div>
    </div>

  </Card>


}