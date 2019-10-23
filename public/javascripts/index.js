function getFileUrl(key) {
  const params = new URLSearchParams();
  params.append('api', key);

  const url = './docs?' + params.toString();

  return url;
}

function renderDocumentation(key) {
  const url = getFileUrl(key);
 
  Redoc.init(url, { scrollYOffset: 5 }, document.getElementById('redoc-container'), function () {
    console.log('Rendered: ', url);
  });
}

async function init() {

  $('#service').html('<option hidden value="">Select a Service</option>');
  $('#version').html('<option hidden value="">Select a Version</option>');

  Object.keys(bucketSchema).forEach((service) => {
    $('#service').append(`<option value="${service}">${service}</option>`);
  });

  $('#service').on('change', ({ target: { value } }) => {
    const options = bucketSchema[value];

    $('#version').html('');

    options.forEach(({ key, version }) => {
      $('#version').append(`<option value="${key}">${version}</option>`);
    });

    $('#version').prop('disabled', options.length < 2);

    renderDocumentation(options[0].key);
  });
  
  $('#version').on('change', ({ target: { value } }) => {
    renderDocumentation(value);
  });

  if (cookies) {
    const { key, service } = cookies;

    $(`#service option[value="${service}"]`)
      .attr('selected', 'selected')
      .change();
    $(`#version option[value="${key}"]`)
      .attr('selected', 'selected')
      .change();
  }
}

window.onload = function() {
  init();
};
