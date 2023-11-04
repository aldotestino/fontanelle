export const mapStyles = [{
  value: 'mapbox://styles/mapbox/dark-v11',
  label: 'Scura',
  image: '/dark.png'
}, {
  value: 'mapbox://styles/mapbox/light-v11',
  label: 'Chiara',
  image: '/light.png'
}, {
  value: 'mapbox://styles/mapbox/navigation-night-v1',
  label: 'Navigazione',
  image: '/navigation_night.png'
}, {
  value: 'mapbox://styles/mapbox/satellite-streets-v12',
  label: 'Satellite',
  image: '/satellite.png'
}] as const;

export const FLY_TO_DURATION = 2000;

export const reportReasons = [
  'Mancanza di manutenzione',
  'Qualità dell\'acqua compromessa',
  'Rotture o danni strutturali',
  'Accesso limitato o insufficiente',
  'Mancanza di igiene e pulizia'
] as const;