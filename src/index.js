import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

countryInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const name = countryInput.value.trim();
  if (name === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
  }

  fetchCountries(name)
    .then(country => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';

      if (country.length === 1) {
        countryInfo.insertAdjacentHTML('beforeend', markupInfo(country));
      } else if (country.length >= 10) {
        manyMatches();
      } else {
        countryList.insertAdjacentHTML('beforeend', markupList(country));
      }
    })

    .catch(wrongName);
}

function manyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function wrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function markupList(country) {
  const layoutList = country
    .map(({ name, flags }) => {
      const layout = `
          <li class="country-list__item">
              <img class="country-list__item--flag" src="${flags.svg}" alt="Flag of ${name.official}">
              <h2 class="country-list__item--name">${name.official}</h2>
          </li>
          `;
      return layout;
    })
    .join('');
  return layoutList;
}

function markupInfo(country) {
  const layoutInfo = country
    .map(({ name, flags, capital, population, languages }) => {
      const layout = `
        <ul class="list-info">
            <li class="country-info__item">
              <img class="country-info__item--flag" src="${
                flags.svg
              }" alt="Flag of ${name.official}">
              <h2 class="country-info__item--name">${name.official}</h2>
            </li>
            <li class="country-info__item"><span class="country-info__item--categories">Capital: </span>${capital}</li>
            <li class="country-info__item"><span class="country-info__item--categories">Population: </span>${population}</li>
            <li class="country-info__item"><span class="country-info__item--categories">Languages: </span>${Object.values(
              languages
            ).join(', ')}</li>
        </ul>
        `;
      return layout;
    })
    .join('');
  return layoutInfo;
}
