let ignoreReleaseChanges = false;

function compareByTimestamp(a, b) {
  if (a.timestamp < b.timestamp) {
    return 1;
  } else if (a.timestamp > b.timestamp) {
    return -1;
  }
  return 0;
}

function renderReleaseDocs(filepath) {
  const link = '//localhost:3000/docs?filepath=' + filepath;
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

  if (release) {
    getFilePath(release).then((filepath) => {
      renderReleaseDocs(filepath);
    });
  }
}

async function getSchemasByService() {
  const response = await axios.get('/schemas');
  return response.data;
}

async function getFilePath(release) {
  const response = await axios.post('/schemas/document', { release });
  return response.data;
}

async function init() {
  const schemasByService = await getSchemasByService();
  
  $services = $('#services');
  $releases = $('#releases');

  $services.html('<option value="">Select a Service</option>');
  Object.keys(schemasByService).forEach((key) => {
    $services.append(`<option value="${key}">${key}</option>`);
  });

  $services.on('change', (e) => {
    const { value } = e.target;

    $releases.html('');
    if (value) {
      const options = schemasByService[value];

      options.sort(compareByTimestamp);
      options.forEach(({ key, sortKey }) => {
        $releases.append(`<option value="${key}">${sortKey}</option>`);
      });

      $releases.parents('select').prop('disabled', options.length < 2);

      showReleaseDocs(options[0].key);
    } else {

      $releases.html('')
      showReleaseDocs(null);
    }
  });

  $releases.parents('select').on('change', (e) => {
    showReleaseDocs(e.target.value);
  });

//   window.addEventListener('popstate', () => {
//     $services.val('').trigger('change');
//   });
//   console.log('window.location.hash ', window.location.hash)
//   if (window.location.hash) {
//     const release = window.location.hash.substr(1);
//     const svc = release.split('/').slice(0, 2).join('::');
// console.log('svc ', svc)
//     ignoreReleaseChanges = true;
//     $services.val(svc).trigger('change');
//     ignoreReleaseChanges = false;

//     $releases.parents('select').val(release).trigger('change');
//   }
}

window.onload = function() {
  init();
};
