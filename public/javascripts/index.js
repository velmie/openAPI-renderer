let ignoreReleaseChanges = false;

function compareByTimestamp(a, b) {
  if (a.timestamp < b.timestamp) {
    return 1;
  } else if (a.timestamp > b.timestamp) {
    return -1;
  }
  return 0;
}

function renderReleaseDocs(release) {
  const params = new URLSearchParams();
  params.append('api', release);

  const link = './docs?' + params.toString();
  const options = {
    scrollYOffset: 5
  };
 
  Redoc.init(link, options, document.getElementById('redoc-container'), function () {
    console.log('Rendered');
  });
}

function showReleaseDocs(release) {
  if (ignoreReleaseChanges) {
    return;
  }
  renderReleaseDocs(release);
}

async function init() {
  const schemasByService = schemas;

  $services = $('#services');
  $releases = $('#releases');

  $services.html('<option hidden value="">Select a Service</option>');
  Object.keys(schemasByService).forEach((key) => {
    $services.append(`<option value="${key}">${key}</option>`);
  });

  $services.on('change', (e) => {
    const { value } = e.target;
    $releases.html('');

    const options = schemasByService[value];

    options.sort(compareByTimestamp);
    options.forEach(({ key, sortKey }) => {
      $releases.append(`<option value="${key}">${sortKey}</option>`);
    });

    $releases.parents('select').prop('disabled', options.length < 2);

    showReleaseDocs(options[0].key);

  });
  

  $releases.parents('select').on('change', (e) => {
    showReleaseDocs(e.target.value);
  });

  if (cookies) {
    showReleaseDocs(cookies.api);
    $(`#services option[value="${cookies.serviceKey}"]`)
    .attr('selected', 'selected')
    .change();
    $(`#releases option[value="${cookies.api}"]`)
    .attr('selected', 'selected')
    .change();
  }
}

window.onload = function() {
  init();
};
