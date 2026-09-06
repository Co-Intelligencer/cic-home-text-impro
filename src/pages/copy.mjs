const guest = 'Guests join free in their browser with a link or six-digit room code. Hosting requires an account.';
const retention = 'Saved recordings are automatically deleted after a period of time to reduce server costs. You can export them or delete them sooner.';
const liveMilo = "Milo listens alongside your group in real time and contributes when the talking stick reaches its seat, or when its name is called in an open round.";
const video = "Video and audio are encrypted in transit and relayed live through Cloudflare's realtime network. The host chooses when recording starts.";
const setup = 'Name your room, choose clockwise, counterclockwise, or open turns, and set an optional turn timer.';
const sharedHow = {
  h20: 'Give each person a <em>full turn</em>.', h21: 'Follow the conversation <em>together</em>.',
  p3: 'The person holding the talking stick has the speaking turn. Choose clockwise or counterclockwise rounds, or an open round for free conversation. An optional timer helps your group keep the pace you agree on. Taking turns gives quieter voices room and makes listening part of the practice.',
  p4: 'Pass the stick, choose a direction, or open the round.',
  p5: '<strong>Demo.</strong> Try the speaking order with placeholder photos and audio.',
  p7: 'Use circles for supervision, intervision, team reflection, councils, community groups, and classrooms. Choose the practice that fits the people you bring together.',
  p8: 'Following the speaking turn',
  p9: 'The room shows who holds the stick and who comes next. A shared speaking order helps your group give each person time and attention.',
  dt0: 'A shared speaking order', dd0: 'Everyone follows the same room state, including who holds the stick and where it can pass next.',
  dt1: 'You control your microphone', dd1: 'Passing the stick mutes your microphone by default. You can unmute yourself when you need to speak; the talking stick supports an agreement to take turns.',
  dt2: 'When someone disconnects', dd2: 'If the speaker disconnects, the stick returns to the shared center after fifteen seconds. Switching browser tabs preserves the turn.',
  dt3: 'Live video and recording', dd3: video
};
const sharedPhilosophy = {
  h10: 'Make room for <em>deep listening</em>.', h20: 'A practice you <em>share</em>.',
  h21: 'Hear what each person <em>brings</em>.', h22: 'Gather around a <em>shared center</em>.',
  p3: 'Talking-piece practices appear in council work, Quaker meetings, restorative justice, and supervision groups. People sit where they can see each other, an object marks the speaking turn, and the group agrees to listen.',
  p4: 'Co-Intelligence Circle brings that practice online. Your group chooses a speaking order and passes a visible talking stick. How you listen to each other gives the structure its meaning.',
  p5: 'Bring an old practice into your next conversation.',
  p6: 'What listening can make possible',
  p7: "Each person brings experience, intuition, and knowledge. A full speaking turn gives those perspectives time to meet the group's collective intelligence. Through deep listening and trust, make room for higher wisdom to emerge.",
  p8: 'Coherence takes practice. The shared understanding you develop can save time in later collaboration and help your group work with greater trust and peace of mind.',
  p10: "The shared center gives your group a common point of attention. Choose what belongs there for your circle and let it support the conversation's purpose.",
  blockquote0: 'Bring an old practice into your next conversation.'
};
const sharedFacilitators = {
  h10: 'Give your group your <em>full attention</em>.', h20: 'A room for your <em>practice</em>.', h21: 'Prepare your next <em>session</em>.',
  h30: 'Your clients join free', h31: 'Join in a browser', h34: 'Prepare the room', h35: 'Share a link or room code', h36: 'Stay with the conversation',
  p2: 'How the room supports your work', p3: 'Clients join through your room link on each plan, including Free. You hold the hosting account.',
  p4: 'Clients open your invitation link in their browser.',
  p8: setup, p9: 'Clients can open the invitation link or enter a six-digit room code in their browser.',
  p10: 'The visible talking stick shows who has the turn. You can give your attention to the speaker and guide the group.'
};
const sharedTherapists = {
  h10: 'Give each person <em>time to finish</em>.', h20: 'Structure for <em>attentive group work</em>.', h21: 'Set up the room for <em>your group</em>.',
  h22: 'Practical questions for your <em>practice</em>.', h23: 'Try a circle with your <em>group</em>.',
  h30: 'See who has the speaking turn', h31: 'Make room for a full thought', h32: 'Guests join in their browser', h33: 'Choose when recording starts',
  h35: 'Choose the tools your practice needs', p3: 'The visible talking stick shows who is speaking. Use the speaking order to help your group listen and take turns.',
  p4: 'Give each speaker time to finish, with an optional timer to guide the pace. Leave room for silence when the group needs it.',
  p5: guest, p7: 'Preparing the room', p8: 'Paid plans include named rooms that keep their links. Use a separate room for each recurring group.',
  p10: 'Set the speaking order, optional timer, and shared center before the group arrives. During the session, use the talking stick to guide the turns.',
  p12: '', p14: 'On a plan that includes recording, the host chooses when it starts. ' + retention, p15: video, p16: guest,
  p17: 'Co-Intelligence Circle is a talking-stick video room. It is not a medical device or certified clinical system. You are responsible for assessing its clinical and legal suitability for your work.',
  p19: 'Create a free hosting account and invite your group. Clients join through a link or six-digit room code.'
};

export const pageCopy = {
  'how-it-works': {
    title: { human: 'How to hold an online talking circle', ai: 'How to bring people and AI into a circle' },
    description: { human: 'Prepare a room, invite your people, and practice deep listening with a visible talking stick and a shared speaking order.', ai: 'Hold an online talking circle with Milo participating in real time. Explore speaking turns, live translation, and circle setup.' },
    shared: sharedHow,
    human: {
      h10: 'Give each voice<br><em>time and attention</em>.', h22: 'Prepare your first <em>circle</em>.', h23: 'Bring your people <em>together</em>.',
      p1: "Bring personal insight and collective intelligence into a shared conversation. A visible talking stick, full speaking turns, and time for silence support your group's practice of listening.",
      p10: 'Name the circle, set an optional timer, and prepare a shared center.', p11: guest,
      p12: 'Give each person time to finish. Leave room for silence before the next voice begins.'
    },
    ai: {
      h10: 'Bring people and AI into<br><em>one conversation</em>.', h22: 'Invite another <em>perspective</em>.',
      h23: 'Prepare your first <em>circle</em>.', h24: 'Understand your <em>AI credits</em>.', h25: 'Start a conversation <em>together</em>.',
      h30: 'An AI participant in real time.', h31: 'Listen across languages.',
      p1: 'Gather your people and invite Milo to take part in the live conversation. A visible talking stick helps the group follow each turn, and live translation lets listeners choose a language.',
      p10: liveMilo, p11: 'Milo uses 1 credit per active minute, when it speaks or holds the stick. A single purchased credit costs €0.10. When credits run out, Milo leaves and your group continues talking.',
      p12: "Each listener chooses a language. They hear a translated voice with the speaker's original voice softly present underneath. Translation quality varies by language pair.",
      p13: 'Live translation uses 2 credits per listener per active minute. Each listener chooses when to enable it, and the room shows a usage counter.',
      p14: "Name your room and set an optional timer. In the circle settings, you can adjust Milo's role to suit your conversation.",
      p15: guest, p16: 'Give each person a full turn. Invite Milo to join when your group wants another perspective.',
      p17: 'Begin with free video circles. Paid plans start at €12 per month. Try your first paid plan free for 7 days.',
      p18: '<strong>0 AI credits</strong><span>Human circles use participant-hours</span>',
      p19: '<strong>1 credit / minute</strong><span>Milo, per active minute</span>',
      p20: '<strong>2 credits / minute</strong><span>Translation, per listener</span>',
      p21: '<strong>€12</strong><span>Paid plans start here, per month</span>'
    }
  },
  philosophy: {
    title: { human: 'Deep listening and collective wisdom', ai: 'Human connection with AI invited' },
    description: { human: 'Explore how personal insight, collective intelligence, deep listening and trust can help a group find coherence.', ai: 'Explore a circle practice grounded in human connection, with an AI participant invited into the live conversation.' },
    shared: sharedPhilosophy,
    human: {
      p1: 'Bring what you know, feel, and sense into the circle. Shared speaking turns create time to listen, reflect, and discover what your group understands together.',
      h23: 'Know how your conversation is <em>handled</em>.', h24: 'A shared practice, <em>online</em>.', h25: 'Experience the practice <em>together</em>.',
      p12: video + ' ' + retention, p14: 'From gathering to online circle', p15: 'Keep the speaking turn, the shared center, and the practice of listening when your group meets online.'
    },
    ai: {
      p1: 'Human connection shapes the circle. Invite AI to take part in real time when its contribution serves the conversation your group wants to have.',
      h23: 'Invite AI into the <em>conversation</em>.', h24: 'Know how your conversation is <em>handled</em>.',
      h25: 'A shared practice, <em>online</em>.', h26: 'Experience the practice <em>together</em>.',
      p12: liveMilo, p13: "Your group chooses when Milo joins. Its published instructions describe its name, voice participation, and speaking language. When credits run out, Milo leaves while the human conversation continues.",
      p15: video + ' ' + retention + ' An invited AI feature processes the audio it needs while active.',
      p17: 'From gathering to online circle', p18: 'Keep the speaking turn, the shared center, and the practice of listening when your group meets online.'
    }
  },
  about: {
    title: { human: 'The people behind Co-Intelligence Circle', ai: 'The people building Co-Intelligence Circle' },
    description: { human: 'Meet Nadim and Frederik, bringing facilitation practice and software design together for online talking circles.', ai: 'Meet Nadim and Frederik, bringing circle practice, realtime software, and invited AI participation together.' },
    shared: {
      h10: 'A facilitator and a builder,<br><em>working together</em>.', h22: 'A Poetic Design <em>project</em>.', h23: 'Bring your people into a <em>circle</em>.',
      p1: 'Nadim brings his experience of holding circles. Frederik builds the software that carries the practice online. Co-Intelligence Circle is a Poetic Design project.',
      p3: 'Nadim is a regenerative leadership consultant and consensus builder. His work has taken him through traditional industry, including Mercedes, Bayer, and Microsoft, and into council work, heart-sharing circles, and consensus practices in organizations.',
      p4: 'He brings that facilitation experience to the room: a visible talking stick, a speaking order the group chooses, and a shared center.',
      p6: 'Frederik runs Poetic Design, a studio for web architecture. He shapes the interface around the conversation, with a shared center and controls that support the circle practice.',
      p9: 'Co-Intelligence Circle is a Poetic Design project funded by its plans. To talk with us, write to <a href="mailto:contact@poetic-design.net">contact@poetic-design.net</a>.'
    },
    human: { p7: 'He builds the online room, the talking stick, and the shared center that your group gathers around.' },
    ai: { p7: 'He builds the realtime rooms, speaking turns, live translation, and the features that let Milo join the conversation.' }
  },
  learner: {
    title: { human: 'Research into listening | The Learner', ai: 'The Learner | Research into AI and listening' },
    description: { human: 'Learn about a private research cohort studying listening, with participant consent and human stewardship at the center of its design.', ai: 'The Learner is a private AI research project exploring listening, silence and attention through consenting circle cohorts.' },
    shared: {
      h20: 'What can be learned from <em>listening</em>?', h21: 'Four questions for the <em>research</em>.', h22: 'An observing <em>seat</em>.',
      h23: 'A record for <em>human stewards</em>.', h24: 'Four research <em>commitments</em>.', h25: 'Before you <em>take part</em>.',
      h26: 'Join a future <em>cohort</em>.', h27: 'Hold a circle <em>today</em>.',
      h31: 'When does a conversation need silence?', h32: 'What need sits behind the words?', h33: 'How do people express the sacred?',
      p2: 'The research question',
      p3: 'Some of what matters in a conversation is difficult to capture in text: a pause, hesitation, grief, or a change in how a group listens. The Learner studies attention through a small, private cohort of circles and human stewards.',
      p5: 'These questions are open research. Answers and delivery dates are still to be determined.',
      p6: 'A pause can express reflection, hesitation, grief, agreement, or refusal. The research asks how context helps people understand those differences.',
      p7: 'Sometimes the useful contribution is silence. The research explores how an intelligence might recognize when listening serves the group.',
      p8: 'People may be seeking understanding, permission to grieve, or a sense of being heard. The research explores these possibilities with care for context and the limits of interpretation.',
      p9: 'Circles can hold spiritual and deeply personal experiences. The research asks how an intelligence might recognize the care those conversations call for.',
      p10: 'Participation in a research circle',
      p11: 'The research design gives the Learner a visible observing seat. It listens with participant consent and takes no speaking turn.',
      p12: 'Consent is requested for each session, including from guests. Any participant can pause listening, and the facilitator can end it.',
      p14: 'The research design calls for a ledger identifying retained material, its source session, and the consent attached to it. Human stewards review entries and request reversals. Removing what a model has learned remains part of the research commitment.',
      p15: 'The project runs in a small private cohort of circles and their stewards.',
      p16: 'These commitments guide the research design and the responsibilities of its stewards.',
      p18: 'The Learner is limited to a private research cohort. Participation requires an invitation and consent from everyone in each session.',
      p19: 'Its research seat is for observation. It listens with consent and takes no speaking turn.',
      p20: 'The circle and its stewards review retained material through the Learning Ledger and can request changes or deletion.',
      p21: 'Any participant can pause listening, and the facilitator can end it. Consent is requested again for each session.',
      p22: 'The project studies how an intelligence might listen with people. Its stated research commitments exclude selling or licensing retained material and using it for advertising.',
      p24: 'A cohort brings together a small number of circles and the stewards who review their ledgers. Register your interest to hear about future cohorts.',
      p26: 'The Learner is a research project. You can use Co-Intelligence Circle for ordinary conversations independently of the cohort.',
      dt0: 'An observing seat', dd0: 'The research design limits the seat to listening and excludes speaking, scoring, ranking, and nudging participants.',
      dt1: 'Consent from each participant', dd1: 'Each person, including guests, sees what would be shared and decides whether to agree before listening begins.',
      dt2: 'Review and reversal', dd2: 'Stewards can review retained material and request its removal. Reversing learned information is a research commitment that requires evaluation.',
      dt3: 'Study the practice of listening', dd3: 'The research focuses on how listening works. Its stated commitments exclude building participant profiles or using one circle as the subject of another.'
    },
    human: { h10: 'A study of <em>listening and attention</em>.', p1: 'The Learner is an AI research project in a private cohort. Its design centers on consent from each participant, visible observation, and review by human stewards.' },
    ai: { h10: 'Can AI learn to <em>listen with people</em>?', p1: 'The Learner explores this question through a private research cohort. Its observing seat listens with consent from every participant, while human stewards review what the project retains.' }
  },
  features: {
    title: { human: 'Tools for your online circle', ai: 'Circle tools, Milo and live translation' },
    description: { human: 'Explore speaking turns, room controls, recording, and features for facilitators. See which tools are available and which are planned.', ai: 'Explore circle tools, Milo, live translation, and transcription. See availability, plan requirements, and beta details.' },
    shared: {
      p0: 'See which tools are available, which plans include them, and what is still in development.',
      p1: 'A visible talking stick shows who has the speaking turn.', p2: 'Follow a speaking order or open the round for free conversation.',
      p3: 'Choose clockwise or counterclockwise turns.', p4: 'Raise a hand to ask for a turn. The speaker can pass the stick to a raised hand.',
      p5: 'Use a visible timer to guide the pace of each turn.', p6: guest, p7: 'See your group around a shared center.',
      p9: 'Keep a named room and its invitation link for a recurring group.', p10: 'Plan a circle, find a time together, and invite your group.'
    },
    human: { h10: 'Tools for your <em>circle</em>.', p11: 'The host chooses when recording starts. ' + retention, p16: 'Add your room name, logo, and visual identity. This feature is in development.' },
    ai: {
      h10: 'People and AI, in one <em>circle</em>.', p11: liveMilo,
      p12: 'Prepare how Milo will take part before your circle. See the setup guide for details.',
      p13: "Choose a listening language and hear the translation with the speaker's original voice softly present underneath.",
      p14: 'Create a written transcript while the feature is active.', p15: 'The host chooses when recording starts. ' + retention,
      p20: 'Add your room name, logo, and visual identity. This feature is in development.',
      p21: 'Live translation is available in beta. Quality varies by language pair, and availability may change during improvements. It uses credits for active minutes. If translation pauses, the circle continues in the original voices.',
      p22: 'Features marked Coming soon are in development. They are excluded from the features currently included in paid plans.',
      p23: 'See <a href="/pricing">plans and pricing</a>, or <a href="mailto:contact@poetic-design.net">contact us</a> about a feature.'
    }
  },
  'for--facilitators': {
    title: { human: 'Online circles for facilitators and coaches', ai: 'Circles with AI for facilitators and coaches' },
    description: { human: 'Hold online talking circles for your practice. Give clients time to speak, listen, and build shared understanding.', ai: 'Hold online talking circles with Milo participating in real time and optional live translation for your clients.' },
    shared: sharedFacilitators,
    human: {
      h22: 'The practical <em>details</em>.', h23: 'Bring your next group into a <em>circle</em>.',
      h32: 'Choose when recording starts', h33: 'A plan for human circles',
      p1: "Give each person's insight time to meet the group's collective intelligence. An online talking circle helps your clients speak, listen, and reflect together.",
      p5: 'You choose when recording starts. The room shows your group when it is active.', p6: 'Starter includes video circles, a talking stick, and optional turn timers. Review the plan and privacy details for your practice.',
      p12: 'Paid plans include named rooms that keep their links. Share the same room link with your recurring group.',
      p13: 'Show the group who holds the talking stick and how to pass it. Use the first round to practice taking turns.',
      p14: 'The host chooses when recording starts. Your group can see when recording is active.',
      p15: 'Some paid plans support parallel rooms. Contact us to confirm the number of simultaneous circles your practice needs.',
      p17: 'Create a free hosting account, prepare your room, and share the invitation. Your clients join free.'
    },
    ai: {
      h22: 'Invite AI into your <em>practice</em>.', h23: 'The practical <em>details</em>.', h24: 'Bring your next group into a <em>circle</em>.',
      h32: 'Choose which features join', h33: 'Choose a plan for your practice',
      p1: 'An online talking circle for the groups you guide. Invite Milo to listen and contribute in real time while your clients share their experience and insight.',
      p5: 'Recording, transcription, and Milo start when enabled. The room shows everyone which features are active.',
      p6: 'Starter supports human circles. Choose Basic, Pro, or Studio to explore Milo and live translation.',
      p12: liveMilo + ' Each listener can choose live translation when your group meets across languages.',
      p14: 'Paid plans include named rooms that keep their links. Share the same room link with your recurring group.',
      p15: 'Show the group who holds the talking stick and how to pass it. Use the first round to practice taking turns.',
      p16: 'Your group can see which features are active. You choose when to invite Milo and when recording or transcription begins.',
      p17: 'Some paid plans support parallel rooms. Contact us to confirm the number of simultaneous circles your practice needs.',
      p19: 'Create a free hosting account, prepare your room, and share the invitation. Your clients join free.'
    }
  },
  'for--therapists': {
    title: { human: 'Online circles for therapists and group practices', ai: 'Circle tools for therapists and group practices' },
    description: { human: 'A talking-stick video room for structured group conversations, visible speaking turns, and time to listen and reflect.', ai: 'Explore a talking-stick video room and optional AI participation. Review recording controls and suitability for your practice.' },
    shared: sharedTherapists,
    human: {
      p1: 'A talking-stick video room for structured group conversations. Set a clear speaking order and give each person time to share, listen, and reflect.',
      p6: 'The host starts recording, and the room shows when it is active.',
      p9: 'Starter includes human circle tools. Review the plan and privacy details before choosing a room for sensitive work.',
      p13: 'Starter supports human circles with transcription disabled at plan level. Review the privacy details for the plan your practice chooses.'
    },
    ai: {
      p1: 'A talking-stick video room for structured group conversations. Decide whether Milo takes part in real time, and make those choices visible to your group.',
      p6: 'The host starts recording, and the room shows when it is active. Enabled AI features process audio while the group can see they are running.',
      p9: 'Starter supports human circles. Other plans offer AI participation and transcription. Review each plan and the privacy details for your practice.',
      p13: 'Starter disables transcription at plan level. On plans that include transcription, it begins when enabled, and the room shows when it is active.'
    }
  },
  'who-its-for': {
    title: { human: 'Circles for facilitators, teams and communities', ai: 'Human and AI circles for your group' },
    description: { human: 'Bring talking circles into facilitation, teamwork, education, and community life. Give each voice time and build shared understanding.', ai: 'Explore live AI participation and translation in circles for facilitators, teams, educators, and communities.' },
    shared: {
      h10: 'For the people you <em>bring together</em>.', h20: 'A circle for your <em>group</em>.',
      h21: 'Give your practice your <em>attention</em>.', h22: 'Hear the perspectives your <em>team holds</em>.',
      h23: 'Different conversations.<br>A shared <em>practice</em>.', h24: 'Give learners room to <em>speak and listen</em>.',
      h25: 'Make the practice <em>your own</em>.', h26: 'Bring your people into a <em>circle</em>.',
      p2: 'A circle supports the conversation your group wants to have.',
      p4: 'Hold supervision and intervision groups, councils, community circles, and conversations around grief. Guests join free in their browser, while a visible talking stick supports the speaking order you choose.',
      p6: 'Use rounds for team reflection, conflict conversations, decision check-ins, and weekly meetings. Hear the experience each person brings and build understanding your team can act on.'
    },
    human: {
      p1: 'Bring personal insight and collective intelligence into your practice, team, or classroom. Guests join free, with time to speak and space to listen.',
      p8: 'Bring learners and community members together around a shared question. Give each voice a full turn and let silence be part of the conversation.',
      p10: 'Choose a speaking order, give each person time, and listen for what emerges between you. The group gives the circle its meaning.'
    },
    ai: {
      p1: 'Bring your people together and invite Milo to participate in real time. Explore circles for your practice, team, classroom, or community, with guests joining free.',
      p8: 'Hold seminars, community councils, and conversations across languages. Invite Milo to contribute, and let each listener choose live translation when useful.',
      p10: 'Your group chooses the speaking order and when AI joins. Give human voices and the invited AI time to contribute to a shared question.'
    }
  },
  pricing: {
    title: { human: 'Pricing for online talking circles', ai: 'Pricing for circles, Milo and translation' },
    description: { human: 'Compare plans for online talking circles. Guests join free; paid plans add room for larger groups, longer sessions, and recording.', ai: 'Compare plans, participant-hours, and AI credits for circles with Milo and live translation.' },
    shared: { h10: 'Choose a plan for your <em>circles</em>.' },
    human: { h20: 'Choosing and managing a <em>plan</em>.', p1: 'Guests join free. Begin with video circles, then choose a paid plan for more people, longer sessions, or more participant-hours. Try your first paid plan free for 7 days and cancel anytime.', p24: guest, p25: 'Upgrades apply immediately. Downgrades take effect at the end of the period you paid for.' },
    ai: {
      h20: 'Examples of <em>credit use</em>.', h21: 'Choosing and managing a <em>plan</em>.',
      h30: 'Your AI credits', h31: '60 minutes with Milo active throughout.', h32: '45 minutes, with Milo active for 20 and one translated listener.', h33: '90 minutes of human conversation.',
      p1: 'Guests join free. Choose a plan for circles with Milo, live translation, recording, or transcripts. Try your first paid plan free for 7 days and cancel anytime.',
      p22: 'Human circles use participant-hours and 0 AI credits.',
      p23: '<strong>1 credit = €0.10</strong><span>The price of one separately purchased credit.</span>',
      p24: '<strong>Milo: 1 credit / minute</strong><span>Per active minute, when Milo speaks or holds the stick.</span>',
      p25: '<strong>Translation: 2 credits / minute</strong><span>Per listener, while translation is active.</span>',
      p26: '<strong>Human circle: 0 AI credits</strong><span>Video circles use participant-hours.</span>',
      p27: 'Prices include VAT · annual billing includes 2 months free · purchased credits carry over · plan credits reset monthly',
      p28: 'Credits cover active AI use. These examples show the cost of Milo and translation; participant-hours are counted separately.',
      p29: '<strong>60 credits</strong><span>€6 at the standalone credit price</span>', p30: '<strong>110 credits</strong><span>€11 at the standalone credit price</span>', p31: '<strong>0 AI credits</strong><span>Uses participant-hours</span>',
      p32: 'Purchased credits can be used for Milo and translation. Review the plan details for recording and breakout rooms.',
      p34: 'Plan credits reset each month. Purchased credits carry over and are used after your plan credits.',
      p35: guest + ' You can enable translation for listeners when it is included in your plan.',
      p36: 'Your group continues in Human Mode. Milo leaves and translation pauses. You choose whether to purchase more credits.',
      p37: 'Upgrades apply immediately. Downgrades apply at the next renewal.'
    }
  },
  join: {
    title: { human: 'Join your talking circle', ai: 'Join your circle' },
    description: { human: 'Join your group using the six-digit room code from your facilitator.', ai: 'Join your group using the six-digit room code from your facilitator.' },
    shared: { h10: 'Join your <em>circle</em>.', p1: 'Use the six-digit room code your facilitator shared with you. Guests join free in their browser.', p2: 'If your facilitator sent an invitation link, open that link to join.' }, human: {}, ai: {}
  },
  login: {
    title: { human: 'Sign in to host a circle', ai: 'Sign in to host a circle' },
    description: { human: 'Sign in or create an account to host Co-Intelligence circles.', ai: 'Sign in or create an account to host Co-Intelligence circles.' }, shared: {}, human: {}, ai: {}
  },
  imprint: {
    title: { human: 'Provider information', ai: 'Provider information' },
    description: { human: 'Provider and contact information for Co-Intelligence Circle, operated by Poetic Design LLP.', ai: 'Provider and contact information for Co-Intelligence Circle, operated by Poetic Design LLP.' },
    shared: { p7: 'Website content may contain errors or become outdated. Operators of external websites are responsible for their own content.' }, human: {}, ai: {}
  },
  privacy: {
    title: { human: 'Privacy and your conversation', ai: 'Privacy and AI participation' },
    description: { human: 'How live video and recordings are handled, with contact details for privacy questions.', ai: 'How live video, recordings, and invited AI features handle conversation audio.' },
    shared: { h10: 'Privacy and your <em>conversation</em>.' },
    human: { p1: video + ' ' + retention },
    ai: { p1: video + ' ' + retention + ' Active AI features process audio through OpenAI for Milo, translation, or transcription.' }
  },
  terms: {
    title: { human: 'Terms of service', ai: 'Terms of service' },
    description: { human: 'Availability of the terms of service and contact details for questions.', ai: 'Availability of the terms of service and contact details for questions.' },
    shared: { p1: 'The full terms of service are being prepared. Contact Poetic Design with questions before using the service.' }, human: {}, ai: {}
  }
};
