// @ts-ignore
import React, {useEffect, useRef, useState} from 'react'
import {localeOptions} from "primereact/api";
import {Translate} from "../types/translate"
const MainContext = React.createContext({});

const breakpoints = [
    {w: 1800, s: 'xl'},
    {w: 1380, s: 'lg'},
    {w: 1040, s: 'md'},
    {w: 810, s: 'sm'},
    {w: 0, s: 'xs'},
    {sw: null},
    {ih: null}
]

const MainContextProvider = ({children}) => {
    const ref = useRef()
    const [loading, setLoading] = useState(false)
    const [shadowRoot, setShadowRoot] = useState(null)
    const [breakpoint, setBreakpoint] = useState(null)
    const [reactApp, setReactApp] = useState(null)
    const [hostLocale, setHostLocale] = useState(null)
    const [maxGuests, setMaxGuests] = useState(0)
    const [maxPets, setMaxPets] = useState(0)
    const [cheapest, setCheapest] = useState(0)


    const _t = () => {
        const locale = localeOptions(hostLocale) as Translate
        return locale.localbooker
    }

    useEffect(() => {
        // @ts-ignore
        setShadowRoot(window.zaffius_appRoot)
        // @ts-ignore
        setReactApp(window.zaffius_appRoot.getElementById('react-app'))
        const handleResize = () => {
            // @ts-ignore
            const clientWidth = window.zaffius_root_node.clientWidth

            // @ts-ignore
            const bp = breakpoints.find((el) => clientWidth >= el.w)
            /**
             * I have no clue what I am doing
             */
            bp.sw = clientWidth
            bp.ih = window.innerHeight
            // @ts-ignore
            window.zaffius_root_node.breakpoint = bp
            setBreakpoint({...bp})
        }

        handleResize()

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [hostLocale])


    return <MainContext.Provider value={{
        ref,
        loading,
        breakpoint,
        shadowRoot,
        reactApp,
        hostLocale,

        maxGuests,
        maxPets,
        cheapest,

        setLoading,
        setMaxGuests,
        setMaxPets,
        setCheapest,
        setHostLocale,

        _t
    }}>
        {children}
    </MainContext.Provider>
}

export {MainContext, MainContextProvider}
