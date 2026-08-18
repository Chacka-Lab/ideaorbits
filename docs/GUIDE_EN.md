# IdeaOrbits Design Guide

Editor: Yan | Last updated: 2026-08-13T19:03:21Z

---

Let ideas be expressed without frustration.

This document is the design guide for the `IdeaOrbits Structured Discussion and Idea Evolution Platform`, primarily intended to articulate the design philosophy and feature design. Each chapter opens with a brief introduction or design philosophy for reference. This guide is currently a draft; the website is not yet live, and both writing and implementation are in progress (currently just me working on it alone).

Repository: https://github.com/Chacka-Lab/ideaorbits | Implementation progress: Writing basic user module [Early stage]

We currently need contributors to help define website design details and write code (open-source nonprofit project, no compensation — sorry!).

Or do you have any feedback to share? That's great — your contributions are very welcome!

You can also email me directly: yananghelp@outlook.com (Yan)

## Notes

`ITPCS System`: Abbreviation for the ITPCS (Idea-Topic-Point-Content-Section System) Content Hierarchy System.

## Community Atmosphere and Design Philosophy

This chapter needs no introduction.

### What kind of contribution do you want to make?

Most high-quality communities today combat [Eternal September](https://en.wikipedia.org/wiki/Eternal_September) by raising the barrier to entry and strictly suppressing low-quality content — but is that truly the right approach?

Imagine this scenario: someone comes up with a brilliant idea and shares it in a mainstream community, but nobody pays attention. So they pin their hopes on the "legendary" high-quality community. One community says: "To join us, you need a GitHub account that is at least 5 years old." Another says: "You have to find a senior member of our community elsewhere to get an invite code first (or pay for one)." Yet another says: "You need to explain in detail why you want to join and what value you bring to our community (and will most likely be rejected)." Then a niche community says: "You just need to read enough articles and interact enough here before you can post!" "Perfect — this is the one," they say. They excitedly register an account, spend hours completing the newcomer tutorial and interaction requirements, successfully post their message, and sit back waiting for replies. A few hours later, the first response arrives — but just as they're about to reply, the forum triggers a security check and requires them to wait 24 hours before posting again… At this point, I imagine they're close to a breakdown. I think most people would have given up long before reaching this point. You might wonder how I can describe this scenario so vividly — because the protagonist is me.

(By the way, when I tried to post this document to [Hacker News](https://news.ycombinator.com/), I encountered the exact same thing described above — though the specific community described above is not Hacker News.)

You might think: "Okay, some communities do have high barriers to entry, but surely cracking down on low-quality content is fine?" Taken at face value, yes — and I'm also firmly against low-quality content. But what I question is: how exactly do we define "low-quality content"? Imagine this scenario: someone asks, "Can we give AI genuine free will to make it smarter?" Most people would probably think this question is worthless, unnecessary to discuss, childish. But what if the question were: "Can we have decentralized ledger-keeping?" Would that also seem childish? Every fully developed idea originates from something as small as "Can we have decentralized ledger-keeping?" — before deep investigation, we have no right to prejudge its value. And why do we demand that the person first conduct deep research entirely on their own? A single person's energy and knowledge are ultimately limited. Since we already have a platform like the internet, why not be a little more inclusive and let our small, seemingly insignificant ideas be mined and discussed together? **Let bad ideas be eliminated faster, let good ideas no longer be buried, let duplicate ideas be assessed swiftly!** If IdeaOrbits truly existed, perhaps this entire document could have been reduced to a single sentence… In summary, I think the problem is that many platforms have a misaligned judgment of what is "low quality." Many platforms excessively pursue finished results, but in today's AI era, the barrier and cost of producing results have dropped dramatically. If platforms continue to stubbornly prioritize results, the loss from overlooking good ideas may far outweigh the benefits of doing so (of course, many platforms simply don't care about idea evolution at all).

You might further challenge: "How do you maintain community quality without high barriers to entry?" I need to clarify: IdeaOrbits has never been a "high-quality community" — the limited pursuit of quality is solely in service of idea evolution. For that quality, I will explicitly list quantifiable low-quality behaviors as counterexamples in the communication etiquette guidelines. For quantifiable violations, content filtering and moderation systems can handle them easily. For non-quantifiable low quality, evolutionary filtering and content governance will handle it. Of course, many communities set high barriers simply because they lack enough moderators — so we need a low-cost, scalable moderation system (see the `Governance and the Future?` section and the `Rights System` chapter).

### Where do ideas come from? And where do they go?

If you browse communities frequently — especially high-quality ones — you'll notice: there are an enormous number of result-posting threads, but they almost never get replies, and are often viewed as spam by many community members. But consider this scenario: a person has finally completed their idea and was originally planning to post the results. Instead of posting results directly, they first share the idea and its origin, and receive an abundance of discussion, skepticism, and praise. Thrilled, they think they've struck gold! Some time later, they post the results — only to find this post gets no attention, just like all those other result posts… That's really discouraging, isn't it? You might wonder why I can describe this so vividly… Yes, you guessed it — this is also my own experience. But in reality, it's even more common for someone to spend weeks or months on something and get zero engagement when they post it. That's absolutely devastating!!!

I believe one reason is the issue of participation motivation. An open-ended idea has a relatively low cost of understanding — people are more willing and able to join the discussion. But a complete result contains an enormous amount of information; few people are willing to spend the mental energy to fully understand a stranger's work. And even if they do, what can they add? A "nice" or a "you got it wrong"? Another reason is that creators simply don't know what to do — they don't know what people want, what they don't want, or what the idea needs. And because of the [curse of knowledge](https://en.wikipedia.org/wiki/Curse_of_knowledge), this isn't something that can be fully resolved through individual effort alone.

Moreover, even if what you've built is excellent, others have no incentive to understand the value of some result that suddenly appeared — never mind that communities receive countless result posts every day, and your idea may get buried. If you actually did something wrong, by that point your investment in the idea is already very large, which is cognitively terrible — you're likely to fall into a sunk cost trap or misjudge the value of your work. At the very moment when you most need others to correct you, you're highly unlikely to get any replies. That is just so, SO, incredibly discouraging!!!

But what if you shared the idea from the very beginning, and the community atmosphere was tolerant of imperfect ideas and actively fostered idea evolution? Imagine (this time truly hypothetically): you post an idea. Some people believe in it and discuss it with you, raising timely challenges when it goes off track. You also learn what people want, what they don't, and what your idea needs. When the time comes to publish, the entire trail of how you got there makes people more willing to trust the idea, more willing to read it, more willing to continue developing it… That would be so wonderful! But this can only ever be a fantasy. …Can it?

In the same way, this document itself began as just an idea — but the current environment doesn't support doing things the way I've described. I hope that in the future, what is said here can be made real for even one completely unknown individual. I urgently implore you: **please do not crush a Dreamer's passion for creation**. Even if their ideas seem naive or unreliable, as long as they are still striving for progress, that passion should never be extinguished.

### What's the difference between discussions?

Discussion can be simply divided into three categories: **Questions**, **Results**, and **Ideas**. Questions: seeking answers. Results: showcasing finished work. Ideas: require refinement and contain constructive content. Clearly, ideas are a kind of intermediate state between questions and results. And questions and results can also fairly easily become ideas! For example: "How should problem A be solved?" is a question, while "Can we use T to solve problem A?" is an idea. All results, in their earliest form, are ideas. Fostering the birth and evolution of ideas does not mean we don't welcome questions and results — for example, "If idea A encounters situation X, what should be done?" and "Summary of successful experience with idea B" are extremely helpful to idea development. But things like "I just got dumped, what do I do?" or "Check out this funny thing!" have almost no value here.

### Governance and the Future?

The standard for **spam content** is: whether it has a clear and net positive effect on the birth, evolution, and assessment of ideas. For ideas specifically, the additional requirement is that the goal must have a clearly discernible positive effect on human progress (defined here as: continuously pursuing higher levels of human spiritual and material well-being through scientific and rational means). Otherwise it is also classified as spam. Something like "a small tool to auto-copy for you" meets this requirement — as long as the goal advances human progress, even if almost negligible, it qualifies. But something like "noodles going up someone's nose" with a goal of humor naturally does not.

Above spam content, two further subcategories are distinguished: **uncivil content** and **malicious content**. Uncivil content: typically violates communication etiquette unintentionally or with very minor impact. Malicious content: typically posted intentionally in full knowledge of violating communication etiquette. The reason for distinguishing subjective intent is that we should give newcomers the opportunity to learn. I understand you may worry this would lead to Eternal September, but I estimate that if the mechanism runs properly, you shouldn't see much spam at all. I also hope you understand: getting more people to communicate politely and join in is far more meaningful than creating a closed but perfect community. This platform shouldn't be a utopia for a small clique — that's already a dime a dozen.

**Idea quality** is judged differently by different people, and for specialized ideas it's difficult to evaluate, so this platform will not and cannot actively judge the quality of ideas.

Although we can't define a universal quality standard for all people, most people do share some common sense of it — and naturally, no one wants to see their screen filled with bad ideas. Building on ITPCS (see the `Content Hierarchy System` chapter) and idea evolution (see the `Idea Evolution System` chapter), we can use a more fine-grained **evolutionary filtering** (essentially the entire evaluation mechanism) to replace traditional popularity-based mechanisms and the **front-end filtering** (essentially high barriers to entry) chosen by most high-quality communities.

Someone might challenge: "Idea evolution only applies to ideas — what about topics?" My solution is to require most topics to be affiliated with some idea. For a platform centered on ideas, this is very natural. It limits the governance scope of any individual topic to within an idea, making it easy to judge the topic's value by its contribution to that idea. That's much simpler and cleaner.

For a low-cost, scalable moderation system, we can no longer have a few admins managing everything. My solution: **community governs community, elites govern governance**. (Here "elites" refers to the moderator group with good judgment and error-correction ability in community governance.) This is a positive cycle: excellent members → govern the community → new members become excellent members → govern the community → … However, once community member quality declines, this cycle rapidly becomes a negative one! Therefore, elite governance of governance is introduced to counteract this tendency. This has some difficulty to implement, and early on will most likely become *elites govern everything*, but if we want to achieve the goals stated in this document, this is what ultimately needs to happen. Please note that some issues still cannot be fully anticipated at the draft stage, because governance uncertainty is too great.

**Excellent members** are those who understand and are willing to abide by the communication etiquette. Whether or not they can offer constructive input or brilliant ideas, as long as they meet this requirement they are excellent members — and the cornerstone of how the community operates. The ability to judge content value is a separate dimension and is irrelevant to the determination of excellent membership.

I'm sure you've noticed — one of this platform's goals is to promote human progress. This goal may sound grand, or it may not be — I think what we're pursuing is the process, not the outcome. Even the most negligible contribution, as long as it is made in the spirit of progress, is deeply appreciated! …So, what kind of contribution do you want to make toward human progress?

### Incentive Mechanism?

To all **excellent answerers** (those willing and able to help ideas evolve) and **dreamers**:

Someone told me that without an incentive mechanism, I can't attract you, and this community will ultimately become just another low-quality one. I'd like to ask: what kind of incentive do you want? What can this site offer you? Besides some reputation, not much else, right? (The reputation this site will eventually have is most likely something you'll bring to it.) But if you genuinely have something you want, just tell me (I'm serious). For a dreamer, there is no better reward than having your ideas taken seriously.

I'm also curious, excellent answerers: what most attracts you to joining a community? An environment where everyone is rational and values logic? Deeply insightful, thought-provoking articles? I have to say — we may not have those. We have only one idea after another, of uncertain quality, rising and falling.

But if you want to be a dreamer, or want to be an excellent answerer, this will be the place you need.

And if you're already an excellent answerer, you can help others here. …A bit disappointing? I can't help it. But if you're also a dreamer, don't forget to help others — and I think others won't forget to help you. (Is that the incentive mechanism you were looking for?)

Let me pour a bit of cold water here though: when the platform first launches, there will be nothing in it! If you're self-interested, I'll admit I have nothing to offer you but a vague vision of the future. This is a chicken-and-egg problem. But if you believe in the principles I've described, please check back from time to time, make small contributions, and maybe things will slowly improve. Regardless, as long as the website hasn't shut down, I'll always be here.

## Content Hierarchy System (ITPCS System)

Versatile, reusable hierarchy: improve once, benefit everywhere; reference once, connect everywhere.

The 5 levels listed below must all be precisely addressable via URL. Please note that, with the exception of suspension and takedowns, there are **no** access restrictions on any level.

### Idea(s)

Top-level independent structure with its own page. Used to aggregate, select topics, and host ideas.

> If an idea is eventually published, perhaps the author could add the line "Ideals stem from ideas" at the time of publication?

- Status: Open | Pinned | Closed

  > Open: Normal state, open for viewing and development.
  >
  > Pinned: Temporary or not in need of evolution; not indexed and idea evolution is fully closed (maturity unchanged).
  >
  > Closed: Basically stable; the ignition and promotion functions are closed.

- Maturity: See the `Maturity` section. The initial maturity state is Undetermined.

- Owner: By default, the creator automatically becomes the owner. However, ownership may change due to violations, account deletion, voluntary transfer, etc. The system does **not** specifically record the original creator, because most content within an idea (including the initial viewpoints, concepts, etc.) comes from its subordinate topics, and traceability responsibility lies at the content layer.

The topics under an idea have special functionality. (The following is conceptual.) The main post of a "Summary" topic is displayed directly on the idea's homepage as its summary (history can be browsed via the Version Machine); adopted topics are prominently displayed in lists or elsewhere; topics that have reached different milestone maturity levels are also shown as important history in sub-pages, etc. Except for the last item, the rest can only be operated by the idea owner and moderators.

### Topic(s)

Secondary independent structure with its own page. Used to mount and aggregate arguments. The earliest argument is automatically treated as the main post of the topic.

- Status: Open | Pinned | Closed

- Owner: Same as above.

- Rigor: Casual, Discussion, Debate.

- Affiliation: Anyone can affiliate their own topic to any idea, or choose not to. Before affiliating, ensure your topic has sufficient relevance to the idea to justify "affiliation." The act of affiliating is not restricted, but if the topic has too little connection to the affiliated idea, it may be considered spam. If left unaffiliated for a long time or affiliated with an Undetermined idea, the topic may be deliberately cooled down.

  > According to Article 2 of the 1996 WIPO Copyright Treaty (WCT):
  >
  > Copyright protection extends to expressions and not to ideas, procedures, methods of operation or mathematical concepts as such.
  >
  > Therefore, others refining or researching an idea without permission **does not infringe copyright**. We protect the right of others to freely use ideas and consider it one of the fundamental rights.

### Point(s)

An object that carries content and identity; it must be mounted to a topic. It can carry multiple pieces of content, browsable through the Version Machine as different versions. Comparing it to a post is fairly appropriate.

- Owner: Same as above.
- Version Machine: Each time new content is published, the corresponding content is automatically assigned a version number. Version numbers are positive integers starting from 1 and increment sequentially; version numbers within the same point are never reused. Any version can be marked as Deprecated; when browsing a deprecated version, the interface will display a warning. A point defaults to displaying the highest-numbered non-deprecated version. If all versions have been marked as deprecated, the point is displayed as deprecated.

### Content(s)

An object that stores the body text and immutable information bound to it; it must be mounted to a point.

- Author: When the user referenced by the author attribute deletes their account, the author attribute must become untraceable. Aside from this, all information within this object is prohibited from being changed.
- Version number: Assigned by the Version Machine of the parent point; see above.

### Section(s)

A governance structure created by the platform team; ideas and topics can be associated with multiple sections. Association with some sections requires moderation review. Some special sections may also have special functionality at the business layer.

- Section Editor-in-Chief: Directly assigned by the editorial team, responsible for managing the entire section. Duties include but are not limited to: reviewing affiliated topics, establishing section rules, adopting/not adopting topics, inviting contributors. Each section has at least one editor-in-chief.

### Deletion

After certain conditions are met, none of the above structures can be self-removed without approval; if removal is still needed, a moderation review must be submitted. Furthermore, if the content to be removed significantly affects research, freedom of speech, etc., the platform will refuse in accordance with the GDPR. The platform always accepts voluntary account deletion — irreversible upon deletion — which can anonymize author information and the like.

- Moderation — Regarding Takedowns: When moderation decides on a takedown, the corresponding content is immediately suspended (visible only to the author and moderators); after moderation confirms, the takedown proceeds (irreversible).

> According to Article 17(3) of the 2018 General Data Protection Regulation (GDPR):
>
> Paragraphs 1 and 2 shall not apply to the extent that processing is necessary:
>
> (a) for exercising the right of freedom of expression and information;
>
> (b) for compliance with a legal obligation which requires processing by Union or Member State law to which the controller is subject or for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller;
>
> (c) for reasons of public interest in the area of public health in accordance with points (h) and (i) of Article 9(2) as well as Article 9(3);
>
> (d) for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes in accordance with Article 89(1) in so far as the right referred to in paragraph 1 is likely to render impossible or seriously impair the achievement of the objectives of that processing; or
>
> (e) for the establishment, exercise or defence of legal claims.
>
> This rule is established accordingly, ensuring user fundamental rights are not violated while keeping important platform information stable and traceable.

## Toolset

Tools that do not affect core business, but greatly enhance the user experience.

### Sorting Tool

Within a single topic, selects points with specified citation relationships and displays them according to filter and sort criteria.

### Multi-filter Tool

Selects specified ideas and topics within a defined scope based on filter criteria.

## Reply System

The reply system addresses the case of replying to a point with another point. This feature actually expresses a **subordinate relationship** — meaning the point you are replying to is the subject of your reply, not its continuation. For most cases of continuing a discussion, consider using "paragraph citation / link citation + sorting tool" instead.

Since points can only be mounted to topics, when replying to a point, if that point has a "reply topic," the reply will be mounted to that "reply topic"; if it doesn't, one will be automatically created and used. The "reply points" under a point currently on the topic can be viewed directly via the expand-replies feature, but nested replies (replies to replies) will not be expanded and cannot be replied to directly on the current page. To view or reply to nested replies, you must go to the standalone page of the point's "reply topic."

A "reply topic" is typically created automatically by the system as needed and automatically associated with the original point; each point has at most one "reply topic." The default owner of a "reply topic" is the owner of the original point at the time of creation; when the original point's owner changes, the owner of the subordinate "reply topic" does not change. A "reply topic" is pinned and unaffiliated (orphan topic) by default; the owner can change this as needed. Otherwise, in terms of actual business functionality, a "reply topic" is not significantly different from a regular topic — all features available to a regular topic are available to a "reply topic."

## Quote System

Clear citation chains, explicit logical progression, and verifiable historical facts: the foundation of structured discussion.

Note: In the quote system, the quoting party is always the content; what differs is the quoted party.

### Paragraph Citation

This citation targets content. When citing, use the ID of the content to be cited and copy the original text of the paragraph to be cited. If the original text does not exist in the cited content, the system should reject the submission and clearly explain the reason.

When the cited content is deleted, the original text and related information become unviewable, and new citations to that content cannot be constructed — but the original text copied as a snapshot in existing citations remains viewable.

### Link Citation

This citation targets all levels of the ITPCS hierarchy. When citing, use the URL of the object to be cited; the system will dynamically resolve a preview card at display time, and changes to the original title, associated sections, status, etc. will be automatically reflected.

When the original object is deleted, this citation cannot retain any valuable information.

### User Citation

This citation targets users. Submit using `@username` to cite a user; internally it is automatically converted to a user ID, and at display time it is dynamically resolved to the display name.

## Idea Evolution System

For those who gather firewood for others, do not let them freeze in the wind and snow.

### Maturity

Ideas have four maturity levels: **Undetermined**, **Viewpoint**, **Concept**, and **Argument**. Lower maturity can advance to higher maturity; reversal is not possible in general. When advancing an idea, a topic must be submitted that is only required to be affiliated with the current idea — it does not need to be your own submission. When advancing, you may select any maturity level higher than the current one; as long as moderation approves (actual maturity matches the selected level), it will be elevated to the corresponding level.

### Calorific Value

Calorific value uses 0 as the baseline; over time, calorific value continuously decays toward 0. Both ideas and topics have a calorific value attribute; an idea's calorific value mainly comes from interactions within topics, but both are counted independently.

Ways to increase calorific value: Support (primary), views, contributions, etc.

Ways to decrease calorific value: Oppose (primary), violation penalties, etc.

Support from community editors and editors carries a higher calorific value bonus so that editorial opinions have real influence.

Regarding low-quality topic cooling mechanisms, I don't think it's necessary to establish one (a mechanism for faster decay of high-calorific-value ideas is sufficient). Ideas that merely pander for attention will naturally be opposed; those that attract through humor or sensationalism will, as discussed above, be classified as spam.

### Ignition

An exciting moment! When $Calorific Value >= Ignition Threshold$, the idea automatically enters the Pre-ignition Period. The Ignition Threshold is dynamically adjusted by the editorial team based on platform conditions. Upon entering the Pre-ignition Period, the system awards a large amount of calorific value and accelerates the rate of natural calorific value decay. When $Calorific Value <= 0$, the idea exits the Pre-ignition Period and enters a limited Cooldown Period; during the Cooldown Period, calorific value is calculated normally but ignition cannot be triggered.

During the Pre-ignition Period, editors will summarize the conditions required for the idea to advance maturity and call on community members to help refine the idea. Meanwhile, the platform will give ideas in the Pre-ignition Period greater exposure. I think the primary function of editorial assistance here is to tell the community what this idea needs (what it's missing).

## Internationalization

Eliminate the Tower of Babel — language should not be a barrier; great things should be understood.

### Language

Most high-quality communities require members to communicate in a unified language, but this is very unfair to speakers of other languages and leads to community homogenization. In the past, this was often unavoidable. But now, thanks to advances in AI, high-quality, low-cost real-time translation has become a reality. I strongly recommend: unless absolutely necessary, use the language you are most comfortable with. If certain terms require a specific language, just mix it in directly. Forcing people who don't know or aren't fluent in a language to translate their messages into that language not only results in inconsistent translation quality but also more easily creates hard-to-detect ambiguities.

### Search

How do you make "机器人" and "Robot" surface the same relevant article in a search? Again thanks to advances in AI, vector search can solve this problem. Multilingual vector models can place texts with similar meaning but completely different literal forms in nearby positions (meaning they return roughly the same results in search).

### Cost

Overall, the two problems that were very difficult for internationalized communities are now basically solved. But the most severe challenge is not technical — it's cost. Vector search is manageable; the cost won't be too extreme. But AI translation (especially high-quality translation) is a different story. In the short term, the most practical approach may still be to let users use third-party translation services themselves (with the option to upload the translated content), but I'll do my best.

## Rights System

The right to represent the rights of community members.

### Positions

Community Editors are selected by the Community Council; Section Editors-in-Chief and Editors are selected jointly by the Community Council and the Platform Team; Editor-in-Chief is selected by the Platform Team; the Community Council and Platform Team govern themselves internally. Theoretically, the ultimate decision-making authority for the entire platform belongs to the Platform Director, but the Platform Team should minimize intervention in platform operational affairs — especially in affairs under the responsibility of the Editorial Team. (Note: the selecting faction does not determine the faction of the selected person.)

Editorial Team: Community Editors, Section Editors-in-Chief, Editors, Editor-in-Chief. (Content governance)

Community Council: Councilors, Senior Councilors, Council President. (Community)

Platform Team: Platform Staff, Platform Director. (Elites)

### Moderation

This is the number one source of authority across the entire platform; moderation confers legitimacy on the vast majority of actions. Moderation levels are: **Initial Review**, **Secondary Review**, **Final Review**, **Re-review**. These correspond respectively to Community Editors, Editors, Platform Staff, and the Community. Levels can be elevated, can be skipped, but cannot be reversed. After a moderation decision, the moderation enters a pending-confirmation state; either active confirmation or automatic confirmation upon timeout will cause the system to execute the decided measures. If there is an objection to the moderation, a protest can be submitted within 48 hours, and the moderation level will be elevated for re-review. Closing-label moderations are automatically confirmed upon decision and cannot be protested. If unsatisfied with the closing moderation, the Community Council may be consulted. If the Community Council finds the moderation decision genuinely inappropriate, it may initiate a re-review process and convene a hearing, with the Editorial Team making the final decision.

## MVP Blacklist

The content hierarchy system only implements Idea, Topic, and Point; in subsequent iterations, Content is prioritized first, then Section. The Rigor attribute for topics is not implemented. The suspension mechanism is not implemented.

The Toolset is not implemented; subsequent iterations will implement based on feedback as needed.

The Reply System is not implemented; it will be prioritized in subsequent iterations.

The Quote System retains only Paragraph Citation and User Citation; source verification is removed from Paragraph Citation.

The Idea Evolution System does not implement the Ignition mechanism; subsequent iterations will implement based on feedback as needed.

The Rights System removes the Community Council and Platform Team; the Editorial Team is initially fully controlled by the Platform Team. The Editorial Team initially retains only Editors and Editor-in-Chief; subsequent iterations will implement based on feedback as needed.

The moderation process retains only Final Review as a single level; subsequent iterations will implement based on Rights System reforms as needed.

## Sustainability

I really don't want VIPs to be able to lord over other users or for pages to be cluttered with ads — I know how miserable that feels. But it's also obvious that the hardware costs for the website are not expected to be a small figure. Initially I'll pay out of pocket, and for now will only accept voluntary donations. In the future I may consult with the community and, with respect for open-source contributors and most users' experience, appropriately add some paid features or advertisements — but if voluntary donations alone can sustain operations, that would be ideal. Whether paid or voluntary donations, I will publish complete income and expenditure details; all funds will be **used entirely for the platform**. And all of the website's source code will be open-sourced under **AGPL-3.0**.

If someday the website can no longer sustain itself financially or community governance deteriorates severely, I hope that some people will step up, fork the source code, and create a **new IdeaOrbits** to continue our ideals and ideas.

As you can probably sense, the governance-related design is heavily dependent on community scale and quality. I'm very uncertain whether the community can truly reach the scale and quality required for the cycle to function. **I don't have a great solution for this either.** And although I've devoted a large portion of this document to institutional design, I actually believe that institutional design is merely a necessary condition — or perhaps even just an enabling factor — for realizing this idea. The true sufficient and necessary conditions, I think, are the shared values between people.

At this point, all I can do is build the website well and send this document where it belongs. If the community ultimately doesn't take off, that's okay — many things in the project will still be valuable, and open-source contributors' work will not be wasted. By the way, you may find this document stilted, awkward, boring, or lacking many rebuttals — and you might dismiss or even dislike it because of that. If so, I still hope you can give me some feedback before you leave; after all, IO is genuinely lacking right now.

(Do you think this counts as a good dream?)

## Acknowledgments

Partially referenced: [Discourse](https://github.com/discourse/discourse), [Git](https://github.com/git/git), [GitHub Discussions](https://github.com/features/discussions), [S.H.\*.T Space](https://shitspace.xyz/), [LINUX SB](https://linux.sb/), IdeaOrbits

Copyright © 2025-2026 [Chacka Lab](https://github.com/Chacka-Lab/), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

---

Ideals stem from ideas

