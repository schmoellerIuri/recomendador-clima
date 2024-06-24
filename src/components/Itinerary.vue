<template>
    <div class="itinerary">
        <div class="list-header">
            <h2>Roteiro de viagem</h2>
        </div>
        <div class="itinerary-content" v-html="outputItinerary"></div>
        <div class="itinerary-bottom">
          <div class="loading-container">
            <h2 v-if="loadingItinerary">{{ loadingString }}</h2>
          </div>
          <div class="buttons">
            <button style="width: 40px;" @click="downloadPDF()">
                <img src="/src/assets/pdf_icon.svg" alt="Baixar como pdf">
            </button>
            <button style="width: 40px;" @click="$emit('getItineraryRequest')"><img src="/src/assets/search.svg"
                    alt="Gerar itinerário">
            </button>
          </div>
        </div>
    </div>
</template>

<script setup>

import { ref, computed } from 'vue';
import { marked } from 'marked';
import { usePDF } from 'vue3-pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';

const pdfmake = usePDF({
  autoInstallVFS: true
})

const emit = defineEmits(['startedGetItinerary', 'finishedGetItinerary', 'getItineraryRequest']);

const itinerary = ref('<p align="center">Seu roteiro será exibido aqui.</p>');
const outputItinerary = computed(() => marked(itinerary.value));
const loadingItinerary = ref(false);
const loadingString = ref('carregando');

const resetValue = () => {
  itinerary.value = '<p align="center">Seu roteiro será exibido aqui.</p>';
};

const loadingStringAnimate = async () => {
  let i = 0;
  while (loadingItinerary.value) {
    loadingString.value = 'carregando' + '.'.repeat(i + 1);
    i = (i + 1) % 3;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

const getItinerary = async (itineraryCities) => {
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
  emit('startedGetItinerary')

  try {
    loadingStringAnimate();
    const response = await fetch('https://city-weather-backend.azurewebsites.net/recomendacao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cidades: itineraryCities })
    });

    if (!response.ok) {
      alert('Erro na resposta do servidor');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let itineraryText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      itineraryText += decoder.decode(value, { stream: true });
      itinerary.value = itineraryText;
    }

    itineraryText += decoder.decode();
    itinerary.value = itineraryText;

  } catch (error) {
    if (error.response.data)
      alert(error.response.data);
    else
      alert(error.message);
    console.log(error);
  }
  finally {
    loadingItinerary.value = false;
    emit('finishedGetItinerary');
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

  pdfmake.createPdf(documentDefinition).download('itinerario.pdf');
};

defineExpose({
  resetValue,
  getItinerary
});

</script>


<style scoped>

.list-header {
    width: 100%;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
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

.itinerary-bottom {
  display: flex;
  width: 100%;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 80%;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  width: 20%;
  height: 80%;
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

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  color: #555;
}

</style>