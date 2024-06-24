# CityWeather

CityWeather é uma aplicação web que permite aos usuários pesquisar e visualizar previsões meteorológicas de diversas cidades, adicioná-las a um itinerário e gerar um PDF com o roteiro de viagem. Esta aplicação utiliza uma combinação de Vue.js para o frontend e uma API backend para obter dados das cidades.

## Índice
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Dependências](#dependências)
- [Configuração do Backend](#configuração-do-backend)
- [Configuração do Frontend](#configuração-do-frontend)
- [Uso](#uso)

## Funcionalidades

1. **Busca de Cidades**: Pesquise cidades dentro de um raio específico a partir de uma localização selecionada no mapa.
2. **Visualização de Previsões do Tempo**: Veja a previsão do tempo das cidades encontradas.
3. **Adicionar ao Itinerário**: Adicione cidades a um itinerário de viagem.
4. **Remover do Itinerário**: Remova cidades do itinerário.
5. **Gerar Itinerário**: Gere um itinerário baseado nas cidades selecionadas.
6. **Download de PDF**: Faça o download do itinerário gerado em formato PDF.

## Arquitetura

A aplicação é dividida em duas partes principais:

### Frontend

- **Vue.js**: Framework JavaScript utilizado para construir a interface de usuário.
- **Axios**: Biblioteca para fazer requisições HTTP ao backend.
- **vue3-pdfmake**: Biblioteca para gerar arquivos PDF a partir do conteúdo HTML.
- **html-to-pdfmake**: Utilizado para converter HTML para o formato utilizado pelo pdfMake.

### Backend

- **Node.js com Express**: Framework para construir a API que fornece os dados das cidades e previsões meteorológicas.
- **API de Recomendações de Cidades**: API que processa as cidades e fornece recomendações baseadas nos critérios do usuário.

## Dependências

### Frontend

- Vue.js
- Axios
- vue3-pdfmake
- html-to-pdfmake
- marked

### Backend

Para detalhes sobre o backend, consulte o repositório: [RecomendadorDeCidadesAPI](https://github.com/schmoellerIuri/RecomendadorDeCidadesAPI).

## Configuração do Backend

Para configurar e executar o backend, siga os passos abaixo:

1. **Clone o Repositório**:
    ```bash
    git clone https://github.com/schmoellerIuri/RecomendadorDeCidadesAPI.git
    ```
2. **Instale as Dependências**:
    ```bash
    cd RecomendadorDeCidadesAPI
    npm install
    ```
3. **Inicie o Servidor**:
    ```bash
    node server.js
    ```

O servidor estará rodando em `http://localhost:5000`.

## Configuração do Frontend

Para configurar e executar o frontend, siga os passos abaixo:

1. **Clone o Repositório do Frontend**:
    ```bash
    git clone https://github.com/schmoellerIuri/recomendador-clima.git
    ```
2. **Instale as Dependências**:
    ```bash
    cd CityWeather
    npm install
    ```
3. **Configuração do Google Maps**:
   - Obtenha uma chave de API do Google Maps.
   - Substitua `DEMO_MAP_ID` no código pelo seu Map ID obtido no Google Cloud Platform.
4. **Inicie o Servidor de Desenvolvimento**:
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173`.

## Uso

1. Abra a aplicação no navegador.
2. Clique no mapa para selecionar uma localização.
3. Defina o raio de busca e os limites de temperatura.
4. Clique em "Buscar" para obter as cidades dentro dos critérios definidos.
5. Adicione cidades ao itinerário clicando no botão de adição.
6. Gere o itinerário e faça o download em PDF.

Para mais informações, dúvidas ou contribuições, sinta-se à vontade para abrir uma issue ou enviar um pull request no repositório do projeto.

**Desenvolvido por Iuri Schmoeller**

**2024**
