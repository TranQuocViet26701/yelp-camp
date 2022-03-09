mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campground.geometry.coordinates,
    zoom: 10,
});

const nav = new mapboxgl.NavigationControl({
    visualizePitch: true,
});
map.addControl(nav, 'top-right');

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<h4>${campground.title}</h4><p>${campground.location}</p>`
);

new mapboxgl.Marker({
    color: 'red',
})
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);
