/* eslint-disable no-undef */
/* eslint no-unused-expressions: ["error", { "allowTernary": true }] */

const $serviceSelect = $('#service');
const $versionSelect = $('#version');

function historyReplace(params) {
  window.history.replaceState(params, '', `?${params}`);
}

function historyPush(params) {
  window.history.pushState(params, '', `?${params}`);
}

function createSearchParams(state) {
  const { apiId } = state;

  const params = new URLSearchParams();
  params.append('api', apiId);
  return params.toString();
}

function getFileUrl(state) {
  const params = createSearchParams(state);
  const url = `./docs?${params}`;
  return url;
}

function renderDocumentation(state) {
  const url = getFileUrl(state);

  // Need to create clone of element.
  // This will help remove unwanted properties of redoc-container (after error)
  const redocContainer = document.getElementById('redoc-container');
  const redocContainerClone = redocContainer.cloneNode();
  redocContainer.replaceWith(redocContainerClone);

  Redoc.init(url, { scrollYOffset: 5 }, redocContainerClone, () => {
    console.log('Rendered: ', url);
  });
}

function getStateFromUrl(search) {
  const apiId = (new URLSearchParams(search)).get('api');
  const [stage, app] = apiId.split('/');

  const state = {
    apiId,
    service: `${app}:${stage}`,
  };
  return state;
}

function getStateFromCookies(cookies) {
  const state = {
    service: cookies.service,
    apiId: cookies.apiId,
  };

  return state;
}

function getPageState() {
  let state;

  if (window.location.search) {
    state = getStateFromUrl(window.location.search);
  } else if (cookies) {
    state = getStateFromCookies(cookies);
  }

  return state;
}

function updateViewByState(state, flagNewState = false) {
  renderDocumentation(state);
  const params = createSearchParams(state);

  if (flagNewState) {
    historyPush(params);
  } else {
    historyReplace(params);
  }
}

function renderServices() {
  Object.keys(bucketSchema).forEach((service) => {
    $serviceSelect.append(`<option value="${service}">${service}</option>`);
  });
}

function renderVersionsByService(service) {
  const options = bucketSchema[service];
  $versionSelect.html('');

  options.forEach(({ key, version }) => {
    $versionSelect.append(`<option value="${key}">${version}</option>`);
  });
}

function renderUpdatedView(state) {
  const { apiId, service } = state;
  updateViewByState(state);

  renderServices();
  $serviceSelect.val(service);
  renderVersionsByService(service);
  $versionSelect.val(apiId);
}

function renderInitialView() {
  $serviceSelect.html('<option hidden value="">Select a Service</option>');
  $versionSelect.html('<option hidden value="">Select a Version</option>');

  renderServices();
}

$(window).bind('popstate', () => {
  $serviceSelect.html('');
  const state = getStateFromUrl(window.location.search);
  renderUpdatedView(state);
});

$serviceSelect.on('change', ({ target }) => {
  const service = target.value;

  renderVersionsByService(service);
  $versionSelect.trigger('change');
});

$versionSelect.on('change', ({ target }) => {
  const state = {
    service: $serviceSelect.val(),
    apiId: target.value,
  };

  updateViewByState(state, true);
});

$(() => {
  pageState = getPageState();
  pageState ? renderUpdatedView(pageState) : renderInitialView();
});
