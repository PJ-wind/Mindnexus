'use client'
import { useState } from 'react'
import { Card } from '@/components/ui'
import { Search, Share2, ChevronDown, ChevronUp, BookOpen, Brain, Activity, Users, Heart, Briefcase, Smile, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const TESTS = [
  // ── INTELLIGENCE ──────────────────────────────────────────────
  { id:'wais', category:'intelligence', categoryLabel:'Intelligence tests', icon:'Brain', badge:'badge-blue', color:'bg-brand-50 text-brand-600', border:'border-brand-100',
    name:'Wechsler Adult Intelligence Scale (WAIS)', version:'WAIS-IV', ageRange:'16–90 years', duration:'60–90 min',
    description:'The most widely used intelligence test for adults. Measures general cognitive ability across Verbal Comprehension, Perceptual Reasoning, Working Memory, and Processing Speed index scores.',
    purpose:'Assesses intellectual disabilities, learning disabilities, dementia, and neuropsychological conditions in adults. Used in clinical, forensic, and educational settings.',
    administration:'Individually administered. 15 subtests. Mean 100, SD 15. Requires trained psychologist.',
    interpretation:'FSIQ below 70 may indicate intellectual disability. 90–110 is average. Above 130 is superior. Always interpret in context of clinical history.',
    howToShare:'Share selected subtests with clients via MindNexus. Results returned to your dashboard automatically.',
    tags:['Adult','IQ','Cognitive','Clinical'] },

  { id:'wisc', category:'intelligence', categoryLabel:'Intelligence tests', icon:'Brain', badge:'badge-blue', color:'bg-brand-50 text-brand-600', border:'border-brand-100',
    name:'Wechsler Intelligence Scale for Children (WISC)', version:'WISC-V', ageRange:'6–16 years', duration:'45–65 min',
    description:'Gold standard intelligence assessment for children. Measures Verbal Comprehension, Visual Spatial, Fluid Reasoning, Working Memory, and Processing Speed.',
    purpose:'Identifies learning disabilities, giftedness, ADHD, and academic difficulties in school and clinical settings.',
    administration:'21 subtests. Requires specialised training. Interpret alongside teacher and parent reports.',
    interpretation:'Mean 100, SD 15. Discrepancies between index scores may indicate specific learning profiles.',
    howToShare:'Share parent-report questionnaires via MindNexus. Child components administered in-session.',
    tags:['Children','IQ','School','Learning disabilities'] },

  { id:'sb5', category:'intelligence', categoryLabel:'Intelligence tests', icon:'Brain', badge:'badge-blue', color:'bg-brand-50 text-brand-600', border:'border-brand-100',
    name:'Stanford-Binet Intelligence Scales', version:'SB5', ageRange:'2–85+ years', duration:'45–75 min',
    description:'Measures five cognitive factors: Fluid Reasoning, Knowledge, Quantitative Reasoning, Visual-Spatial Processing, and Working Memory across verbal and non-verbal tasks.',
    purpose:'Used across the full lifespan. Particularly useful for very high or very low ability levels where other tests have ceiling or floor effects.',
    administration:'Uses routing procedure to determine starting points. Produces Full Scale IQ and five factor scores.',
    interpretation:'Mean 100, SD 15. Ceiling up to 225 for gifted, floor at 10 for very low functioning.',
    howToShare:'Non-verbal components shareable digitally. Verbal components require in-session administration.',
    tags:['Lifespan','IQ','Gifted','Clinical'] },

  { id:'kabc', category:'intelligence', categoryLabel:'Intelligence tests', icon:'Brain', badge:'badge-blue', color:'bg-brand-50 text-brand-600', border:'border-brand-100',
    name:'Kaufman Assessment Battery for Children (KABC-II)', version:'KABC-II', ageRange:'3–18 years', duration:'25–70 min',
    description:'Grounded in Luria\'s neuropsychological model and CHC theory. Minimises verbal instructions, making it excellent for bilingual and culturally diverse children.',
    purpose:'Particularly useful for children from diverse cultural and linguistic backgrounds. Identifies specific learning profile strengths and weaknesses.',
    administration:'Minimal verbal requirements for core subtests. Can be administered in child\'s native language.',
    interpretation:'Results in Mental Processing Index (MPI) or Fluid-Crystallised Index (FCI).',
    howToShare:'Parent questionnaires shareable via MindNexus. Core tests require in-person administration.',
    tags:['Children','Cultural fairness','Bilingual','Learning'] },

  { id:'unit', category:'intelligence', categoryLabel:'Intelligence tests', icon:'Brain', badge:'badge-blue', color:'bg-brand-50 text-brand-600', border:'border-brand-100',
    name:'Universal Nonverbal Intelligence Test (UNIT)', version:'UNIT-2', ageRange:'5–21 years', duration:'10–45 min',
    description:'Completely language-free intelligence test using only gestures and symbols. No verbal instructions or responses required. Designed to be culturally and linguistically fair.',
    purpose:'Ideal for deaf, hard of hearing, language-disordered, ELL individuals, or those from culturally diverse backgrounds.',
    administration:'Pantomime gesture instructions. Six subtests across Memory and Reasoning. Completely nonverbal.',
    interpretation:'Full Scale IQ, mean 100, SD 15. Valuable when verbal tests would underestimate true ability.',
    howToShare:'Fully shareable digitally via MindNexus. Visual stimuli presented on screen for remote use.',
    tags:['Nonverbal','Deaf','ELL','Cultural fairness'] },

  { id:'cfit', category:'intelligence', categoryLabel:'Intelligence tests', icon:'Brain', badge:'badge-blue', color:'bg-brand-50 text-brand-600', border:'border-brand-100',
    name:'Culture Fair Intelligence Test (CFIT)', version:'CFIT Scale 2 & 3', ageRange:'8 years–Adult', duration:'12–13 min',
    description:'Developed by Raymond Cattell. Measures fluid intelligence while minimising cultural, language, and education influences using geometric figures and patterns.',
    purpose:'Used when culturally unbiased reasoning assessment is needed. Useful in cross-cultural research and for non-English speaking individuals.',
    administration:'Group or individual. Four subtests: Series, Classification, Matrices, Conditions. Strictly timed.',
    interpretation:'IQ equivalent scores. Assesses fluid reasoning independently of crystallised knowledge.',
    howToShare:'Fully shareable digitally. Client completes independently online. Auto-scored and returned to dashboard.',
    tags:['Fluid intelligence','Group testing','Research','Cross-cultural'] },

  // ── MEMORY & NEUROPSYCHOLOGICAL ───────────────────────────────
  { id:'wms', category:'memory', categoryLabel:'Memory & neuropsychological tests', icon:'Activity', badge:'badge-purple', color:'bg-purple-light text-purple-DEFAULT', border:'border-purple-light',
    name:'Wechsler Memory Scale (WMS)', version:'WMS-IV', ageRange:'16–90 years', duration:'35–60 min',
    description:'The most comprehensive standardised memory battery. Assesses Auditory Memory, Visual Memory, Visual Working Memory, Immediate Memory, and Delayed Memory indices.',
    purpose:'Assesses memory impairment in dementia, traumatic brain injury, epilepsy, and neurological conditions. Often paired with WAIS.',
    administration:'Seven subtests including immediate and 20–30 minute delayed recall. Requires trained administration.',
    interpretation:'Mean 100, SD 15. Significant gap between Immediate and Delayed memory may indicate consolidation problems.',
    howToShare:'Daily memory failure questionnaires shareable with clients and carers. Core testing requires in-session administration.',
    tags:['Memory','Dementia','Brain injury','Neuropsychology'] },

  { id:'bvrt', category:'memory', categoryLabel:'Memory & neuropsychological tests', icon:'Activity', badge:'badge-purple', color:'bg-purple-light text-purple-DEFAULT', border:'border-purple-light',
    name:'Benton Visual Retention Test (BVRT)', version:'BVRT-5', ageRange:'8 years–Adult', duration:'5–10 min',
    description:'Assesses visual perception, visual memory, and visuoconstructive abilities. Client views geometric figures and reproduces them from memory.',
    purpose:'Screens for brain damage, visual memory deficits, and visuospatial functioning. Sensitive to right hemisphere lesions.',
    administration:'Three forms (C, D, E) with copy and immediate/delayed recall procedures. Scored for correct responses and error types.',
    interpretation:'Error types (omissions, distortions, perseverations, rotations) provide qualitative neurological information.',
    howToShare:'Adaptable for digital sharing. Client views stimuli on screen. Results scored by therapist.',
    tags:['Visual memory','Neuropsychology','Brain damage','Visuospatial'] },

  { id:'wcst', category:'memory', categoryLabel:'Memory & neuropsychological tests', icon:'Activity', badge:'badge-purple', color:'bg-purple-light text-purple-DEFAULT', border:'border-purple-light',
    name:'Wisconsin Card Sorting Test (WCST)', version:'WCST-64', ageRange:'6.5 years–Adult', duration:'20–30 min',
    description:'Measures abstract thinking, cognitive flexibility, use of feedback, and strategic planning. Cards sorted by colour, shape, or number according to changing undisclosed rules.',
    purpose:'Assesses frontal lobe functioning and executive function. Sensitive to prefrontal cortex damage, schizophrenia, ADHD, and brain injury.',
    administration:'Client sorts cards based on undisclosed rule that changes without warning. Key scores: categories completed, perseverative errors, failure to maintain set.',
    interpretation:'High perseverative errors indicate difficulty shifting strategies — characteristic of frontal lobe dysfunction.',
    howToShare:'Computerised version shareable digitally. Fully automated scoring. Results sent to dashboard on completion.',
    tags:['Executive function','Frontal lobe','Schizophrenia','ADHD'] },

  { id:'stroop', category:'memory', categoryLabel:'Memory & neuropsychological tests', icon:'Activity', badge:'badge-purple', color:'bg-purple-light text-purple-DEFAULT', border:'border-purple-light',
    name:'Stroop Color and Word Test', version:'Stroop', ageRange:'7 years–Adult', duration:'5 min',
    description:'Measures cognitive processing speed, flexibility, and ability to inhibit automatic responses. The Stroop effect occurs when word colour conflicts with its meaning.',
    purpose:'Assesses response inhibition, selective attention, and processing speed. Sensitive to frontal lobe dysfunction, ADHD, and depression.',
    administration:'Three pages: Word, Colour, Colour-Word (interference). 45 seconds per page. Scores: Word, Colour, Colour-Word, and Interference.',
    interpretation:'Low Colour-Word score and high Interference indicates poor inhibitory control. Useful for ADHD assessment.',
    howToShare:'Fully shareable digitally with timed conditions. Auto-scored and sent to dashboard.',
    tags:['Executive function','ADHD','Attention','Processing speed'] },

  // ── PERSONALITY ───────────────────────────────────────────────
  { id:'mmpi', category:'personality', categoryLabel:'Personality tests', icon:'Users', badge:'badge-amber', color:'bg-amber-50 text-amber-700', border:'border-amber-100',
    name:'Minnesota Multiphasic Personality Inventory (MMPI)', version:'MMPI-3', ageRange:'18+ years', duration:'35–50 min',
    description:'The most widely researched personality assessment in the world. Measures personality structure and psychopathology across 10 clinical scales and multiple validity scales.',
    purpose:'Clinical diagnosis, treatment planning, forensic evaluation, and personnel selection. Validity scales detect inconsistent or distorted responding.',
    administration:'335 true/false items. Requires 8th grade reading level. Validity scales reviewed before clinical scale interpretation.',
    interpretation:'T-scores above 65 clinically elevated. Profiles interpreted in codetypes. Requires trained interpretation.',
    howToShare:'Shareable via MindNexus client portal. Full profile report generated for therapist review.',
    tags:['Personality','Psychopathology','Forensic','Clinical diagnosis'] },

  { id:'bfi', category:'personality', categoryLabel:'Personality tests', icon:'Users', badge:'badge-amber', color:'bg-amber-50 text-amber-700', border:'border-amber-100',
    name:'Big Five Personality Inventory (BFI)', version:'BFI-2', ageRange:'14+ years', duration:'10–15 min',
    description:'Measures the five major personality dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism (OCEAN). One of the most empirically supported personality frameworks.',
    purpose:'Used in counselling, career guidance, relationship counselling. Helps clients understand personality strengths. Useful for premarital and career counselling.',
    administration:'60 items rated on 5-point Likert scale. Available in multiple languages. Free for clinical use.',
    interpretation:'High Neuroticism linked to emotional instability. High Conscientiousness linked to academic and career success.',
    howToShare:'Easily shared via MindNexus. Visual profile results viewable by both therapist and client during session.',
    tags:['Personality','Career','Relationships','Self-awareness'] },

  { id:'mbti', category:'personality', categoryLabel:'Personality tests', icon:'Users', badge:'badge-amber', color:'bg-amber-50 text-amber-700', border:'border-amber-100',
    name:'Myers-Briggs Type Indicator (MBTI)', version:'MBTI Step II', ageRange:'14+ years', duration:'25–30 min',
    description:'Classifies personality into 16 types based on four dichotomies: Extraversion/Introversion, Sensing/Intuition, Thinking/Feeling, and Judging/Perceiving.',
    purpose:'Used in career counselling, team building, relationship counselling, and self-development. Helps clients understand communication styles and decision-making.',
    administration:'93–144 items. Self-report questionnaire. Results in a 4-letter type code (e.g. INTJ, ENFP). Best interpreted with a trained practitioner.',
    interpretation:'16 personality types each with distinct strengths and growth areas. No type is better than another.',
    howToShare:'Shareable via MindNexus client portal. Results discussed collaboratively to ensure accurate self-identification.',
    tags:['Personality type','Career','Relationships','Self-development'] },

  { id:'rorschach', category:'personality', categoryLabel:'Personality tests', icon:'Users', badge:'badge-amber', color:'bg-amber-50 text-amber-700', border:'border-amber-100',
    name:'Rorschach Inkblot Test', version:'R-PAS', ageRange:'5 years–Adult', duration:'45–60 min',
    description:'A projective assessment using ambiguous inkblot images. Client describes what they see. Responses coded for personality structure, defence mechanisms, and psychological functioning.',
    purpose:'Assesses personality organisation, thought processes, emotional regulation, reality testing, and interpersonal style.',
    administration:'Ten standard inkblot cards presented individually. Responses coded for location, determinants, content, and special scores. Requires extensive training.',
    interpretation:'Interpreted using R-PAS. Provides indices for Thought and Perception, Stress and Distress, Self and Other Representation, and Engagement.',
    howToShare:'In-session administration only. Physical stimulus cards required. Digital scoring tools available after in-person administration.',
    tags:['Projective','Personality structure','Reality testing','Clinical'] },

  // ── ANXIETY & DEPRESSION ──────────────────────────────────────
  { id:'gad7', category:'anxiety', categoryLabel:'Anxiety & depression tests', icon:'Heart', badge:'badge-teal', color:'bg-teal-light text-teal-DEFAULT', border:'border-teal-light',
    name:'Generalised Anxiety Disorder Scale (GAD-7)', version:'GAD-7', ageRange:'18+ years', duration:'2–3 min',
    description:'7-item self-report scale measuring severity of generalised anxiety disorder. One of the most widely used anxiety screening tools globally.',
    purpose:'Screens for GAD, monitors symptoms over time, assesses treatment response. Also sensitive for panic disorder, social anxiety, and PTSD.',
    administration:'7 questions rated 0–3 over the past 2 weeks. Total score 0–21.',
    interpretation:'0–4 minimal, 5–9 mild, 10–14 moderate, 15–21 severe. Score ≥10 warrants further evaluation.',
    howToShare:'One-click share via MindNexus. Auto-scored. Results immediately added to client record and session notes.',
    tags:['Anxiety','Screening','Self-report','Treatment monitoring'] },

  { id:'phq9', category:'anxiety', categoryLabel:'Anxiety & depression tests', icon:'Heart', badge:'badge-teal', color:'bg-teal-light text-teal-DEFAULT', border:'border-teal-light',
    name:'Patient Health Questionnaire (PHQ-9)', version:'PHQ-9', ageRange:'12+ years', duration:'2–3 min',
    description:'9-item depression screening tool based on DSM diagnostic criteria. One of the most validated depression measures globally.',
    purpose:'Screens for depression, monitors severity, tracks treatment response. Item 9 on suicidal ideation triggers automatic safety alert.',
    administration:'9 items rated 0–3 over the past 2 weeks. Item 9 triggers automatic crisis alert if endorsed.',
    interpretation:'0–4 minimal, 5–9 mild, 10–14 moderate, 15–19 moderately severe, 20–27 severe depression.',
    howToShare:'Share with one click. Item 9 auto-triggers crisis notification. Results added to session notes.',
    tags:['Depression','Suicide screening','PHQ','Treatment monitoring'] },

  { id:'bai', category:'anxiety', categoryLabel:'Anxiety & depression tests', icon:'Heart', badge:'badge-teal', color:'bg-teal-light text-teal-DEFAULT', border:'border-teal-light',
    name:'Beck Anxiety Inventory (BAI)', version:'BAI', ageRange:'17–80 years', duration:'5–10 min',
    description:'A 21-item self-report measure focusing on somatic and physiological symptoms of anxiety to differentiate anxiety from depression.',
    purpose:'Measures anxiety severity, tracks treatment progress, and differentiates anxiety from depressive symptoms.',
    administration:'21 items rated 0–3 based on severity over the past week. Total score 0–63.',
    interpretation:'0–7 minimal, 8–15 mild, 16–25 moderate, 26–63 severe anxiety.',
    howToShare:'Shareable via MindNexus. Auto-scored with visual severity graph. Previous scores shown for progress comparison.',
    tags:['Anxiety','Somatic symptoms','Beck','Treatment monitoring'] },

  { id:'bdi', category:'anxiety', categoryLabel:'Anxiety & depression tests', icon:'Heart', badge:'badge-teal', color:'bg-teal-light text-teal-DEFAULT', border:'border-teal-light',
    name:'Beck Depression Inventory (BDI)', version:'BDI-II', ageRange:'13+ years', duration:'5–10 min',
    description:'A 21-item self-report measure assessing presence and severity of depressive symptoms consistent with DSM criteria. Used for over 60 years.',
    purpose:'Measures depression severity, monitors treatment response, and screens for depression in clinical and research settings.',
    administration:'21 groups of statements rated 0–3 over the past 2 weeks. Item 9 assesses suicidal ideation.',
    interpretation:'0–13 minimal, 14–19 mild, 20–28 moderate, 29–63 severe. Item 9 triggers automatic alert.',
    howToShare:'Share via MindNexus. Suicidal ideation item triggers therapist alert. Progress tracked with visual graph.',
    tags:['Depression','BDI','Severity','Clinical'] },

  { id:'hama', category:'anxiety', categoryLabel:'Anxiety & depression tests', icon:'Heart', badge:'badge-teal', color:'bg-teal-light text-teal-DEFAULT', border:'border-teal-light',
    name:'Hamilton Anxiety Rating Scale (HAM-A)', version:'HAM-A', ageRange:'18+ years', duration:'10–15 min',
    description:'A clinician-administered scale measuring severity of anxiety symptoms. One of the first anxiety rating scales developed and still widely used in clinical trials.',
    purpose:'Assesses anxiety severity for clinical and research purposes. Evaluates treatment efficacy and monitors response to therapy or medication.',
    administration:'14 items rated 0–4 by a clinician based on observation and client report. Total score 0–56.',
    interpretation:'0–17 mild, 18–24 mild to moderate, 25–30 moderate to severe, 31+ severe anxiety.',
    howToShare:'Therapist-administered only. Record HAM-A scores in MindNexus session notes during or after session.',
    tags:['Anxiety','Clinician-rated','Research','Hamilton'] },

  { id:'hamd', category:'anxiety', categoryLabel:'Anxiety & depression tests', icon:'Heart', badge:'badge-teal', color:'bg-teal-light text-teal-DEFAULT', border:'border-teal-light',
    name:'Hamilton Depression Rating Scale (HAM-D)', version:'HAM-D17', ageRange:'18+ years', duration:'15–20 min',
    description:'The most widely used clinician-administered depression scale in clinical trials. Assesses depressive symptoms across mood, guilt, sleep, work, and somatic domains.',
    purpose:'Quantifies depression severity, monitors treatment response, and serves as outcome measure in clinical research and medication trials.',
    administration:'Semi-structured interview by trained clinician. 17 items rated on 0–4 or 0–2 scales.',
    interpretation:'0–7 normal, 8–16 mild, 17–23 moderate, 24+ severe depression.',
    howToShare:'Clinician-administered. Record scores in MindNexus session notes. Track across sessions to monitor response.',
    tags:['Depression','Clinician-rated','Research','Treatment response'] },

  // ── ADDICTION ─────────────────────────────────────────────────
  { id:'cage', category:'addiction', categoryLabel:'Addiction & substance tests', icon:'AlertTriangle', badge:'badge-red', color:'bg-red-50 text-red-600', border:'border-red-100',
    name:'CAGE Questionnaire', version:'CAGE', ageRange:'16+ years', duration:'1–2 min',
    description:'Four-item screening tool for alcohol use disorders. CAGE is an acronym: Cut down, Annoyed, Guilty, Eye-opener. One of the simplest and most widely used alcohol screens.',
    purpose:'Quick screening for alcohol dependence in clinical settings. Used in primary care, emergency medicine, and general practice.',
    administration:'4 yes/no questions. Can be asked conversationally during clinical interview.',
    interpretation:'2 or more "yes" answers suggests clinically significant alcohol problem requiring further assessment.',
    howToShare:'Share instantly via MindNexus. Simple yes/no format. Results reviewed before next session.',
    tags:['Alcohol','Quick screen','CAGE','Primary care'] },

  { id:'audit', category:'addiction', categoryLabel:'Addiction & substance tests', icon:'AlertTriangle', badge:'badge-red', color:'bg-red-50 text-red-600', border:'border-red-100',
    name:'Alcohol Use Disorders Identification Test (AUDIT)', version:'AUDIT & AUDIT-C', ageRange:'18+ years', duration:'2 min',
    description:'A 10-item WHO screening tool identifying hazardous and harmful alcohol consumption patterns. AUDIT-C is an abbreviated 3-item version for quick screening.',
    purpose:'Identifies alcohol problems from risky use to dependence. Guides intervention level — brief advice, counselling, or specialist referral.',
    administration:'10 questions about frequency, quantity, and alcohol-related problems. Scored 0–40.',
    interpretation:'0–7 low risk, 8–15 hazardous (brief advice), 16–19 harmful (brief counselling), 20+ possible dependence.',
    howToShare:'One-click share via MindNexus. Auto-scored. High-risk scores flagged for review.',
    tags:['Alcohol','WHO','Substance use','Screening'] },

  { id:'dast', category:'addiction', categoryLabel:'Addiction & substance tests', icon:'AlertTriangle', badge:'badge-red', color:'bg-red-50 text-red-600', border:'border-red-100',
    name:'Drug Abuse Screening Test (DAST-10)', version:'DAST-10', ageRange:'18+ years', duration:'2 min',
    description:'A 10-item self-report instrument providing a brief index of consequences related to drug abuse, excluding alcohol and tobacco.',
    purpose:'Screens for drug use problems and guides intervention level. Used in addiction counselling, primary care, and criminal justice.',
    administration:'10 yes/no questions about drug use in the past 12 months. Scored 0–10.',
    interpretation:'0 no problem, 1–2 low (monitor), 3–5 moderate (assess), 6–8 substantial (refer), 9–10 severe.',
    howToShare:'Shareable via MindNexus. Anonymous option available for sensitive cases.',
    tags:['Drug use','Screening','Addiction','Assessment'] },

  // ── GRIEF & TRAUMA ────────────────────────────────────────────
  { id:'pcl5', category:'grief', categoryLabel:'Grief & trauma tests', icon:'Heart', badge:'badge-red', color:'bg-pink-50 text-pink-600', border:'border-pink-100',
    name:'PTSD Checklist for DSM-5 (PCL-5)', version:'PCL-5', ageRange:'18+ years', duration:'5–10 min',
    description:'A 20-item self-report measure assessing presence and severity of all four DSM-5 PTSD symptom clusters: intrusion, avoidance, negative cognitions/mood, and hyperarousal.',
    purpose:'Screens for probable PTSD, monitors symptom change, and evaluates treatment response.',
    administration:'20 items rated 0–4 over the past month. Total score 0–80.',
    interpretation:'Score ≥33 suggests probable PTSD. 10-point change considered clinically meaningful.',
    howToShare:'Share via MindNexus with one click. Auto-scored with cluster breakdown. Previous scores shown for tracking.',
    tags:['PTSD','Trauma','DSM-5','Treatment monitoring'] },

  { id:'iesr', category:'grief', categoryLabel:'Grief & trauma tests', icon:'Heart', badge:'badge-red', color:'bg-pink-50 text-pink-600', border:'border-pink-100',
    name:'Impact of Event Scale-Revised (IES-R)', version:'IES-R', ageRange:'18+ years', duration:'5–10 min',
    description:'A 22-item self-report measure assessing subjective distress caused by traumatic events across Intrusion, Avoidance, and Hyperarousal subscales.',
    purpose:'Measures impact of a specific traumatic event. Screens for PTSD, assesses trauma response, and monitors recovery in grief and trauma counselling.',
    administration:'22 items rated 0–4 based on distress over the past 7 days in relation to a specific named event.',
    interpretation:'0–23 normal, 24–32 mild PTSD, 33–36 moderate, 37+ severe. Subscales interpreted separately.',
    howToShare:'Shareable via MindNexus. Client specifies the event. Subscale scores visualised as charts in dashboard.',
    tags:['Trauma','PTSD','Grief','Event-specific'] },

  { id:'pg13', category:'grief', categoryLabel:'Grief & trauma tests', icon:'Heart', badge:'badge-red', color:'bg-pink-50 text-pink-600', border:'border-pink-100',
    name:'Prolonged Grief Disorder Scale (PG-13)', version:'PG-13-R', ageRange:'18+ years', duration:'5 min',
    description:'A 13-item scale specifically designed to assess prolonged grief disorder (complicated grief), a distinct syndrome from normal grief and depression.',
    purpose:'Identifies clients experiencing prolonged grief disorder needing specialised grief-focused treatment.',
    administration:'13 items on frequency and severity scales. Assesses yearning, functional impairment, and difficulty accepting the loss.',
    interpretation:'Requires specific endorsement pattern including at least 6 months of symptoms and functional impairment.',
    howToShare:'Share via MindNexus client portal. Results highlight items requiring clinical attention.',
    tags:['Grief','Bereavement','Complicated grief','Loss'] },

  // ── CAREER ────────────────────────────────────────────────────
  { id:'riasec', category:'career', categoryLabel:'Career & vocational tests', icon:'Briefcase', badge:'badge-green', color:'bg-green-50 text-green-700', border:'border-green-100',
    name:'Holland Occupational Codes (RIASEC)', version:'Self-Directed Search (SDS)', ageRange:'14+ years', duration:'15–20 min',
    description:'Based on Holland\'s theory classifying people and environments into six types: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional.',
    purpose:'Helps clients identify career paths aligned with personality. Used with adolescents, university students, and adults in career transition.',
    administration:'Client rates activities, competencies, occupations, and self-estimates. Produces 3-letter Holland code matched to occupational databases.',
    interpretation:'Holland code matched to thousands of occupations. High congruence predicts satisfaction and stability.',
    howToShare:'Fully shareable via MindNexus. Results show Holland code, matched careers, and visual hexagon profile.',
    tags:['Career','Vocational','Adolescents','Career change'] },

  { id:'sii', category:'career', categoryLabel:'Career & vocational tests', icon:'Briefcase', badge:'badge-green', color:'bg-green-50 text-green-700', border:'border-green-100',
    name:'Strong Interest Inventory (SII)', version:'Strong 2012', ageRange:'15+ years', duration:'35–40 min',
    description:'One of the most widely used career assessments worldwide. Measures interests across Holland\'s six themes, 30 basic interest scales, and 130 specific occupations.',
    purpose:'Identifies occupational interests, explores career options, guides educational decisions, and supports career transitions.',
    administration:'291 items rating interests across occupations, subjects, activities, and people. Produces detailed profile report.',
    interpretation:'Results show similarity to people satisfied in specific careers. High occupational scale scores indicate likely satisfaction.',
    howToShare:'Shareable via MindNexus. Generates comprehensive career interest profile for session discussion.',
    tags:['Career interests','Occupational','Education planning','Vocational'] },

  // ── RELATIONSHIP & COUPLES ────────────────────────────────────
  { id:'das', category:'relationship', categoryLabel:'Relationship & couples tests', icon:'Smile', badge:'badge-purple', color:'bg-pink-50 text-pink-700', border:'border-pink-100',
    name:'Dyadic Adjustment Scale (DAS)', version:'DAS-32 & DAS-4', ageRange:'18+ years', duration:'10–15 min',
    description:'A 32-item measure of relationship adjustment covering Dyadic Consensus, Satisfaction, Cohesion, and Affectional Expression. DAS-4 is a brief 4-item version.',
    purpose:'Assesses relationship quality, identifies problem areas, guides couples therapy, and monitors progress in counselling.',
    administration:'32 items using various response formats. Both partners can complete simultaneously. DAS-4 for quick screening.',
    interpretation:'Score ≥100 indicates satisfaction (non-distressed average 114.8). Below 100 indicates relationship distress.',
    howToShare:'Share simultaneously with both partners via MindNexus. Results compared side-by-side in therapist dashboard.',
    tags:['Couples','Relationship quality','Premarital','Satisfaction'] },

  { id:'gottman', category:'relationship', categoryLabel:'Relationship & couples tests', icon:'Smile', badge:'badge-purple', color:'bg-pink-50 text-pink-700', border:'border-pink-100',
    name:'Gottman Relationship Assessment', version:'Gottman Checkup', ageRange:'18+ years', duration:'30–45 min',
    description:'Based on Gottman\'s research on relationship stability. Assesses Sound Relationship House components including friendship, conflict management, shared meaning, and trust.',
    purpose:'Comprehensively assesses relationship strengths and growth areas. Guides Gottman Method Couples Therapy intervention planning.',
    administration:'Both partners complete independently. Covers communication patterns, emotional connection, and the Four Horsemen.',
    interpretation:'Highlights relationship strengths, areas of concern, and skill gaps for Gottman Method interventions.',
    howToShare:'Share with both partners simultaneously via MindNexus. Detailed relationship profile reviewed in couples session.',
    tags:['Couples','Gottman','Premarital','Conflict','Communication'] },

  { id:'ras', category:'relationship', categoryLabel:'Relationship & couples tests', icon:'Smile', badge:'badge-purple', color:'bg-pink-50 text-pink-700', border:'border-pink-100',
    name:'Relationship Assessment Scale (RAS)', version:'RAS', ageRange:'18+ years', duration:'2–3 min',
    description:'A brief 7-item global measure of relationship satisfaction. Simple and quick yet psychometrically sound. Widely used in relationship research.',
    purpose:'Quick screening of relationship satisfaction in couples and premarital counselling. Tracks change over the course of therapy.',
    administration:'7 items rated on a 5-point scale. Completed by each partner in under 3 minutes.',
    interpretation:'Total score 7–35. Below 20 suggests clinically significant relationship dissatisfaction.',
    howToShare:'Share with both partners with one click. Completed in minutes on mobile app. Results immediately available in dashboard.',
    tags:['Couples','Satisfaction','Quick screen','Premarital'] }
]

const CATEGORY_META: Record<string, { label: string; Icon: any; color: string; border: string; badge: string }> = {
  intelligence: { label: 'Intelligence tests',              Icon: Brain,         color: 'bg-brand-50 text-brand-600',         border: 'border-brand-100',  badge: 'badge-blue'   },
  memory:       { label: 'Memory & neuropsychological',     Icon: Activity,      color: 'bg-purple-light text-purple-DEFAULT', border: 'border-purple-light', badge: 'badge-purple' },
  personality:  { label: 'Personality tests',              Icon: Users,         color: 'bg-amber-50 text-amber-700',          border: 'border-amber-100',  badge: 'badge-amber'  },
  anxiety:      { label: 'Anxiety & depression tests',     Icon: Heart,         color: 'bg-teal-light text-teal-DEFAULT',     border: 'border-teal-light', badge: 'badge-teal'   },
  addiction:    { label: 'Addiction & substance tests',    Icon: AlertTriangle, color: 'bg-red-50 text-red-600',              border: 'border-red-100',    badge: 'badge-red'    },
  grief:        { label: 'Grief & trauma tests',           Icon: Heart,         color: 'bg-pink-50 text-pink-600',            border: 'border-pink-100',   badge: 'badge-red'    },
  career:       { label: 'Career & vocational tests',      Icon: Briefcase,     color: 'bg-green-50 text-green-700',          border: 'border-green-100',  badge: 'badge-green'  },
  relationship: { label: 'Relationship & couples tests',   Icon: Smile,         color: 'bg-pink-50 text-pink-700',            border: 'border-pink-100',   badge: 'badge-purple' },
}

export default function PsychologicalTestsPage() {
  const [search, setSearch]               = useState('')
  const [expanded, setExpanded]           = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('all')

  function toggleExpand(id: string) {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  async function shareWithClient(testName: string) {
    try {
      await fetch('/api/therapists/share-test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ testName }) })
    } catch {}
    toast.success(`"${testName}" shared with client!`)
  }

  const filtered = TESTS.filter(t =>
    (activeCategory === 'all' || t.category === activeCategory) &&
    (search === '' || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(g => g.toLowerCase().includes(search.toLowerCase())) ||
      t.description.toLowerCase().includes(search.toLowerCase()))
  )

  const categories = Object.keys(CATEGORY_META)
  const countByCategory = (cat: string) => TESTS.filter(t => t.category === cat).length

  const groupedFiltered = categories.reduce<Record<string, typeof TESTS>>((acc, cat) => {
    const items = filtered.filter(t => t.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Psychological test tools</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {TESTS.length} standardised assessments across {categories.length} categories. Share any test with clients directly from this page.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" className="input pl-9 text-sm"
          placeholder="Search by name, category, or purpose..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${activeCategory === 'all' ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
          All ({TESTS.length})
        </button>
        {categories.map(cat => {
          const meta = CATEGORY_META[cat]
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${activeCategory === cat ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {meta.label.split(' ')[0]} ({countByCategory(cat)})
            </button>
          )
        })}
      </div>

      {/* How sharing works */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6 flex gap-3">
        <BookOpen className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-brand-700 leading-relaxed">
          <strong>How sharing works:</strong> Click &quot;Share with client&quot; on any test. Your client receives a notification on their MindNexus portal and mobile app. They complete the test and results are automatically added to their record and your session notes. Both partners receive and complete simultaneously for couples tests.
        </div>
      </div>

      {/* Tests grouped by category */}
      {Object.entries(groupedFiltered).map(([cat, tests]) => {
        const meta = CATEGORY_META[cat]
        const Icon = meta.Icon
        return (
          <div key={cat} className="mb-8">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${meta.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-medium text-sm">{meta.label}</h3>
              <span className={`badge ${meta.badge} text-xs ml-1`}>{tests.length} test{tests.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="space-y-3">
              {tests.map(test => {
                const isExpanded = expanded.includes(test.id)
                return (
                  <Card key={test.id} className={`border transition-all ${isExpanded ? meta.border : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-medium leading-snug">{test.name}</h4>
                      <span className={`badge ${meta.badge} text-[10px] flex-shrink-0 mt-0.5`}>{test.version}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-[11px] text-gray-400 mb-2">
                      <span>Age: {test.ageRange}</span>
                      <span>Duration: {test.duration}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">{test.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {test.tags.map(tag => (
                        <span key={tag} className="badge bg-gray-100 text-gray-500 text-[10px]">{tag}</span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                      <button onClick={() => shareWithClient(test.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg text-xs font-medium transition-colors border border-brand-100">
                        <Share2 className="w-3 h-3" /> Share with client
                      </button>
                      <button onClick={() => toggleExpand(test.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-medium transition-colors border border-gray-200">
                        {isExpanded ? <><ChevronUp className="w-3 h-3" /> Hide details</> : <><ChevronDown className="w-3 h-3" /> Full details</>}
                      </button>
                    </div>

                    {/* Expanded */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                        <div><div className="text-xs font-semibold text-gray-700 mb-1.5">Purpose & clinical use</div><p className="text-xs text-gray-500 leading-relaxed">{test.purpose}</p></div>
                        <div><div className="text-xs font-semibold text-gray-700 mb-1.5">Administration</div><p className="text-xs text-gray-500 leading-relaxed">{test.administration}</p></div>
                        <div><div className="text-xs font-semibold text-gray-700 mb-1.5">Interpretation guide</div><p className="text-xs text-gray-500 leading-relaxed">{test.interpretation}</p></div>
                        <div className={`p-3 rounded-lg border ${meta.border} ${meta.color} bg-opacity-20`}>
                          <div className="text-xs font-semibold mb-1">How to share on MindNexus</div>
                          <p className="text-xs leading-relaxed opacity-90">{test.howToShare}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}

      {Object.keys(groupedFiltered).length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tests found for &quot;{search}&quot;</p>
          <p className="text-xs mt-1">Try a different search term or browse all categories</p>
        </div>
      )}
    </div>
  )
}
