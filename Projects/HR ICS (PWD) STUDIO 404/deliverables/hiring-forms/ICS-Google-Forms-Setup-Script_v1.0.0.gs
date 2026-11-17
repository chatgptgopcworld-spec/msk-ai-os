/**
 * ICS [PWD] Studio 404 - Hiring automation (one-click setup)
 *
 * HOW TO USE (about 3 minutes):
 *  1. Go to https://script.google.com and click "New project".
 *  2. Delete the sample code, paste this whole file, click Save.
 *  3. Choose the function "setupHiring" in the toolbar and click Run.
 *  4. Allow the permissions when Google asks (it needs your Forms, Sheets and Drive).
 *  5. Open "Execution log": it prints the public Form link, the Sheet link and the
 *     Interview Evaluation form link.
 *  Then do the 3 small manual steps in SETUP.md (file upload question, logo, test).
 *
 * What it creates:
 *  - Application Form: company details + "I have read and agree" first, then questions.
 *  - Interview Evaluation Form (staff only).
 *  - Google Sheet with: Summary (totals + All/Shortlist/Maybe/Reject filter),
 *    Applications (auto score, result, reason, one-click WhatsApp link), Templates.
 *  - A trigger that scores every new application the moment it is submitted.
 */

var CFG = {
  SHORTLIST_MIN: 75,   // 75-100 Shortlist
  MAYBE_MIN: 50,       // 50-74 Maybe, below 50 Reject
  SHEET_NAME: 'ICS Hiring Sheet',
  APPLICATION_TITLE: 'ICS [PWD] Studio 404: Job Application Form',
  EVALUATION_TITLE: 'ICS [PWD] Studio 404: Interview Evaluation (Staff Only)'
};

var TEMPLATES = {
  "Shortlist": "Assalam o Alaikum {name},\n\nCongratulations! You have been shortlisted for an interview at *ICS [PWD] Studio 404*.\n\n📍 *Location:* {address}\n📅 *Date:* {date}\n⏰ *Time:* {time}\n👤 *Contact:* {contact}\n\n*Please bring:*\n• One printed copy of your CV\n• A copy of your CNIC\n• Your portfolio or laptop (if you have one)\n\nPlease reply \"OK\" to confirm your attendance. If you cannot attend, kindly let us know at least 6 hours in advance.\n\nBest regards,\n*HR Team*\n*ICS [PWD] Studio 404*",
  "Maybe": "Assalam o Alaikum {name},\n\nWe have received your application for *ICS [PWD] Studio 404*.\n\nOur team is currently reviewing all applications. If your profile matches our requirements, we will contact you shortly on this number.\n\nThank you for your patience.\n\nBest regards,\n*HR Team*\n*ICS [PWD] Studio 404*",
  "Reject": "Assalam o Alaikum {name},\n\nThank you for your interest in *ICS [PWD] Studio 404*. We have reviewed your application.\n\nAfter careful consideration, we will not be moving forward with your application at this time. This decision reflects our current requirements for this role and is not a judgment of your skills or potential.\n\nWe wish you every success in your job search. If a suitable opening comes up in the future, we will be glad to contact you.\n\nBest regards,\n*HR Team*\n*ICS [PWD] Studio 404*"
};

// Question titles. The scoring reads answers by these exact titles.
var Q = {
  AGREE: 'I have read everything above, including the work timing, pay and company rules, and I agree.',
  NAME: 'Full name',
  WA: 'WhatsApp number',
  AREA: 'Current city and area',
  DIST: 'How far is our office from your home?',
  STATUS: 'What are you doing right now?',
  EDU: 'Highest education',
  EXP: 'How much work experience do you have in this field?',
  IT: 'Have you worked in an IT firm before?',
  ITD: 'If yes: where, what job and for how long?',
  OTHER: 'Are you doing any other job right now?',
  COMMIT: 'If selected, for how long can you surely stay with us?',
  SHIFT: 'Which shift are you comfortable with?',
  JOIN: 'When can you join?',
  PROMISE: 'If I am shortlisted, I will come for the interview at the given time, or tell you on WhatsApp at least 1 day before if I can\'t.'
};

/* ------------------------------------------------------------------ */
/* SCORING (pure functions, easy to test)                              */
/* ------------------------------------------------------------------ */

function startsWithAny_(text, list) {
  text = String(text || '').trim();
  for (var i = 0; i < list.length; i++) {
    if (text.indexOf(list[i]) === 0) return true;
  }
  return false;
}

/**
 * a = {dist, edu, it, commit, shift, join, other} (answer texts)
 * Returns {score, result, why}
 */
function scoreApplication(a) {
  var score = 0;
  var low = [];

  // Distance: under 5 km, 5-10 km = good (25). More = low (8)
  if (startsWithAny_(a.dist, ['Less than 5 km', '5 to 10 km'])) { score += 25; }
  else { score += 8; low.push('Far from office'); }

  // How long they can stay: 4 months or more = good (20). 1-3 months = low (5)
  if (startsWithAny_(a.commit, ['1 month', '2 months', '3 months'])) { score += 5; low.push('Short stay'); }
  else { score += 20; }

  // Education: Matric, Inter/DAE, Bachelor's in progress = good (10). Else low (3)
  if (startsWithAny_(a.edu, ['Matric', 'Intermediate', 'Bachelor\'s (in progress)'])) { score += 10; }
  else { score += 3; low.push('Higher education'); }

  // Can join: right away or within 1 week = good (15). Later = low (5)
  if (startsWithAny_(a.join, ['Right away', 'Within 1 week'])) { score += 15; }
  else { score += 5; low.push('Joins later than 1 week'); }

  // Worked in an IT firm before: No = good (15). Yes = low (5)
  if (startsWithAny_(a.it, ['No'])) { score += 15; }
  else { score += 5; low.push('Worked in IT before'); }

  // Shift: one of our 3 shifts or "fine with any" = good (15). Own timing = low (5)
  if (startsWithAny_(a.shift, ['Shift 1', 'Shift 2', 'Shift 3', 'I am fine with any shift'])) { score += 15; }
  else { score += 5; low.push('Own shift timing'); }

  var hasOtherJob = startsWithAny_(a.other, ['Yes']);
  var result;
  if (score >= CFG.SHORTLIST_MIN && !hasOtherJob) result = 'Shortlist';
  else if (score >= CFG.MAYBE_MIN || hasOtherJob) result = 'Maybe';
  else result = 'Reject';
  if (hasOtherJob) low.push('Has another job');

  return { score: score, result: result, why: low.join(', ') };
}

/** Turns 0300 1234567 / +92 300 1234567 / 923001234567 into 923001234567 */
function normalizeWhatsApp_(raw) {
  var d = String(raw || '').replace(/[^0-9]/g, '');
  if (d.indexOf('0092') === 0) d = d.substring(2);
  if (d.indexOf('92') === 0) return d;
  if (d.indexOf('0') === 0) return '92' + d.substring(1);
  if (d.length === 10) return '92' + d;
  return d;
}

/* ------------------------------------------------------------------ */
/* SETUP                                                               */
/* ------------------------------------------------------------------ */

function setupHiring() {
  var ss = SpreadsheetApp.create(CFG.SHEET_NAME);
  var appForm = buildApplicationForm_();
  appForm.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  var evalForm = buildEvaluationForm_();
  evalForm.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  buildSheets_(ss);

  ScriptApp.newTrigger('onApplicationSubmit').forForm(appForm).onFormSubmit().create();
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());

  if (typeof appForm.setPublished === 'function') { appForm.setPublished(true); }
  if (typeof evalForm.setPublished === 'function') { evalForm.setPublished(true); }

  Logger.log('=== DONE ===');
  Logger.log('PUBLIC APPLICATION FORM (put this in job posts): ' + appForm.getPublishedUrl());
  Logger.log('Edit the application form (add file upload here): ' + appForm.getEditUrl());
  Logger.log('INTERVIEW EVALUATION FORM (staff only): ' + evalForm.getPublishedUrl());
  Logger.log('HIRING SHEET: ' + ss.getUrl());
}

function addInfo_(form, title, text) {
  form.addSectionHeaderItem().setTitle(title).setHelpText(text);
}

function mc_(form, title, choices, required, help) {
  var it = form.addMultipleChoiceItem().setTitle(title).setChoiceValues(choices).setRequired(required !== false);
  if (help) it.setHelpText(help);
  return it;
}

function buildApplicationForm_() {
  var f = FormApp.create(CFG.APPLICATION_TITLE);
  f.setDescription('Registered by Government of Pakistan. PSEB registration no.: Z-25-23414/26\n\nPlease read the details below first, then answer honestly. There are no wrong answers. Shortlisted candidates will get a WhatsApp message with the interview time and details.');
  f.setConfirmationMessage('Thank you! We have received your application. If you are shortlisted, we will message you on WhatsApp with the interview time and details.');
  f.setAllowResponseEdits(false);
  f.setShowLinkToRespondAgain(false);

  // ---- Page 1: All details about work ----
  addInfo_(f, 'ALL DETAILS ABOUT WORK (please read)',
    'About us\n' +
    'ICS [PWD] Studio 404 has been working professionally since 2017, for 8 years. We are a software house and an IT institute. ' +
    'Our CEO, Mohammad Zeeshan, also runs registered companies in the US and Germany. Our Managing Director, Mohammad Abbas, manages the institute. ' +
    'We handle social media content monetization, software and web development, celebrity management, and local and international projects.');
  addInfo_(f, 'Our office',
    'Building # 25/A, Main Rehmania Road, Opposite Street # 10, Partab Nagar, Faisalabad\n' +
    'Google Maps: https://maps.app.goo.gl/WpozvDe7KrWQxYtH8?g_st=iw');
  addInfo_(f, 'Registration',
    'Registered by Government of Pakistan. PSEB registration no.: Z-25-23414/26');
  addInfo_(f, 'What we do',
    '- Facebook, TikTok and YouTube content monetization\n' +
    '- Organic page creation, growth and monetization\n' +
    '- Completing monetization requirements and generating revenue\n' +
    '- Organic, AI-generated and celebrity-related content creation\n' +
    '- AI-powered image and video generation (generative AI)\n' +
    '- AI-powered automation: YouTube, TikTok and Facebook automation\n' +
    '- Copyright work');
  addInfo_(f, 'Our progress',
    '8 years of work | 680+ happy clients | 20+ team members');
  addInfo_(f, 'Work timing',
    'Each shift is 9 hours of work. You will be placed on one of these shifts:\n' +
    'Shift 1: 11:00 AM to 8:00 PM\nShift 2: 2:00 PM to 11:00 PM\nShift 3: 4:00 PM to 1:00 AM');
  addInfo_(f, 'Pay',
    '1 month unpaid internship, then a fixed starting salary of Rs. 25,000.');
  addInfo_(f, 'Company rules and regulations',
    '1. Be on time. Be at your desk exactly when your shift starts. If you are late, you get up to 3 warnings. After 3 warnings without a valid reason, a time penalty applies: you make up the extra hours.\n' +
    '2. Dress code. Cultural dress (like shalwar kameez) or formal or semi-formal clothes are fine. Shorts are not allowed.\n' +
    '3. Lunch break. You get a 25-minute lunch break. The office has a kitchen, oven, fridge and freezer.\n' +
    '4. Prayer. Prayer time is allowed. The time is shared equally between the company and you, and it counts inside your working hours. Example: a 20-minute prayer is 10 minutes from the company and 10 minutes from you.\n' +
    '5. No smoking or vaping. Smoking, vaping and pods are not allowed in the office. You may do it only in your lunch break, in the designated smoking zone.\n' +
    '6. Conduct. Be respectful and professional with colleagues, clients and visitors.\n' +
    '7. Contract. You must sign the contract within 1 week. All rules in it must be followed.\n' +
    '8. Mobile phones. You may bring your phone, but only emergency calls are allowed. A penalty applies if you are caught using it otherwise.\n' +
    '9. Confidentiality and equipment. Keep company and client information private. Use company equipment for work only. The first month is an unpaid internship, then the fixed starting salary is Rs. 25,000.');
  f.addCheckboxItem().setTitle(Q.AGREE).setChoiceValues(['I have read and I agree']).setRequired(true);

  // ---- Page 2: Application ----
  f.addPageBreakItem().setTitle('Job application')
    .setHelpText('Please answer honestly. There are no wrong answers. Fields marked * are required.');

  f.addTextItem().setTitle(Q.NAME).setRequired(true);
  var wa = f.addTextItem().setTitle(Q.WA).setRequired(true)
    .setHelpText('We will send the interview message to this number. Example: 0300 1234567');
  wa.setValidation(FormApp.createTextValidation().setHelpText('Please enter a valid phone number.')
    .requireTextMatchesPattern('[0-9+\\- ]{10,16}').build());
  f.addTextItem().setTitle(Q.AREA).setRequired(true)
    .setHelpText('The area, road or town where you live now. Example: Jang Road, Faisalabad');

  mc_(f, Q.DIST, ['Less than 5 km', '5 to 10 km', '10 to 20 km', 'More than 20 km'], true, 'Our office is in Faisalabad.');

  mc_(f, Q.STATUS, ['Student', 'Fresh graduate', 'Looking for a job', 'Working, want to switch', 'Freelancer', 'Other']);
  mc_(f, Q.EDU, ['Matric', 'Intermediate / DAE', 'Bachelor\'s (in progress)', 'Bachelor\'s (complete)', 'Master\'s or higher', 'Short course / diploma only']);
  mc_(f, Q.EXP, ['None, I am new', 'Less than 6 months', '6 to 12 months', '1 to 2 years', '2 to 4 years', 'More than 4 years']);
  mc_(f, Q.IT, ['Yes', 'No'], true, 'Any IT, software or IT-related job counts.');
  f.addParagraphTextItem().setTitle(Q.ITD).setRequired(false)
    .setHelpText('Only if you answered Yes. Company name, job title and number of months.');
  mc_(f, Q.OTHER, ['Yes', 'No']);

  mc_(f, Q.COMMIT, ['4 months', '6 months', '6 months to 1 year', '1 year to 1.5 years']);
  var shift = f.addMultipleChoiceItem().setTitle(Q.SHIFT).setRequired(true)
    .setHelpText('Each shift is 9 hours. Choose "Other" to write your own comfortable timing.');
  shift.setChoiceValues(['Shift 1: 11:00 AM to 8:00 PM', 'Shift 2: 2:00 PM to 11:00 PM', 'Shift 3: 4:00 PM to 1:00 AM', 'I am fine with any shift']);
  shift.showOtherOption(true);
  mc_(f, Q.JOIN, ['Right away', 'Within 1 week', 'Within 2 weeks', 'After 1 month or more']);

  // NOTE: Apps Script cannot create a "File upload" question. Add it by hand (see SETUP.md):
  // Add question > File upload > "Upload your CV and portfolio" > allow all types > Required.

  f.addCheckboxItem().setTitle(Q.PROMISE).setChoiceValues(['Yes, I agree']).setRequired(true);
  return f;
}

function buildEvaluationForm_() {
  var f = FormApp.create(CFG.EVALUATION_TITLE);
  f.setDescription('Staff only. Fill in right after the interview. One form per candidate. Rate each point from 1 (poor) to 5 (excellent).');
  f.setConfirmationMessage('Evaluation saved.');
  f.addTextItem().setTitle('Candidate name').setRequired(true);
  f.addTextItem().setTitle('WhatsApp number').setRequired(true);
  f.addDateItem().setTitle('Interview date').setRequired(true);
  f.addTextItem().setTitle('Interviewed by').setRequired(true);
  mc_(f, 'Arrival', ['On time or early', 'Late, under 15 min', 'Late, over 15 min', 'Late, did not inform']);
  var crit = [
    ['Communication', 'Speaks clearly, understands questions, polite on WhatsApp and in person.'],
    ['Skills / practical test', 'Quality of portfolio or small test task done in the office.'],
    ['Attitude', 'Willing to learn, takes feedback well, respectful.'],
    ['Punctuality', 'Came on time, replied on time, informed if late.'],
    ['Commitment', 'Clear plan to stay 1 year or more, no studies abroad or exams clash soon.']
  ];
  crit.forEach(function (c) {
    f.addScaleItem().setTitle(c[0]).setHelpText(c[1]).setBounds(1, 5).setLabels('Poor', 'Excellent').setRequired(true);
  });
  mc_(f, 'Final decision', ['Select', 'Hold', 'Reject'], true, 'Guide: total 20+ of 25 = Select, 15-19 = Hold, under 15 = Reject. The final decision is the interviewer\'s.');
  f.addTextItem().setTitle('Salary offered (PKR), if Select').setRequired(false);
  f.addDateItem().setTitle('Joining date, if Select').setRequired(false);
  f.addParagraphTextItem().setTitle('Notes').setRequired(false);
  return f;
}

function buildSheets_(ss) {
  // Summary
  var sum = ss.insertSheet('Summary', 0);
  var app = ss.insertSheet('Applications');
  var tpl = ss.insertSheet('Templates');

  // Applications
  var headers = ['Received', 'Name', 'WhatsApp', 'City / area', 'Distance', 'Score', 'Result', 'Why', 'Status', 'Send WhatsApp', 'WA number (auto)'];
  app.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#111111').setFontColor('#ffffff');
  app.setFrozenRows(1);
  app.setColumnWidths(1, 1, 140); app.setColumnWidths(2, 1, 170); app.setColumnWidths(3, 1, 130);
  app.setColumnWidths(4, 1, 190); app.setColumnWidths(5, 1, 110); app.setColumnWidths(6, 1, 60);
  app.setColumnWidths(7, 1, 90); app.setColumnWidths(8, 1, 260); app.setColumnWidths(9, 1, 140); app.setColumnWidths(10, 1, 150);
  app.hideColumns(11);
  app.getRange(1, 1, 1000, headers.length).createFilter();
  app.getRange('A2:A1000').setNumberFormat('dd mmm yyyy, hh:mm');
  app.getRange('I2:I1000').setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(['New', 'Messaged', 'Interview booked', 'Came for interview', 'Joined', 'Not coming', 'Rejected'], true).build());
  var rules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Shortlist').setBackground('#e6f4ec').setFontColor('#137a3f').setRanges([app.getRange('G2:G1000')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Maybe').setBackground('#fff3e0').setFontColor('#a35d00').setRanges([app.getRange('G2:G1000')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Reject').setBackground('#fdecec').setFontColor('#c00d0d').setRanges([app.getRange('G2:G1000')]).build()
  ];
  app.setConditionalFormatRules(rules);

  // Templates (also the interview details used in every WhatsApp message)
  tpl.getRange('A1:B4').setValues([
    ['Interview date', 'Monday, 17 November 2026'],
    ['Interview time', '11:00 AM'],
    ['Office address', 'Building # 25/A, Main Rehmania Road, Opposite Street # 10, Partab Nagar, Faisalabad. Map: https://maps.app.goo.gl/WpozvDe7KrWQxYtH8?g_st=iw'],
    ['Contact person', '[Name, phone]']
  ]);
  tpl.getRange('A5').setValue('Message templates. Words in {curly brackets} are filled in automatically: {name} {date} {time} {address} {contact}');
  tpl.getRange('A6:B8').setValues([
    ['Shortlist', TEMPLATES.Shortlist],
    ['Maybe', TEMPLATES.Maybe],
    ['Reject', TEMPLATES.Reject]
  ]);
  tpl.getRange('A1:A8').setFontWeight('bold');
  tpl.getRange('B1:B8').setWrap(true).setVerticalAlignment('top');
  tpl.getRange('A6:A8').setVerticalAlignment('top');
  tpl.setColumnWidth(1, 170); tpl.setColumnWidth(2, 640);
  tpl.getRange('B1:B4').setBackground('#fffbe6');
  tpl.getRange('A10').setValue('Change the yellow cells (date, time, address, contact) for each interview batch. WhatsApp buttons update by themselves.');

  // Summary
  sum.getRange('A1').setValue('ICS [PWD] Studio 404: Hiring Summary').setFontSize(16).setFontWeight('bold');
  sum.getRange('A3:A7').setValues([['Total forms received'], ['Shortlist'], ['Maybe'], ['Reject'], ['New today']]);
  sum.getRange('B3:B7').setFormulas([
    ['=COUNTA(Applications!B2:B)'],
    ['=COUNTIF(Applications!G2:G,"Shortlist")'],
    ['=COUNTIF(Applications!G2:G,"Maybe")'],
    ['=COUNTIF(Applications!G2:G,"Reject")'],
    ['=COUNTIF(Applications!A2:A,">="&TODAY())']
  ]);
  sum.getRange('A3:A7').setFontWeight('bold');
  sum.getRange('B3:B7').setFontSize(16).setFontWeight('bold').setHorizontalAlignment('left');
  sum.getRange('A4:B4').setFontColor('#137a3f'); sum.getRange('A5:B5').setFontColor('#a35d00'); sum.getRange('A6:B6').setFontColor('#c00d0d'); sum.getRange('A7:B7').setFontColor('#0b5cad');
  sum.getRange('A9').setValue('Show:').setFontWeight('bold');
  sum.getRange('B9').setValue('All').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['All', 'Shortlist', 'Maybe', 'Reject'], true).build())
    .setBackground('#fffbe6').setFontWeight('bold');
  sum.getRange('C9').setValue('Pick All, Shortlist, Maybe or Reject. The full list is always on the Applications tab.');
  sum.getRange('A11:H11').setValues([['Name', 'WhatsApp', 'City / area', 'Score', 'Result', 'Why', 'Status', 'Received']])
    .setFontWeight('bold').setBackground('#111111').setFontColor('#ffffff');
  sum.getRange('A12').setFormula('=IFERROR(QUERY(Applications!A2:I,"select B,C,D,F,G,H,I,A where B is not null"&IF($B$9="All",""," and G = \'"&$B$9&"\'")&" order by A desc",0),"No applications yet")');
  sum.getRange('H12:H1000').setNumberFormat('dd mmm yyyy, hh:mm');
  sum.setColumnWidths(1, 1, 190); sum.setColumnWidths(2, 1, 130); sum.setColumnWidths(3, 1, 190);
  sum.setColumnWidths(6, 1, 260); sum.setColumnWidths(7, 1, 130); sum.setColumnWidths(8, 1, 150);
  sum.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Shortlist').setBackground('#e6f4ec').setFontColor('#137a3f').setRanges([sum.getRange('E12:E1000')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Maybe').setBackground('#fff3e0').setFontColor('#a35d00').setRanges([sum.getRange('E12:E1000')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Reject').setBackground('#fdecec').setFontColor('#c00d0d').setRanges([sum.getRange('E12:E1000')]).build()
  ]);
  ss.setActiveSheet(sum);
}

/* ------------------------------------------------------------------ */
/* RUNS BY ITSELF ON EVERY NEW APPLICATION                             */
/* ------------------------------------------------------------------ */

function onApplicationSubmit(e) {
  var ans = {};
  e.response.getItemResponses().forEach(function (r) {
    var v = r.getResponse();
    ans[r.getItem().getTitle()] = (v instanceof Array) ? v.join(', ') : String(v);
  });

  var res = scoreApplication({
    dist: ans[Q.DIST], edu: ans[Q.EDU], it: ans[Q.IT], commit: ans[Q.COMMIT],
    shift: ans[Q.SHIFT], join: ans[Q.JOIN], other: ans[Q.OTHER]
  });

  var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
  var sh = ss.getSheetByName('Applications');
  var wa = normalizeWhatsApp_(ans[Q.WA]);
  sh.appendRow([
    e.response.getTimestamp(),
    ans[Q.NAME] || '',
    "'" + (ans[Q.WA] || ''),
    ans[Q.AREA] || '',
    ans[Q.DIST] || '',
    res.score,
    res.result,
    res.why,
    'New',
    '',
    wa
  ]);
  var row = sh.getLastRow();
  sh.getRange(row, 10).setFormula(whatsAppFormula_(row));
}

/** One-click WhatsApp link. Reads the message text from the Templates tab, so edits apply instantly. */
function whatsAppFormula_(row) {
  var firstName = 'IFERROR(LEFT(B' + row + ',FIND(" ",B' + row + ')-1),B' + row + ')';
  var msg = 'INDEX(Templates!$B$6:$B$8,MATCH(G' + row + ',{"Shortlist";"Maybe";"Reject"},0))';
  var filled = 'SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(' + msg +
    ',"{name}",' + firstName + '),"{date}",Templates!$B$1),"{time}",Templates!$B$2),"{address}",Templates!$B$3),"{contact}",Templates!$B$4)';
  return '=IF(K' + row + '="","",HYPERLINK("https://api.whatsapp.com/send?phone="&K' + row + '&"&text="&ENCODEURL(' + filled + '),"💬 Send "&G' + row + '))';
}
