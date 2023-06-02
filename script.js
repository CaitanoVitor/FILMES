const input = document.querySelector('.input')
const moviesDiv = document.querySelector('.movies');
const btnPrev = document.querySelector('.btn-prev');
const btnNex = document.querySelector('.btn-next');
const videoDay = document.querySelector('.highlight__video');
const titleVideo = document.querySelector('.highlight__title');
const video = document.querySelector('.highlight__video-link');
const rating = document.querySelector('.highlight__rating');
const genres = document.querySelector('.highlight__genres');
const launch = document.querySelector('.highlight__launch');
const description = document.querySelector('.highlight__description');
const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.modal__img');
const modalTitle = document.querySelector('.modal__title');
const modalDesciption = document.querySelector('.modal__description');
const modalAverage = document.querySelector('.modal__average');
const modalGenres = document.querySelector('.modal__genres');
const close = document.querySelector('.modal__close');
const btnTheme = document.querySelector('.btn-theme');
const body = document.querySelector('body');
const btnClose = document.querySelector('.modal__close')



let moviesArray = [];
let page = 0;
let searchArrey = [];
let searching = false;
let theme = localStorage.getItem('theme') !== null ? localStorage.getItem('theme') : "light";

async function getMovies() {
    const response = await axios.get('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');
    const moviesArray = response.data.results.slice(0, 18);
    return moviesArray;

};
function renderMovies() {
    moviesArray.slice(page, page + 6).forEach(item => {
        const div = document.createElement('div');
        div.className = 'movie';
        div.style.backgroundImage = `url(${item.poster_path})`;
        div.addEventListener('click', () => {
            openModal(item);
        });
        modal
        const divInfo = document.createElement('div')
        divInfo.className = "movie__info"
        const span1 = document.createElement('span')
        span1.className = 'movie__title'
        span1.textContent = item.title;

        const span2 = document.createElement('span')
        span2.className = 'movie__rating'
        span2.textContent = item.vote_average.toFixed(1);

        const star = document.createElement('img')
        star.src = "./assets/estrela.svg"

        span2.appendChild(star);
        divInfo.append(span1, span2);
        div.appendChild(divInfo);
        moviesDiv.appendChild(div);
    });
}

const openModal = async (item) => {
    const response = await axios.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${item.id}?language=pt-BR`);
    modal.classList.remove("hidden");
    modalImg.src = response.data.backdrop_path;
    modalTitle.textContent = response.data.title;
    modalDesciption.textContent = response.data.overview;
    modalAverage.textContent = response.data.vote_average.toFixed(1);
    modalGenres.innerHTML = '';
    response.data.genres.forEach(item => {
        const genreSpan = document.createElement('span');
        genreSpan.classList.add('modal__genre');
        genreSpan.textContent = item.name;
        modalGenres.appendChild(genreSpan);
    });

}
const closeModal = () => {
    modal.classList.add("hidden");

}
close.addEventListener('click', () => {
    closeModal();
});
btnNex.addEventListener('click', () => {
    clearMovies();
    if (page === 12) {
        page = 0;
    } else {
        page += 6
    }

    !searching ? renderMovies() : search(searchArrey);
});
btnPrev.addEventListener('click', () => {
    clearMovies();
    if (page === 0) {
        page = 12;
    } else {
        page -= 6
    }

    !searching ? renderMovies() : search(searchArrey);
});
function clearMovies() {
    const movieDiv = document.querySelectorAll('.movie');
    movieDiv.forEach((movie) => movie.remove())
}
async function firstRender() {
    moviesArray = await getMovies();
    renderMovies(moviesArray.slice(0, 6));
};

async function videoHighlight() {
    const response = await axios.get('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');
    const responseVideos = await axios.get('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');
    videoDay.style.backgroundImage = `url(${response.data.backdrop_path})`;
    videoDay.style.backgroundSize = "contain";
    titleVideo.textContent = response.data.title;
    rating.textContent = response.data.vote_average.toFixed(1);
    response.data.genres.forEach(item => {
        genres.textContent += item.name + " ";
    });
    const dataFormat = new Date(response.data.release_date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
    launch.textContent = dataFormat;
    description.textContent = response.data.overview;
    video.href = `https://www.youtube.com/watch?v=${responseVideos.data.results[0].key}`;


};
input.addEventListener('keypress', (event) => {
    if (event.code != 'Enter') {
        return
    }
    searchMove(input.value);

});

async function searchMove(value) {
    const response = await axios.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${value}`);
    search(response.data.results);
    if (!value || response.data.results.length === 0) {
        input.value = '';
        searching = false;
        return renderMovies();
    }
    searching = true;
    searchArrey = response.data.results;
}
function search(moviesSearch) {
    moviesDiv.innerHTML = "";
    moviesSearch.slice(page, page + 6).forEach(item => {
        const div = document.createElement('div');
        div.className = 'movie';
        if (item.backdrop_path !== null) {
            div.style.backgroundImage = `url(${item.backdrop_path})`;
        } else {
            div.style.backgroundImage = '';
        }

        const divInfo = document.createElement('div')
        divInfo.className = "movie__info"
        const span1 = document.createElement('span')
        span1.className = 'movie__title'
        span1.textContent = item.title;

        const span2 = document.createElement('span')
        span2.className = 'movie__rating'
        span2.textContent = item.vote_average;

        const star = document.createElement('img')
        star.src = "./assets/estrela.svg"

        span2.appendChild(star);
        divInfo.append(span1, span2);
        div.appendChild(divInfo);
        moviesDiv.appendChild(div);
    });
}
function themePage() {
    if (theme === 'dark') {
        btnTheme.src = './assets/dark-mode.svg';
        btnNex.src = './assets/arrow-right-light.svg';
        btnPrev.src = './assets/arrow-left-light.svg';
        btnClose.src = './assets/close.svg';
        body.style.setProperty('--background', '#1B2028');
        body.style.setProperty('--input-color', '#665F5F');
        body.style.setProperty('--text-color', '#FFFFFF');
        body.style.setProperty('--bg-secondary', '#2D3440');
        bory.style.setProperty('--bg-modal', '#FF0040');

    } else {
        btnTheme.src = './assets/light-mode.svg';
        btnNex.src = './assets/arrow-right-dark.svg';
        btnPrev.src = './assets/arrow-left-dark.svg';
        btnClose.src = './assets/close-dark.svg';
        body.style.setProperty('--background', '#FFFFFF');
        body.style.setProperty('--input-color', '#665F5F');
        body.style.setProperty('--text-color', '#1B2028');
        body.style.setProperty('--bg-secondary', '#EDEDED');
        bory.style.setProperty('--rating-color', '#2D3440');
        bory.style.setProperty('--bg-modal', '#1B2028');
    }
}
btnTheme.addEventListener('click', () => {
    if (theme === "light") {
        theme = "dark"
    } else {
        theme = "light"
    }
    localStorage.setItem('theme', theme);
    themePage();
})




firstRender();
videoHighlight();