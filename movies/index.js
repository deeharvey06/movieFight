const URL = 'http://www.omdbapi.com/'

const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc =  movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src="${imgSrc}" />
      ${movie.Title}
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const res = await axios.get(URL, {
      params: {
        apikey: '5dbd454d',
        s: searchTerm
      }
    });

    if (res.data.Error) {
      return [];
    }

    return res.data.Search;
  },
}

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  const res = await axios.get(URL, {
    params: {
      apikey: '5dbd454d',
      i: movie.imdbID
    }
  });

  summaryElement.innerHTML = movieTemplate(res.data);

  if (side === 'left') {
    leftMovie = res.data;
  } else {
    rightMovie = res.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  leftSideStats.forEach((leftStat, i) => {
    const rightStat = rightSideStats[i];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('warning');
    }
  });
};

const movieTemplate = movieDetail => {
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes);

  let count = 0
  const awards = movieDetail.Awards.split(' ').reduce((acc, ele) => {
    const value = parseInt(ele);

    if (isNaN(value)) {
      return acc;
    } else {
      return  acc + ele;
    }

  }, 0);

  return `
    <article class="media">
        <figure class="media-left">
          <p class="image">
            <img src="${movieDetail.Poster}">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <h1>${movieDetail.Title}</h1>
            <h4>${movieDetail.Genre}</h4>
            <p>${movieDetail.Plot}</p>
          </div>
        </div>
      </article>

      <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
      </article>
      <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
      </article>
      <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
      </article>
      <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMBD Rating</p>
      </article>
      <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMBD Votes</p>
      </article>
  `;
}