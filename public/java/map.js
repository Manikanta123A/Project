mapboxgl.accessToken = maptoken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://style/mapbox/streets-v12",
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 12 // starting zoom
});
map.on('load', () => {
    // Load an image from an external URL.
    map.loadImage(
        'https://cdn-icons-png.freepik.com/512/16/16304.png',
        (error, image) => {
            if (error) throw error;

            // Add the image to the map style.
            map.addImage('cat', image);

            // Add a data source containing one point feature.
            map.addSource('point', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': coordinates
                            }
                        }
                    ]
                }
            });

            // Add a layer to use the image to represent the data.
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'point', // reference the data source
                'layout': {
                    'icon-image': 'cat', // reference the image
                    'icon-size': 0.15
                }
            });
           

        }
    );
});
map.on('click', (e) => {
    // Copy coordinates array.

    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML("<p>Exact location showed after booking</p>")
        .addTo(map);
});