'use client'
import { useState } from 'react'
import { Card } from '@/components/ui'
import { Search, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'

const THEORIES = [
  {
    id: 'psychoanalytic',
    name: 'Psychoanalytic theory',
    founder: 'Sigmund Freud (1890s)',
    category: 'Psychodynamic',
    summary: 'Explores how unconscious processes, early childhood experiences, and repressed emotions shape behaviour and psychological distress.',
    coreConcepts: [
      'The unconscious mind contains repressed thoughts, memories, and desires that influence behaviour without awareness.',
      'The psyche is structured into Id (instinctual drives), Ego (reality-based mediator), and Superego (moral conscience).',
      'Defence mechanisms such as repression, projection, denial, and displacement protect the ego from anxiety.',
      'Early childhood experiences — particularly the oral, anal, phallic, latency, and genital stages — shape adult personality.',
      'The Oedipus and Electra complexes describe children\'s unconscious feelings toward parents.',
      'Transference occurs when clients redirect feelings about past relationships onto the therapist.'
    ],
    techniques: [
      'Free association — client speaks freely without censoring thoughts to uncover unconscious material.',
      'Dream analysis — exploring dream content to access unconscious wishes and conflicts.',
      'Transference interpretation — analysing how the client\'s feelings toward the therapist reflect past relationships.',
      'Resistance analysis — examining what the client avoids discussing to identify unconscious defences.',
      'Interpretation — therapist offers explanations of unconscious patterns observed in the client\'s material.'
    ],
    counsellingApplication: 'Best suited for clients with long-standing personality patterns, relationship difficulties, or unresolved childhood trauma who are willing to engage in extended, insight-oriented therapy. Used in psychodynamic therapy, which is a modern, shorter adaptation of classical psychoanalysis.',
    limitations: 'Time-intensive, expensive, limited empirical evidence for core constructs, culturally biased toward Western individualistic frameworks. Less suitable for crisis intervention or brief therapy.'
  },
  {
    id: 'cbt',
    name: 'Cognitive Behavioural Theory (CBT)',
    founder: 'Aaron Beck & Albert Ellis (1960s)',
    category: 'Cognitive-Behavioural',
    summary: 'Focuses on the relationship between thoughts, feelings, and behaviours. Identifies and challenges unhelpful thinking patterns and maladaptive behaviours.',
    coreConcepts: [
      'Thoughts (cognitions), emotions, and behaviours are interconnected — changing one affects the others.',
      'Automatic thoughts are rapid, involuntary thoughts that arise in situations and influence emotional responses.',
      'Cognitive distortions are systematic errors in thinking such as catastrophising, all-or-nothing thinking, and mind reading.',
      'Core beliefs are deep-seated, fundamental beliefs about oneself, others, and the world (e.g. "I am unlovable").',
      'The cognitive model: Situation → Automatic thought → Emotion → Behaviour → Consequence.',
      'Maladaptive behaviours (e.g. avoidance, safety behaviours) maintain and reinforce psychological distress.'
    ],
    techniques: [
      'Thought records — identifying and challenging automatic negative thoughts using evidence.',
      'Behavioural activation — scheduling pleasurable and meaningful activities to counter depression.',
      'Exposure therapy — gradual, systematic confrontation with feared stimuli to reduce anxiety.',
      'Behavioural experiments — testing the validity of beliefs through real-life experiments.',
      'Socratic questioning — using guided questioning to help clients examine the evidence for their beliefs.',
      'Cognitive restructuring — replacing distorted thoughts with more balanced, realistic alternatives.',
      'Problem-solving training — developing practical skills to manage life challenges.'
    ],
    counsellingApplication: 'The most empirically supported therapy for depression, anxiety disorders, OCD, PTSD, eating disorders, and phobias. Suitable for structured, time-limited therapy (typically 8–20 sessions). Highly effective for clients who are motivated and able to engage with homework tasks.',
    limitations: 'Less effective for severe personality disorders, psychosis, or clients with limited insight. Can feel too structured or rational for clients who need more relational warmth. Homework completion can be a barrier.'
  },
  {
    id: 'humanistic',
    name: 'Humanistic / Person-Centred Theory',
    founder: 'Carl Rogers (1950s)',
    category: 'Humanistic',
    summary: 'Emphasises the inherent worth and growth potential of every person. The therapeutic relationship — characterised by empathy, unconditional positive regard, and genuineness — is the primary agent of change.',
    coreConcepts: [
      'Every person has an inherent drive toward self-actualisation — growing into their fullest potential.',
      'Psychological distress arises from incongruence between the real self (who one actually is) and the ideal self (who one believes one should be).',
      'Unconditional positive regard — accepting and valuing the client without judgement or conditions.',
      'Empathic understanding — the therapist accurately understands the client\'s inner world and reflects this back.',
      'Congruence / genuineness — the therapist is authentic and transparent in the relationship.',
      'The client is the expert on their own experience; the therapist\'s role is to facilitate, not direct.',
      'The actualising tendency — people move naturally toward growth when the right conditions are provided.'
    ],
    techniques: [
      'Active listening — giving full attention and demonstrating deep understanding of the client\'s experience.',
      'Reflection of feelings — accurately mirroring the emotional content of what the client communicates.',
      'Paraphrasing — restating content in the therapist\'s own words to show understanding.',
      'Open questions — inviting exploration without directing the client\'s narrative.',
      'Presence — being fully emotionally available to the client in the moment.',
      'Avoiding advice-giving — trusting the client to find their own answers.'
    ],
    counsellingApplication: 'Forms the relational foundation of most counselling approaches. Essential for building therapeutic alliance. Particularly effective for adjustment difficulties, self-esteem issues, relationship problems, and personal growth. Often used as a standalone approach in supportive counselling.',
    limitations: 'Less structured than CBT or behavioural approaches. May be insufficient as a sole treatment for severe mental illness, acute crisis, or conditions requiring specific skill-building interventions.'
  },
  {
    id: 'existential',
    name: 'Existential theory',
    founder: 'Rollo May, Irvin Yalom (1950s–1980s)',
    category: 'Humanistic',
    summary: 'Addresses the fundamental human concerns of meaning, freedom, isolation, and mortality. Helps clients confront existential anxieties and live more authentically.',
    coreConcepts: [
      'Four ultimate concerns: death, freedom, isolation, and meaninglessness — the core sources of existential anxiety.',
      'Authentic existence — living in accordance with one\'s own values and taking responsibility for one\'s choices.',
      'Bad faith — avoiding authentic existence by pretending one has no choices or by living according to others\' expectations.',
      'The therapeutic relationship is a genuine encounter between two human beings, not a technique.',
      'Anxiety is an inevitable part of existence; the goal is not to eliminate it but to face it courageously.',
      'Meaning-making — humans create meaning in a world that has no inherent meaning.'
    ],
    techniques: [
      'Exploring existential concerns through open, philosophical dialogue.',
      'Examining how the client avoids confronting freedom and responsibility.',
      'Exploring the client\'s relationship with their own mortality.',
      'Helping the client identify and live by their core values.',
      'The therapeutic encounter as a model for authentic relationship.',
      'Logotherapy (Frankl) — helping clients find meaning even in suffering.'
    ],
    counsellingApplication: 'Most useful for clients facing major life transitions, terminal illness, grief, mid-life crisis, loss of meaning, or existential anxiety. Powerful in palliative care, career counselling, and bereavement work. Complements other approaches.',
    limitations: 'Less structured and not suited to symptom-focused or brief therapy. Can be intellectually demanding. Less empirical research base compared to CBT.'
  },
  {
    id: 'gestalt',
    name: 'Gestalt theory',
    founder: 'Fritz Perls (1950s)',
    category: 'Humanistic',
    summary: 'Focuses on present-moment awareness and the integration of thoughts, feelings, and bodily sensations. Emphasises the whole person in their environment rather than isolated parts.',
    coreConcepts: [
      'The present moment is the primary focus — "the here and now".',
      'Awareness — becoming fully conscious of one\'s thoughts, feelings, bodily sensations, and behaviours in the present.',
      'Unfinished business — incomplete experiences from the past that continue to disrupt present functioning.',
      'Contact and withdrawal — healthy functioning involves full contact with experience and appropriate withdrawal.',
      'The field — the person cannot be understood apart from their environment and relationships.',
      'Polarities — inner conflicts involve two opposing parts (e.g. strong vs vulnerable) that need integration.'
    ],
    techniques: [
      'Empty chair technique — having a dialogue with an absent person or a part of oneself represented by an empty chair.',
      'Two-chair work — enacting a dialogue between two conflicting parts of the self.',
      'Body awareness — drawing attention to physical sensations as clues to emotional experience.',
      'Exaggeration — asking clients to amplify a gesture, movement, or statement to bring deeper meaning to awareness.',
      'I-statements — replacing passive language with direct, first-person statements of experience.',
      'Role playing — enacting scenarios to explore feelings and relationships.'
    ],
    counsellingApplication: 'Effective for clients with unresolved interpersonal conflicts, difficulty identifying emotions, relational problems, and low self-awareness. Widely used in individual and group therapy. Integrates well with CBT and person-centred approaches.',
    limitations: 'The experiential techniques can feel confrontational or overwhelming for highly anxious or traumatised clients. Less evidence base than CBT. Requires a skilled practitioner to use safely.'
  },
  {
    id: 'adlerian',
    name: 'Adlerian / Individual Psychology',
    founder: 'Alfred Adler (1900s)',
    category: 'Psychodynamic',
    summary: 'Focuses on social interest, inferiority feelings, birth order, and the individual\'s lifestyle goals. Emphasises that all behaviour is purposeful and goal-directed.',
    coreConcepts: [
      'Inferiority feelings — everyone experiences feelings of inferiority; healthy development involves striving toward superiority or competence.',
      'Social interest (Gemeinschaftsgefühl) — a sense of belonging, contribution, and community is central to mental health.',
      'Lifestyle — each person develops a unique pattern of beliefs, goals, and behaviours (lifestyle) early in life.',
      'Birth order — position in the family (firstborn, middle, youngest) influences personality development.',
      'Teleological thinking — behaviour is understood in terms of its purpose and future goals, not just past causes.',
      'Fictional finalism — people are motivated by subjective goals that may not correspond to reality.'
    ],
    techniques: [
      'Lifestyle assessment — exploring early recollections, family constellation, and birth order.',
      'Encouragement — building the client\'s confidence and belief in their ability to contribute.',
      'Reframing — helping clients see their experiences and behaviours from new perspectives.',
      'Acting "as if" — encouraging clients to behave as if they are the person they want to become.',
      'Catching oneself — helping clients notice when they are engaging in unhelpful patterns.',
      'Task setting — collaboratively agreeing on between-session tasks to promote growth.'
    ],
    counsellingApplication: 'Particularly effective for children, families, school-based counselling, and parenting guidance. Useful for clients struggling with low self-esteem, social difficulties, or perfectionistic strivings. Integrates well with CBT and family therapy.',
    limitations: 'Less systematised than CBT. Some concepts (birth order, fictional finalism) lack strong empirical support. Less well-known in Nigeria despite broad applicability.'
  },
  {
    id: 'rebt',
    name: 'Rational Emotive Behaviour Theory (REBT)',
    founder: 'Albert Ellis (1955)',
    category: 'Cognitive-Behavioural',
    summary: 'The ABC model holds that it is not events themselves but our beliefs about events that cause emotional distress. Identifies and disputes irrational beliefs to produce healthier emotional responses.',
    coreConcepts: [
      'ABC model: Activating event → Belief → Consequence (emotional and behavioural).',
      'Irrational beliefs involve absolute musts, shoulds, and oughts (e.g. "I must be perfect").',
      'Four core irrational beliefs: demandingness, awfulising, low frustration tolerance, and global self-rating.',
      'Unconditional self-acceptance — accepting oneself as a fallible human being regardless of performance.',
      'Disputing — actively challenging the logic, evidence, and helpfulness of irrational beliefs.',
      'Rational beliefs are flexible, realistic, and lead to healthy negative emotions (e.g. disappointment rather than depression).'
    ],
    techniques: [
      'Disputing irrational beliefs — using logical, empirical, and pragmatic challenges.',
      'Rational emotive imagery — imagining distressing scenarios while changing emotional responses.',
      'Shame-attacking exercises — deliberately engaging in mildly embarrassing behaviours to reduce shame.',
      'Psychoeducation — teaching the ABC model and helping clients apply it independently.',
      'Role playing — rehearsing rational responses to challenging situations.',
      'Unconditional acceptance exercises — practising self, other, and life acceptance.'
    ],
    counsellingApplication: 'Effective for anxiety, depression, anger, guilt, and shame. Particularly useful when clients hold rigid, demanding beliefs. Forms part of the CBT family and integrates well with standard CBT techniques.',
    limitations: 'The direct and confrontational disputing style can feel invalidating to some clients. Less suitable for highly distressed or fragile clients without first establishing strong alliance.'
  },
  {
    id: 'narrative',
    name: 'Narrative therapy',
    founder: 'Michael White & David Epston (1980s)',
    category: 'Postmodern',
    summary: 'Views people as separate from their problems. Explores the stories people tell about their lives, externalises problems, and helps clients re-author preferred identities and narratives.',
    coreConcepts: [
      'People make meaning of their lives through stories (narratives) that shape identity and experience.',
      'Problem-saturated stories dominate and overshadow alternative, more positive stories.',
      'Externalisation — the person is not the problem; the problem is the problem.',
      'Unique outcomes — exceptions to the dominant problem story that can be used to build alternative narratives.',
      'Re-authoring — collaboratively constructing preferred stories about identity and experience.',
      'Social and cultural discourses shape what stories are considered "normal" or acceptable.'
    ],
    techniques: [
      'Externalising conversations — giving the problem a name and speaking of it as external to the person.',
      'Mapping the influence of the problem — exploring how the problem has affected the person\'s life.',
      'Identifying unique outcomes — searching for times when the problem was less influential.',
      'Re-authoring conversations — building a richer, preferred story from unique outcomes.',
      'Witnessing and documenting — using letters, certificates, or community witnesses to affirm new stories.',
      'Scaffolding questions — careful questioning that moves from familiar to new territory.'
    ],
    counsellingApplication: 'Highly effective in African and collectivist cultural contexts because it acknowledges social and cultural influences on problems. Excellent for trauma, domestic violence, family therapy, grief, and work with children. Deeply respectful and non-pathologising.',
    limitations: 'Requires significant therapist skill and training. Less structured than CBT. Evidence base is growing but smaller than for CBT.'
  },
  {
    id: 'solution_focused',
    name: 'Solution-Focused Brief Therapy (SFBT)',
    founder: 'Steve de Shazer & Insoo Kim Berg (1980s)',
    category: 'Postmodern',
    summary: 'Focuses on solutions rather than problems. Identifies client strengths, resources, and exceptions to the problem to build toward preferred futures in a brief, structured format.',
    coreConcepts: [
      'The solution is not necessarily related to the problem — understanding the problem is not required to find a solution.',
      'Every client has strengths and resources that can be mobilised for change.',
      'Small changes can lead to bigger changes — find the first small step.',
      'The miracle question — if a miracle happened overnight and the problem was solved, how would life be different?',
      'Exceptions — times when the problem is absent or less severe contain the seeds of solutions.',
      'Scaling questions — rating progress on a 0–10 scale to identify what is already working.'
    ],
    techniques: [
      'Miracle question — "Suppose tonight while you sleep a miracle occurs and your problem is solved. How would you know? What would be different?"',
      'Scaling questions — "On a scale of 0–10, where 0 is the worst it has been and 10 is the miracle, where are you today?"',
      'Exception-finding questions — "Tell me about a time recently when the problem was a little less severe."',
      'Complimenting — genuinely affirming client strengths and resources observed during the session.',
      'Between-session tasks — "Do more of what is already working."',
      'Coping questions — "How have you managed to cope as well as you have despite all of this?"'
    ],
    counsellingApplication: 'Excellent for brief therapy contexts, schools, employee assistance programmes, crisis counselling, and when clients are reluctant or resistant. Works well across all presenting concerns and is culturally flexible. Typically 1–8 sessions.',
    limitations: 'May not be sufficient for severe trauma, complex PTSD, or deep-seated personality issues without integrating other approaches. Some clients find the focus on solutions invalidating when they need to process pain.'
  },
  {
    id: 'systemic',
    name: 'Systemic / Family Systems Theory',
    founder: 'Murray Bowen, Salvador Minuchin, Jay Haley (1950s–1970s)',
    category: 'Systemic',
    summary: 'Views individuals within the context of their family and social systems. Problems are understood as patterns of interaction within systems rather than individual pathology.',
    coreConcepts: [
      'The family is a system; changes in one part affect all other parts.',
      'Identified patient — the person presenting with symptoms may be expressing distress on behalf of the whole system.',
      'Triangulation — when tension between two people is relieved by involving a third person.',
      'Differentiation of self — the ability to maintain one\'s own identity and values within relationships.',
      'Enmeshment vs disengagement — overly close or overly distant family boundaries.',
      'Circular causality — problems are maintained by circular patterns of interaction rather than linear cause and effect.',
      'Genogram — a visual map of family relationships across three or more generations.'
    ],
    techniques: [
      'Genogram — mapping family relationships, patterns, and history across generations.',
      'Circular questioning — asking each family member how they think others see the problem.',
      'Reframing — offering alternative meanings to family behaviour and interaction patterns.',
      'Enactment — asking family members to demonstrate their typical interactions in the session.',
      'Boundary setting — helping families establish healthier levels of closeness and separateness.',
      'Positive connotation — reframing problematic behaviour as motivated by positive intentions.'
    ],
    counsellingApplication: 'Essential for couples counselling, family therapy, premarital counselling, parenting difficulties, and work with children and adolescents. Highly applicable in Nigerian and African cultural contexts where family is central to identity and wellbeing.',
    limitations: 'Requires all family members to attend, which can be logistically difficult. Less applicable for individuals working in isolation from their family system.'
  },
  {
    id: 'attachment',
    name: 'Attachment theory',
    founder: 'John Bowlby & Mary Ainsworth (1950s–1970s)',
    category: 'Psychodynamic',
    summary: 'Explores how early attachment relationships with caregivers shape emotional regulation, relational patterns, and psychological wellbeing across the lifespan.',
    coreConcepts: [
      'Secure attachment — a consistent, responsive caregiver creates a secure base for exploration and healthy development.',
      'Insecure attachment styles: Anxious (fearful of abandonment), Avoidant (dismissing of closeness), Disorganised (fearful-avoidant).',
      'Internal working models — mental representations of self and others formed through early attachment experiences.',
      'The secure base — a therapist who is consistent, attuned, and emotionally available can provide a corrective attachment experience.',
      'Affect regulation — securely attached individuals develop better capacity to manage emotions.',
      'Attachment patterns are activated in times of stress and are reflected in adult romantic relationships.'
    ],
    techniques: [
      'Exploring attachment history — understanding early relational experiences with caregivers.',
      'Identifying attachment patterns — linking early experiences to current relational difficulties.',
      'Therapist as secure base — maintaining consistency, attunement, and reliability in the therapeutic relationship.',
      'Emotion regulation skills — helping clients manage intense emotions that arise in attachment contexts.',
      'Adult Attachment Interview (AAI) — structured interview assessing attachment representations.',
      'Integrating with EFT (Emotionally Focused Therapy) for couples work.'
    ],
    counsellingApplication: 'Foundational for understanding relationship difficulties, couples counselling, parenting work, trauma, grief, and personality disorder treatment. The most important developmental framework for understanding how early experiences shape adult mental health.',
    limitations: 'Not a standalone therapy model. Works best when integrated with other approaches such as CBT, EFT, or psychodynamic therapy.'
  },
  {
    id: 'act',
    name: 'Acceptance and Commitment Therapy (ACT)',
    founder: 'Steven Hayes (1980s–1990s)',
    category: 'Third-Wave CBT',
    summary: 'Part of the third wave of CBT. Focuses on psychological flexibility — the ability to accept difficult thoughts and feelings while committing to values-based action.',
    coreConcepts: [
      'Psychological flexibility — the ability to be present, open to experience, and act according to values.',
      'Cognitive defusion — creating distance from unhelpful thoughts rather than challenging their content.',
      'Acceptance — willingness to experience difficult thoughts and feelings without struggling against them.',
      'Present-moment awareness — mindfulness of current experience without judgement.',
      'Self-as-context — observing oneself from a stable perspective beyond thoughts and feelings.',
      'Values — identifying what matters most and using this as a compass for action.',
      'Committed action — taking concrete steps aligned with values even in the presence of discomfort.'
    ],
    techniques: [
      'Defusion exercises — "I am having the thought that..." or watching thoughts like clouds passing.',
      'Mindfulness exercises — present-moment awareness practices.',
      'Values clarification — identifying personal values across life domains.',
      'Acceptance exercises — willingness exercises to open up to difficult emotions.',
      'Metaphors — the Quicksand metaphor, Leaves on a Stream, Passengers on a Bus.',
      'Committed action planning — setting values-based behavioural goals.',
      'The Matrix — a visual tool mapping toward/away moves in relation to values and barriers.'
    ],
    counsellingApplication: 'Highly effective for chronic pain, anxiety, depression, OCD, addiction, and stress. Particularly useful when clients are caught in experiential avoidance or fusion with unhelpful thoughts. Growing evidence base. Integrates beautifully with mindfulness and CBT.',
    limitations: 'The language and metaphors can feel abstract or confusing to some clients. Requires therapist training in ACT-specific processes.'
  }
]

const CATEGORIES = ['All', 'Psychodynamic', 'Cognitive-Behavioural', 'Humanistic', 'Postmodern', 'Systemic', 'Third-Wave CBT']

export default function TheoriesPage() {
  const [search, setSearch]         = useState('')
  const [expanded, setExpanded]     = useState<string[]>([])
  const [activeCategory, setActive] = useState('All')

  function toggle(id: string) {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const filtered = THEORIES.filter(t =>
    (activeCategory === 'All' || t.category === activeCategory) &&
    (search === '' ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.founder.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Psychological theories</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {THEORIES.length} major counselling theories — founders, core concepts, techniques, and clinical application.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" className="input pl-9 text-sm"
          placeholder="Search theories by name, founder, or approach..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActive(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${activeCategory === cat ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6 flex gap-3">
        <BookOpen className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-brand-700 leading-relaxed">
          Each theory includes core concepts, therapeutic techniques, and counselling application guidance. Click <strong>Full details</strong> on any theory to expand the complete framework.
        </p>
      </div>

      {/* Theory cards */}
      <div className="space-y-3">
        {filtered.map(theory => {
          const isExpanded = expanded.includes(theory.id)
          return (
            <div key={theory.id} className={`card border transition-all ${isExpanded ? 'border-brand-200' : 'border-gray-200'}`}>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold">{theory.name}</h3>
                    <span className="badge badge-blue text-[10px] flex-shrink-0">{theory.category}</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">Founded by: {theory.founder}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{theory.summary}</p>
                </div>
              </div>

              {/* Expand button */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                <button onClick={() => toggle(theory.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-medium transition-colors border border-gray-200">
                  {isExpanded
                    ? <><ChevronUp className="w-3 h-3" /> Collapse</>
                    : <><ChevronDown className="w-3 h-3" /> Full details — concepts, techniques & application</>}
                </button>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-5">
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-2">Core concepts</div>
                    <ul className="space-y-1.5">
                      {theory.coreConcepts.map((c, i) => (
                        <li key={i} className="flex gap-2 text-xs text-gray-500 leading-relaxed">
                          <div className="w-4 h-4 rounded-full bg-brand-50 text-brand-500 text-[9px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</div>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-2">Therapeutic techniques</div>
                    <ul className="space-y-1.5">
                      {theory.techniques.map((t, i) => (
                        <li key={i} className="flex gap-2 text-xs text-gray-500 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 flex-shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-brand-50 rounded-xl border border-brand-100">
                    <div className="text-xs font-semibold text-brand-700 mb-1.5">Counselling application</div>
                    <p className="text-xs text-brand-700 leading-relaxed">{theory.counsellingApplication}</p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="text-xs font-semibold text-amber-700 mb-1.5">Limitations & considerations</div>
                    <p className="text-xs text-amber-700 leading-relaxed">{theory.limitations}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No theories found for &quot;{search}&quot;</p>
          </div>
        )}
      </div>
    </div>
  )
}
