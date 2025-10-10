// JS/SJS/TAG/computeTrendingHashtagsRealtime.js
export function computeTrendingHashtagsRealtime(all, hashtagLeaderboard, esc){
  if(!hashtagLeaderboard) return;
  try {
    const now = Date.now();
    const windowDays = 14;
    const tagMap = new Map();

    all.forEach(p => {
      const created = p.createdAt?.toMillis ? p.createdAt.toMillis() : 0;
      const daysAgo = created ? Math.max(0,(now-created)/(1000*60*60*24)) : 365;
      if(daysAgo > windowDays) return;
      const likes = p.likes||0, comments = p.commentsCount||0;
      const freshness = Math.max(0, windowDays - daysAgo);
      const postScore = (likes * 1) + (comments * 2) + (freshness * 3);
      (p.hashtags||[]).forEach(h => {
        const key = h.toLowerCase();
        const existing = tagMap.get(key) || { tag: h, count:0, score:0 };
        existing.count += 1;
        existing.score += postScore;
        tagMap.set(key, existing);
      });
    });

    const items = Array.from(tagMap.values()).sort((a,b)=> b.score - a.score).slice(0,20);
    if(items.length === 0){
      hashtagLeaderboard.innerHTML = '<div class="text-muted py-2">Chưa có hashtag thịnh hành</div>';
      return;
    }
    let html = '';
    items.forEach(it => {
      html += `<div class="leaderboard-item"><a class="hashtag-btn" href="tag.html?tag=${encodeURIComponent(it.tag)}">${esc(it.tag)}</a><div class="small-muted">${it.count} bài</div></div>`;
    });
    hashtagLeaderboard.innerHTML = html;
  } catch(e){
    console.error('computeTrendingHashtagsRealtime error', e);
    hashtagLeaderboard.innerHTML = '<div class="text-muted py-2">Không thể tải hashtag</div>';
  }
}
