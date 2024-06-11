<template>
    <div class="city-list">
        <div class="list-header">
            <h2>{{ title }}</h2>
        </div>
        <ul v-if="!loading">
            <li v-for="city in cities" :key="city.nome" class="city-item"
                @dblclick="() => { if (resultList) emit('list-dblclick', city) }"
                title="Duplo clique para ver previsão do tempo">
                <div class="city-info">
                    <div class="city-name">{{ city.nome }}, {{ city.estado }}</div>
                    <div class="city-distance">Distância:{{ city.distancia }} km</div>
                    <div class="city-weather">
                        <img :src="city.previsaoDoTempo[0].day.condition.icon"
                            :alt="city.previsaoDoTempo[0].day.condition.text" />
                        <span>{{ city.previsaoDoTempo[0].day.condition.text }}</span>
                        <span>| Máx: {{ city.previsaoDoTempo[0].day.maxtemp_c }}°C </span>
                        <span>| Mín: {{ city.previsaoDoTempo[0].day.mintemp_c }}°C</span>
                    </div>
                </div>
                <div class="city-button">
                    <button v-if="resultList" class="add-button"
                        @click="emit('add-clicked', city)">&plus;
                    </button>
                    <button v-else class="remove-button" @click="removeCity(city)">
                        <img src="/src/assets/delete_icon.svg" alt="Remover cidade do itinerário" />
                    </button>
                </div>
            </li>
            <li v-if="resultList && metadata && metadata.nextPage < metadata.totalCount" class="list-bottom">
                <button @click="emit('search', metadata.nextPage)" style="width: 120px;">Carregar mais</button>
            </li>
        </ul>
        <div v-else class="loading-spinner">{{ loadingString }}</div>
    </div>
</template>

<script setup>

import { ref, reactive } from 'vue';

const props = defineProps({
    title: String,
    resultList: Boolean
});
const emit = defineEmits(['add-clicked', 'remove-clicked', 'search', 'list-dblclick']);

const loading = ref(false);
const cities = ref([]);
const metadata = reactive({});
const loadingString = ref('Carregando');

const setLoading = (value) => {
    loading.value = value;
};

const getNextPage = () => {
    return metadata.nextPage;
};

const getCities = () => {
    return cities.value;
};

const resetCities = () => {
    cities.value.splice(0, cities.value.length);
};

const updateCities = (response) => {
    metadata.totalCount = response.metadata.totalCount;
    metadata.nextPage = response.metadata.nextPage;
    cities.value = cities.value.concat(response.cidades);
};

const loadingStringAnimate = async () => {
    let i = 0;
    while (loading.value) {
        loadingString.value = 'carregando' + '.'.repeat(i + 1);
        i = (i + 1) % 3;
        await new Promise(resolve => setTimeout(resolve, 500));
    }
};

const addCity = (city) => {
    if (cities.value.length < 10 && !cities.value.includes(city))
        cities.value.push(city);
};

const removeCity = (city) => {
    const index = cities.value.indexOf(city);
    if (index > -1) {
        cities.value.splice(index, 1);
    }
};

defineExpose({
    setLoading,
    addCity,
    removeCity,
    resetCities,
    updateCities,
    loadingStringAnimate,
    getNextPage,
    getCities
});

</script>

<style scoped>
.city-list {
    height: 100%;
    flex: 1;
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
}

.list-header {
    width: 100%;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.city-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    height: 450px;
    width: 100%;
}

.city-item {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #ddd;
    height: 120px;
}

.city-info {
    padding: 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 9;
}

.city-button {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.list-bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
}

.city-name {
    font-weight: bold;
    font-size: 18px;
}

.city-distance,
.city-weather {
    margin-top: 5px;
    display: flex;
    align-items: center;
}

.city-weather img {
    margin-right: 5px;
}

.city-weather span {
    padding: 1px;
    margin-right: 2px;
}

button {
    background-color: green;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    min-height: 25px;
}

button:hover {
    background-color: darkgreen;
}

.add-button:hover {
  background-color: darkgreen;
}

.add-button {
    font-size: 20px;
    background-size: cover;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.remove-button {
    background-color: rgb(235, 65, 65);
    border: none;
    width: 25px;
    height: 25px;
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.remove-button:hover {
    background-color: red;
}

.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 18px;
    color: #555;
}


</style>