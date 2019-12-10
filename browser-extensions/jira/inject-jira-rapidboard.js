(function() {
  'use strict';

  const reloadPage = () => {
    // eslint-disable-next-line no-self-assign
    window.location.href = window.location.href;
  };

  const startLoading = (text) => {
    stopLoading();

    const container = document.getElementById('breadcrumbs-container');
    if (!container) {
      return;
    }

    const loading = document.createElement('div');

    loading.id = 'palantir-loading';
    loading.innerHTML = text + '...';
    loading.style.marginLeft = '25px';
    loading.style.color = '#d60505';

    container.appendChild(loading);
  };

  const stopLoading = () => {
    const loading = document.getElementById('palantir-loading');

    if (!loading) {
      return;
    }

    loading.parentNode.removeChild(loading);
  };

  const activeBoardId = () => {
    const match = window.location.search.match(/rapidView=(\d+)/i);

    return match && match[1] || null;
  };

  const boardConfig = (boardId) => {
    const id = boardId || activeBoardId();

    return fetch('/rest/agile/1.0/board/' + id + '/configuration')
      .then(response => response.json());
  };

  const collectIssues = (boardId, issues) => new Promise((resolve) => {
    const id = boardId || activeBoardId();
    const beforeIssues = issues || [];

    if (!id) {
      resolve(beforeIssues);

      return;
    }

    fetch('/rest/agile/1.0/board/' + id + '/issue?startAt=' + beforeIssues.length)
      .then(response => response.json())
      .then((data) => {
        const totalIssues = beforeIssues.concat(data.issues);

        if (totalIssues.length === data.total) {
          resolve(totalIssues);

          return;
        }

        collectIssues(id, totalIssues).then(newIssues => resolve(newIssues));
      });
  });

  const put = (url, body) => fetch(url, {
    method: 'PUT',
    headers: new Headers({ 'content-type': 'application/json' }),
    body: JSON.stringify(body),
  }).then(response => response.status === 204 ? null : response.json());

  const markMoved = () => {
    if (document.getElementById('palantir-loading')) {
      return;
    }

    startLoading('Collecting');

    const dayBefore = new Date();
    dayBefore.setDate(dayBefore.getDate() - (dayBefore.getDay() === 1 ? 3 : 1));
    dayBefore.setHours(10);
    dayBefore.setMinutes(0);
    dayBefore.setSeconds(0);
    const dayBeforeTime = dayBefore.getTime();

    collectIssues().then((issues) => {
      issues.forEach((issue) => {
        const updated = new Date(issue.fields.updated);

        if (dayBeforeTime > updated.getTime()) {
          return;
        }

        const issueEl = document.querySelector('[data-issue-id="' + issue.id + '"]');

        if (!issueEl || issueEl.className.indexOf('ghx-parent-group') > -1) {
          return;
        }

        issueEl.style.transform = 'rotate(-5deg)';
        issueEl.style.transformOrigin = 'center center';
      });

      stopLoading();
    });
  };

  const applySymbols = () => {
    if (document.getElementById('palantir-loading')) {
      return;
    }

    startLoading('Applying symbols');

    const columns = {};
    const progress = {
      total: 0,
      done: 0,
    };

    boardConfig()
      .then((config) => {
        config.columnConfig.columns.forEach((column) => {
          const symbol = column.name.charAt(0);

          if (symbol.charCodeAt(0) < 8400) {
            return;
          }

          column.statuses.forEach((status) => {
            columns[status.id] = symbol;
          });
        });

        return collectIssues();
      })
      .then((issues) => {
        issues.forEach((issue) => {
          const issueEl = document.querySelector('[data-issue-id="' + issue.id + '"]');

          if (!issueEl) {
            return;
          }

          let symbols = issue.fields.customfield_10089 || '';
          const symbol = columns[issue.fields.status.id];

          if (!symbol) {
            return;
          }

          symbols += symbol;

          progress.total++;

          put('/rest/api/2/issue/' + issue.key, { fields: { customfield_10089: symbols }})
            .then(() => {
              progress.done++;

              if (progress.done === progress.total) {
                stopLoading();

                reloadPage();
              }
            });
        });
      });
  };

  document.addEventListener('keyup', (event) => {
    if (event.key === 'm' && event.ctrlKey && event.altKey) {
      markMoved();

      event.stopPropagation();
    }
    else if (event.key === 'k' && event.ctrlKey && event.altKey) {
      applySymbols();

      event.stopPropagation();
    }
  }, false);
})();
