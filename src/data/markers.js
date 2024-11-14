export const getClusterMarker = (width, type) => {

  const h = width * (72/68)

  const {primary_color, font_color} = getColors()

  let svg
  switch (type ){
    case 'stay':
      svg = stay_marker
      break
    case 'cluster':
      svg = cluster_marker
  }
  svg = svg.replaceAll('$primary_color', primary_color)
    .replaceAll('$font_color', font_color)
    .replaceAll('$width', width)
    .replaceAll('$height', h)

  // Create the cluster from the svg
  let blob = new Blob([svg], {
    type: 'image/svg+xml',
  });
  let url = URL.createObjectURL(blob);
  let image = document.createElement('img');
  image.src = url;

  return image
}
export const getColors = () => {
  // get to the style
  const style = getComputedStyle(window.localbooker_container.shadowRoot.host)
  const primary_color = style.getPropertyValue('--map-bg-color')
  const font_color = style.getPropertyValue('--map-font-color')
  return {primary_color, font_color}
}

const cluster_marker = '<svg width="95" height="105" viewBox="0 0 95 105" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
  '<g filter="url(#filter0_d_369_12)">\n' +
  '<path d="M47.5 70L46.1132 72.0801C46.953 72.64 48.047 72.64 48.8868 72.0801L47.5 70ZM47.5 70C48.8868 72.0801 48.8874 72.0797 48.8881 72.0792L48.89 72.078L48.8952 72.0744L48.9119 72.0633L48.9692 72.0245C49.0179 71.9914 49.0873 71.944 49.1761 71.8825C49.3537 71.7595 49.6088 71.5803 49.9305 71.348C50.5736 70.8835 51.4841 70.2056 52.5729 69.3385C54.7467 67.6076 57.6515 65.1071 60.5649 62.0319C66.2893 55.9894 72.5 47.2549 72.5 37.5C72.5 30.8696 69.8661 24.5107 65.1777 19.8223C60.4893 15.1339 54.1304 12.5 47.5 12.5C40.8696 12.5 34.5107 15.1339 29.8223 19.8223C25.1339 24.5107 22.5 30.8696 22.5 37.5C22.5 47.2549 28.7107 55.9894 34.4351 62.0319C37.3485 65.1071 40.2533 67.6076 42.4271 69.3385C43.5159 70.2056 44.4264 70.8835 45.0695 71.348C45.3912 71.5803 45.6463 71.7595 45.8239 71.8825C45.9127 71.944 45.9821 71.9914 46.0308 72.0245L46.0881 72.0633L46.1048 72.0744L46.11 72.078L46.1119 72.0792C46.1126 72.0797 46.1132 72.0801 47.5 70Z" fill="$primary_color" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>\n' +
  '</g>\n' +
  '<defs>\n' +
  '<filter id="filter0_d_369_12" x="0" y="0" width="95" height="105" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n' +
  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>\n' +
  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>\n' +
  '<feOffset dy="10"/>\n' +
  '<feGaussianBlur stdDeviation="10"/>\n' +
  '<feColorMatrix type="matrix" values="0 0 0 0 0.2211 0 0 0 0 0.27192 0 0 0 0 0.33 0 0 0 0.1 0"/>\n' +
  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_369_12"/>\n' +
  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_369_12" result="shape"/>\n' +
  '</filter>\n' +
  '</defs>\n' +
  '</svg>\n'

const stay_marker = '<svg width="$width" height="$height" viewBox="0 0 95 105" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
  '<g filter="url(#filter0_d_369_12)">\n' +
  '<path d="M47.5 70L46.1132 72.0801C46.953 72.64 48.047 72.64 48.8868 72.0801L47.5 70ZM47.5 70C48.8868 72.0801 48.8874 72.0797 48.8881 72.0792L48.89 72.078L48.8952 72.0744L48.9119 72.0633L48.9692 72.0245C49.0179 71.9914 49.0873 71.944 49.1761 71.8825C49.3537 71.7595 49.6088 71.5803 49.9305 71.348C50.5736 70.8835 51.4841 70.2056 52.5729 69.3385C54.7467 67.6076 57.6515 65.1071 60.5649 62.0319C66.2893 55.9894 72.5 47.2549 72.5 37.5C72.5 30.8696 69.8661 24.5107 65.1777 19.8223C60.4893 15.1339 54.1304 12.5 47.5 12.5C40.8696 12.5 34.5107 15.1339 29.8223 19.8223C25.1339 24.5107 22.5 30.8696 22.5 37.5C22.5 47.2549 28.7107 55.9894 34.4351 62.0319C37.3485 65.1071 40.2533 67.6076 42.4271 69.3385C43.5159 70.2056 44.4264 70.8835 45.0695 71.348C45.3912 71.5803 45.6463 71.7595 45.8239 71.8825C45.9127 71.944 45.9821 71.9914 46.0308 72.0245L46.0881 72.0633L46.1048 72.0744L46.11 72.078L46.1119 72.0792C46.1126 72.0797 46.1132 72.0801 47.5 70Z" fill="$primary_color" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>\n' +
  '<path d="M42.5 39C43.0933 39 43.6734 38.8241 44.1667 38.4944C44.6601 38.1648 45.0446 37.6962 45.2716 37.1481C45.4987 36.5999 45.5581 35.9967 45.4424 35.4147C45.3266 34.8328 45.0409 34.2982 44.6213 33.8787C44.2018 33.4591 43.6672 33.1734 43.0853 33.0576C42.5033 32.9419 41.9001 33.0013 41.3519 33.2284C40.8038 33.4554 40.3352 33.8399 40.0056 34.3333C39.6759 34.8266 39.5 35.4067 39.5 36C39.5 36.7956 39.8161 37.5587 40.3787 38.1213C40.9413 38.6839 41.7044 39 42.5 39ZM42.5 35C42.6978 35 42.8911 35.0586 43.0556 35.1685C43.22 35.2784 43.3482 35.4346 43.4239 35.6173C43.4996 35.8 43.5194 36.0011 43.4808 36.1951C43.4422 36.3891 43.347 36.5673 43.2071 36.7071C43.0673 36.847 42.8891 36.9422 42.6951 36.9808C42.5011 37.0194 42.3 36.9996 42.1173 36.9239C41.9346 36.8482 41.7784 36.72 41.6685 36.5556C41.5586 36.3911 41.5 36.1978 41.5 36C41.5 35.7348 41.6054 35.4804 41.7929 35.2929C41.9804 35.1054 42.2348 35 42.5 35ZM55.5 33H47.5C47.2348 33 46.9804 33.1054 46.7929 33.2929C46.6054 33.4804 46.5 33.7348 46.5 34V40H38.5V32C38.5 31.7348 38.3946 31.4804 38.2071 31.2929C38.0196 31.1054 37.7652 31 37.5 31C37.2348 31 36.9804 31.1054 36.7929 31.2929C36.6054 31.4804 36.5 31.7348 36.5 32V45C36.5 45.2652 36.6054 45.5196 36.7929 45.7071C36.9804 45.8946 37.2348 46 37.5 46C37.7652 46 38.0196 45.8946 38.2071 45.7071C38.3946 45.5196 38.5 45.2652 38.5 45V42H56.5V45C56.5 45.2652 56.6054 45.5196 56.7929 45.7071C56.9804 45.8946 57.2348 46 57.5 46C57.7652 46 58.0196 45.8946 58.2071 45.7071C58.3946 45.5196 58.5 45.2652 58.5 45V36C58.5 35.2044 58.1839 34.4413 57.6213 33.8787C57.0587 33.3161 56.2956 33 55.5 33ZM56.5 40H48.5V35H55.5C55.7652 35 56.0196 35.1054 56.2071 35.2929C56.3946 35.4804 56.5 35.7348 56.5 36V40Z" fill="$font_color"/>\n' +
  '</g>\n' +
  '<defs>\n' +
  '<filter id="filter0_d_369_12" x="0" y="0" width="95" height="105" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n' +
  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>\n' +
  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>\n' +
  '<feOffset dy="10"/>\n' +
  '<feGaussianBlur stdDeviation="10"/>\n' +
  '<feColorMatrix type="matrix" values="0 0 0 0 0.2211 0 0 0 0 0.27192 0 0 0 0 0.33 0 0 0 0.1 0"/>\n' +
  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_369_12"/>\n' +
  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_369_12" result="shape"/>\n' +
  '</filter>\n' +
  '</defs>\n' +
  '</svg>\n'

