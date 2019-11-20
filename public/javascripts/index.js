/* eslint-disable no-undef */

const serviceSelect = $('#service');
const versionSelect = $('#version');

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

function parseSearchParams({ search }) {
  const apiId = (new URLSearchParams(search)).get('api');
  const [stage, app] = apiId.split('/');

  const state = {
    apiId,
    service: `${app}:${stage}`,
  };
  return state;
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

function fillInSelect(service) {
  const options = bucketSchema[service];
  versionSelect.html('');

  options.forEach(({ key, version }) => {
    versionSelect.append(`<option value="${key}">${version}</option>`);
  });
}

function changeURL(state, replace = false) {
  const params = createSearchParams(state);
  if (replace) {
    historyReplace(params);
  } else {
    historyPush(params);
  }
}

function changeSelects(state) {
  const { apiId, service } = state;

  serviceSelect.val(service);
  fillInSelect(service);
  versionSelect.val(apiId);

  renderDocumentation(state);
  changeURL(state, true);
}

function init() {
  serviceSelect.html('<option hidden value="">Select a Service</option>');
  versionSelect.html('<option hidden value="">Select a Version</option>');

  Object.keys(bucketSchema).forEach((service) => {
    serviceSelect.append(`<option value="${service}">${service}</option>`);
  });

  serviceSelect.on('change', ({ target }) => {
    const service = target.value;

    fillInSelect(service);
    versionSelect.trigger('change');
  });

  versionSelect.on('change', ({ target }) => {
    const state = {
      service: serviceSelect.val(),
      apiId: target.value,
    };

    renderDocumentation(state);
    changeURL(state);
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

$(window).on('load', init);
