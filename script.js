const $ = id => document.getElementById(id);
const KEY = 'students_v1';
const ADMIN = {name:'kareem', pass:'246855'};   // بيانات دخول المدير

const seed = [
  {name:'ندي ايمن محمد', pass:'105', score:100},
  {name:'مروة أحمد محمود',  pass:'104', score:92},
  {name:'ياسمين محمد سيد', pass:'109', score:50},
  {name:'إسراء السبع عبد الرحمن',   pass:'106', score:82},
  {name:'ياسمين أحمد أبوالحمد', pass:'117', score:79},
  {name:'مني علي عمر', pass:'111', score:71},
  {name:'هاجر كريم إبراهيم', pass:'112', score:70},
  {name:'جهاد حسين محمد', pass:'115', score:71},
  {name:'أسماءالأسدأحمد', pass:'102', score:61},
  {name:'أسماء أحمد إبراهيم', pass:'118', score:50},
  {name:'حسنات عبدالحي برعي', pass:'103', score:10},
  {name:'أميرة صابر محمد', pass:'108', score:74},
];
let students;
try { students = JSON.parse(localStorage.getItem(KEY)) || seed; } catch { students = seed; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(students)); } catch {} };

const gradeOf = s => s>=90 ? 'ممتاز' : s>=80 ? 'جيد جداً' : s>=65 ? 'جيد' : s>=50 ? 'مقبول' : 'راسب';
const show = id => { document.querySelectorAll('.view').forEach(v=>v.classList.remove('active')); $(id).classList.add('active'); scrollTo(0,0); };

/* ---- الدخول ---- */
$('lBtn').onclick = () => {
  const n = $('lName').value.trim(), p = $('lPass').value.trim();
  if (n.toLowerCase()===ADMIN.name && p===ADMIN.pass) { $('lErr').textContent=''; render(); show('admin'); return; }
  const s = students.find(x => x.name===n && x.pass===p);
  if (!s) { $('lErr').textContent = 'الاسم أو الرقم السري غير صحيح'; return; }
  $('lErr').textContent='';
  $('rName').textContent = s.name; $('rScore').textContent = s.score + '%'; $('rGrade').textContent = gradeOf(s.score);
  show('result');
};
['lName','lPass'].forEach(i => $(i).addEventListener('keydown', e => e.key==='Enter' && $('lBtn').click()));
const out = () => { $('lName').value=''; $('lPass').value=''; show('login'); };
$('logout').onclick = $('backHome').onclick = $('aLogout').onclick = out;

/* ---- لوحة التحكم ---- */
let editing = -1;
function render() {
  const q = $('q').value.trim();
  const rows = students.map((s,i)=>({...s,i})).filter(s => s.name.includes(q));
  $('tb').innerHTML = rows.length ? rows.map((s,k)=>`
    <tr><td>${k+1}</td><td>${esc(s.name)}</td><td>${esc(s.pass)}</td><td>${s.score}%</td><td>${gradeOf(s.score)}</td>
    <td><button class="ib d" onclick="del(${s.i})"><i class="fa-solid fa-trash-can"></i></button><button class="ib e" onclick="edit(${s.i})"><i class="fa-solid fa-pen"></i></button></td></tr>`).join('')
    : '<tr><td colspan="6" class="empty">لا توجد نتائج</td></tr>';
  $('cnt').textContent = students.length;
}
const esc = t => String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function read() {
  const name=$('fName').value.trim(), pass=$('fPass').value.trim(), score=Number($('fScore').value);
  if (!name || !pass || $('fScore').value==='' || score<0 || score>100) { alert('من فضلك املأ كل الحقول (النتيجة من 0 إلى 100)'); return null; }
  return {name, pass, score};
}
function clear() { editing=-1; ['fName','fPass','fScore'].forEach(i=>$(i).value=''); }
$('bAdd').onclick = () => { const d=read(); if(!d) return; students.push(d); save(); clear(); render(); };
$('bUp').onclick  = () => { if(editing<0){alert('اختر طالباً للتعديل أولاً');return;} const d=read(); if(!d) return; students[editing]=d; save(); clear(); render(); };
$('bCan').onclick = clear;
window.edit = i => { const s=students[i]; editing=i; $('fName').value=s.name; $('fPass').value=s.pass; $('fScore').value=s.score; $('form').scrollIntoView({behavior:'smooth'}); };
window.del  = i => { if(confirm('هل تريد حذف هذا الطالب؟')){ students.splice(i,1); save(); clear(); render(); } };
$('q').oninput = render;

document.querySelectorAll('.nav a').forEach(a => a.onclick = () => {
  document.querySelectorAll('.nav a').forEach(x=>x.classList.remove('on')); a.classList.add('on');
  $(a.dataset.go).scrollIntoView({behavior:'smooth'});
});
render();
