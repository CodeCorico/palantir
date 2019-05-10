const Trello = require('trello');

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

  if (card.idMembers[i + 1]) {
    return await membersFromCard(trello, card, i + 1, newMembers);
  }

  return newMembers;
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

  if (trelloCards[i + 1]) {
    return await fetchCards(trello, trelloCards, i + 1, newCards);
  }

  return newCards;
};

const callback = async (req, res) => {
  const { key = null, token = null, board = null, list = null } = req.query;

  if (!key || !token) {
    res.json({ error: 'The "key" and "token" parameters are missing' });

    return;
  }

  if (!board) {
    res.json({ error: 'The "board" id parameter is missing' });

    return;
  }

  if (!list) {
    res.json({ error: 'The "list" name parameter is missing' });

    return;
  }

  const trello = new Trello(key, token);

  const trelloLists = await trello.getListsOnBoard(board);
  let listId = null;

  trelloLists.some((trelloList) => {
    if (trelloList.name === list) {
      listId = trelloList.id

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
