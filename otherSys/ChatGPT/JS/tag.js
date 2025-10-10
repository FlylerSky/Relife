// JS/tag.js (aggregator for tag page)
import { initFirebase } from '../firebase-config.js';
import { collection, query, orderBy, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { initConnectionStatus } from './SJS/TAG/updateConn.js';
import { computeTrendingHashtagsRealtime } from './SJS/TAG/computeTrendingHashtagsRealtime.js';
import { loadPostsForTag } from './SJS/TAG/loadPostsForTag.js';

const db = initFirebase();

// DOM refs
const activeTagTitle = document.getElementById('activeTagTitle');
const postsList = document.getElementById('postsList');
const hashtagLeaderboard = document.getElementById('hashtagLeaderboard');
const statusConn = document.getElementById('statusConn');
const activeTagCountEl = document.getElementById('activeTagCount');

// small utilities (kept here so SJS functions remain pure and accept them as params)
const esc = s => String(s || '').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fmtDate = ts => { try { return ts?.toDate ? ts.toDate().toLocaleString('vi-VN') : ''; } catch { return ''; } };

// init connection status UI
initConnectionStatus(statusConn);

// parse URL tag
let selectedTag = new URLSearchParams(location.search).get('tag');
if(selectedTag) selectedTag = decodeURIComponent(selectedTag);

let viewMode = 'trending';
const sortTrendingBtn = document.getElementById('sortTrending');
const sortNewestBtn = document.getElementById('sortNewest');
if(sortTrendingBtn) sortTrendingBtn.addEventListener('click', ()=> { viewMode='trending'; loadPostsForTag({ selectedTag, viewMode, db, postsList, activeTagCountEl, esc, fmtDate }); });
if(sortNewestBtn) sortNewestBtn.addEventListener('click', ()=> { viewMode='newest'; loadPostsForTag({ selectedTag, viewMode, db, postsList, activeTagCountEl, esc, fmtDate }); });

// set title / placeholder
if(!selectedTag){
  activeTagTitle.textContent='Khám phá Topics';
  if(activeTagCountEl) activeTagCountEl.textContent='Chọn hashtag để bắt đầu.';
} else {
  activeTagTitle.textContent = selectedTag.replace(/^#/, '');
}

// realtime feed: compute trending from all posts
const postsRef = collection(db,'posts');
onSnapshot(query(postsRef, orderBy('createdAt','desc')), snap => {
  // convert docs => plain objects for scoring
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  computeTrendingHashtagsRealtime(all, hashtagLeaderboard, esc);
  if(selectedTag){
    loadPostsForTag({ selectedTag, viewMode, db, postsList, activeTagCountEl, esc, fmtDate });
  }
});

// initial compute once (cold start)
(async ()=>{
  const snaps = await getDocs(query(collection(db,'posts'), orderBy('createdAt','desc')));
  const all = snaps.docs.map(s => ({ id: s.id, ...s.data() }));
  computeTrendingHashtagsRealtime(all, hashtagLeaderboard, esc);
  if(selectedTag) {
    await loadPostsForTag({ selectedTag, viewMode, db, postsList, activeTagCountEl, esc, fmtDate });
  }
})();
