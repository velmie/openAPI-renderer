console.log('test');

const docsContainer = document.getElementById('redoc-container');
const updateButton = document.getElementById('update-button');

function updateDocumentation(docUrl) {

  const options = {
    scrollYOffset: 5
  };

  Redoc.init(docUrl, options, docsContainer, function () {
    console.log('Rendered');
    console.log(arguments);
  });
}

updateButton.addEventListener('click', event => {
  const link1 = 'http://petstore.swagger.io/v2/swagger.json';

  const params = new URLSearchParams();
  params.append('stage', 'dev');
  params.append('timestamp', Date.now());

  const link2 = '//localhost:3000/docs?' + params.toString();

  updateDocumentation(Math.random() > 0.5 ? link1 : link2);
});


