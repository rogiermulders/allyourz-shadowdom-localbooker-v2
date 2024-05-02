import {classNames} from "primereact/utils";


interface Col {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    def?: number;
}

interface WidthHeight {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    def?: string;
}


const sizes = ['xl', 'lg', 'md', 'sm', 'xs']

/**
 * For speed only the first argument can have the grid parameters
 * - This fynction adds the column width class to the given classes like 'col col-8' for the current breakpoint
 * - First param can look some like {lg: 3, md: 6} where the keys can be xs, sm, md, lg, xl and def
 * - This function will just behave like classNames
 */
const col = (...args: (Col | string | object)[]): string => {
    /**
     * Get the breakpoint (low level shit, dunno this will work)
     */
    const bp = window.zaffius_root_node.breakpoint.s
    /**
     * Check the first arg, when the value is a number it is our grid
     */
    if (typeof Object.values(args[0])[0] === 'number') {
        /**
         * we want to get a grid className for the current widow size
         */
        const grid = {...args[0] as Col}

        /**
         * Get default (when we have a default and no match later on we use that one)
         */
        const defaultBp = (typeof grid.def === 'undefined') ? false : grid.def

        if (defaultBp !== false) delete grid.def // Remove it so it does not bother us anymore

        args.shift() // and remove it

        if (typeof grid[bp] !== 'undefined' ) {
            // Exact match.
            args.unshift('col-' + grid[bp])
        } else {

            // Not found.
            if (defaultBp !== false) {
                // Use default
                args.unshift('col-' + defaultBp)
            } else {
                // No default: Walk down... say i have {md :3} and I come in with lg -> go from the bp (lg)
                let match

                // for (let i = sizes.indexOf(bp) - 1; i >= 0; i--) { // This one goes UP
                for (let i = sizes.indexOf(bp) + 1; i < 5; i++) { // This one goes DOWN
                    if (grid[sizes[i]]) {
                        match = sizes[i]
                        break;
                    }
                }

                // WhenContent we have a match use that one else use the largest we've got
                args.unshift('col-' + (match ? grid[match] : Math.max(...Object.values(grid))))
            }

        }
        // And add an extra className (dunno here)
        // args.unshift('col')


        // For speed don't go classNames when not needed (dunno.. must be a tad faster)
        if (args.length === 2) {
            return args[0] + ' ' + args[1]
        }
    }

    return classNames(...args)

}
const bpIndex = () => sizes.indexOf(window.zaffius_root_node.breakpoint.s)

const lte = (bp: 'xl' | 'lg' | 'md' | 'sm' | 'xs') => {
    const queryIndex = sizes.indexOf(bp);
    return queryIndex <= bpIndex()
}
const gte = (bp: 'xl' | 'lg' | 'md' | 'sm' | 'xs') => {
    //const currentBp = sizes.indexOf(window.localbooker.breakpoint.s)
    const queryIndex = sizes.indexOf(bp);
    return queryIndex >= bpIndex()
}

const wh = (width: WidthHeight, height: WidthHeight, style?: object): object => {

    /**
     * Get the breakpoint (low level shit, dunno this will work)
     */
    const bp = window.zaffius_root_node.breakpoint.s

    // Handle width
    let myWidth = width.def;
    let myHeight = height.def;

    if (width[bp]) {
        myWidth = width[bp]
    }
    if (height[bp]) {
        myHeight = height[bp]
    }

    if (style) {
        return {...style, width: myWidth, height: myHeight}
    }
    return {width: myWidth, height: myHeight}
}

/**
 * Adds a breakpoint to the class thing
 */
const addBp = (...args: any[]): string => {
    args.push(window.zaffius_root_node.breakpoint.s)
    return classNames(...args)
}

/**
 * Gets the breakpoint
 */
const getBp = (): string => window.zaffius_root_node.breakpoint.s

const ifBp = (bps: string | [string]): boolean => {
    if (typeof bps === 'string') {
        bps = [bps]
    }
    return bps.includes(window.zaffius_root_node.breakpoint.s)
}

export {col, getBp, ifBp, addBp, wh, lte, gte, bpIndex}
