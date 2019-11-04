(function() {
  'use strict';

  const message = (name, data) =>
    window.top.postMessage(Object.assign({ name }, data || {}), 'http://localhost:3000');

  const fetchJSON = url => fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }),
  }).then(response => response.json());

  const requestsTypes = domain => new Promise((resolve, reject) => {
    fetchJSON(`https://${domain}/timeoff/settings/leave_types`)
      .then(data => resolve({ types: data.leave_types }))
      .catch(err => reject(err));
  });

  const leavesToday = (domain, groupId, result) => new Promise((resolve, reject) => {
    fetchJSON(`https://${domain}/timeoff/leave_requests/group_leaves_today?group=${groupId}`)
      .then(data => resolve(Object.assign(result, {
        todayRequests: data.leave_requests || [],
        todayUsers: data.users || [],
      })))
      .catch(err => reject(err));
  });

  const leavesNextDays = (domain, groupId, result) => new Promise((resolve, reject) => {
    fetchJSON(`https://${domain}/timeoff/leave_requests/group_leaves_next_n_days?group=${groupId}`)
      .then(data => resolve(Object.assign(result, {
        nextDaysRequests: data.leave_requests || [],
        nextDaysUsers: data.users || [],
      })))
      .catch(err => reject(err));
  });

  const userInterface = user => ({
    id: user.id,
    name: user.name,
  });

  const requestInterface = (types, users) => (request) => ({
    id: request.id,
    type: types[request.leave_type_id],
    startDate: request.start_date,
    endDate: request.end_date,
    units: request.leave_units,
    user: userInterface(users[request.user_id]),
  });

  const collectRequests = (domain, groupId, result) => new Promise((resolve, reject) => {
    try {
      const types = {};
      const users = {};

      result.types.forEach(type => (types[type.id] = type.name));

      result.todayUsers.forEach(user => (users[user.id] = user));
      result.nextDaysUsers.forEach(user => (users[user.id] = user));

      resolve({
        today: result.todayRequests.map(requestInterface(types, users)),
        nextDays: result.nextDaysRequests.map(requestInterface(types, users)),
      });
    } catch(err) {
      reject(err);
    }
  });

  const actions = {};

  actions.consume = (data) => {
    const { domain, groupId } = data;

    requestsTypes(domain, groupId)
      .then(result => leavesToday(domain, groupId, result))
      .then(result => leavesNextDays(domain, groupId, result))
      .then(result => collectRequests(domain, groupId, result))
      .then(requests => message('requests', { requests }))
      .catch((err) => {
        throw err;
      });
  };

  window.addEventListener('message', (event) => {
    if (event.data.name && event.data.name === 'action') {
      actions[event.data.action](event.data);
    }
  }, false);

  message('ready');
})();
