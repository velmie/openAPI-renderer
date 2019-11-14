/* eslint-disable no-undef */

const serviceSelect = $('#service');
const versionSelect = $('#version');

function createSearchParams(key) {
  const params = new URLSearchParams();
  params.append('api', key);
  return params.toString();
}

function parseSearchParams({ search }) {
  const key = (new URLSearchParams(search)).get('api');
  const [stage, app] = key.split('/');
  const service = `${app}:${stage}`;
  return { key, service };
}

function getFileUrl(key) {
  const params = createSearchParams(key);
  const url = `./docs?${params}`;
  return url;
}

async function renderDocumentation(key) {
  const url = getFileUrl(key);

  Redoc.init(url, { scrollYOffset: 5 }, document.getElementById('redoc-container'), () => {
    console.log('Rendered: ', url);
  });
}

function fillInSelect(value) {
  const options = bucketSchema[value];
  versionSelect.html('');

  options.forEach(({ key, version }) => {
    versionSelect.append(`<option value="${key}">${version}</option>`);
  });
}

function changeURL(key, replace = false) {
  const params = createSearchParams(key);
  if (replace) {
    window.history.replaceState(params, '', `?${params}`);
  } else {
    window.history.pushState(params, '', `?${params}`);
  }
}

function changeSelects({ key, service }) {
  serviceSelect.val(service);
  fillInSelect(service);
  versionSelect.val(key);
  renderDocumentation(key);
  changeURL(key, true);
}

function init() {
  serviceSelect.html('<option hidden value="">Select a Service</option>');
  versionSelect.html('<option hidden value="">Select a Version</option>');

  Object.keys(bucketSchema).forEach((service) => {
    serviceSelect.append(`<option value="${service}">${service}</option>`);
  });

  serviceSelect.on('change', ({ target: { value } }) => {
    fillInSelect(value);
    versionSelect.trigger('change');
  });

  versionSelect.on('change', ({ target: { value } }) => {
    renderDocumentation(value);
    changeURL(value);
  });

  if (window.location.search) {
    changeSelects(parseSearchParams(window.location));
  } else if (cookies) {
    changeSelects(cookies);
  }
}

window.addEventListener('popstate', () => {
  changeSelects(parseSearchParams(window.location));
});

window.onload = () => {
  init();
};
