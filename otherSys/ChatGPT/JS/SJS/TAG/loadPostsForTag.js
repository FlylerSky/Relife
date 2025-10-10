// JS/SJS/TAG/loadPostsForTag.js
import { collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

export async function loadPostsForTag({ selectedTag, viewMode = 'trending', db, postsList, activeTagCountEl, esc, fmtDate } = {}){
  if(!postsList) return;
  postsList.innerHTML = '<div class="text-center text-muted py-4">Đang tải...</div>';
  if(!selectedTag){
    postsList.innerHTML = '<div class="text-center text-muted py-4">Chọn hashtag từ bảng bên phải.</div>';
    if(activeTagCountEl) activeTagCountEl.textContent = '';
    return;
  }

  try {
    const snaps = await getDocs(query(collection(db,'posts'), orderBy('createdAt','desc')));
    const arr = [];
    snaps.forEach(s => {
      const d = s.data();
      const hashtags = d.hashtags || [];
      if(hashtags.some(h => h.toLowerCase() === selectedTag.toLowerCase())){
        arr.push({ id: s.id, ...d });
      }
    });

    if(arr.length === 0){
      postsList.innerHTML = `<div class="text-center text-muted py-4">Chưa có bài cho ${esc(selectedTag)}</div>`;
      if(activeTagCountEl) activeTagCountEl.textContent = '0 bài';
      return;
    }

    const now = Date.now();
    function score(p){
      const likes = p.likes||0, comments = p.commentsCount||0;
      const created = p.createdAt?.toMillis ? p.createdAt.toMillis() : 0;
      const daysAgo = created ? Math.max(0,(now-created)/(1000*60*60*24)) : 365;
      const freshness = Math.max(0, 14 - daysAgo);
      return (likes*1) + (comments*2) + (freshness*3);
    }

    if(viewMode === 'trending') arr.sort((a,b)=> score(b) - score(a));
    else arr.sort((a,b)=> (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0) - (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0));

    let html = '';
    arr.forEach(p => {
      // create a short plain-text snippet
      let plain = '';
      try { plain = (typeof DOMPurify !== 'undefined') ? DOMPurify.sanitize(p.content||'', {ALLOWED_TAGS:[]}) : String(p.content||''); } catch(e){ plain = String(p.content||''); }
      const snippet = plain.length > 220 ? plain.slice(0,220) + '…' : plain;
      html += `<div class="mb-3 p-2 border rounded">
        <div class="d-flex justify-content-between">
          <div>
            <div class="fw-bold">${esc(p.title || '(Không tiêu đề)')}</div>
            <div class="small-muted">${esc(p.displayName || '')}</div>
          </div>
          <div class="text-end small-muted">
            <div><i class="bi bi-hand-thumbs-up"></i> ${p.likes||0}</div>
            <div><i class="bi bi-chat"></i> ${p.commentsCount||0}</div>
          </div>
        </div>
        <div class="mt-2 snippet">${esc(snippet)}</div>
        <div class="mt-2 text-end"><a class="btn btn-sm btn-outline-primary btn-rounded" href="post.html?id=${p.id}"><i class="bi bi-box-arrow-up-right"></i></a></div>
      </div>`;
    });

    postsList.innerHTML = html;
    if(activeTagCountEl) activeTagCountEl.textContent = `${arr.length} bài`;
  } catch(err){
    console.error('loadPostsForTag error', err);
    postsList.innerHTML = '<div class="text-muted py-3">Không thể tải bài — thử lại sau.</div>';
  }
}
