function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderMarkdown(text) {
  if (!text) return '';
  let html = escapeHtml(text);

  // Headers
  html = html.replace(/^#{6} (.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#{5} (.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#{4} (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^#{3} (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#{2} (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Line breaks
  html = html.replace(/\n/g, '<br>');

  return html;
}

function showAlert(container, message, type = 'error') {
  const el = document.createElement('div');
  el.className = `alert alert-${type}`;
  el.textContent = message;
  container.innerHTML = '';
  container.appendChild(el);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

function toggleMobileSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
}

function getChapterProgress(chapterId) {
  try {
    const progress = JSON.parse(localStorage.getItem('chapterProgress') || '{}');
    return progress[chapterId] || 0;
  } catch {
    return 0;
  }
}

function setChapterProgress(chapterId, percent) {
  const progress = JSON.parse(localStorage.getItem('chapterProgress') || '{}');
  progress[chapterId] = Math.max(progress[chapterId] || 0, percent);
  localStorage.setItem('chapterProgress', JSON.stringify(progress));
}

function updateUserInStorage(updates) {
  const user = getUser();
  if (user) {
    Object.assign(user, updates);
    localStorage.setItem('user', JSON.stringify(user));
  }
}

