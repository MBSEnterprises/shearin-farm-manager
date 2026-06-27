const KEY="chickenTrackerFullV1";
const $=id=>document.getElementById(id);
const today=()=>new Date().toISOString().slice(0,10);
let deferredPrompt;

const blank={eggs:[],birds:[],sales:[],uses:[],expenses:[]};
let db=load();

function load(){try{return {...blank,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return {...blank}}}
function save(){localStorage.setItem(KEY,JSON.stringify(db));renderAll()}
function money(n){return Number(n||0).toLocaleString(undefined,{style:"currency",currency:"USD"})}
function num(n){return Number(n||0)}
function csvEscape(v){return `"${String(v??"").replaceAll('"','""')}"`}
function download(filename,content,type="text/csv"){const blob=new Blob([content],{type});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();URL.revokeObjectURL(a.href)}
function toCSV(rows,headers){return headers.join(",")+"\n"+rows.map(r=>headers.map(h=>csvEscape(r[h])).join(",")).join("\n")}
function addRow(collection,item){db[collection].push({...item,id:crypto.randomUUID?.()||String(Date.now()+Math.random())});save()}
function removeRow(collection,id){if(confirm("Delete this entry?")){db[collection]=db[collection].filter(x=>x.id!==id);save()}}

function setDefaultDates(){["eggDate","saleDate","useDate","expenseDate"].forEach(id=>$(id).value=today())}
setDefaultDates();
$("todayLine").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"});

document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tabs button,.panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.tab).classList.add("active")});

$("eggForm").onsubmit=e=>{e.preventDefault();addRow("eggs",{Date:$("eggDate").value,"Eggs Collected":num($("eggCount").value),"Broken/Discarded":num($("eggBad").value),Notes:$("eggNotes").value});e.target.reset();setDefaultDates()};
$("birdForm").onsubmit=e=>{e.preventDefault();addRow("birds",{"Name/ID":$("birdName").value,Breed:$("birdBreed").value,Status:$("birdStatus").value,"Hatch/Acquired Date":$("birdDate").value,Notes:$("birdNotes").value});e.target.reset()};
$("saleForm").onsubmit=e=>{e.preventDefault();const dozens=num($("saleDozens").value), price=num($("salePrice").value);addRow("sales",{Date:$("saleDate").value,Customer:$("saleCustomer").value,"Dozens Sold":dozens,"Price/Dozen":price,Total:(dozens*price).toFixed(2),Paid:$("salePaid").value,Notes:$("saleNotes").value});e.target.reset();$("salePrice").value="5.00";setDefaultDates()};
$("useForm").onsubmit=e=>{e.preventDefault();addRow("uses",{Date:$("useDate").value,"Eggs Used":num($("useCount").value),Purpose:$("usePurpose").value});e.target.reset();setDefaultDates()};
$("expenseForm").onsubmit=e=>{e.preventDefault();addRow("expenses",{Date:$("expenseDate").value,Category:$("expenseCategory").value,Amount:num($("expenseAmount").value).toFixed(2),Notes:$("expenseNotes").value});e.target.reset();setDefaultDates()};

function table(id,rows,headers,collection){$(id).innerHTML="<tr>"+headers.map(h=>`<th>${h}</th>`).join("")+"<th></th></tr>"+rows.slice().reverse().map(r=>"<tr>"+headers.map(h=>`<td>${r[h]??""}</td>`).join("")+`<td class="row-actions"><button onclick="removeRow('${collection}','${r.id}')">Delete</button></td></tr>`).join("")}
function renderAll(){
  const d=today();
  $("eggsToday").textContent=db.eggs.filter(x=>x.Date===d).reduce((a,x)=>a+num(x["Eggs Collected"]),0);
  const seven=new Date(); seven.setDate(seven.getDate()-6); const sevenStr=seven.toISOString().slice(0,10);
  $("eggs7").textContent=db.eggs.filter(x=>x.Date>=sevenStr).reduce((a,x)=>a+num(x["Eggs Collected"]),0);
  $("activeHens").textContent=db.birds.filter(x=>["Active layer","Too young","Broody"].includes(x.Status)).length;
  const ym=d.slice(0,7); $("salesMonth").textContent=money(db.sales.filter(x=>x.Date?.startsWith(ym)).reduce((a,x)=>a+num(x.Total),0));
  table("eggTable",db.eggs,["Date","Eggs Collected","Broken/Discarded","Notes"],"eggs");
  table("birdTable",db.birds,["Name/ID","Breed","Status","Hatch/Acquired Date","Notes"],"birds");
  table("saleTable",db.sales,["Date","Customer","Dozens Sold","Price/Dozen","Total","Paid","Notes"],"sales");
  table("useTable",db.uses,["Date","Eggs Used","Purpose"],"uses");
  table("expenseTable",db.expenses,["Date","Category","Amount","Notes"],"expenses");
}
renderAll();

$("exportEggs").onclick=()=>download("chicken-eggs.csv",toCSV(db.eggs,["Date","Eggs Collected","Broken/Discarded","Notes"]));
$("exportFlock").onclick=()=>download("chicken-flock.csv",toCSV(db.birds,["Name/ID","Breed","Status","Hatch/Acquired Date","Notes"]));
$("exportSales").onclick=()=>download("chicken-sales.csv",toCSV(db.sales,["Date","Customer","Dozens Sold","Price/Dozen","Total","Paid","Notes"]));
$("exportUse").onclick=()=>download("chicken-household-use.csv",toCSV(db.uses,["Date","Eggs Used","Purpose"]));
$("exportExpenses").onclick=()=>download("chicken-expenses.csv",toCSV(db.expenses,["Date","Category","Amount","Notes"]));
$("exportAll").onclick=()=>download("chicken-tracker-backup.json",JSON.stringify(db,null,2),"application/json");
$("importBackup").onchange=e=>{const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{try{db={...blank,...JSON.parse(r.result)}; save(); alert("Backup imported.")}catch{alert("That backup file could not be read.")}}; r.readAsText(f)};
$("clearAll").onclick=()=>{if(confirm("This deletes all Chicken Tracker data on this device. Export a backup first. Continue?")){db={...blank};save()}};

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").classList.remove("hidden")});
$("installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null;$("installBtn").classList.add("hidden")}};

if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(()=>{})}
