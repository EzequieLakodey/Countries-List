// Datos de países: REST Countries API v5.
//
// La versión anterior (/v2, usada originalmente en este proyecto) fue deprecada
// y hoy devuelve un error sin payload. La v5 cambió la forma de la respuesta:
// los países ya no vienen en un array suelto, sino en data.objects[], y los
// campos pasaron a objetos anidados (names.common, currencies[], etc.).
//
// La v5 exige API key en el header Authorization. Para uso desde el navegador
// la key debe ser pública y tener el origen permitido, así que este archivo lee
// la key de window.COUNTRIES_API_KEY, que se define en index.html. Si falta,
// se muestra un aviso con las instrucciones para conseguirla.
const apiUrl = `https://api.restcountries.com/countries/v5`;

// Máximo por página en el plan gratuito.
const pageSize = 100;

// Key pública cargada desde el HTML; ver README.
const apiKey = window.COUNTRIES_API_KEY;

const mainContainer = document.querySelector(`#main-desplazation`);
const countriesContainer = document.querySelector(`#countries-container`);

function showNotice(message) {
  countriesContainer.innerHTML = `
    <div class="alert alert-warning text-center" role="alert">
      <p>${message}</p>
    </div>`;
}

function renderCountry(country) {
  // Monedas: en v5 currencies[] trae { code, name, symbol }.
  let currencies = [];
  country.currencies?.forEach((c) => {
    currencies.push(c.name);
  });

  // Idiomas: en v5 languages[] trae { bcp47, iso639_1, name }.
  let languages = [];
  country.languages?.forEach((l) => {
    languages.push(l.name);
  });

  // La v5 anida el nombre, la bandera y la capital.
  const countryName = country.names?.common ?? country.names?.official;
  const flagUrl = country.flag?.url_svg ?? country.flag?.url_png;
  const capital = country.capitals?.[0]?.name ?? `N/A`;

  const cards = document.createElement(`div`);
  cards.classList.add(
    `auto-row`,
    `card`,
    `col-xl-4`,
    `col-md-6`,
    `col-sm-12`,
    `justify-content-between`,
    `align-items-center`
  );
  cards.innerHTML = `
      <h3 class="card-title"> ${countryName} </h3>
      <button type="button" id="showdetails${countryName}" class="btn btn-outline-primary"> Details </button>
      <div class="hidden text-center justify-content-between align-items-center flex-column" id="detailsection${countryName}">
        <img src="${flagUrl}" alt="${countryName} flag" class="card-img-top img-fluid py-3"/>
        <h4 class="card-text"> Capital : ${capital} </h4>
        <em class="card-text"> Currency : ${currencies} </em>
        <p class="card-text"> Languages : ${languages} </p>
        <p class="card-text"> Region : ${country.region}, ${country.subregion} </p>
        <p class="card-text"> Calling code : +${country.calling_codes?.[0] ?? `N/A`} </p>
        <p class="card-text"> Time zone : ${country.timezones} </p>
      </div>
      `;
  countriesContainer.appendChild(cards);

  const countriesDetailButton = document.getElementById(
    `showdetails${countryName}`
  );
  countriesDetailButton.addEventListener(`click`, () => {
    let showCountryDetail = document.getElementById(
      `detailsection${countryName}`
    );
    showCountryDetail.classList.toggle(`show`);
  });
}

// Pedí una página de países ya mapeada a la forma que usa este archivo.
async function fetchPage(offset) {
  const resp = await fetch(`${apiUrl}?limit=${pageSize}&offset=${offset}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`);
  }

  const data = await resp.json();

  // La v5 envuelve la lista en data.objects y expone el total en data.meta.
  return {
    countries: data?.data?.objects ?? [],
    total: data?.data?.meta?.total ?? data?.data?.objects?.length ?? 0,
  };
}

async function loadCountries() {
  let offset = 0;
  let total = Infinity;
  let loaded = 0;

  // La v5 pagina de a pageSize: seguimos hasta cubrir el total informado.
  while (loaded < total) {
    const { countries, total: reportedTotal } = await fetchPage(offset);
    total = reportedTotal;

    countries.forEach(renderCountry);
    loaded += countries.length;
    offset += pageSize;

    if (countries.length === 0) break;
  }

  if (loaded === 0) {
    showNotice(`No se recibieron países de la API.`);
  }
}

if (!apiKey) {
  showNotice(
    `Falta la API key de REST Countries.<br>
     Creá una gratis en <a href="https://restcountries.com/sign-up" target="_blank">restcountries.com/sign-up</a>
     y cargala en index.html: <code>&lt;script&gt;window.COUNTRIES_API_KEY="tu_key"&lt;/script&gt;</code>`
  );
} else {
  loadCountries().catch((err) => {
    console.error(err);
    showNotice(
      `Error al cargar los países. Revisá la API key y que el origen de la página esté permitido en la key.`
    );
  });
}
