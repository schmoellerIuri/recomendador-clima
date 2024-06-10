<script setup>
import { ref, onMounted, watch, reactive, computed } from 'vue'
import axios from 'axios'
import Modal from './Modal.vue';
import { marked } from 'marked';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const mapElement = ref(null);
const marker = ref(null);
const radius = ref(10);
const maxTemp = ref(0);
const minTemp = ref(0);
const isValid = ref(true);
const data = reactive({ cidades: [] });
const itineraryCities = reactive([]);
const loading = ref(false);
const loadingString = ref('Carregando');
const openModal = ref(false);
const inputBorderColor = ref('#ddd');
const selectedCity = ref(null);
const itinerary = ref('<p align="center">Seu roteiro será exibido aqui.</p>');
const outputItinerary = computed(() => marked(itinerary.value))
const loadingItinerary = ref(false);

let circle = null;

onMounted(() => {
  if (mapElement.value) {
    const map = new google.maps.Map(mapElement.value, {
      center: { lat: -24.7199, lng: -53.7433 },
      zoom: 4,
      mapId: 'DEMO_MAP_ID'
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
    });
  }
});

watch(radius, (value) => {
  if (value < 10) {
    radius.value = 10;
  }
  if (value > 200) {
    radius.value = 200;
  }
  if (circle) {
    circle.setRadius(value * 1000);
  }
});

watch([maxTemp, minTemp], () => {
  if (maxTemp.value !== null && minTemp.value !== null && maxTemp.value >= minTemp.value) {
    inputBorderColor.value = '#ddd';
    isValid.value = true;
  }

  else {
    isValid.value = false;
    inputBorderColor.value = 'red';
  }
});

const searchWeather = async (offset = 0) => {
  if (!isValid.value) {
    alert('Temperatura máxima não pode ser menor que a temperatura mínima');
    return;
  }

  if (loading.value || loadingItinerary.value) {
    alert('Aguarde o carregamento anterior');
    return;
  }

  if (offset === 0) {
    data.cidades = [];
    itineraryCities.splice(0, itineraryCities.length);
    itinerary.value = '<p align="center">Seu roteiro será exibido aqui.</p>';
  }

  loading.value = true;

  try {
    loadingStringAnimate();
    const lat = marker.value.getPosition().lat();
    const lon = marker.value.getPosition().lng();

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
    data.metadata = response.data.metadata;
    data.cidades = data.cidades.concat(response.data.cidades);
    if (data.cidades.length === 0) {
      alert('Nenhuma cidade encontrada');
    }
  } catch (error) {
    alert(error.message);
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const loadingStringAnimate = async () => {
  let i = 0;
  while (loading.value || loadingItinerary.value) {
    loadingString.value = 'carregando' + '.'.repeat(i + 1);
    i = (i + 1) % 3;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
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
  if (itineraryCities.length < 10 && !itineraryCities.includes(city))
    itineraryCities.push(city);
};

const removeCityFromItinerary = (city) => {
  const index = itineraryCities.indexOf(city);
  if (index > -1) {
    itineraryCities.splice(index, 1);
  }
};

const getItinerary = async () => {
  if (itineraryCities.length === 0) {
    alert('Adicione cidades ao itinerário');
    return;
  }
  if (itineraryCities.length > 10) {
    alert('Máximo de 10 cidades no itinerário');
    return;
  }
  if (loadingItinerary.value) {
    alert('Aguarde o carregamento anterior');
    return;
  }

  loadingItinerary.value = true;

  try {
    loadingStringAnimate();
    const response = await axios.post('https://localhost:443/recomendacao', {
      cidades: itineraryCities
    });
    itinerary.value = response.data;
  } catch (error) {
    alert(error.message);
    console.log(error);
  }
  finally {
    loadingItinerary.value = false;
  }

};

const downloadPDF = async () => {
  const html = outputItinerary.value;
  const pdfContent = htmlToPdfmake(html);

  const documentDefinition = {
    content: pdfContent,
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 15,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      quote: {
        italics: true,
        alignment: 'right',
        margin: [0, 10, 0, 10]
      },
      small: {
        fontSize: 8
      }
    }
  };

  pdfMake.createPdf(documentDefinition).download('itinerario.pdf');
};

</script>

<template>
  <div class="screen">
    <div class="header">
      <span class="title">CityWeather</span>
    </div>
    <div class="container">
      <div class="map-container">
        <div ref="mapElement" class="map"></div>
        <div class="sidebar">
          <div class="form">
            <div class="form-group">
              <label for="radius">Raio de busca (km):</label>
              <input type="number" id="radius" v-model="radius" min="10" max="200" />
            </div>
            <div class="form-group">
              <label for="maxTemp">Temperatura máxima (°C):</label>
              <input type="number" id="maxTemp" v-model="maxTemp" :style="{ 'border-color': inputBorderColor }" />
            </div>
            <div class="form-group">
              <label for="minTemp">Temperatura mínima (°C):</label>
              <input type="number" id="minTemp" v-model="minTemp" :style="{ 'border-color': inputBorderColor }" />
            </div>
            <button @click="searchWeather()">Buscar</button>
          </div>
        </div>
      </div>
      <div class="city-list-container">
        <div class="city-list">
          <div class="list-header">
            <h2>Cidades</h2>
          </div>
          <ul v-if="!loading">
            <li v-for="city in data.cidades" :key="city.nome" class="city-item" @dblclick="openCityModal(city)"
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
                <button class="add-button" @click="addCityToItinerary(city)">&plus;</button>
              </div>
            </li>
            <li v-if="data.metadata && data.metadata.nextPage < data.metadata.totalCount" class="list-bottom">
              <button @click="searchWeather(data.metadata.nextPage)" style="width: 150px;">Carregar mais</button>
            </li>
          </ul>
          <div v-else class="loading-spinner">{{ loadingString }}</div>
        </div>
        <div class="city-list">
          <div class="list-header">
            <h2>Cidades no Itinerário (Máx. 10)</h2>
          </div>
          <ul v-if="itineraryCities.length > 0">
            <li v-for="city in itineraryCities" :key="city.nome" class="city-item">
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
                <button class="remove-button" @click="removeCityFromItinerary(city)">
                  <img src="/src/assets/delete_icon.svg" alt="Remover cidade do itinerário" />
                </button>

              </div>
            </li>
          </ul>
        </div>
        <div class="itinerary">
          <div class="list-header">
            <h2>Roteiro de viagem</h2>
          </div>
          <div v-if="!loadingItinerary" class="itinerary-content" v-html="outputItinerary"></div>
          <div v-else class="loading-spinner" style="height: 400px; border-bottom: 1px solid #ddd;">{{ loadingString }}
          </div>
          <div class="itinerary-bottom">
            <button style="width: 40px;" @click="downloadPDF()">
              <img src="/src/assets/pdf_icon.svg" alt="Baixar como pdf">
            </button>
            <button style="width: 40px;" @click="getItinerary()"><img src="/src/assets/search.svg"
                alt="Gerar itinerário">
            </button>
          </div>
        </div>
      </div>
    </div>
    <Modal :isOpen="openModal" :city="selectedCity" @close="closeCityModal" />
  </div>
</template>


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
  /* Garantir que a barra tenha largura total */
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

.map {
  flex: 2;
  height: 100%;
}

.sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: #f4f4f4;
}

.form {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="number"] {
  width: 80%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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

.city-list {
  height: 100%;
  flex: 1;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.itinerary-bottom {
  display: flex;
  justify-content: right;
  align-items: center;
  margin: 5px;
  width: auto;
  height: 50px;
  gap: 10px;
}

.itinerary {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.itinerary-content {
  height: 400px;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #ddd;
  overflow-y: auto;
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

.add-button {
  font-size: 20px;
  font-weight: bold;
  background-size: cover;
  width: 12px;
  height: 25px;
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.remove-button {
  background-color: rgb(235, 65, 65);
  width: 12px;
  height: 25px;
  border-radius: 1rem;
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
