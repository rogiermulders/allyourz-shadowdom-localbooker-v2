/**
 * Maybe do this buttstrip based
 * For renesseaanzee we of course can use _next but my guess is we should not rely on it
 *
 * 384
 */


export const imageResize = (imgSrc, width: 96 | 128 | 256 | 384 | 640 | 750 | 828 | 1080 | 1200 | 1920 | 2048 | 3840) => {

    if(!imgSrc) return null

    /**
     * Do we get the images from next?
     */
    if(import.meta.env.VITE_APP_IMAGESERVICE.includes('_next')) {
        return import.meta.env.VITE_APP_IMAGESERVICE + '?url=' + encodeURIComponent(imgSrc) + '&w=' + width + '&q=75'
    } else {
        if(width <= 384) {
            const arr = imgSrc.split('/')
            arr.splice(-1, 0, 'thumbs')
            return arr.join('/')
        } else {
            return imgSrc
        }
    }
}
