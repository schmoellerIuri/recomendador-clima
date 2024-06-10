<!-- CityModal.vue -->
<template>
    <div v-if="isOpen" class="modal">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h2>{{ city.nome }}, {{ city.estado }}</h2>
            <div class="city-distance">Distância: {{ city.distancia }} km</div>
            <div class="weather-forecast-container">
                <div class="weather-list-header">
                    <h2>Previsão do tempo (próx. 5 dias)</h2>
                </div>
                <ul class="weather-list">
                    <li v-for="weather in city.previsaoDoTempo" :key="weather.date" class="weather-item">
                        <div class="weather-date">{{ formatDate(weather.date) }}</div>
                        <div class="weather-condition">
                            <img :src="weather.day.condition.icon" :alt="weather.day.condition.text" />
                            <span>{{ weather.day.condition.text }}</span>
                            <span>| Máx: {{ weather.day.maxtemp_c }}°C</span>
                            <span>| Mín: {{ weather.day.mintemp_c }}°C</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['isOpen', 'city']);
const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};
</script>

<style scoped>
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 30%;
    height: 60%;
}

.weather-forecast-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 10px;
    width: auto;
    height: 80%;
}

.weather-list-header {
    width: 100%;
    border-bottom: 1px solid #ddd;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.weather-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    height: 400px;
    width: 80%;
}

.weather-item {
    padding-top: 10px;
    border-bottom: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    height: 80px;
    width: 100%;
}

.weather-date {
    font-size: 18px;
    font-weight: bold;
}

.weather-condition {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
</style>