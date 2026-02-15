// Экраны
const welcomeScreen = document.getElementById('welcome-screen');
const mainMenuScreen = document.getElementById('main-menu-screen');
const scheduleScreen = document.getElementById('schedule-screen');
const songsScreen = document.getElementById('songs-screen');
const settingsScreen = document.getElementById('settings-screen');

// Элементы
const nameInput = document.getElementById('name-input');
const enterBtn = document.getElementById('enter-btn');
const greetingEl = document.getElementById('greeting');
const calendarMonthEl = document.getElementById('calendar-month');
const calendarPrev = document.getElementById('calendar-prev');
const calendarNext = document.getElementById('calendar-next');
const expandAllBtn = document.getElementById('expand-all-btn');
const collapseAllBtn = document.getElementById('collapse-all-btn');
const scheduleList = document.getElementById('schedule-list');
const foldersList = document.getElementById('folders-list');
const songsList = document.getElementById('songs-list');
const addFolderBtn = document.getElementById('add-folder-btn');
const addSongBtn = document.getElementById('add-song-btn');
const folderScreen = document.getElementById('folder-screen');
const folderTitleEl = document.getElementById('folder-title');
const songModal = document.getElementById('song-modal');
const songTitleInput = document.getElementById('song-title-input');
const songLyricsInput = document.getElementById('song-lyrics-input');
const songModalCancel = document.getElementById('song-modal-cancel');
const songModalSave = document.getElementById('song-modal-save');
const songSearchInput = document.getElementById('song-search-input');
const songViewModal = document.getElementById('song-view-modal');
const songViewTitle = document.getElementById('song-view-title');
const songViewBody = document.getElementById('song-view-body');
const songViewClose = document.getElementById('song-view-close');
const songZoomIn = document.getElementById('song-zoom-in');
const songZoomOut = document.getElementById('song-zoom-out');
const songZoomValue = document.getElementById('song-zoom-value');
const songCopyBtn = document.getElementById('song-copy-btn');
const songEditBtn = document.getElementById('song-edit-btn');
const transposeDown = document.getElementById('transpose-down');
const transposeUp = document.getElementById('transpose-up');
const transposeValueEl = document.getElementById('transpose-value');
const chordPosBtn = document.getElementById('chord-pos-btn');
const folderModal = document.getElementById('folder-modal');
const folderNameInput = document.getElementById('folder-name-input');
const folderCreatedBy = document.getElementById('folder-created-by');
const folderModalCancel = document.getElementById('folder-modal-cancel');
const folderModalSave = document.getElementById('folder-modal-save');
const folderDeleteModal = document.getElementById('folder-delete-modal');
const folderDeleteCancel = document.getElementById('folder-delete-cancel');
const folderDeleteConfirm = document.getElementById('folder-delete-confirm');
const clearDataBtn = document.getElementById('clear-data-btn');
const logoutBtn = document.getElementById('logout-btn');
const scheduleSongsModal = document.getElementById('schedule-songs-modal');
const scheduleSongsTitle = document.getElementById('schedule-songs-title');
const scheduleSongsSearch = document.getElementById('schedule-songs-search');
const scheduleSongsList = document.getElementById('schedule-songs-list');
const scheduleSongsCancel = document.getElementById('schedule-songs-cancel');
const scheduleSongsSave = document.getElementById('schedule-songs-save');

// Состояние
let currentUserName = '';
let currentCalendarDate = new Date();
let currentFolderIndex = -1;
let expandedScheduleDays = (() => {
  try {
    const d = localStorage.getItem(SCHEDULE_EXPANDED_KEY);
    return d ? new Set(JSON.parse(d)) : new Set();
  } catch {
    return new Set();
  }
})();

function saveExpandedSchedule() {
  try {
    localStorage.setItem(SCHEDULE_EXPANDED_KEY, JSON.stringify([...expandedScheduleDays]));
  } catch {}
}

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const ROLES = [
  { id: 'ведёт', label: 'Ведёт', slots: 1 },
  { id: 'клавишник', label: 'Клавишник', slots: 1 },
  { id: 'барабанщик', label: 'Барабанщик', slots: 1 },
  { id: 'гитарист', label: 'Гитарист', slots: 1 },
  { id: 'бэк-вокал', label: 'Бэк-вокалист', slots: 3 }
];

const STORAGE_KEY = 'sluzhenie-schedule';
const SONGS_KEY = 'sluzhenie-songs';
const FOLDERS_KEY = 'sluzhenie-folders-shared';
const USER_KEY = 'sluzhenie-user';
const SCHEDULE_EXPANDED_KEY = 'sluzhenie-schedule-expanded';
const CHORD_POS_KEY = 'sluzhenie-chord-pos';
const SCHEDULE_SONGS_KEY = 'sluzhenie-schedule-songs';

function getSchedule() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function setSlot(dateKey, roleId, name) {
  const s = getSchedule();
  s[`${dateKey}-${roleId}`] = name || '';
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function getSlot(dateKey, roleId) {
  return getSchedule()[`${dateKey}-${roleId}`] || '';
}

function getScheduleSongs(dateKey) {
  try {
    const data = localStorage.getItem(SCHEDULE_SONGS_KEY);
    const obj = data ? JSON.parse(data) : {};
    return Array.isArray(obj[dateKey]) ? obj[dateKey] : [];
  } catch {
    return [];
  }
}

function setScheduleSongs(dateKey, titles) {
  try {
    const data = localStorage.getItem(SCHEDULE_SONGS_KEY);
    const obj = data ? JSON.parse(data) : {};
    obj[dateKey] = Array.isArray(titles) ? titles : [];
    localStorage.setItem(SCHEDULE_SONGS_KEY, JSON.stringify(obj));
  } catch {}
}

function getAllSongs() {
  const folders = getFolders();
  const list = [];
  folders.forEach(f => {
    (f.songs || []).forEach(s => list.push({ title: s.title || 'Без названия' }));
  });
  return list;
}

function getFolders() {
  try {
    const data = localStorage.getItem(FOLDERS_KEY);
    let folders = data ? JSON.parse(data) : [];
    if (!Array.isArray(folders)) folders = [];
    return folders;
  } catch {
    return [];
  }
}

function setFolders(folders) {
  try {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  } catch {}
}

function getCurrentFolder() {
  const folders = getFolders();
  return currentFolderIndex >= 0 && currentFolderIndex < folders.length ? folders[currentFolderIndex] : null;
}

function getSongs() {
  const folder = getCurrentFolder();
  return folder ? (folder.songs || []) : [];
}

function setSongsInFolder(songs) {
  const folders = getFolders();
  if (currentFolderIndex >= 0 && currentFolderIndex < folders.length) {
    folders[currentFolderIndex].songs = songs;
    setFolders(folders);
  }
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateLabel(d) {
  const day = d.getDay();
  const name = day === 0 ? 'Воскресенье' : 'Вторник';
  return `${name}, ${d.getDate()} ${MONTHS_GEN[d.getMonth()]}`;
}

function isTodayOrFuture(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d >= today;
}

function showScreen(screenEl) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  if (screenEl) screenEl.classList.add('active');
}

function renderSchedule() {
  if (!scheduleList || !calendarMonthEl) return;
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarMonthEl.textContent = `${MONTHS[month]} ${year}`;

  const serviceDays = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if ((date.getDay() === 0 || date.getDay() === 2) && isTodayOrFuture(date)) {
      serviceDays.push(date);
    }
  }

  const visibleKeys = new Set(serviceDays.map(d => dateKey(d)));
  expandedScheduleDays.forEach(k => { if (!visibleKeys.has(k)) expandedScheduleDays.delete(k); });

  let html = '';
  for (let i = 0; i < serviceDays.length; i++) {
    const date = serviceDays[i];
    const key = dateKey(date);
    const label = formatDateLabel(date);
    const isExpanded = expandedScheduleDays.has(key);

    html += `<div class="schedule-day-card ${isExpanded ? 'expanded' : ''}" data-day-key="${key}">
      <button type="button" class="schedule-day-header schedule-day-toggle">
        <span class="schedule-day-label">${label}</span>
        <svg class="schedule-day-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="schedule-day-body">
        <div class="schedule-day-body-inner">
          <div class="schedule-slots">`;

    for (const role of ROLES) {
      const slots = role.slots || 1;
      for (let s = 0; s < slots; s++) {
        const roleId = slots > 1 ? `${role.id}-${s + 1}` : role.id;
        const slotLabel = slots > 1 ? `${role.label} ${s + 1}` : role.label;
        const value = getSlot(key, roleId);
        const display = value || 'пусто';
        const isEmpty = !value;
        const isMine = !!(value && currentUserName && value.trim().toLowerCase() === currentUserName.trim().toLowerCase());
        const slotClass = isEmpty ? 'slot-empty' : (isMine ? 'slot-mine' : 'slot-filled');
        html += `<div class="schedule-slot ${slotClass}" data-date="${key}" data-role="${roleId}" data-empty="${isEmpty}" data-mine="${isMine}">
          <span class="slot-role">${slotLabel}:</span>
          <span class="slot-value">${display}</span>
          ${isMine ? '<span class="slot-cancel-hint"><svg class="cancel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> отменить</span>' : ''}
        </div>`;
      }
    }
    const selectedSongs = getScheduleSongs(key);
    const songsCount = selectedSongs.length;
    html += `<div class="schedule-day-actions">
      <button type="button" class="schedule-day-btn btn-songs" data-date="${key}" title="Выбрать песни">Песни${songsCount ? ` (${songsCount})` : ''}</button>
      <button type="button" class="schedule-day-btn btn-approve" data-date="${key}" title="Отправить состав в бот">Утвердить состав</button>
    </div>`;
    html += `</div></div></div>`;
  }

  if (serviceDays.length === 0) {
    html = '<p class="empty-message">Нет предстоящих дней служения в этом месяце</p>';
  }

  scheduleList.innerHTML = html;

  scheduleList.querySelectorAll('.schedule-slot[data-empty="true"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentUserName) return;
      const dk = el.dataset.date;
      const roleId = el.dataset.role;
      if (dk) { expandedScheduleDays.add(dk); saveExpandedSchedule(); }
      setSlot(dk, roleId, currentUserName);
      renderSchedule();
    });
  });

  scheduleList.querySelectorAll('.schedule-day-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.schedule-day-card');
      const key = card?.dataset.dayKey;
      if (key) {
        if (expandedScheduleDays.has(key)) {
          expandedScheduleDays.delete(key);
        } else {
          expandedScheduleDays.add(key);
        }
        saveExpandedSchedule();
      }
      card?.classList.toggle('expanded');
    });
  });

  scheduleList.querySelectorAll('.schedule-slot[data-mine="true"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!confirm('Убрать себя из этого слота?')) return;
      const dk = el.dataset.date;
      const roleId = el.dataset.role;
      if (dk) { expandedScheduleDays.add(dk); saveExpandedSchedule(); }
      setSlot(dk, roleId, '');
      renderSchedule();
    });
  });

  scheduleList.querySelectorAll('.btn-songs').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dk = btn.dataset.date;
      if (dk) openScheduleSongsModal(dk);
    });
  });

  scheduleList.querySelectorAll('.btn-approve').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dk = btn.dataset.date;
      if (dk) sendScheduleToBot(dk);
    });
  });
}

function openScheduleSongsModal(dateKey) {
  if (!scheduleSongsModal || !scheduleSongsList) return;
  scheduleSongsModal.dataset.dateKey = dateKey;
  const [y, m, d] = dateKey.split('-');
  const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
  const dayName = date.getDay() === 0 ? 'Воскресенье' : 'Вторник';
  scheduleSongsTitle.textContent = `Песни — ${dayName}, ${d} ${MONTHS_GEN[parseInt(m, 10) - 1]} ${y}`;
  if (scheduleSongsSearch) scheduleSongsSearch.value = '';
  const allSongs = getAllSongs().slice().sort((a, b) => (a.title || '').localeCompare(b.title || '', 'ru'));
  const selected = new Set(getScheduleSongs(dateKey));
  scheduleSongsList.innerHTML = allSongs.length === 0
    ? '<p class="empty-message">Нет песен. Добавь песни в папках.</p>'
    : allSongs.map(s => {
        const checked = selected.has(s.title);
        return `<label class="schedule-song-item" data-title="${escapeHtml(s.title)}"><input type="checkbox" value="${escapeHtml(s.title)}" ${checked ? 'checked' : ''}> ${escapeHtml(s.title)}</label>`;
      }).join('');
  scheduleSongsModal.classList.add('active');
  filterScheduleSongsList();
}

function filterScheduleSongsList() {
  if (!scheduleSongsList || !scheduleSongsSearch) return;
  const q = scheduleSongsSearch.value.trim().toLowerCase();
  const items = scheduleSongsList.querySelectorAll('.schedule-song-item');
  items.forEach(label => {
    const title = (label.dataset.title || label.textContent || '').toLowerCase();
    label.style.display = !q || title.includes(q) ? '' : 'none';
  });
}

if (scheduleSongsSearch) scheduleSongsSearch.addEventListener('input', filterScheduleSongsList);

function closeScheduleSongsModal() {
  if (scheduleSongsModal) scheduleSongsModal.classList.remove('active');
}

if (scheduleSongsCancel) scheduleSongsCancel.addEventListener('click', closeScheduleSongsModal);
if (scheduleSongsSave) scheduleSongsSave.addEventListener('click', () => {
  const dk = scheduleSongsModal?.dataset.dateKey;
  if (!dk) return;
  const checked = scheduleSongsList?.querySelectorAll('input[type="checkbox"]:checked');
  const titles = checked ? [...checked].map(cb => cb.value) : [];
  setScheduleSongs(dk, titles);
  closeScheduleSongsModal();
  renderSchedule();
});

function buildScheduleText(dateKey) {
  const s = getSchedule();
  const parts = [];
  const [y, m, d] = dateKey.split('-');
  const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
  const dayName = date.getDay() === 0 ? 'Воскресенье' : 'Вторник';
  parts.push(`${dayName}, ${d} ${MONTHS_GEN[parseInt(m, 10) - 1]} ${y}`);
  parts.push('');
  for (const role of ROLES) {
    const slots = role.slots || 1;
    for (let i = 0; i < slots; i++) {
      const roleId = slots > 1 ? `${role.id}-${i + 1}` : role.id;
      const label = slots > 1 ? `${role.label} ${i + 1}` : role.label;
      const val = s[`${dateKey}-${roleId}`] || '';
      parts.push(`${label}: ${val || '—'}`);
    }
  }
  const songs = getScheduleSongs(dateKey);
  if (songs.length > 0) {
    parts.push('');
    parts.push('Песни:');
    songs.forEach(t => parts.push('• ' + t));
  }
  return parts.join('\n');
}

function sendScheduleToBot(dateKey) {
  const text = buildScheduleText(dateKey);
  if (navigator.share) {
    navigator.share({
      title: 'Состав служения',
      text: text
    }).catch(() => {
      copyAndNotify(text);
    });
  } else {
    copyAndNotify(text);
  }
}

function copyAndNotify(text) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Состав скопирован. Вставь в Telegram или другое приложение.');
    }).catch(() => alert('Не удалось скопировать'));
  } else {
    alert('Состав:\n\n' + text);
  }
}

function renderFolders() {
  if (!foldersList) return;
  const folders = getFolders();
  foldersList.innerHTML = folders.length === 0
    ? '<p class="empty-message">Папок пока нет. Создай первую!</p>'
    : folders.map((f, i) => `
      <div class="folder-item" data-idx="${i}">
        <span class="folder-name">${escapeHtml(f.name || 'Без названия')}</span>
        <span class="folder-meta">${(f.songs || []).length} песен${f.createdBy ? ' · ' + escapeHtml(f.createdBy) : ''}</span>
        <button type="button" class="folder-delete" data-idx="${i}" aria-label="Удалить папку"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    `).join('');

  foldersList.querySelectorAll('.folder-item').forEach(el => {
    const idx = parseInt(el.dataset.idx, 10);
    el.addEventListener('click', (e) => {
      if (e.target.closest('.folder-delete')) return;
      openFolder(idx);
    });
  });

  foldersList.querySelectorAll('.folder-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      folderDeleteModal.dataset.deleteIdx = String(idx);
      folderDeleteModal.classList.add('active');
    });
  });
}

function confirmFolderDelete() {
  const idx = parseInt(folderDeleteModal.dataset.deleteIdx, 10);
  if (isNaN(idx)) return;
  const folders = getFolders();
  folders.splice(idx, 1);
  setFolders(folders);
  folderDeleteModal.classList.remove('active');
  delete folderDeleteModal.dataset.deleteIdx;
  renderFolders();
}

function openFolder(idx) {
  currentFolderIndex = idx;
  const folders = getFolders();
  const folder = folders[idx];
  if (folderTitleEl) folderTitleEl.textContent = folder?.name || 'Папка';
  if (songSearchInput) songSearchInput.value = '';
  showScreen(folderScreen);
  renderSongs();
}

function renderSongs() {
  if (!songsList) return;
  const songs = getSongs();
  const query = (songSearchInput?.value || '').trim().toLowerCase();
  const filtered = query
    ? songs.filter(s => (s.title || '').toLowerCase().includes(query) || (s.lyrics || '').toLowerCase().includes(query))
    : songs;
  songsList.innerHTML = filtered.length === 0
    ? '<p class="empty-message">' + (query ? 'Ничего не найдено' : 'В папке пока нет песен. Добавь первую!') + '</p>'
    : filtered.map((s, i) => {
      const origIdx = songs.indexOf(s);
      return `
      <div class="song-item" data-idx="${origIdx}">
        <div class="song-header">
          <span class="song-title">${escapeHtml(s.title || 'Без названия')}</span>
          <button type="button" class="song-delete" data-idx="${origIdx}" aria-label="Удалить"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <pre class="song-lyrics">${escapeHtml((s.lyrics || '').slice(0, 150))}${(s.lyrics || '').length > 150 ? '...' : ''}</pre>
      </div>
    `;
    }).join('');

  songsList.querySelectorAll('.song-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      const songs = getSongs();
      songs.splice(idx, 1);
      setSongsInFolder(songs);
      renderSongs();
    });
  });

  if (songSearchInput) {
    songSearchInput.oninput = () => renderSongs();
  }

  songsList.querySelectorAll('.song-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.song-delete')) return;
      const idx = parseInt(el.dataset.idx, 10);
      const songs = getSongs();
      const song = songs[idx];
      if (song) showSongDetail(song, idx);
    });
  });
}

const CHORD_REGEX = /^[A-Ga-gHh][#b]?(m|maj|min|dim|sus|add|aug|M)?[0-9/]*(\s+[A-Ga-gHh][#b]?(m|maj|min|dim|sus|add|aug|M)?[0-9/]*)*$/;

const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const CHROMATIC_FLAT = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

function noteToIndex(n) {
  if (!n || !n.length) return -1;
  const s = (n[0].toUpperCase() === 'H' ? 'B' + (n.slice(1) || '') : n);
  let i = CHROMATIC.indexOf(s);
  if (i < 0) i = CHROMATIC_FLAT.indexOf(s);
  return i;
}

function indexToNote(i) {
  return CHROMATIC[(i + 12) % 12];
}

function parseNoteToIndex(noteStr) {
  const m = (noteStr || '').match(/^([A-Ga-gHh])([#b]*)$/);
  if (!m) return -1;
  let i = noteToIndex(m[1]);
  if (i < 0) return -1;
  const accs = m[2] || '';
  for (const c of accs) {
    i = c === '#' ? (i + 1) % 12 : (i - 1 + 12) % 12;
  }
  return i;
}

const CHORD_END = '(?=[\\s\\/]|$)';
function normalizeChordEnharmonics(str) {
  return str.replace(new RegExp('\\b([A-Ga-gHh])(#+|b+)?([mM]aj|[mM]in|dim|sus|add|aug|m|M)?(\\d*)(?:\\/([A-Ga-gHh])(#+|b+)?)?' + CHORD_END, 'g'),
    (m, root, acc, qual, num, bassRoot, bassAcc) => {
      const fullRoot = root + (acc || '');
      let idx = parseNoteToIndex(fullRoot);
      if (idx < 0) return m;
      let out = indexToNote(idx) + (qual || '') + (num || '');
      if (bassRoot) {
        const fullBass = bassRoot + (bassAcc || '');
        const bi = parseNoteToIndex(fullBass);
        if (bi >= 0) out += '/' + indexToNote(bi);
      }
      return out;
    });
}

function toAsciiAccidentals(str) {
  return (str || '').replace(/♯|\u266F/g, '#').replace(/♭|\u266D/g, 'b').replace(/♮|\u266E/g, '');
}

function transposeChord(str, semitones) {
  if (!semitones) return str;
  const s = normalizeChordEnharmonics(toAsciiAccidentals(str));
  return s.replace(new RegExp('\\b([A-Ga-gHh])(#|b)?([mM]aj|[mM]in|dim|sus|add|aug|m|M)?(\\d*)(?:\\/([A-Ga-gHh])(#|b)?)?' + CHORD_END, 'g'), (m, root, acc, qual, num, bassRoot, bassAcc) => {
    let idx = noteToIndex(root + (acc || ''));
    if (idx < 0) return m;
    idx = (idx + semitones + 12) % 12;
    let out = indexToNote(idx) + (qual || '') + (num || '');
    if (bassRoot) {
      let bi = noteToIndex(bassRoot + (bassAcc || ''));
      if (bi >= 0) {
        bi = (bi + semitones + 12) % 12;
        out += '/' + indexToNote(bi);
      }
    }
    return out;
  });
}

function isChordLine(line) {
  const t = line.trim();
  if (!t || t.length > 120) return false;
  return CHORD_REGEX.test(t) || /^[\sA-Ga-gHh#b0-9\/mM]+$/.test(t) && t.length < 80;
}

let songTranspose = 0;

function formatLyricsWithChords(text, transpose = 0) {
  if (!text) return '';
  const lines = text.split(/\r?\n/);
  const items = [];
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trimEnd();
    if (!trimmed) {
      items.push({ type: 'break' });
      continue;
    }
    if (isChordLine(trimmed)) {
      const ascii = toAsciiAccidentals(trimmed);
      const normalized = normalizeChordEnharmonics(ascii);
      const transposed = transpose ? transposeChord(normalized, transpose) : normalized;
      const out = normalizeChordEnharmonics(transposed);
      const chordHtml = '<div class="song-line chord-line">' + escapeHtml(out) + '</div>';
      const nextTrimmed = i + 1 < lines.length ? lines[i + 1].trimEnd() : '';
      const nextIsLyric = nextTrimmed && !isChordLine(nextTrimmed);
      if (nextIsLyric) {
        const lyricHtml = '<div class="song-line lyric-line">' + escapeHtml(nextTrimmed) + '</div>';
        items.push({ type: 'pair', chord: chordHtml, lyric: lyricHtml });
        i++;
      } else {
        items.push({ type: 'pair', chord: chordHtml, lyric: '' });
      }
    } else {
      items.push({ type: 'pair', chord: '', lyric: '<div class="song-line lyric-line">' + escapeHtml(trimmed) + '</div>' });
    }
  }
  return items.map(it => {
    if (it.type === 'break') return '<div class="song-line song-line-break"></div>';
    const parts = [it.chord, it.lyric].filter(Boolean);
    return '<div class="chord-lyric-block">' + parts.join('') + '</div>';
  }).join('');
}

let songViewZoom = 100;
let chordPos = localStorage.getItem(CHORD_POS_KEY) || 'above';

function applyChordPos() {
  if (!songViewBody) return;
  songViewBody.classList.toggle('chords-above', chordPos === 'above');
  songViewBody.classList.toggle('chords-below', chordPos === 'below');
  if (chordPosBtn) {
    chordPosBtn.textContent = chordPos === 'above' ? 'Аккорды сверху' : 'Аккорды снизу';
    chordPosBtn.dataset.pos = chordPos;
  }
}

function setSongViewZoom(val) {
  songViewZoom = Math.max(80, Math.min(150, val));
  if (songViewBody) songViewBody.style.fontSize = songViewZoom + '%';
  if (songZoomValue) songZoomValue.textContent = songViewZoom + '%';
}

let currentViewedSong = null;
let currentViewedSongIdx = -1;

function showSongDetail(song, idx) {
  if (!songViewModal || !songViewTitle || !songViewBody) return;
  currentViewedSong = song;
  currentViewedSongIdx = idx;
  songTranspose = 0;
  if (transposeValueEl) transposeValueEl.textContent = '0';
  songViewTitle.textContent = song.title || 'Без названия';
  songViewBody.innerHTML = formatLyricsWithChords(song.lyrics || '', songTranspose);
  songViewBody.style.fontSize = songViewZoom + '%';
  songViewBody.classList.remove('columns-2', 'columns-3');
  songViewBody.classList.add('columns-1');
  document.querySelectorAll('.col-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cols === '1');
  });
  if (songZoomValue) songZoomValue.textContent = songViewZoom + '%';
  applyChordPos();
  songViewModal.classList.add('active');
}

if (chordPosBtn) chordPosBtn.addEventListener('click', () => {
  chordPos = chordPos === 'above' ? 'below' : 'above';
  localStorage.setItem(CHORD_POS_KEY, chordPos);
  applyChordPos();
});

if (songViewClose) songViewClose.addEventListener('click', () => songViewModal.classList.remove('active'));
if (songZoomIn) songZoomIn.addEventListener('click', () => setSongViewZoom(songViewZoom + 10));
if (songZoomOut) songZoomOut.addEventListener('click', () => setSongViewZoom(songViewZoom - 10));

document.querySelectorAll('.col-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.col-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cols = btn.dataset.cols || '1';
    if (songViewBody) {
      songViewBody.classList.remove('columns-1', 'columns-2', 'columns-3');
      songViewBody.classList.add('columns-' + cols);
    }
  });
});

if (songEditBtn) songEditBtn.addEventListener('click', () => {
  if (!currentViewedSong || currentViewedSongIdx < 0) return;
  songViewModal.classList.remove('active');
  songTitleInput.value = currentViewedSong.title || '';
  songLyricsInput.value = currentViewedSong.lyrics || '';
  songModal.dataset.editIdx = String(currentViewedSongIdx);
  songModal.querySelector('.modal-title').textContent = 'Редактировать песню';
  songModal.classList.add('active');
});

function updateSongViewWithTranspose() {
  if (!currentViewedSong || !songViewBody) return;
  songViewBody.innerHTML = formatLyricsWithChords(currentViewedSong.lyrics || '', songTranspose);
  if (transposeValueEl) transposeValueEl.textContent = songTranspose > 0 ? '+' + songTranspose : String(songTranspose);
}

if (transposeDown) transposeDown.addEventListener('click', () => {
  songTranspose = Math.max(-10, songTranspose - 2);
  updateSongViewWithTranspose();
});

if (transposeUp) transposeUp.addEventListener('click', () => {
  songTranspose = Math.min(10, songTranspose + 2);
  updateSongViewWithTranspose();
});

if (songCopyBtn) songCopyBtn.addEventListener('click', () => {
  if (!currentViewedSong) return;
  const raw = toAsciiAccidentals(currentViewedSong.lyrics || '');
  const normalized = normalizeChordEnharmonics(raw);
  const lyrics = songTranspose ? transposeChord(normalized, songTranspose) : normalized;
  const text = (currentViewedSong.title || '') + '\n\n' + lyrics;
  navigator.clipboard?.writeText(text).then(() => {
    songCopyBtn.textContent = 'Скопировано!';
    setTimeout(() => { songCopyBtn.textContent = 'Копировать'; }, 1500);
  });
});
songViewModal?.addEventListener('click', (e) => {
  if (e.target === songViewModal) songViewModal.classList.remove('active');
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showMenu(name) {
  currentUserName = name.trim();
  localStorage.setItem(USER_KEY, currentUserName);
  welcomeScreen.classList.remove('active');
  mainMenuScreen.classList.add('active');
  greetingEl.textContent = `${currentUserName}, привет!`;
  currentCalendarDate = new Date();
}

function logout() {
  currentUserName = '';
  localStorage.removeItem(USER_KEY);
  nameInput.value = '';
  nameInput.placeholder = 'Введи своё имя';
  showScreen(welcomeScreen);
}

// Ввод имени
enterBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name) {
    showMenu(name);
  } else {
    nameInput.focus();
    nameInput.placeholder = 'Введи имя, пожалуйста';
  }
});

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') enterBtn.click();
});

// При загрузке — если имя сохранено, сразу в меню
function init() {
  const savedName = localStorage.getItem(USER_KEY);
  if (savedName && savedName.trim()) {
    currentUserName = savedName.trim();
    greetingEl.textContent = `${currentUserName}, привет!`;
    showScreen(mainMenuScreen);
  } else {
    showScreen(welcomeScreen);
  }
}

init();

// Навигация
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const screenId = btn.dataset.screen + '-screen';
    const screen = document.getElementById(screenId);
    if (screen) {
      showScreen(screen);
      if (screenId === 'schedule-screen') {
        currentCalendarDate = new Date();
        renderSchedule();
      } else       if (screenId === 'songs-screen') {
        renderFolders();
      }
    }
  });
});

document.querySelectorAll('.back-btn[data-back]').forEach(btn => {
  btn.addEventListener('click', () => {
    showScreen(mainMenuScreen);
  });
});

document.querySelectorAll('.back-btn[data-back-to-folders]').forEach(btn => {
  btn.addEventListener('click', () => {
    currentFolderIndex = -1;
    showScreen(document.getElementById('songs-screen'));
    renderFolders();
  });
});

// Календарь — избегаем бага Date при смене месяца
if (calendarPrev) calendarPrev.addEventListener('click', () => {
  const y = currentCalendarDate.getFullYear();
  const m = currentCalendarDate.getMonth();
  currentCalendarDate = new Date(y, m - 1, 1);
  renderSchedule();
});

if (expandAllBtn) expandAllBtn.addEventListener('click', () => {
  const cards = scheduleList?.querySelectorAll('.schedule-day-card');
  cards?.forEach(c => {
    const k = c.dataset.dayKey;
    if (k) expandedScheduleDays.add(k);
    c.classList.add('expanded');
  });
  saveExpandedSchedule();
});

if (collapseAllBtn) collapseAllBtn.addEventListener('click', () => {
  expandedScheduleDays.clear();
  scheduleList?.querySelectorAll('.schedule-day-card').forEach(c => c.classList.remove('expanded'));
  saveExpandedSchedule();
});

if (calendarNext) calendarNext.addEventListener('click', () => {
  const y = currentCalendarDate.getFullYear();
  const m = currentCalendarDate.getMonth();
  currentCalendarDate = new Date(y, m + 1, 1);
  renderSchedule();
});

// Добавить папку — открыть модал
if (addFolderBtn) addFolderBtn.addEventListener('click', () => {
  folderNameInput.value = '';
  if (folderCreatedBy) folderCreatedBy.textContent = currentUserName ? `Создаёт: ${currentUserName}` : '';
  folderModal.classList.add('active');
  folderNameInput.focus();
});

if (folderModalCancel) folderModalCancel.addEventListener('click', () => {
  folderModal.classList.remove('active');
});

if (folderModalSave) folderModalSave.addEventListener('click', () => {
  const name = folderNameInput.value.trim();
  if (!name) {
    folderNameInput.focus();
    return;
  }
  const folders = getFolders();
  folders.push({ name, createdBy: currentUserName || '', songs: [] });
  setFolders(folders);
  folderModal.classList.remove('active');
  renderFolders();
  openFolder(folders.length - 1);
});

folderModal?.addEventListener('click', (e) => {
  if (e.target === folderModal) folderModal.classList.remove('active');
});

if (folderDeleteCancel) folderDeleteCancel.addEventListener('click', () => {
  folderDeleteModal.classList.remove('active');
  delete folderDeleteModal.dataset.deleteIdx;
});

if (folderDeleteConfirm) folderDeleteConfirm.addEventListener('click', () => {
  confirmFolderDelete();
});

folderDeleteModal?.addEventListener('click', (e) => {
  if (e.target === folderDeleteModal) {
    folderDeleteModal.classList.remove('active');
    delete folderDeleteModal.dataset.deleteIdx;
  }
});

folderNameInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') folderModalSave?.click();
});

// Добавить песню — открыть модал
if (addSongBtn) addSongBtn.addEventListener('click', () => {
  songTitleInput.value = '';
  songLyricsInput.value = '';
  delete songModal.dataset.editIdx;
  songModal.querySelector('.modal-title').textContent = 'Новая песня';
  songModal.classList.add('active');
  songTitleInput.focus();
});

// Модал песни
if (songModalCancel) songModalCancel.addEventListener('click', () => {
  songModal.classList.remove('active');
  delete songModal.dataset.editIdx;
  songModal.querySelector('.modal-title').textContent = 'Новая песня';
});

if (songModalSave) songModalSave.addEventListener('click', () => {
  const title = songTitleInput.value.trim();
  const lyrics = songLyricsInput.value.trim();
  if (!title) {
    songTitleInput.focus();
    return;
  }
  const songs = getSongs();
  const editIdx = songModal.dataset.editIdx;
  if (editIdx !== undefined && editIdx !== '') {
    const idx = parseInt(editIdx, 10);
    if (idx >= 0 && idx < songs.length) {
      songs[idx] = { title, lyrics };
    }
  } else {
    songs.push({ title, lyrics });
  }
  setSongsInFolder(songs);
  songModal.classList.remove('active');
  delete songModal.dataset.editIdx;
  songModal.querySelector('.modal-title').textContent = 'Новая песня';
  renderSongs();
  if (currentViewedSong && editIdx !== undefined) {
    currentViewedSong.title = title;
    currentViewedSong.lyrics = lyrics;
  }
});

songModal?.addEventListener('click', (e) => {
  if (e.target === songModal) songModal.classList.remove('active');
});

// Выйти
if (logoutBtn) logoutBtn.addEventListener('click', () => {
  if (confirm('Выйти? При следующем входе нужно будет ввести имя снова.')) {
    logout();
  }
});

// Очистить данные
if (clearDataBtn) clearDataBtn.addEventListener('click', () => {
  if (confirm('Удалить всё расписание и песни? Это нельзя отменить.')) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SONGS_KEY);
    localStorage.removeItem(FOLDERS_KEY);
    localStorage.removeItem(SCHEDULE_EXPANDED_KEY);
    localStorage.removeItem(SCHEDULE_SONGS_KEY);
    expandedScheduleDays.clear();
    renderSchedule();
    renderFolders();
    alert('Данные очищены.');
  }
});

// PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
