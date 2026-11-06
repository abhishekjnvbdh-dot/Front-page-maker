const $ = id => document.getElementById(id);
const templates = [
 ["Minimal Professional","Classic","#e8faff","#267bb0"],["Blue Academic","Academic","#d9f1ff","#0877bd"],
 ["Purple Galaxy","Creative","#eee4ff","#8652c9"],["Green Nature","Nature","#e4f6e8","#27865a"],
 ["Pink Creative","Creative","#ffe5f1","#d34c91"],["Golden Luxury","Premium","#fff2d3","#b17b22"],
 ["Dark Modern","Modern","#dfe7f4","#344b70"],["Science Theme","Science","#e2f5ff","#1684a9"],
 ["Mathematics","Academic","#e9edff","#5269c9"],["Computer Science","Technology","#ddf7f4","#168e88"],
 ["Geography","Explore","#e9f4df","#628a39"],["Art & Literature","Classic","#fff0e2","#b36c42"]
];
const themes={aurora:["#e8faff","#267bb0"],ocean:["#d9f1ff","#0877bd"],sunset:["#fff0e6","#d66b55"],emerald:["#e4f6e8","#27865a"],violet:["#eee4ff","#8652c9"],classic:["#fffdf5","#9a7742"]};
let selected=0, logoData="", deferredPrompt=null;
function renderTemplates(){
 $("templateGrid").innerHTML=templates.map((t,i)=>`<button class="template-card ${i===selected?'active':''}" data-index="${i}" style="text-align:left;color:inherit"><div class="template-thumb" style="background:linear-gradient(135deg,${t[2]},${t[2]} 55%,${t[3]}55)"><div class="mini-page" style="border:2px solid ${t[3]}"><i>YOUR SCHOOL NAME</i><div class="mini-line" style="background:${t[3]}"></div><b>${t[0]}</b><div class="mini-box" style="background:${t[2]};border-color:${t[3]}"></div><i>STUDENT DETAILS</i></div></div><div class="template-name">${t[0]}</div><div class="template-tag">${t[1]} · A4 portrait</div></button>`).join("");
 document.querySelectorAll(".template-card").forEach(b=>b.addEventListener("click",()=>applyTemplate(+b.dataset.index)));
}
function applyTemplate(i){selected=i;const t=templates[i];const map={0:"classic",1:"ocean",2:"violet",3:"emerald",4:"sunset",5:"classic",6:"ocean",7:"ocean",8:"violet",9:"emerald",10:"emerald",11:"sunset"};$("theme").value=map[i];update();renderTemplates();$("studio").scrollIntoView({behavior:"smooth"});}
function update(){
 const vals={pSchool:$("school").value||"YOUR SCHOOL NAME",pTitle:$("title").value||"PROJECT TITLE",pSubject:$("subject").value||"Subject",pStudent:$("student").value||"Student name",pClass:[ $("className").value,$("roll").value].filter(Boolean).join(" / ")||"Class / Roll",pTeacher:$("teacher").value||"Teacher's name",pSession:$("session").value||"Academic session"};
 Object.entries(vals).forEach(([id,v])=>$(id).textContent=v);
 const [bg,accent]=themes[$("theme").value];$("paper").style.background=`linear-gradient(145deg,${bg},#fff 52%,${bg})`;$("paper").style.setProperty("--accent",accent);
 $("pTitle").style.fontFamily=$("font").value;
 $("paperLogo").innerHTML=logoData?`<img src="${logoData}" alt="School logo">`:"✦";
}
["school","title","subject","student","className","roll","teacher","session","theme","font"].forEach(id=>$(id).addEventListener("input",update));
$("logo").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{logoData=r.result;update()};r.readAsDataURL(f)});
$("clearLogo").onclick=()=>{logoData="";$("logo").value="";update()};
$("newBtn").onclick=()=>{$("title").value="MY SCHOOL PROJECT";$("student").value="";$("className").value="";$("roll").value="";$("teacher").value="";$("designName").value="";applyTemplate(0);update()};
$("browseBtn").onclick=()=>$("templates").scrollIntoView({behavior:"smooth"});
function snapshot(){return {name:$("designName").value.trim()||$("title").value||"Untitled design",school:$("school").value,title:$("title").value,subject:$("subject").value,student:$("student").value,className:$("className").value,roll:$("roll").value,teacher:$("teacher").value,session:$("session").value,theme:$("theme").value,font:$("font").value,logo:logoData,template:selected,updated:new Date().toISOString()}}
function load(s){["school","title","subject","student","className","roll","teacher","session","theme","font"].forEach(k=>$(k).value=s[k]??"");logoData=s.logo||"";selected=s.template||0;$("designName").value=s.name||"";update();renderTemplates();$("studio").scrollIntoView({behavior:"smooth"})}
function getSaved(){try{return JSON.parse(localStorage.getItem("fpm-designs")||"[]")}catch{return []}}
function notify(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
$("saveBtn").onclick=()=>{const s=snapshot(),all=getSaved();all.unshift(s);localStorage.setItem("fpm-designs",JSON.stringify(all.slice(0,30)));notify("Design saved on this device.");renderSaved()};
function renderSaved(){const all=getSaved();$("savedList").innerHTML=all.length?all.map((s,i)=>`<div class="saved-item"><b>${escapeHtml(s.name)}</b><small>${escapeHtml(s.subject||"No subject")} · ${new Date(s.updated).toLocaleDateString()}</small><div><button class="secondary-btn" data-load="${i}">Open</button><button class="secondary-btn" data-del="${i}">Delete</button></div></div>`).join(""):'<p class="hint">No saved designs yet. Create and save your first cover page.</p>';document.querySelectorAll("[data-load]").forEach(b=>b.onclick=()=>load(getSaved()[+b.dataset.load]));document.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{const a=getSaved();a.splice(+b.dataset.del,1);localStorage.setItem("fpm-designs",JSON.stringify(a));renderSaved()})}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("savedBtn").onclick=()=>{$("savedSection").hidden=false;renderSaved();$("savedSection").scrollIntoView({behavior:"smooth"})};$("closeSaved").onclick=()=>$("savedSection").hidden=true;
$("pngBtn").onclick=async()=>{const paper=$("paper"),rect=paper.getBoundingClientRect(),scale=3;const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(rect.width*scale)}" height="${Math.round(rect.height*scale)}" viewBox="0 0 ${rect.width} ${rect.height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${paper.outerHTML}</div></foreignObject></svg>`;const blob=new Blob([svg],{type:"image/svg+xml;charset=utf-8"});const url=URL.createObjectURL(blob);const img=new Image();img.onload=()=>{const c=document.createElement("canvas");c.width=rect.width*scale;c.height=rect.height*scale;const ctx=c.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);c.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="front-page.png";a.click();URL.revokeObjectURL(a.href);notify("PNG export started.")},"image/png")};img.onerror=()=>{URL.revokeObjectURL(url);notify("PNG export isn't supported in this browser. Use Print / PDF.")};img.src=url};
$("pdfBtn").onclick=()=>{notify("Choose Save as PDF in the print dialog.");setTimeout(()=>window.print(),350)};
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").hidden=false});
$("installBtn").onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("installBtn").hidden=true};
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
renderTemplates();update();renderSaved();
