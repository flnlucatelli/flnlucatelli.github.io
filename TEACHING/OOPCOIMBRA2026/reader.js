'use strict';
(() => {
  const lang = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';
  const labels = {
    en: {slide:'Slide',read:'Read',code:'Complete code',of:'of',search:'Search slides',found:'slides found',all:'slides',noResults:'No slides match this search.',sources:'Further reading',program:'Complete program',snippet:'Code on this slide',output:'Expected output',exerciseOutput:'Expected output after completing the exercise',noCode:'This slide develops a concept. Follow the explanation or choose a slide with a complete program.',copy:'Copy code',copied:'Code copied. Paste it into the Kotlin Playground editor.',copyFail:'Clipboard access is unavailable. The code is selected; use Ctrl+C or ⌘C, then paste it into Kotlin Playground.',download:'Download .kt',play:'Copy & open Playground',playHelp:'Each file is an independent program. In Kotlin Playground, replace the entire editor contents with this code and run it. Exercises containing TODO must be completed first.',showSolution:'Reveal solution',solution:'Solution',tryFirst:'Attempt the exercise before consulting the worked solution.',exercise:'Exercise',openSlide:'Open slide',solutionSlide:'Solution slide',sourceLabel:'Source file',loadError:'The materials could not be loaded. Please reload this page or use the PDF and source-code downloads below.',closeFullscreen:'Exit full screen',noFullscreen:'Full screen is unavailable in this browser.',notes:'The English explanations follow the same examples and slide numbering as the Portuguese material.',completeNotice:'The slide may show only an excerpt. This pane contains the complete file, with all the declarations needed to run it.',readLabel:'Text of the slide',imageError:'The slide image could not be loaded. Use the Read tab for its full content.',jump:'Go to slide',exerciseDetails:'Read the problem, complete the program, and compare your result with the expected output.',count:'slides'},
    pt: {slide:'Diapositivo',read:'Ler',code:'Código completo',of:'de',search:'Pesquisar diapositivos',found:'diapositivos encontrados',all:'diapositivos',noResults:'Nenhum diapositivo corresponde à pesquisa.',sources:'Leitura complementar',program:'Programa completo',snippet:'Código do diapositivo',output:'Saída esperada',exerciseOutput:'Saída esperada depois de completar o exercício',noCode:'Este diapositivo desenvolve um conceito. Acompanhe a explicação ou escolha um diapositivo com um programa completo.',copy:'Copiar código',copied:'Código copiado. Cole-o no editor do Kotlin Playground.',copyFail:'A área de transferência não está disponível. O código ficou selecionado; use Ctrl+C ou ⌘C e cole-o no Kotlin Playground.',download:'Descarregar .kt',play:'Copiar e abrir Playground',playHelp:'Cada ficheiro é um programa independente. No Kotlin Playground, substitua todo o conteúdo do editor por este código e execute. Complete primeiro as chamadas TODO dos exercícios.',showSolution:'Ver resolução',solution:'Resolução',tryFirst:'Tente resolver o exercício antes de consultar a resolução.',exercise:'Exercício',openSlide:'Abrir diapositivo',solutionSlide:'Diapositivo da resolução',sourceLabel:'Ficheiro de código',loadError:'Não foi possível carregar o material. Recarregue a página ou utilize as ligações para o PDF e para os ficheiros de código abaixo.',closeFullscreen:'Sair do ecrã inteiro',noFullscreen:'O modo de ecrã inteiro não está disponível neste navegador.',notes:'Os diapositivos apresentados são os da aula. O separador Ler permite consultar o texto; Código completo reúne o programa correspondente.',completeNotice:'O diapositivo pode mostrar apenas um excerto. Este separador contém o ficheiro completo, com todas as declarações necessárias para o executar.',readLabel:'Texto do diapositivo',imageError:'Não foi possível carregar a imagem. Consulte o conteúdo completo no separador Ler.',jump:'Ir para o diapositivo',exerciseDetails:'Leia o enunciado, complete o programa e compare o resultado com a saída esperada.',count:'diapositivos'}
  }[lang];
  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => {const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  let data, current=1, activeTab='slide';
  const revealed = new Set();
  const normalise = s => String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const fileUrl = file => '../code/'+lang+'/'+file.split('/').map(encodeURIComponent).join('/');
  const currentSlide = () => data.slides[current-1];
  const validNumber = n => Number.isFinite(Number(n)) ? Math.max(1,Math.min(data.slides.length,Math.trunc(Number(n)))) : current;
  function readHash(){const h=location.hash.slice(1);const p=new URLSearchParams(h);const n=p.get('slide') || (/^slide-(\d+)$/.exec(h)||[])[1];return n ? {number:n,tab:p.get('view')} : null;}
  function updateLocation(){
    const hash='#slide='+current+(activeTab==='slide'?'':'&view='+activeTab);
    history.replaceState(null,'',hash);
    try{localStorage.setItem('oop-coimbra-slide',String(current));}catch(_e){}
    $('language-link').href='../'+(lang==='pt'?'en':'pt')+'/index.html'+hash;
  }
  function paragraphList(items,cls){const box=el('div',cls);(items||[]).forEach(t=>box.append(el('p','',t)));return box;}
  function codeBlock(code,label){const box=el('div','code-block');if(label)box.append(el('span','code-label',label));const pre=el('pre');const c=el('code','',code);pre.append(c);box.append(pre);return box;}
  function outputBlock(output,isExercise=false){const box=el('div','output-box');box.append(el('span','code-label',isExercise?labels.exerciseOutput:labels.output),el('pre','',output));return box;}
  function table(rows){const wrap=el('div','table-scroll');const table=el('table','slide-table');const head=el('thead');const tr=el('tr');rows[0].forEach(v=>{const th=el('th','',v);th.scope='col';tr.append(th);});head.append(tr);table.append(head);const body=el('tbody');rows.slice(1).forEach(row=>{const tr=el('tr');row.forEach(v=>tr.append(el('td','',v)));body.append(tr);});table.append(body);wrap.append(table);return wrap;}
  function renderToc(){
    const query=normalise($('slide-search').value).trim();
    const terms=query.split(/\s+/).filter(Boolean);
    const matches=data.slides.filter(s=>{const text=normalise([s.number,s.id,s.section,s.title,s.lead,...(s.explain||[]),s.code,...(s.rows||[]).flat()].join(' '));return terms.every(t=>text.includes(t));});
    $('search-count').textContent=matches.length+' '+(query?labels.found:labels.all);
    const nav=$('slide-toc');nav.replaceChildren();
    if(!matches.length){nav.append(el('p','help-text',labels.noResults));return;}
    const groups=new Map();matches.forEach(s=>{if(!groups.has(s.section))groups.set(s.section,[]);groups.get(s.section).push(s);});
    groups.forEach((slides,section)=>{const part=el('section','toc-section');part.append(el('h2','',section));const list=el('ol');slides.forEach(s=>{const li=el('li');const a=el('a');a.href='#slide='+s.number;a.dataset.slide=s.number;if(s.number===current)a.setAttribute('aria-current','true');a.append(el('span','toc-number',String(s.number).padStart(2,'0')),el('span','',s.title.replace(/\n/g,' ')));a.addEventListener('click',event=>{event.preventDefault();go(s.number);if(matchMedia('(max-width:680px)').matches)$('toc-shell').open=false;});li.append(a);list.append(li);});part.append(list);nav.append(part);});
  }
  function markCurrent(){document.querySelectorAll('#slide-toc a').forEach(a=>{if(Number(a.dataset.slide)===current)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});}
  function translatedSlide(s){
    const frame=el('article','translation-slide'+(s.kind==='cover'?' slide-cover':''));
    frame.append(el('div','slide-section-label',s.section),el('h2','',s.title));
    if(s.lead)frame.append(el('p','slide-lead',s.lead));
    const inner=el('div','slide-inner'+(!s.code?' prose-only':''));
    if(s.code){const left=el('div');const code=el('div','slide-code');code.append(el('span','code-label',s.kind==='exercise'?labels.exercise:labels.snippet),el('pre','',s.code));left.append(code);if(s.output!==undefined){const out=el('div','slide-output');out.append(el('span','code-label',s.kind==='exercise'?labels.exerciseOutput:labels.output),el('pre','',s.output));left.append(out);}inner.append(left);}
    const prose=paragraphList(s.explain,'slide-explanations');if(s.rows)prose.append(table(s.rows));inner.append(prose);frame.append(inner);
    const foot=el('div','slide-foot');foot.append(el('span','',s.section+' · '+s.id),el('span','',s.number+' / '+data.slides.length));frame.append(foot);return frame;
  }
  function renderSlide(s){
    const target=$('slide-content');target.replaceChildren();
    if(lang==='pt'){
      const img=el('img');img.src='../slides/pt/'+String(s.number).padStart(3,'0')+'.webp';img.alt=labels.slide+' '+s.number+': '+s.title.replace(/\n/g,' ');img.width=1600;img.height=900;img.decoding='async';
      img.addEventListener('error',()=>{const err=el('p','empty-state',labels.imageError);target.replaceChildren(err);});target.append(img);
      if(current<data.slides.length){const nextImg=new Image();nextImg.src='../slides/pt/'+String(current+1).padStart(3,'0')+'.webp';}
    }else target.append(translatedSlide(s));
    $('slide-title').textContent=s.title.replace(/\n/g,' ');$('slide-id').textContent=s.section+' · '+s.id;
  }
  function renderRead(s){
    const target=$('read-pane');target.replaceChildren();target.append(el('p','eyebrow',s.section+' / '+String(s.number).padStart(2,'0')),el('h2','',s.title.replace(/\n/g,' ')));
    if(s.lead)target.append(el('p','help-text',s.lead));
    if(s.code)target.append(codeBlock(s.code,labels.snippet));
    if(s.output!==undefined)target.append(outputBlock(s.output,s.kind==='exercise'));
    target.append(paragraphList(s.explain,'reading-explain'));if(s.rows)target.append(table(s.rows));
  }
  function codeActions(file,code,root){
    const actions=el('div','code-actions');const status=el('p','status-message');status.setAttribute('aria-live','polite');
    const copy=el('button','button small',labels.copy);copy.type='button';copy.addEventListener('click',()=>copyCode(code,root,status));
    const download=el('a','button secondary small',labels.download);download.href=fileUrl(file);download.download=file.split('/').pop();
    const play=el('a','button secondary small',labels.play);play.href='https://play.kotlinlang.org/';play.target='_blank';play.rel='noopener noreferrer';play.addEventListener('click',()=>{copyCode(code,root,status);});
    actions.append(copy,download,play);return {actions,status};
  }
  async function copyCode(text,root,status){
    try{if(!navigator.clipboard)throw new Error('clipboard');await navigator.clipboard.writeText(text);status.textContent=labels.copied;}
    catch(_e){const node=root.querySelector('pre code')||root.querySelector('pre');if(node){const range=document.createRange();range.selectNodeContents(node);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);}status.textContent=labels.copyFail;}
  }
  function renderCode(s){
    const target=$('code-pane');target.replaceChildren();const file=s.file&&data.files[s.file];
    if(!file){target.append(el('p','empty-state',labels.noCode));return;}
    target.append(el('h2','',s.kind==='exercise'?labels.exercise:labels.program),el('p','help-text',labels.completeNotice),el('span','code-file-label',s.file));
    const block=codeBlock(file.code,labels.sourceLabel);const {actions,status}=codeActions(s.file,file.code,block);target.append(actions,block,status);
    const output=file.output!==undefined?file.output:s.output;if(output!==undefined)target.append(outputBlock(output,s.kind==='exercise'));
    target.append(el('p','help-text',labels.playHelp));
  }
  function renderSources(s){
    const target=$('source-links');target.replaceChildren();const urls=[...new Set(s.sources||[])];target.hidden=urls.length===0;if(!urls.length)return;target.append(el('span','source-links-label',labels.sources));
    urls.forEach(url=>{try{const parsed=new URL(url);if(!['https:','http:'].includes(parsed.protocol))return;const name=parsed.pathname.split('/').pop().replace(/\.html$/,'').replace(/-/g,' ');const a=el('a','',name.charAt(0).toUpperCase()+name.slice(1)+' ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';target.append(a);}catch(_e){}});
  }
  function showActiveTab(){
    const s=currentSlide();const gated=s.kind==='solution'&&!revealed.has(s.number);
    $('solution-gate').hidden=!gated;$('reader-panels').hidden=gated;$('fullscreen').disabled=gated;
    ['slide','read','code'].forEach(tab=>{$('tab-'+tab).setAttribute('aria-selected',String(activeTab===tab));$('tab-'+tab).tabIndex=activeTab===tab?0:-1;$('panel-'+tab).hidden=activeTab!==tab;});
    updateLocation();
  }
  function go(number,tab){
    current=validNumber(number);if(['slide','read','code'].includes(tab))activeTab=tab;
    const s=currentSlide();$('slide-number').value=current;$('slide-total').textContent=data.slides.length;$('previous-slide').disabled=current===1;$('next-slide').disabled=current===data.slides.length;
    $('progress-fill').style.width=(current/data.slides.length*100)+'%';$('slide-progress').setAttribute('aria-valuenow',current);$('slide-progress').setAttribute('aria-valuemax',data.slides.length);$('slide-progress').setAttribute('aria-valuetext',labels.slide+' '+current+' '+labels.of+' '+data.slides.length);
    renderSlide(s);renderRead(s);renderCode(s);renderSources(s);markCurrent();showActiveTab();
    $('reader-announcer').textContent=labels.slide+' '+current+' '+labels.of+' '+data.slides.length+': '+s.title.replace(/\n/g,' ');
  }
  function renderExercises(){
    const list=$('exercise-list');list.replaceChildren();data.slides.filter(s=>s.kind==='exercise').forEach((s,index)=>{
      const item=el('details','exercise-item');const summary=el('summary');const title=el('span');title.append(el('span','exercise-number',String(index+1).padStart(2,'0')),el('span','',s.title.replace(/^(Playground:|Playground —)\s*/i,'')));summary.append(title);item.append(summary);
      const body=el('div','exercise-content');body.append(paragraphList(s.explain,'exercise-explain'));const file=s.file&&data.files[s.file];
      if(file){const block=codeBlock(file.code,labels.exercise);const {actions,status}=codeActions(s.file,file.code,block);body.append(actions,block,status);if(s.output!==undefined)body.append(outputBlock(s.output,true));}
      const slideLink=el('a','',labels.openSlide+' '+s.number+' →');slideLink.href='#slide='+s.number;slideLink.addEventListener('click',e=>{e.preventDefault();go(s.number);$('viewer-top').scrollIntoView({block:'start'});});body.append(slideLink);
      const solution=data.slides[s.number];if(solution&&solution.kind==='solution'){
        const detail=el('details','solution-details');detail.append(el('summary','',labels.showSolution),el('p','solution-note',labels.tryFirst));const solutionFile=solution.file&&data.files[solution.file];
        if(solutionFile){const block=codeBlock(solutionFile.code,labels.solution);const {actions,status}=codeActions(solution.file,solutionFile.code,block);detail.append(actions,block,status);if(solutionFile.output!==undefined)detail.append(outputBlock(solutionFile.output));}
        detail.append(paragraphList(solution.explain,'solution-explain'));body.append(detail);
      }
      item.append(body);list.append(item);
    });
  }
  function attachEvents(){
    $('slide-search').addEventListener('input',renderToc);$('previous-slide').addEventListener('click',()=>go(current-1));$('next-slide').addEventListener('click',()=>go(current+1));
    $('slide-number').addEventListener('change',()=>go($('slide-number').value));$('slide-number').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go($('slide-number').value);$('slide-number').blur();}});
    ['slide','read','code'].forEach((tab,index)=>{const button=$('tab-'+tab);button.addEventListener('click',()=>{activeTab=tab;showActiveTab();});button.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();e.stopPropagation();const tabs=['slide','read','code'];const next=e.key==='Home'?0:e.key==='End'?2:(index+(e.key==='ArrowRight'?1:2))%3;activeTab=tabs[next];showActiveTab();$('tab-'+activeTab).focus();}});});
    $('reveal-solution').addEventListener('click',()=>{revealed.add(current);showActiveTab();});
    window.addEventListener('hashchange',()=>{const hash=readHash();if(hash)go(hash.number,hash.tab);});
    window.addEventListener('keydown',e=>{if(e.ctrlKey||e.altKey||e.metaKey||e.target.closest('input,textarea,select,[contenteditable=true],[role=tablist]'))return;if(e.key==='ArrowRight'){e.preventDefault();go(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(current-1);}});
    $('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else {activeTab='slide';showActiveTab();await $('fullscreen-frame').requestFullscreen();}}catch(_e){$('reader-announcer').textContent=labels.noFullscreen;}});
    $('fullscreen-exit').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen();});
  }
  async function init(){
    if(matchMedia('(max-width:680px)').matches)$('toc-shell').open=false;
    try{const response=await fetch('data.json');if(!response.ok)throw new Error('HTTP '+response.status);data=await response.json();if(!Array.isArray(data.slides)||!data.slides.length)throw new Error('No slides');data.files=data.files||{};
      $('loading').hidden=true;$('loaded-material').hidden=false;$('slide-number').max=data.slides.length;
      const hash=readHash();let saved=1;try{saved=localStorage.getItem('oop-coimbra-slide')||1;}catch(_e){}
      current=validNumber(hash?hash.number:saved);if(hash&&['slide','read','code'].includes(hash.tab))activeTab=hash.tab;
      renderToc();renderExercises();attachEvents();go(current);
    }catch(error){$('loading').textContent=labels.loadError;$('loading').setAttribute('role','alert');$('toc-shell').hidden=true;document.querySelector('.reader-layout').style.gridTemplateColumns='1fr';}
  }
  init();
})();
