# IdeaOrbits Design Guide

Let ideas be expressed without frustration.

This is the design guide for IdeaOrbits. It does not cover specific implementation details. The beginning of each chapter (first- and second-level headings) introduces the chapter or articulates its design philosophy, for reference. The guide is currently a draft; the website has not yet launched, and both writing and implementation are in progress (Chacka Lab is currently just me -- when I say "we," it's because I hope Chacka Lab will grow to include more people). Implementation progress: core modules and architecture have been finalized [...]

GitHub repository (for future use): https://github.com/Chacka-Lab/ideaorbits

Currently seeking contributors to help design website details and write code (open-source non-profit project, no pay -- sorry)

Or do you have opinions or counterarguments? Completely welcome -- thank you for your contribution!

Contact me directly: yananghelp@outlook.com


### Notes

`ITPCS System`: Abbreviation for the Idea-Topic-Post-Content-Section System.
`I.`: Abbreviation for Idea.
`S.`: Abbreviation for Section.
`To.`: Abbreviation for Topic.
`Pos.`: Abbreviation for Post.
`Cont.`: Abbreviation for Content.


## Community Atmosphere & Design Philosophy

Maintaining a healthy community atmosphere has always been a challenge. Most professional communities address this by raising entry barriers and harshly penalizing low-quality content. Whatever the approach, I've never been particularly fond of that.

Imagine this scenario: a person suddenly has a brilliant idea and shares it in a general community, but nobody pays attention. So they turn to professional communities. One says: "To join us, you need a GitHub account registered for at least 3 years." Another says: "You need to find an existing member in a general community to give you an invite code." Yet another says: "You need to write a detailed explanation of why you want to join and what value you bring -- and it will most likely be rejected." Then a niche professional community says: "You just need to read enough articles and interact enough before you can post!" "Perfect -- that's the one," he thinks, and excitedly registers, spends hours completing the onboarding tutorial and interaction requirements, successfully posts his idea, and waits for replies. A few hours later, a reply comes in -- but just as he's about to respond, the forum's fraud detection triggers, requiring him to wait 24 hours before posting again... At this point, I imagine his spirit is thoroughly crushed. And many people probably give up long before reaching this stage. You might wonder why I describe this so vividly -- because the protagonist is me.

You might think: fine, some communities do have high entry barriers, but cracking down on low-quality content is reasonable, isn't it? Yes -- I hate low-quality content too. But where exactly is the line? Imagine someone in a community asks: "Could we give AI genuine free will to make it smarter?" Most people would consider this worthless, unnecessary to discuss, naive. But what about: "Could we do decentralized accounting?" Is that question also naive? Someone might counter: "Satoshi released a complete whitepaper." True -- but my point is that every polished idea originates from a tiny seed like "could we do decentralized accounting?" Developing an idea alone is mostly a matter of courtesy (not wasting others' time) -- or simply because no one else wants to join. One person's energy and perspective are always limited. Since we already have the internet, why not share our insignificant little ideas for everyone to explore and refine together -- letting bad ideas be eliminated faster, letting good ideas no longer be buried? If IdeaOrbits truly existed, perhaps its design guide would need only a single sentence.

In short, what we aspire to is "letting ideas be expressed without frustration." This does not mean we must protect truly low-quality or malicious expression -- because permitting such expression would harm the positive, idea-inspiring discourse we want to foster. In other words, if you understand this statement with a holistic view, you're on the right track.


### Complex or Simple?

On this question, our stance is: complex but practical, and optional. Features can be numerous and intricate, but the core functionality must remain easily accessible and guided by pragmatism -- learn a feature when you need it. We refuse to sacrifice genuinely useful features in the name of so-called "simplicity."


### Governance

Supporting the features described above and below requires significant manpower, so extensive community governance is necessary (see the Rights System chapter). Beyond the guidance of the staff team, what matters most is this positive cycle: excellent members => govern the community => new members become excellent members => govern the community => ... However, once community member quality declines, this cycle will rapidly reverse. The problems involved cannot be fully anticipated at the draft stage -- they'll need to be addressed one by one after official launch.

"Excellent members" here refers to those who understand and are willing to follow the community's philosophy of exchange. At the same time, we must be vigilant against excessive homogeneity: prescribed forms of address, dictatorial leadership, over-purification of the membership, and so on. These must be firmly resisted -- not just in words. The community must accommodate differing opinions; what we reject is only low-quality and malicious content.

If you've read this far, you may well be the kind of "quality member" we're looking for. Feel free to share your thoughts.


## Content Hierarchy System (ITPCS System)

Flexible, versatile, reusable hierarchy: one improvement benefits everywhere; one reference connects everywhere.

All 5 levels listed below can be precisely located via URL.


### Idea(s)

The top-level independent structure, with its own dedicated page. Used to aggregate and advance Topics and evolve Ideas. Most content on an Idea's page derives from its subordinate Topics.

- Status: Open | Pinned | Archived | Closed.

  Open: Normal status -- browsing, advancing, and sharing are welcome.

  Pinned: Typically used for temporary or non-evolving discussions. Excluded from public listings by default, with the evolution feature disabled.

  Archived: No longer worth advancing or modifying, but still worth reading. Write functions are restricted.

  Closed: No longer worth reading or advancing. Excluded from public listings by default, with write functions restricted.

- Owner: By default, the creator of an Idea automatically becomes its owner. Ownership may change due to violations, account deletion, voluntary transfer, or other reasons. The system does not record the original creator separately.

- Subordinates: Anyone may affiliate a Topic they own with any Idea. Once affiliated, that Topic becomes a subordinate of the Idea. The Idea's owner may establish reasonable rules governing affiliation. Owners are responsible for their Ideas, should review affiliation requests, and must provide clear responses. If an owner lacks the capacity to manage, they may invite contributors; high-value projects may also request editorial board involvement. If an owner persistently neglects their management obligations, the editorial board will forcibly transfer ownership or close the Idea.

  Note -- Under Article 2 of the 1996 WIPO Copyright Treaty (WCT):

  "Copyright protection extends to expressions and not to ideas, procedures, methods of operation or mathematical concepts as such."

  Therefore, others completing or researching an idea without permission does not infringe copyright. We protect the right of all users to freely build upon ideas, treating this as a fundamental right. That said, we still oppose low-quality and malicious content.


### Topic(s)

The secondary independent structure, with its own dedicated page. Used to mount and aggregate Posts. The earliest Post is automatically treated as the main content of the Topic.

- Status: As above.
- Owner: As above.
- Affiliation: Anyone may affiliate a Topic they own with any Idea. Before affiliating, ensure your Topic is sufficiently related to the Idea to warrant affiliation, and that it meets the Idea's affiliation requirements. If you are unsure, contact the owner first to confirm their agreement. If the owner does not respond clearly, contact the editorial board directly. Once you receive explicit approval from either the owner or the editorial board, you are no longer responsible for the affiliation.


### Post(s)

The object that carries Content and identity, which must be mounted to a Topic. A Post can carry multiple Contents; historical versions of Content can be viewed through the Version Machine.

- Owner: As above.

- Version Machine: Each time new Content is published, it is automatically assigned a version number -- a positive integer starting from 1 and incrementing by 1. Version numbers within a single Post are never reused. Any version can be marked as deprecated; a warning is displayed when viewing deprecated versions. A Post defaults to showing the highest-numbered non-deprecated version. If all versions are deprecated, the Post is displayed as deprecated.


### Content(s)

The object storing the body text and immutable information bound to it, which must be mounted to a Post.

- Author: When the user referenced as Author deletes their account, the Author attribute must become untraceable. Aside from this, all information in this object is prohibited from modification.
- Version number: Assigned by the Version Machine of the parent Post (see above).


### Section(s)

An authoritative governance structure created by the platform. Ideas and Topics can be associated with multiple Sections. Some associations require review. Certain special Sections may also have unique business-layer functions.

For example: Posts and Contents within Topics associated with the "Important" Section cannot be deleted; removing the association or deletion requires joint review by the section editor and the editor-in-chief / deputy editor-in-chief.

- Section Editor-in-Chief (also called the moderator): Directly assigned by the editorial board, responsible for managing the entire Section. Duties include but are not limited to: reviewing association requests, setting section rules, removing mismatched Ideas/Topics, inviting contributors... Each Section has at least one Editor-in-Chief.


### Deletion

None of the above structures can be self-deleted; deletion must go through a review process. If the content to be deleted significantly affects research, freedom of speech, or similar rights, the platform will refuse deletion in accordance with GDPR. The platform always accepts self-requested account deletion; once completed it is irreversible, and this action can anonymize author and owner information.

- Review -- Regarding Deletion: When the review process decides to delete content, it is immediately taken offline (visible only to the author). The content is deleted (irrecoverably) once the review is confirmed.

  Note -- Under Article 17(3) of the 2018 General Data Protection Regulation (GDPR):

  "Paragraphs 1 and 2 shall not apply to the extent that processing is necessary:

  (a) for exercising the right of freedom of expression and information;

  (b) for compliance with a legal obligation which requires processing by Union or Member State law to which the controller is subject or for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller;

  (c) for reasons of public interest in the area of public health in accordance with points (h) and (i) of Article 9(2) as well as Article 9(3);

  (d) for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes in accordance with Article 89(1) in so far as the right referred to in paragraph 1 is likely to render impossible or seriously impair the achievement of the objectives of that processing; or

  (e) for the establishment, exercise or defence of legal claims."

  This policy is established accordingly, ensuring that important information on the platform remains stable and traceable while safeguarding fundamental rights.


## Toolset

Tools that don't affect the core workflow but significantly improve the user experience.

### Curation Tool

Within a single Topic, select Posts with specified citation relationships and display them according to filtering and sorting criteria.


## Reply System

The Reply System addresses the case of Posts replying to Posts. This feature actually expresses a subordination relationship -- the Post you are replying to is the subject of your reply, not its continuation. For most cases of continuing a discussion, you should consider using paragraph citations / link citations combined with the Curation Tool instead.

Since Posts can only be mounted to Topics, when replying to a Post, if that Post has a "reply topic," the reply will be mounted there; if not, one is automatically created. To reduce nesting depth, reply Posts under the current Topic can be viewed inline via the "expand replies" feature -- but replies-to-replies will not be expanded. Viewing replies-to-replies requires navigating to the dedicated page of the Post's "reply topic."

A "reply topic" is typically created automatically by the system when needed and automatically associated with the original Post. Each Post may have at most one "reply topic." The default owner of a "reply topic" is the owner of the original Post at the time of creation; changes to the original Post's ownership do not affect the "reply topic's" ownership. A "reply topic" defaults to "provisional" status and is unaffiliated (headless topic); the owner may change this as needed. Otherwise, in terms of actual functionality, a "reply topic" is largely identical to a regular Topic.


## Reference System

Clear citation chains, explicit logical progression, verifiable historical facts -- the foundation of structured discussion.

Note: In the Reference System, the citing party is always a Content object; what varies is the cited party.

### Paragraph Citation

This citation targets Content. When citing, use the ID of the Content to be cited and copy the original text of the paragraph to be cited. If the original text does not exist in the cited Content, the system should reject the submission and clearly explain why.

When the cited Content is deleted, the original text and related information of the cited content become unviewable, and no new citations can be built for that Content -- but the copied original text in existing citations remains viewable as a snapshot.


### Link Citation

This citation targets all levels of the ITPCS hierarchy. When citing, use the URL of the object to be cited; the system dynamically resolves a preview card on display. Changes to the original title, associated Sections, status, and so on are automatically reflected.

When the original object is deleted, the citation cannot retain any valuable information.


### User Citation

This citation targets users. When submitting, cite a user with @username; the system internally translates this to the user's ID and dynamically resolves it to the username on display, updating automatically when the user changes their name.


## Idea Evolution System

When you need help, come here to seek it; when you are able, come here to help others.

### Maturity

Ideas are classified into three maturity levels: Viewpoint, Concept, and Argument. Lower maturity can advance to higher maturity. When submitting, any maturity level may be selected -- as long as the review passes (i.e., the actual maturity matches the selected level). Advancement requests can be submitted by anyone, for any Idea, at any time (using only Topics they own), as long as the review passes.


### Heat

Heat has a baseline of 0; over time, heat naturally decays toward 0. Both Ideas and Topics have heat attributes; an Idea's heat primarily comes from interactions within its Topics, but the two are counted independently.

Ways to increase heat: Recommendations (primary), views, submissions, etc.
Ways to decrease heat: Not recommended (primary), violation penalties, etc.


### Ignition

An exciting moment! When Calorific >= Ignition Threshold, the Idea automatically enters an ignition period. The ignition threshold is dynamically adjusted by the editorial board based on platform conditions. Upon entering the ignition period, the system awards a large boost of heat and accelerates the natural decay rate. When Calorific <= 0, the Idea exits the ignition period and enters a limited cooling period; during the cooling period, heat is calculated normally but ignition cannot be triggered again.

During the ignition period, editors will summarize the conditions required for the Idea to advance in maturity, and organize and encourage community members to refine the Idea to help it advance.


## Rights System

Rights that act on behalf of community members.

### Positions

Community editors are selected by the Community Council; section editors-in-chief, editors, and editors-in-chief are selected jointly by the Community Council and the staff team; the Community Council is self-governing; the maintenance team is internally self-governing. The ultimate decision-making authority across the platform theoretically rests with the site owner, but the staff team should minimize intervention in operational matters -- especially those under the editorial board's responsibility. During the early period, focus primarily on the following positions: community editor, editor, council member, staff.

Editorial Board: Community Editor, Section Editor-in-Chief, Editor, Editor-in-Chief.
Community Council: Council Member, Senior Council Member, Rotating Chair (one person only).
Staff Team: Staff, Site Owner (one person only).


### Review

This is the platform's single greatest source of authority; review grants procedural legitimacy to the vast majority of operations. Review is divided into: Initial Review, Secondary Review, Final Review, and Re-Review. These correspond respectively to: Community Editor, Editor, Staff Team, and Community. Levels can be escalated or skipped, but never downgraded.

Once a review is completed, it enters a pending confirmation state; either active confirmation or automatic confirmation after a timeout causes the system to execute the review's decision. If there is an objection, a protest may be submitted within 72 hours, causing the review to escalate and be redone. Reviews marked "closed" are automatically confirmed upon completion and cannot be protested.

If unsatisfied with a "closed" review, one may seek the Community Council's assistance. If the Council confirms the review decision is indeed improper, it may initiate a re-review process. If the maintenance team accepts the Council's grounds for re-review, it may negotiate a compensation plan directly with the affected party to make amends; if not, a hearing will be scheduled. The complainant (optional), respondent (optional), Community Council, maintenance team, and editorial board representatives will participate in the hearing; the final decision is made jointly by the editorial board and the Community Council.


## Sustainability

I want to invest more emotion in this section, because what follows is itself part of sustainability -- if you are reading this, you are already contributing to the platform's survival. All of the website's source code is open-sourced under AGPL-3.0. I genuinely do not want VIP tiers that elevate some users above others, or pages cluttered with ads -- I know how unpleasant that is. But it's also obvious that the hardware costs of running the site will not be trivial. We plan to "run on passion" in the early days and initially accept only voluntary donations. In the future, we may consult with the community and, with respect for open-source contributors and the majority of user experience, introduce some paid features -- but if voluntary donations alone can sustain operations, all the better. Whether it's paid features or voluntary donations, we will publish complete income and expenditure records; all funds will be used exclusively for the platform, with not a single cent going to private use. If someday the site becomes financially unsustainable or community governance deteriorates severely, we hope some people will step forward, take the source code, fork a new IdeaOrbits, and carry our ideals and vision forward. -- Chacka Lab

---

Ideals stem from ideas.