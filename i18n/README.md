# Maintaining the language editions

The root HTML pages are the canonical English sources. The ten pages listed in
`pages.json` have Dutch, French, German, Italian and European Portuguese editions.
Publication titles, proper names and source documents retain their original wording.
Detailed teaching and event archives remain at their existing URLs.

After editing an English page:

1. Install the build dependency: `python -m pip install -r scripts/requirements-i18n.txt`.
2. Run `python scripts/build_translations.py --extract` to refresh `source.json`.
3. Add or update the corresponding text in all five language JSON catalogs.
4. Run `python scripts/build_translations.py --check`, then
   `python scripts/build_translations.py` to regenerate the static HTML files.
5. Review the changed pages, navigation and filters before committing the English
   sources, catalogs and generated pages together.

Run commands from the repository root. Do not hand-edit generated locale HTML.
`source-hashes.json` records which English sources produced the current editions.
Dynamic filter messages live in `languages.js`; genealogy controls live in
`genealogy.js`. Keep their wording aligned with the static catalogs.

All editions identify the English page as canonical and list the other editions
with `hreflang` links. Language changes are explicit; visitors are never redirected
based on their browser language. The language menu works without JavaScript.

## Doctoral artwork and genealogy sources

- The computer-science image is the author's supplied thesis cover. Its epigraph
  comes from the introduction to *Freely Generated Categorical Structures and
  Automatic Differentiation*: “theory and practice in computer science should
  inform one another” (initial capitalization adjusted for display).
- The mathematics epigraph is an editorial adaptation of the author's requested
  wording, not a verbatim quotation from *Pseudomonads and Descent*. The decorative
  azulejo image was generated for this site; the category diagrams are separately
  drawn SVG artwork, so their notation remains precise.
- `assets/genealogy/lucatellinunes.pdf` is the supplied Mathematics Genealogy Project
  PDF, unchanged. The display SVG preserves its chart and vector lettering while
  adapting the background and ink colours. The text file is its extracted transcript.

The epigraphs are displayed as independent reflections alongside each doctorate;
they are not intended as exhaustive descriptions of either thesis.
