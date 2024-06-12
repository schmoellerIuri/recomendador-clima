<template>
  <div class="screen">
    <div class="header">
      <span class="title">CityWeather</span>
    </div>
    <div class="container">
      <div class="map-container">
        <MapElement ref="MapComponentRef" @positionChanged="updatePosition" />
        <div class="sidebar">
          <FormCity ref="FormCityComponentRef" @startedSearch="startSearch"
            @finishedSearch="{ { CityListComponentRef.setLoading(false); } }"
            @receivedData="updateAllData" @resetData="resetAllData" @radiusChanged="updateRadius" />
        </div>
      </div>
      <div class="city-list-container">
        <CityList ref="CityListComponentRef" title="Cidades Encontradas" :resultList="true"
          @add-clicked="addCityToItinerary"
          @search="() => { FormCityComponentRef.searchWeather(CityListComponentRef.getNextPage()) }"
          @list-dblclick="openCityModal" />
        <CityList ref="ItineraryListComponentRef" title="Cidades no itinerário" :resultList="false" />
        <Itinerary ref="ItineraryRef"
          @startedGetItinerary="() => { FormCityComponentRef.setLoadingItinerary(true) }"
          @finishedGetItinerary="() => { FormCityComponentRef.setLoadingItinerary(false) }"
          @getItineraryRequest="triggerGetItinerary" />
      </div>
    </div>
    <Modal :isOpen="openModal" :city="selectedCity" @close="closeCityModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Modal from './Modal.vue';
import MapElement from './components/MapElement.vue'
import FormCity from './components/FormCity.vue'
import CityList from './components/CityList.vue'
import Itinerary from './components/Itinerary.vue'

const MapComponentRef = ref(null);
const FormCityComponentRef = ref(null);
const CityListComponentRef = ref(null);
const ItineraryListComponentRef = ref(null);
const ItineraryRef = ref(null);
const openModal = ref(false);
const selectedCity = ref(null);

onMounted(async () => {

});

const updateRadius = (value) => {
  MapComponentRef.value.updateRadius(value);
};

const updatePosition = (position) => {
  FormCityComponentRef.value.updatePosition(position);
};

const resetAllData = () => {
  CityListComponentRef.value.resetCities();
  ItineraryListComponentRef.value.resetCities();
  ItineraryRef.value.resetValue();
};

const updateAllData = (response) => {
  CityListComponentRef.value.updateCities(response);
};

const startSearch = () => {
  CityListComponentRef.value.setLoading(true);
  CityListComponentRef.value.loadingStringAnimate();
};

const openCityModal = (city) => {
  selectedCity.value = city;
  openModal.value = true;
};

const closeCityModal = () => {
  openModal.value = false;
  selectedCity.value = null;
};

const addCityToItinerary = (city) => {
  ItineraryListComponentRef.value.addCity(city);
};

const triggerGetItinerary = () => {
  const cities = ItineraryListComponentRef.value.getCities();
  ItineraryRef.value.getItinerary(cities);
};

</script>

<style scoped>
.screen {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  min-width: 1100px;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 15;
}

.header {
  background-color: green;
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
}

.title {
  margin-left: 10px;
}

.map-container {
  display: flex;
  width: 100%;
  height: 100%;
  flex: 1;
}

.sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: #f4f4f4;
}

button {
  background-color: green;
  font-weight: bold;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button:hover {
  background-color: darkgreen;
}

.city-list-container {
  background-color: #f4f4f4;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: center;
  width: 100%;
  flex: 1;
}
</style>
