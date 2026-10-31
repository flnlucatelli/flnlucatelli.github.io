#!/usr/bin/env python3
"""Build static translations from the canonical English pages and reviewed catalogs."""
from pathlib import Path
import argparse, json, re, hashlib, posixpath
from urllib.parse import urlsplit, urlunsplit
from bs4 import BeautifulSoup, Comment, Doctype, NavigableString

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://flnlucatelli.github.io'
LOCALES = {'en':'English', 'nl':'Nederlands', 'fr':'Français', 'de':'Deutsch', 'it':'Italiano', 'pt':'Português'}
PAGES = json.loads((ROOT/'i18n/pages.json').read_text())

def norm(text): return ' '.join(str(text).split())
def eligible(node):
    return not (isinstance(node,(Comment,Doctype)) or node.find_parent(['script','style','svg']) or node.parent.name in ('script','style','svg') or node.find_parent(class_=['pub-title-line','pub-authors','authors']) or (node.parent.name=='em' and node.find_parent(class_='venue')))
def strings(soup):
    for node in soup.find_all(string=True):
        value=norm(node)
        if eligible(node) and value and re.search('[a-zA-ZÀ-ž]',value): yield value
    for el in soup.find_all(True):
        for a in ('aria-label','alt','title','placeholder','label'):
            if el.get(a): yield el[a]
        if el.name=='meta' and el.get('name')=='description': yield el['content']

def utility(name,locale,catalog):
    text=lambda s:catalog.get(s,s)
    path=lambda code:('/' if code=='en' else '/'+code+'/')+name
    links=''.join(f'<li><a href="{path(code)}" lang="{code}" hreflang="{code}" data-language="{code}"'+(' aria-current="true"' if code==locale else '')+f'>{label}</a></li>' for code,label in LOCALES.items())
    return f'''<div class="language-tools"><a class="doctoral-shortcut" href="{'/' if locale=='en' else '/'+locale+'/'}PhDs.html">{text('PhDs')}</a><details class="language-menu"><summary><svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true"><circle cx="10" cy="10" r="7.4" fill="none" stroke="currentColor"/><ellipse cx="10" cy="10" rx="3.3" ry="7.4" fill="none" stroke="currentColor"/><path d="M3 7h14M3 13h14" fill="none" stroke="currentColor"/></svg>{text('Languages')} · {LOCALES[locale]}</summary><ul class="language-options">{links}</ul></details></div>'''

def add_chrome(soup,name,locale,catalog):
    for old in soup.select('.language-tools,.translation-origin'):old.decompose()
    for old in soup.select('link[rel="canonical"],link[rel="alternate"][hreflang]'):old.decompose()
    for code in ('canonical',):
        soup.head.append(soup.new_tag('link',rel=code,href=ORIGIN+'/'+name))
    for code in LOCALES:
        soup.head.append(soup.new_tag('link',rel='alternate',hreflang=code,href=ORIGIN+('/' if code=='en' else '/'+code+'/')+name))
    soup.head.append(soup.new_tag('link',rel='alternate',hreflang='x-default',href=ORIGIN+'/'+name))
    for file,tag,attrs in [('languages.css','link',{'rel':'stylesheet'}),('languages.js','script',{})]:
        if not soup.find(tag,{'href' if tag=='link' else 'src':re.compile(r'(^|/)'+re.escape(file)+'$')}):
            el=soup.new_tag(tag,**attrs);el['href' if tag=='link' else 'src']='/'+file;soup.head.append(el)
    header=soup.select_one('.page > header') or soup.select_one('body > header')
    header.insert_after(BeautifulSoup(utility(name,locale,catalog),'html.parser'))
    if locale!='en':
        label=catalog['Read the original English version']
        note=BeautifulSoup(f'<p class="translation-origin"><a href="/{name}" lang="en" hreflang="en">{label}</a></p>','html.parser')
        target=soup.select_one('.page') or soup.body
        if target==soup.body and soup.select_one('body > footer'):soup.select_one('body > footer').insert_before(note)
        else:target.append(note)

def localize(name,locale,catalog):
    soup=BeautifulSoup((ROOT/name).read_text(),'html.parser')
    for el in soup.select('.language-tools,.translation-origin'):el.decompose()
    soup.html['lang']='pt-PT' if locale=='pt' else locale
    for node in list(soup.find_all(string=True)):
        key=norm(node)
        if eligible(node) and key in catalog:
            original=str(node); lead=original[:len(original)-len(original.lstrip())]; tail=original[len(original.rstrip()):]
            node.replace_with(lead+catalog[key]+tail)
    for el in soup.find_all(True):
        for a in ('aria-label','alt','title','placeholder','label'):
            if el.get(a) in catalog:el[a]=catalog[el[a]]
        if el.name=='meta' and el.get('name')=='description' and el.get('content') in catalog:el['content']=catalog[el['content']]
        for attr in ('href','src','poster'):
            if not el.get(attr):continue
            value=el[attr];parts=urlsplit(value)
            if parts.scheme or parts.netloc or value.startswith('#'):continue
            relative=parts.path.lstrip('/')
            if relative in PAGES and el.name=='a':
                path='/'+locale+'/'+relative
            else:path='/'+relative
            el[attr]=urlunsplit(('', '', path, parts.query, parts.fragment))
            if el.name=='a' and relative.endswith('.html') and relative not in PAGES and not el.get('data-language'):
                el['hreflang']='en'
                # Show that detailed event/teaching pages remain in their source language.
                if not relative.startswith('TEACHING/') and not el.select_one('.source-language'):
                    badge=soup.new_tag('small',attrs={'class':'source-language','lang':'en'});badge.string='EN';el.append(badge)
    add_chrome(soup,name,locale,catalog)
    return str(soup)+'\n'

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--extract',action='store_true');parser.add_argument('--check',action='store_true');args=parser.parse_args()
    sources={}
    for name in PAGES:
        soup=BeautifulSoup((ROOT/name).read_text(),'html.parser')
        for el in soup.select('.language-tools,.translation-origin'):el.decompose()
        for value in strings(soup):
            if name not in sources.setdefault(value,[]):sources[value].append(name)
    for value in ('Languages','PhDs','Read the original English version'):sources.setdefault(value,['shared interface'])
    if args.extract:
        (ROOT/'i18n/source.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n');print(f'{len(sources)} source strings');return
    missing={}
    catalogs={code:json.loads((ROOT/f'i18n/{code}.json').read_text()) for code in LOCALES if code!='en'}
    for code,catalog in catalogs.items():
        absent=set(sources)-set(catalog)
        if absent:missing[code]=sorted(absent)
    if missing:raise SystemExit(json.dumps(missing,ensure_ascii=False,indent=2))
    if args.check:print(f'All {len(sources)} strings covered in {len(catalogs)} languages.');return
    for name in PAGES:
        # English remains the primary source at the original URL.
        source=(ROOT/name).read_text();soup=BeautifulSoup(source,'html.parser')
        add_chrome(soup,name,'en',{});(ROOT/name).write_text(str(soup)+'\n')
    for code,catalog in catalogs.items():
        (ROOT/code).mkdir(exist_ok=True)
        for name in PAGES:(ROOT/code/name).write_text(localize(name,code,catalog))
    hashes={name:hashlib.sha256((ROOT/name).read_bytes()).hexdigest() for name in PAGES}
    (ROOT/'i18n/source-hashes.json').write_text(json.dumps(hashes,indent=2)+'\n')
    print(f'Built {len(PAGES)*len(catalogs)} translated pages; {len(PAGES)} canonical English pages retained.')
if __name__=='__main__':main()
