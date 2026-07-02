
const app=document.getElementById("app");
let state={view:"home",communityId:"beaufort-sc",categoryKey:"safety",needs:[],opportunityCat:"baseball",query:""};

function community(){return COMMUNITIES.find(x=>x.id===state.communityId)||COMMUNITIES[0]}
function category(){const cm=community();return (cm.categories||[]).find(x=>x.key===state.categoryKey)||(cm.categories||[])[0]}
function opportunity(){return OPPORTUNITIES.find(x=>x.cat===state.opportunityCat)||OPPORTUNITIES[0]}
function setView(v){state.view=v;render();window.scrollTo(0,0)}
function selectCommunity(id){state.communityId=id;state.categoryKey="safety";setView("community")}
function selectCategory(key){state.categoryKey=key;setView("detail")}
function selectOpportunity(cat){state.opportunityCat=cat;state.query=cat;setView("opps")}
function top(back){return `<div class="top">${back?`<button class="back" onclick="setView('${back}')">← Back</button>`:`<strong>🧭 Family Compass</strong>`}<button class="linkbtn" onclick="setView('search')">Search</button></div>`}
function ring(score){return `<div class="ring" style="--score:${score}"><div><div class="score">${score}</div><div class="smalltext center">/100</div></div></div>`}

function home(){return `${top()}<section class="card hero center"><div class="logo">🧭</div><h1>Family Compass</h1><p>Find your fit. Build your life.</p></section><section class="card"><h2>A search engine for family life.</h2><p>Search communities, safety, schools, childcare, jobs, connectivity, youth sports, and the stuff families usually discover too late.</p></section><button class="button green" onclick="setView('find')">Find places that fit us</button><button class="button" onclick="setView('location')">Search a specific place</button><button class="button secondary" onclick="selectCommunity('beaufort-sc')">View Beaufort real-data profile</button>`}

function find(){const needs=["🛡️ Low crime","🏫 Strong schools","👶 Childcare","💼 Jobs","🇺🇸 Military-friendly","🎣 Outdoors","📶 Internet/cell"];return `${top('home')}<h1>Find places that fit your family</h1><p>Pick what matters. This ranks sample communities for now.</p><div class="card"><input class="input" value="New Jersey" /><div class="chips">${needs.map(n=>`<button class="chip ${state.needs.includes(n)?'active':''}" onclick="toggleNeed('${n}')">${n}</button>`).join("")}</div></div><button class="button green" onclick="setView('results')">Find My Fit</button>`}
function toggleNeed(n){state.needs.includes(n)?state.needs=state.needs.filter(x=>x!==n):state.needs.push(n);render()}

function results(){const rs=[...COMMUNITIES].sort((a,b)=>b.score-a.score);return `${top('find')}<h1>Best fits found</h1><p>Sample ranking based on your selected needs.</p>${rs.map((x,i)=>`<div class="card"><p class="smalltext">#${i+1} match</p><h3>${x.name}</h3><div class="badge">${x.label}</div><p><strong>${x.score}/100</strong></p><p>${x.summary}</p><button class="button small green" onclick="selectCommunity('${x.id}')">View Community Fit</button></div>`).join("")}`}

function location(){return `${top('home')}<h1>Search a place</h1><p>Choose a sample community.</p><div class="chips">${COMMUNITIES.map(x=>`<button class="chip" onclick="selectCommunity('${x.id}')">${x.name}</button>`).join("")}</div>`}

function communityScreen(){const x=community();return `${top('location')}<div class="center"><h2>${x.name}</h2><h1>Community Fit Score</h1>${ring(x.score)}<div class="badge">${x.label}</div></div><div class="card"><p><strong>${x.summary}</strong></p></div><div class="card"><h3>Things families should know</h3>${(x.reality||[]).map(r=>`<div class="warn">⚠️ ${r}</div>`).join("")}</div>${(x.categories||[]).length?`<div class="card"><h3>Tap a category</h3>${x.categories.map(k=>`<button class="cardbtn" onclick="selectCategory('${k.key}')"><div class="row"><span>${k.name}</span><span class="status">${k.score}</span></div><p>${k.quick}</p></button>`).join("")}</div><button class="button green" onclick="setView('search')">Search opportunities nearby</button>`:`<div class="card"><p>This is still sample data. Beaufort is the real-data pilot.</p></div>`}`}

function detail(){const k=category();if(!k)return `${top('community')}<div class="card"><p>No category detail yet.</p></div>`;return `${top('community')}<div class="center"><h2>${k.name}</h2>${ring(k.score)}<div class="badge">${k.score>=80?'Strong':k.score>=70?'Good':'Needs planning'}</div></div><div class="card"><h3>Quick take</h3><p><strong>${k.quick}</strong></p></div><div class="card"><h3>What the data says</h3>${k.stats.map(s=>`<div class="row"><span>${s[0]}</span><span class="status">${s[1]}</span></div>`).join("")}</div><div class="card"><h3>Recent / important notes</h3>${k.notes.map(n=>`<div class="warn">• ${n}</div>`).join("")}</div><div class="card"><h3>Sources</h3>${k.sources.map(s=>`<p class="source">${s}</p>`).join("")}</div>`}

function search(){return `${top('community')}<h1>Search Family Compass</h1><p>Search family-life categories near ${community().name}.</p><input class="input" placeholder="Try: childcare, jobs, baseball, internet" oninput="state.query=this.value"/><button class="button green" onclick="runSearch()">Search</button><div class="chips">${OPPORTUNITIES.map(o=>`<button class="chip" onclick="selectOpportunity('${o.cat}')">${o.icon} ${o.title}</button>`).join("")}</div>`}

function runSearch(){const q=(state.query||"").toLowerCase();let cat="recreation";if(q.includes("baseball")||q.includes("sport")||q.includes("youth"))cat="baseball";else if(q.includes("child")||q.includes("daycare"))cat="childcare";else if(q.includes("job")||q.includes("work")||q.includes("career"))cat="jobs";else if(q.includes("group")||q.includes("church")||q.includes("community"))cat="community";else if(q.includes("internet")||q.includes("cell")||q.includes("wifi"))cat="connectivity";selectOpportunity(cat)}

function opps(){const found=opportunity();return `${top('search')}<div class="center"><div class="logo">${found.icon}</div><h1>${found.title}</h1><p>Sample results near ${community().name}. In the live app these buttons open real registration, provider, job, or map links.</p></div>${found.items.map(i=>`<div class="card"><h3>${i[0]}</h3><p class="why">Why we showed this: it matches your family-life search.</p><button class="button small green" onclick="alert('Live version opens: ${i[1]}')">${i[1]}</button></div>`).join("")}`}

function render(){app.innerHTML=({home,find,results,location,community:communityScreen,detail,search,opps}[state.view]||home)()}
render();
