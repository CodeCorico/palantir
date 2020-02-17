const Trello = require('trello');

const { app } = require('../config');

const membersCache = {};

const membersFromCard = async (trello, card, i = 0, members = []) => {
  if (!card.idMembers || !card.idMembers[i]) {
    return members;
  }

  membersCache[card.idMembers[i]] = membersCache[card.idMembers[i]]
    || await trello.getMember(card.idMembers[i]);

  const trelloMember = membersCache[card.idMembers[i]];

  const newMembers = members.concat({
    id: trelloMember.id,
    fullName: trelloMember.fullName,
    avatarUrl: trelloMember.avatarUrl,
    url: trelloMember.url,
  });

  return card.idMembers[i + 1]
    ? membersFromCard(trello, card, i + 1, newMembers)
    : newMembers;
};

const fetchCards = async (trello, trelloCards, i = 0, cards = []) => {
  if (!trelloCards[i]) {
    return cards;
  }

  const trelloCard = trelloCards[i];

  let color = null;
  let done = false;

  const name = trelloCard.name
    .replace(/\[(#.*?)\]/g, (string, colorFound) => {
      color = colorFound;

      return '';
    })
    .replace(/\[(ok|done|x)\]/gi, () => {
      done = true;

      return '';
    })
    .trim();

  const members = await membersFromCard(trello, trelloCard);

  const newCards = cards.concat({
    id: trelloCard.id,
    name,
    color,
    done,
    members,
  });

  return trelloCards[i + 1]
    ? fetchCards(trello, trelloCards, i + 1, newCards)
    : newCards;
};

const callback = async (req, res) => {
  const { appId = null } = req.query;

  if (!appId) {
    res.json({ error: 'The "appId" parameter is missing' });

    return;
  }

  const appConfig = app(appId);

  if (!appConfig) {
    res.json({ error: `The app ${appId} doesn't exist` });

    return;
  }

  const { key, token } = appConfig.secrets;
  const { board, list } = appConfig.config;

  const trello = new Trello(key, token);

  const trelloLists = await trello.getListsOnBoard(board);
  let listId = null;

  if (typeof trelloLists === 'string') {
    res.json({ error: trelloLists });

    return;
  }

  trelloLists.some((trelloList) => {
    if (trelloList.name === list) {
      listId = trelloList.id;

      return true;
    }

    return false;
  });

  if (!listId) {
    res.json({ error: `List "${list}" not found` });

    return;
  }

  const trelloCards = await trello.getCardsOnList(listId);

  const cards = await fetchCards(trello, trelloCards);

  res.json({ cards });
};

const routes = [{ path: 'trello', method: 'GET', callback }];

module.exports = routes;
