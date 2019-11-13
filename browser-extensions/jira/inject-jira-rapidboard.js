(function() {
  'use strict';

  const startLoading = () => {
    const container = document.getElementById('breadcrumbs-container');
    if (!container) {
      return;
    }

    const loading = document.createElement('div');

    loading.id = 'palantir-loading';
    loading.innerHTML = 'Collecting...';
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

  const collectIssues = (boardId, issues, callback) => {
    fetch('/rest/agile/1.0/board/' + boardId + '/issue?startAt=' + issues.length)
      .then(response => response.json())
      .then((data) => {
        const totalIssues = issues.concat(data.issues);

        if (totalIssues.length === data.total) {
          callback(totalIssues);

          return;
        }

        collectIssues(boardId, totalIssues, callback);
      });
  };

  const markMoved = () => {
    startLoading();

    const boardIdMatch = window.location.search.match(/rapidView=(\d+)/i);

    if (!boardIdMatch) {
      return;
    }

    const dayBefore = new Date();
    dayBefore.setDate(dayBefore.getDate() - (dayBefore.getDay() === 1 ? 3 : 1));
    dayBefore.setHours(10);
    dayBefore.setMinutes(0);
    dayBefore.setSeconds(0);
    const dayBeforeTime = dayBefore.getTime();

    collectIssues(boardIdMatch[1], [], (issues) => {
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

  document.addEventListener('keyup', (event) => {
    if (event.key === 'm' && event.ctrlKey && event.altKey) {
      markMoved();
    }
  }, false);
})();
