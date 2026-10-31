# Maintaining the language editions

The root HTML pages are the canonical English sources. The ten pages listed in
`pages.json` have Dutch, French, German, Italian and European Portuguese editions.
Publication titles, proper names and source documents retain their original wording.
Detailed teaching and event archives remain at their existing URLs.
In Portuguese, use “ciência da computação” consistently for “computer science”.

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

- The computer-science illustration is inspired by the author's supplied thesis
  cover, without its typography, and incorporates Utrecht University's Academiegebouw.
  The architecture reference is the photograph on the university's
  [visitor information page](https://www.uu.nl/en/organisation/utrecht-university-hall/visitor-information).
  Its epigraph
  comes from the introduction to *Freely Generated Categorical Structures and
  Automatic Differentiation*: “theory and practice in computer science should
  inform one another” (initial capitalization adjusted for display).
- The mathematics epigraph is an editorial adaptation of the author's requested
  wording, not a verbatim quotation from *Pseudomonads and Descent*. The artwork
  returns to the original Portuguese azulejo composition, with architectural
  references to Coimbra and Porto. Unlabelled triangle and coherence-square
  diagrams are drawn separately as SVG in the clear central area. The illustration
  contains no equations or letter labels.
  Architectural references: [Coimbra's Via Latina](https://europeanheritageawards-archive.eu/laureates-1978-2022/detail/via-latina-coimbra)
  and [Porto's historic buildings](https://www.up.pt/portal/pt/conhecer/cultura-museus-e-patrimonio/edificios-historicos/).
- `assets/genealogy/lucatellinunes.pdf` is adapted from the supplied Mathematics
  Genealogy Project chart. The author's entry gives equal prominence to the
  mathematics doctorate awarded by the University of Coimbra in 2018 and the
  computer science doctorate awarded by Utrecht University in 2026, without
  programme details. The display SVG and text transcription carry the same
  degree information; all ancestral entries and supervision connections
  are retained. These shared chart assets remain in English.

The epigraphs are displayed as independent reflections alongside each doctorate;
they are not intended as exhaustive descriptions of either thesis.


The doctoral overview is labelled “Doctorates” in English, with corresponding
labels in all five translations. Its existing `PhDs.html` URL is retained.
The link uses the same styling as the other main navigation items and has a
matching card in the homepage directory, beside Mathematical genealogy. It
also remains in the homepage footer and Further information. There is no
standalone overview link beneath the homepage degree information.
