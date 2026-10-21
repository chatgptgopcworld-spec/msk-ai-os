"""Regenerates wiki/sections/*.md from raw/laws using verbatim extraction.
Edit SPECS / NOTES here, then run:  python3 tools/build_sections.py
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_section import extract
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'wiki', 'sections')
CHECKED = '2026-10-22'
P = '01 PECA 2016 with Rules (amended upto 2025) - SJA.md'
Q = '04 Pakistan Penal Code 1860 - SJA.md'
S = '06 Qanun-e-Shahadat Order 1984 (amended upto 2025) - SJA.md'
SRC = {P: 'source-01-peca-sja', Q: 'source-04-ppc-sja', S: 'source-06-qso-sja'}
STATUS = {'peca-2016': 'verified', 'ppc-1860': 'outdated-source', 'qso-1984': 'verified'}

SPECS = [
 ('peca-s13','peca-2016','PECA s.13 Electronic forgery',P,r'^13\. Electronic forgery',r'^14\. ',1000),
 ('peca-s14','peca-2016','PECA s.14 Electronic fraud',P,r'^14\. Electronic fraud',r'^15\. ',1000),
 ('peca-s16','peca-2016','PECA s.16 Unauthorized use of identity information',P,r'^16\. Unauthorized use',r'^17\. ',1000),
 ('peca-s20','peca-2016','PECA s.20 Offences against dignity of a natural person',P,r'^20\. Offences against dignity',r'^21\. ',1000),
 ('peca-s21','peca-2016','PECA s.21 Offences against modesty of a natural person and minor',P,r'^21\. Offences against modesty',r'^22\. ',1000),
 ('peca-s24','peca-2016','PECA s.24 Cyber stalking',P,r'^24\. Cyber stalking',r'^\[24A\.',1000),
 ('peca-s24a','peca-2016','PECA s.24A Cyberbullying',P,r'^\[24A\. Cyberbullying',r'^25\. ',1000),
 ('peca-s26a','peca-2016','PECA s.26A Punishment for false and fake information',P,r'^\[26A, Punishment',r'^27\. ',1000),
 ('peca-s29','peca-2016','PECA s.29 Investigation agency (NCCIA)',P,r'^Investigation agency\. —\(1\)',r'^19\[30\.',1000),
 ('peca-s30','peca-2016','PECA s.30 Power to investigate',P,r'^19\[30\. Power',r'^\[30A\. Remand',1000),
 ('peca-rules-r6','peca-2016','PECA Investigation Rules 2018, r.6 Cybercrime complaint registration',P,r'^6\. Cybercrime complaint registration',r'^7\. Investigation and case',2000),
 ('ppc-s182','ppc-1860','PPC s.182 False information with intent to cause public servant to use his lawful power to the injury of another',Q,r'^\[182\. False information',r'^\[?183\.',2600),
 ('ppc-s211','ppc-1860','PPC s.211 False charge of offence made with intent to injure',Q,r'^211\. False charge',r'^\[?212\.',2600),
 ('ppc-s383','ppc-1860','PPC s.383 Extortion',Q,r'^383\. Extortion',r'^384\.',2600),
 ('ppc-s384','ppc-1860','PPC s.384 Punishment for extortion',Q,r'^384\. Punishment',r'^\[?385\.',2600),
 ('ppc-s415','ppc-1860','PPC s.415 Cheating',Q,r'^415\. Cheating',r'^\[?416\.',2600),
 ('ppc-s420','ppc-1860','PPC s.420 Cheating and dishonestly inducing delivery of property',Q,r'^420\. Cheating',r'^Of Fraudulent Deeds',2600),
 ('ppc-s499','ppc-1860','PPC s.499 Defamation',Q,r'^499\. Defamation',r'^500\.',2600),
 ('ppc-s500','ppc-1860','PPC s.500 Punishment for defamation',Q,r'^500\. Punishment',r'^501\.',2600),
 ('ppc-s503','ppc-1860','PPC s.503 Criminal intimidation',Q,r'^503\. Criminal intimidation',r'^\[?504\.',2600),
 ('ppc-s506','ppc-1860','PPC s.506 Punishment for criminal intimidation',Q,r'^506\. Punishment',r'^507\.',2600),
 ('ppc-s507','ppc-1860','PPC s.507 Criminal intimidation by an anonymous communication',Q,r'^507\. Criminal',r'^\[?508\.',2600),
 ('ppc-s509','ppc-1860','PPC s.509 Insulting modesty or causing sexual harassment',Q,r'^\[509\. Insulting',r'^\[?510\.',2600),
 ('qso-art46a','qso-1984','QSO Art.46-A Relevance of information generated, received or recorded by automated information system',S,r'^\[46-A\. Relevance',r'^\[?47\.',1900),
 ('qso-art73','qso-1984','QSO Art.73 Primary evidence',S,r'^73\. Primary evidence',r'^\[?74\.',2200),
 ('qso-art78a','qso-1984','QSO Art.78-A Proof of electronic signature and electronic document',S,r'^\[78-A\. Proof',r'^79\. ',2200),
 ('qso-art164','qso-1984','QSO Art.164 Production of evidence available because of modern devices',S,r'^164\. ',r'^165\. ',3600),
]

NOTES = {
'peca-s14': """Ingredients (all needed):
1. Intent for wrongful gain.
2. Any one of: interferes with or uses an information system, device or data; OR induces a person to enter into a relationship; OR deceives any person.
3. The act or omission is likely to cause damage or harm to that person or any other person.

Facts to look for: what was gained or sought (money, data, access), how the deception happened (messages, calls, fake profile), and the loss or likely harm. Compare with [[ppc-s420]] where property was actually delivered.""",
'peca-s16': """Ingredients:
1. Obtains, sells, possesses, transmits or uses
2. another person's identity information
3. without authorization.

Check the Act's definition of "identity information" in s.2 (not yet extracted) before mapping facts. Sub-section (2) gives the victim an application to "the Authority"; see [[smpra]] for who that is and whether it is operating.""",
'peca-s20': """Ingredients of s.20(1) (all needed):
1. Intentionally, and
2. publicly exhibits, displays or transmits
3. information through an information system
4. which the accused knows to be false, and
5. which intimidates or harms the reputation or privacy of a natural person.
Exclusion: anything aired by PEMRA-licensed broadcast media or distribution service.

Weak points to audit: ingredient 4 needs facts showing the content is false *and* that the accused knew it. Ingredient 2 needs facts showing it was public (group size, public post, shares). A true but embarrassing post does not fit s.20; consider [[peca-s24]] (d) or [[peca-s21]] instead, depending on the content.
Sub-section (2): removal/blocking application to "the Authority" ([[smpra]]).""",
'peca-s21': """Ingredients of s.21(1):
1. Intentionally and publicly exhibits, displays or transmits information which does any one of (a) superimposes a face over sexually explicit image/video; (b) includes a photo/video of the person in sexually explicit conduct; (c) intimidates with a sexual act or sexually explicit image/video; (d) cultivates, entices or induces the person to engage in a sexually explicit act;
2. through an information system;
3. to harm the person or their reputation, or to take revenge, create hatred or blackmail.
s.21(2): higher punishment where the victim is a minor.

Handle with special care: never attach the explicit material itself to a draft; describe it and hand it to the investigator directly. The reading of the sentence structure after clause (d) should be confirmed with an advocate.""",
'peca-s24': """Ingredients of s.24(1):
1. Intent to coerce, intimidate or harass any person;
2. uses an information system, network, internet, website, email or similar means; and
3. does any one of:
   (a) follows, contacts or attempts to contact the person repeatedly to foster personal interaction **despite a clear indication of disinterest**;
   (b) monitors the person's use of internet, email, texts or other electronic communication;
   (c) watches or spies on the person so as to cause fear of violence or serious alarm or distress;
   (d) takes a photo or video of the person and displays or distributes it without consent in a manner that harms them.
Proviso to s.24(2): higher punishment if the victim is a minor.

Weak points to audit: for (a), record the date and wording of the "clear indication of disinterest" (block, written refusal) and number the contacts after it. For (c), describe the actual fear or distress caused, not a conclusion.""",
'peca-s24a': """Reads as inserted by Act XXXVII of 2023 (see footnote in text). Ingredients of s.24A(1): intent to harass, threaten or target another person; posts or sends electronic messages (including pictures or videos) using a social media platform. Note sub-section (5) speaks of "child cyberbullying" and the application route in (2) is for a minor through a guardian; confirm with an advocate whether the section is used for adult victims before citing it.""",
'peca-s26a': """Inserted by Act II of 2025. Listed here mainly as a **risk check**: a complainant's own public posts about the respondent should not themselves become "false or fake information". Advise users not to publicise allegations online while a complaint is pending.""",
'peca-s29': """Establishes the NCCIA; s.29(4): the FIA Cyber Crime Wing ceased to exist and its cases transferred to NCCIA. See [[nccia]].""",
'peca-s30': """Only an authorized officer of the investigation agency (NCCIA) may investigate PECA offences, subject to joint investigation teams. Practical effect: PECA offences go to [[nccia]], not to the local police station; non-PECA offences in the same incident (e.g. physical threats) may still need the police route ([[police-fir]]).""",
'peca-rules-r6': """Rules of 2018 were written for the FIA Cybercrime Wing; read "Cybercrime Wing" in light of [[peca-s29]](4). Whether NCCIA has notified its own rules is an open question in [[legal-gaps]].""",
'ppc-s182': """**Risk to the complainant, not a ground of complaint.** Giving a public servant information one knows or believes to be false, intending or knowing it likely that they will act on it to someone's injury, is an offence. This is why every draft keeps unknowns in [BRACKETS] and states only what the complainant can support.""",
'ppc-s211': """**Risk to the complainant.** Instituting criminal proceedings or falsely charging someone, knowing there is no just or lawful ground, with intent to injure. Over-charging (citing sections the facts do not support) invites this allegation.""",
'ppc-s420': """Depends on the definition of cheating in [[ppc-s415]]. Ingredients: (1) the accused cheats; (2) thereby dishonestly induces the person deceived (3) to deliver property to any person, or to make, alter or destroy a valuable security or signed/sealed thing capable of becoming one. If the fraud was online, also consider [[peca-s14]]; avoid citing both without facts for each.""",
'ppc-s499': """Ingredients: (1) makes or publishes an imputation concerning a person, by words, signs or visible representations; (2) intending to harm, or knowing or having reason to believe it will harm, that person's reputation; (3) not falling within the Exceptions in the section (read them in full above before drafting). Civil defamation remedies (Defamation Ordinance 2002) are not yet in raw/ — see [[legal-gaps]].""",
'ppc-s500': """Note the proviso on the "originator" of a defamatory imputation (higher punishment). Forum and whether the offence is cognizable come from Cr.P.C. Schedule II, which is not yet in raw/ — see [[legal-gaps]].""",
'ppc-s503': """Ingredients: (1) threatens another with injury to person, reputation or property (or of someone in whom that person is interested); (2) with intent to cause alarm, or to make the person do what they are not legally bound to do, or omit what they are entitled to do, as the means of avoiding the threat. Quote the actual threat with date, time and medium; do not paraphrase it into something stronger. Punishment in [[ppc-s506]]; anonymous threats [[ppc-s507]].""",
'ppc-s506': """Second part covers threats to cause death, grievous hurt, destruction of property by fire, an offence punishable with death/life/7+ years, or to impute unchastity to a woman. Cite the second part only if the words of the threat actually fall within it.""",
'qso-art164': """Discretionary: the Court "may, if deem appropriate" allow evidence obtained through modern devices. Admissibility is the court's decision; the complainant's job is to preserve originals and the device so authenticity can be shown. See [[evidence-handling]], [[qso-art46a]], [[qso-art73]], [[qso-art78a]].""",
}

def main():
    os.makedirs(OUT, exist_ok=True)
    for sid, st, label, f, s, e, fl in SPECS:
        r = extract(f, s, e, fl)
        note = NOTES.get(sid, 'Not yet broken down into ingredients. Read the verbatim text in full before citing.')
        status = STATUS[st]
        warn = ''
        if status == 'outdated-source':
            warn = ('\n> [!warning] Source currency\n> This text is from a compilation amended up to 14 Dec 2023. '
                    'Later amendments exist (see [[legal-gaps]]). Confirm this section is unchanged before citing it.\n')
        md = f"""---
type: section
statute: {st}
source: {SRC[f]}
last_checked: {CHECKED}
status: {status}
---
# {label}

Statute: [[{st}]]
{warn}
## Verbatim text

```text
{r['text']}
```

## Location

- File: `raw/laws/{f}`, lines {r['start']}-{r['end']}
- PDF page(s): {r['pages']} (see [[{SRC[f]}]] for the PDF link)
- Extracted by `tools/extract_section.py` on {CHECKED}; footnote markers and OCR artefacts are left as they appear in the source.

## Drafting notes (Claude's breakdown, not law)

{note}
"""
        open(os.path.join(OUT, sid + '.md'), 'w', encoding='utf-8').write(md)
        print(f'{sid}: lines {r["start"]}-{r["end"]} p.{r["pages"]}')

if __name__ == '__main__':
    main()
