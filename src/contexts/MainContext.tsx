// @ts-ignore
import React, {useEffect, useRef, useState} from 'react'
import {localeOptions} from "primereact/api";
import {Translate} from "../types/translate"
import { breakpoints } from '../data/constants';

const MainContext = React.createContext({});

// const breakpoints = [
//     {w: 1800, s: 'xl'},
//     {w: 1380, s: 'lg'},
//     {w: 1040, s: 'md'},
//     {w: 810, s: 'sm'},
//     {w: 0, s: 'xs'},
//     {sw: null},
//     {ih: null}
// ]

const MainContextProvider = ({children}) => {
    const ref = useRef()
    const [loading, setLoading] = useState(false)
    const [allCssLoaded, setAllCssLoaded] = useState(false)
    const [shadowRoot, setShadowRoot] = useState(null)
    const [breakpoint, setBreakpoint] = useState(null)
    const [reactApp, setReactApp] = useState(null)
    const [hostLocale, setHostLocale] = useState(null)
    const [maxGuests, setMaxGuests] = useState(0)
    const [maxPets, setMaxPets] = useState(0)
    const [cheapest, setCheapest] = useState(0)
    const [themeCss,setThemeCss] = useState(null)

    const _t = () => {
        const locale = localeOptions(hostLocale) as Translate
        return locale.localbooker
    }

    useEffect(() => {
        // @ts-ignore
        setShadowRoot(window.localbooker_shadowRoot)
        // @ts-ignore
        setReactApp(window.localbooker_shadowRoot.getElementById('react-app'))
        const handleResize = () => {
            // @ts-ignore
            const clientWidth = window.localbooker_container.clientWidth

            // @ts-ignore
            const bp = breakpoints.find((el) => clientWidth >= el.w)
            /**
             * I have no clue what I am doing
             */
            bp.sw = clientWidth
            bp.ih = window.innerHeight
            // @ts-ignore
            window.localbooker_container.breakpoint = bp
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
        allCssLoaded,
        maxGuests,
        maxPets,
        cheapest,
        themeCss,
        setLoading,
        setMaxGuests,
        setMaxPets,
        setCheapest,
        setHostLocale,
        setThemeCss,
        setAllCssLoaded,
        _t
    }}>
        {children}
    </MainContext.Provider>
}

export {MainContext, MainContextProvider}
