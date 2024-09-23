import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export default function Layout({ children }) {

  const location = useLocation()

  useEffect(() => {
    const json = sessionStorage.getItem('localbooker-root')
    if(json){
      const storage = JSON.parse(json)
      console.log('==>', location.pathname)


      console.log('===> Storage: ', storage)
      storage.lastPath = location.pathname
      sessionStorage.setItem('localbooker-root', JSON.stringify(storage))
    }
  }, [location.pathname])

  return <>{children}</>

}