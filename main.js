import * as bootstrap from 'bootstrap';
import './style.scss';
import { nav } from './nav';

const getarticles = async () => {
  const url = new URL(import.meta.env.VITE_API_URL);
  url.pathname = '/api/articles';
  const reponse = await fetch(url);
  const articles = await reponse.json();

  return articles;
};

const listearticles = () => {
  // récupération des données

  let html = '';
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];

    // url de l'image
    const imgUrl = article.lien_image;

    let articleCard = `
      <a class="card col-5 col-md-3" href="/article/?id=${article.id}">
        <img src="${imgUrl}" crossorigin class="card-img-top" alt="lien_image de ${article.titre}">
        <div class="card-body">
          <h5 class="card-title">${article.titre} </h5>
        </div>
      </a>
    `;
    html += articleCard;
  }
  return html;
};

let articles = await getarticles();

document.querySelector('#app').innerHTML = `
  <main>
    ${nav}

    <div class="container-fluid my-4">
      <input type="text" class="form-control" id="search-input" placeholder="Recherchez dans l'annuaire" />
    </div>

    <div class="container-fluid my-4">
      <div id="liste-articles" class="d-flex gap-3 flex-wrap justify-content-center">
        ${listearticles()}
      </div>
    </div>
  </main>
`;

// recherche
document.querySelector('#search-input').addEventListener('input', async (e) => {
  const url = new URL(import.meta.env.VITE_API_URL);
  url.pathname = '/api/articles/search';
  url.searchParams.set('q', e.target.value ?? '');
  const reponse = await fetch(url);
  const results = await reponse.json();
  console.log(results);

  if (!results || results.length === 0 || results.statusCode === 500) {
    articles = await getarticles();
  } else {
    articles = results;
  }
  const liste = document.querySelector('#liste-articles');
  liste.innerHTML = listearticles();
});