import axios, { AxiosResponse } from 'axios';

const searchForm = document.getElementById('searchForm') as HTMLFormElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const resultsContainer = document.getElementById('results');
const itemsPerPage = 9;
let startPage = 1;

searchForm.addEventListener('submit', handleSearchFormSubmit);

function handleSearchFormSubmit(event: Event) {
  event.preventDefault();
  const search = searchInput.value;

  if (search === '') {
    alert('Please enter name to lookup');
    return;
  }

  searchUsers(search);
}

async function searchUsers(query: string) {
  const apiURL = 'https://api.github.com/search/users';
  const value = 'login';

  try {
    const response: AxiosResponse<any> = await axios.get(apiURL, {
      params: {
        q: `${query} in:${value}`
      },
    });

    const results = response.data.items;

    console.log(results)

    displayResults(results);
    createPaginationButtons(results.length);
  } catch (error) {
    console.error('Error occurred during search:', error);
  }
}

function displayResults(results: any[]): void {

  if (!resultsContainer) {
    console.error('Nothing found');
    return;
  }

  resultsContainer.innerHTML = '';

  //To print 9 items
  const startIndex = (startPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = results.slice(startIndex, endIndex);
  
  const createTable = document.createElement('table');
  createTable.classList.add('user-info-table');
  createTable.classList.add('margin-center');

  //To create table header
  const tableHeaderRow = document.createElement('tr');
  const loginHeader = document.createElement('th');
  loginHeader.textContent = 'Login';
  const typeHeader = document.createElement('th');
  typeHeader.textContent = 'Type';
  const avatarHeader = document.createElement('th');
  avatarHeader.textContent = 'Avatar';

  tableHeaderRow.appendChild(loginHeader);
  tableHeaderRow.appendChild(typeHeader);
  tableHeaderRow.appendChild(avatarHeader);
  createTable.appendChild(tableHeaderRow);

  //To create table rows with data
  paginatedResults.forEach((result: any) => {
    const login = result.login;
    const type = result.type;
    const avatarUrl = result.avatar_url;

    console.log(login,type,avatarUrl)

    const tableRow = document.createElement('tr');
    const loginCell = document.createElement('td');
    loginCell.textContent = login;
    const typeCell = document.createElement('td');
    typeCell.textContent = type;
    const avatarCell = document.createElement('td');
    const avatarImg = document.createElement('img');
    avatarImg.src = avatarUrl;
    avatarImg.alt = 'Avatar';
    avatarCell.appendChild(avatarImg);

    tableRow.appendChild(loginCell);
    tableRow.appendChild(typeCell);
    tableRow.appendChild(avatarCell);
    createTable.appendChild(tableRow);
  });

  resultsContainer.appendChild(createTable);
}

function createPaginationButtons(totalItems: number) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginationContainer = document.getElementById('pagination');

  if (!paginationContainer) {
    console.error('Nothing to present');
    return;
  }
 
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const paginationButton = document.createElement('button');
    paginationButton.classList.add('btn-page');

    paginationButton.textContent = String(i);

    paginationButton.addEventListener('click', () => {
      startPage = i;
      searchUsers(searchInput.value);
    });

    paginationContainer.appendChild(paginationButton);
  }
}


