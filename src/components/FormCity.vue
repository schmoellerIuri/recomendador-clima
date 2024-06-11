<template>
    <div class="form">
        <div class="form-group">
            <label for="radius">Raio de busca (km):</label>
            <input type="number" id="radius" v-model="radius" min="10" max="200"
                :class="{ 'invalid-input': radius < 10 || radius > 200 }" />
        </div>
        <div class="form-group">
            <label for="maxTemp">Temperatura máxima (°C):</label>
            <input type="number" id="maxTemp" v-model="maxTemp" :class="{ 'invalid-input': !isValid }" />
        </div>
        <div class="form-group">
            <label for="minTemp">Temperatura mínima (°C):</label>
            <input type="number" id="minTemp" v-model="minTemp" :class="{ 'invalid-input': !isValid }" />
        </div>
        <button @click="searchWeather()">Buscar</button>
    </div>
</template>


<script setup>

import { ref, watch } from 'vue';
import axios from 'axios';

const emit = defineEmits(['startedSearch', 'finishedSearch', 'resetData', 'receivedData', 'radiusChanged']);

const radius = ref(10);
const maxTemp = ref(0);
const minTemp = ref(0);
const inputBorderColor = ref('#ddd');
const isValid = ref(true);
const loading = ref(false);
const loadingItinerary = ref(false);

let lat = 0;
let lon = 0;

watch([maxTemp, minTemp], () => {
    if (maxTemp.value !== null && minTemp.value !== null && maxTemp.value >= minTemp.value) {
        inputBorderColor.value = '#ddd';
        isValid.value = true;
    } else {
        isValid.value = false;
        inputBorderColor.value = 'red';
    }
});

watch(radius, (value) => {
    emit('radiusChanged', radius.value);
});

const setLoadingItinerary = (value) => {
    loadingItinerary.value = value;
};

const searchWeather = async (offset = 0) => {
    if (!isValid.value) {
        alert('Temperatura máxima não pode ser menor que a temperatura mínima');
        return;
    }

    if (radius.value < 10 || radius.value > 200) {
        alert('O raio de busca deve ser entre 10 e 200 km');
        return;
    }

    if (loading.value || loadingItinerary.value) {
        alert('Aguarde o carregamento anterior');
        return;
    }

    if (offset === 0) {
        emit('resetData')
    }

    loading.value = true;

    emit('startedSearch');

    try {
        const response = await axios.get('https://localhost:443/cidades', {
            params: {
                lat: lat > 0 ? lat.toString() : lat.toString(),
                lon: lon > 0 ? '+' + lon.toString() : lon.toString(),
                raio_busca: radius.value,
                max_temp: maxTemp.value,
                min_temp: minTemp.value,
                offset: offset
            }
        });

        if (response.data.cidades.length === 0) {
            alert('Nenhuma cidade encontrada');
        }

        emit('receivedData', response.data);
    } catch (error) {
        alert(error.message);
        console.log(error);
    } finally {
        emit('finishedSearch');
        loading.value = false;
    }
};

const updatePosition = (position) => {
    lat = position.lat();
    lon = position.lng();
};

defineExpose({
    updatePosition,
    searchWeather,
    setLoadingItinerary
});

</script>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    padding: 15px;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
}

.form-group input {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
}

.form-group input.invalid-input {
    border: 1px solid red;
    border-radius: 0.25rem;
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
</style>