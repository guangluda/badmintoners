

  
  mapboxgl.accessToken = mapToken;
  
  const map = new mapboxgl.Map({
      container: 'map', 
      style: 'mapbox://styles/mapbox/streets-v11',
      center: court.geometry.coordinates, 
      zoom: 9, 
      projection: 'globe' 
});
map.on('style.load', () => {
      map.setFog({}); 
});  

new mapboxgl.Marker()
    .setLngLat(court.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({offset:25})
      .setHTML(
          `<h3>${court.title}</h3>`
      )
    )
    .addTo(map)


map.addControl(new mapboxgl.NavigationControl())
map.addControl(new mapboxgl.FullscreenControl())