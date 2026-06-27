let data=JSON.parse(localStorage.getItem('eggData')||'[]');
function render(){let t=document.getElementById('t');t.innerHTML='<tr><th>Date</th><th>Eggs</th></tr>';data.forEach(r=>t.innerHTML+=`<tr><td>${r.d}</td><td>${r.e}</td></tr>`)}
function save(){data.push({d:d.value,e:e.value});localStorage.setItem('eggData',JSON.stringify(data));render();}
function exportCSV(){let csv='Date,Eggs\n'+data.map(r=>r.d+','+r.e).join('\n');let b=new Blob([csv]);let a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='egg-data.csv';a.click();}
render();