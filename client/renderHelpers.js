import {fetchSinglePlayer, fetchAllPlayers, addNewPlayer, removePlayer} from './ajaxHelpers';

const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

//RENDER ALL PLAYERS
export const renderAllPlayers = (playerList) => {
  // First check if we have any data before trying to render it!
  if (!playerList || !playerList.length) {
    playerContainer.innerHTML = '<h3>No players to display!</h3>';
    return;
  }
  // Loop through the list of players, and construct some HTML to display each one
  let playerContainerHTML = '';
  for (let i = 0; i < playerList.length; i++) {
    const pup = playerList[i];
    let pupHTML = `
      <div class="single-player-card">
        <div class="header-info">
          <p class="pup-title">${pup.name}</p>
          <p class="pup-number">#${pup.id}</p>
        </div>
        <img src="${pup.imageUrl}" alt="photo of ${pup.name} the puppy">
        <button class="detail-button" data-id=${pup.id}>DETAILS</button>
        <button class="delete-button" data-id=${pup.id}>REMOVE</button>
      </div>
    `;
    playerContainerHTML += pupHTML;
  }

  playerContainer.innerHTML = playerContainerHTML;







  //FETCH SINGLE PLAYER DETAILS
  let detailButton = [...document.getElementsByClassName('detail-button')];
  for (let i = 0; i < detailButton.length; i++) {
    const button = detailButton[i];
    button.addEventListener('click', async () => {
      const player = await fetchSinglePlayer(button.dataset.id);
      renderSinglePlayer(player);
    });
  }
  //DELETE PLAYER
  let deleteButton = [...document.getElementsByClassName('delete-button')];
  for (let i = 0; i < deleteButton.length; i++) {
    const button = deleteButton[i];
    button.addEventListener('click', async () => {
      await removePlayer(button.dataset.id);
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    });
}
};

// //DELETE PLAYER
//   let deleteButton = [...document.getElementsByClassName('delete-button')];
//   for (let i = 0; i < deleteButton.length; i++) {
//     button.addEventListener('click', async () => {
//       await removePlayer(button.dataset.id);
//       const players = await fetchAllPlayers();
//       renderAllPlayers(players);
//     });
// });
  
// RENDER SINGLE PLAYER
export const renderSinglePlayer = (playerObj) => {
  if (!playerObj || !playerObj.id) {
    playerContainer.innerHTML = "<h3>Couldn't find data for this player!</h3>";
    return;
  }

  let pupHTML = `
    <div class="single-player-view">
      <div class="header-info">
        <p class="pup-title">${playerObj.name}</p>
        <p class="pup-number">#${playerObj.id}</p>
      </div>
      <p>Team: ${playerObj.team ? playerObj.team.name : 'Unassigned'}</p>
      <p>Breed: ${playerObj.breed}</p>
      <img src="${playerObj.imageUrl}" alt="photo of ${
    playerObj.name
  } the puppy">
      <button id="see-all">Back to all players</button>
    </div>
  `;

  playerContainer.innerHTML = pupHTML;
    let backButton = document.getElementById('see-all');
  backButton.addEventListener('click', async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  });
};

//ADD NEW PLAYER
export const renderNewPlayerForm = () => {
  let formHTML = `
    <form>
      <label for="name">Name:</label>
      <input type="text" name="name" />
      <label for="breed">Breed:</label>
      <input type="text" name="breed" />
      <button type="submit">Submit</button>
    </form>
  `;
  newPlayerFormContainer.innerHTML = formHTML;

  let form = document.querySelector('#new-player-form > form');
  form.addEventListener('submit', async (event) => { event.preventDefault();
let playerData = {
      name: form.elements.name.value,
      breed: form.elements.breed.value
    }
    await addNewPlayer(playerData);
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    form.elements.name.value = '';
    form.elements.breed.value = '';
  });
};
