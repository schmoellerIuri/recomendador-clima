<template>
    <div ref="mapElement" class="map"></div>
</template>


<script setup>

import { ref, onMounted, watch } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const emit = defineEmits(['positionChanged']);

const radius = ref(10)
const mapElement = ref(null);
const marker = ref(null);

let circle = null;

let map = null;

const loader = new Loader({
    apiKey: "AIzaSyC_oxL80PhD6P1i5Eiu1tNB6qsE4GokS5M",
    version: "weekly"
});

loader.load().then(async () => {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(mapElement.value, {
        center: { lat: -24.7199, lng: -53.7433 },
        zoom: 5,
    });

    map.addListener('click', (e) => {
        if (marker.value === null) {
            marker.value = new google.maps.Marker({
                position: e.latLng,
                map: map
            });
            circle = new google.maps.Circle({
                strokeColor: "#0000FF",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#0000FF",
                fillOpacity: 0.35,
                map: map,
                center: marker.value.getPosition(),
                radius: radius.value * 1000
            });
        } else {
            marker.value.setPosition(e.latLng);
            circle.setCenter(marker.value.getPosition());
        }

        emit('positionChanged', marker.value.getPosition());
    });
});

onMounted(() => {

});

const updateRadius = (value) => {
    radius.value = value;
    circle.setRadius(value * 1000);
}

const getPosition = () => {
    return (marker.value.getPosition().lat(), marker.value.getPosition().lng());
}

defineExpose({
    updateRadius,
    getPosition
});

</script>

<style scoped>
.map {
  flex: 2;
  height: 100%;
}
</style>