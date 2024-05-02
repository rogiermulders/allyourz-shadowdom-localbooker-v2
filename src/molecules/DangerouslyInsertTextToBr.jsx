export default function DangerouslyInsertTextToBr({children, style}) {


  const html = children.replaceAll('\n','<br/>')
  return <div style={style} dangerouslySetInnerHTML={{__html:html}}></div>


}
