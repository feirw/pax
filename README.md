# Supply Signal

**The AI supply chain. In 60 seconds.**

Supply Signal is a voice-first briefing concept that helps busy teams understand which critical AI suppliers need their attention, what changed, and which alternatives to investigate. Listen to the top risks over your morning coffee, then dig into the details that matter.

Built with Lovable for a hackathon.

## The problem

Advanced chips, chipmaking equipment, and high-bandwidth memory are critical dependencies in the AI supply chain. Our initial watchlist focuses on TSMC, ASML, and SK hynix.

Export controls, factory shutdowns, sanctions, and strikes can affect companies further down the chain. The warning signs are scattered across news sources, leaving procurement and risk teams to piece them together manually.

**The warning signs exist. Busy teams need a faster way to find and understand them.**

## The idea

Start with three to five key suppliers. Monitor the news, identify meaningful disruption events, and turn the top two or three risks into a spoken briefing designed to take one minute.

The planned experience answers four questions:

- **What happened?** A concise summary of the event, linked to the source article.
- **Why does it matter?** The supplier dependency and potential exposure.
- **What changed?** A transparent risk score and movement since the previous briefing.
- **What can we do next?** Suggested checks and alternative suppliers to investigate.

The main interaction is listening. Risk cards, trends, and follow-up questions provide detail when a listener needs it.

## What works in this prototype

The repository contains a runnable interface with simulated intelligence. Headlines, scores, trends, and answers are demonstration fixtures, not current news or validated risk assessments. The displayed date does not indicate a live data refresh.

| Capability                | Current implementation                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Daily briefing experience | A scripted briefing with a shared 60-second playback clock, play/pause/replay controls, and a timed transcript |
| Spoken narration          | Browser speech synthesis; voice availability and delivery depend on the browser and device                     |
| Supplier risk overview    | Three simulated supplier cards with scores, daily changes, and seven-day trends                                |
| Follow-up questions       | Typed questions receive predefined, keyword-based answers that can be read aloud                               |
| Alternative suppliers     | Illustrative suggestions with qualification caveats in the mock answers                                        |
| Layout                    | Responsive interface for desktop and mobile                                                                    |

**Planned integrations:** GDELT and RSS ingestion, LLM event detection, calculated risk scores, source-article links, ElevenLabs narration, scheduled delivery, and voice-input Q&A. These are not connected in the current demo. No external API keys are required to run it.

### Try the demo

1. Run the app locally using the instructions below and open the address printed in the terminal.
2. Select **Play today's briefing** to hear the scripted overview and follow the transcript.
3. Explore the TSMC, SK hynix, and ASML risk cards and their simulated trends.
4. Ask **“What changed for ASML?”** or **“What are the alternatives?”**, then select **Listen** on the response.
5. Review the alternative-supplier strip for possible follow-up investigations.

If browser audio is unavailable, the timed transcript remains usable. The playback clock runs for 60 seconds; speech timing can vary by voice and device.

## How the full product would work

```text
GDELT + RSS feeds
       ↓
Supplier matching and article deduplication
       ↓
LLM event detection with source references
       ↓
Risk scoring and ranking
       ↓
Top 2–3 risks → briefing script → ElevenLabs narration
       ↓
Listen, inspect sources, and ask follow-up questions
```

Our proposed scoring model is:

**Risk score = freshness × severity × supplier exposure**

- **Freshness:** how recent the event is, with older events decaying over time.
- **Severity:** the estimated operational impact of the disruption.
- **Supplier exposure:** how directly the event affects the monitored supplier or dependency.

Factor scales, decay rules, and normalization to a 0–100 display still need to be defined and validated. The current demo scores are hardcoded; they are not computed from this formula and do not represent probabilities.

For a live pilot, each alert should retain its source, distinguish reported facts from model interpretation, and be spot-checked by humans. Alternative suppliers are research leads: technical compatibility, capacity, qualification, and regional requirements must be checked before making a sourcing decision.

## Who it is for

| Audience                                                                               | Intended value                                                             |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Procurement and supply chain managers in hardware, telecom, EV, and electronics        | A quick morning check on supplier exposure and issues to investigate       |
| Risk and security teams; AI infrastructure investors                                   | A concise view of emerging disruption signals with traceable evidence      |
| Government and trade bodies, including potential users in Pax Silica partner countries | Visibility into dependencies and opportunities for more resilient sourcing |

The concept is motivated by more resilient, trusted AI supply chains and the potential to surface alternatives in partner countries. No government affiliation or endorsement is claimed.

## Impact and validation

Our target is to reduce the daily first-pass news review from hours to about one minute, while helping teams notice disruptions earlier. **This is a hypothesis to test with users, not a measured result.**

In an initial pilot, we would measure time spent reviewing news, alert relevance, missed important events, source accuracy, and whether the briefing prompts a useful follow-up action. A short briefing should help teams prioritize deeper investigation.

## Business model

Subscription pricing and features below are **assumptions to test**, not available paid plans or established market data.

| Plan       | Proposed scope                                                            | Example price    |
| ---------- | ------------------------------------------------------------------------- | ---------------- |
| Starter    | One team, five suppliers, daily voice briefing                            | About $99/month  |
| Pro        | Unlimited suppliers, custom alerts, Slack/email/phone delivery, voice Q&A | About $499/month |
| Enterprise | Company-specific supplier lists and part-specific alerts                  | Custom           |

Illustrative revenue: **100 paying teams × $300 average monthly revenue = $30,000/month.** This is scenario math, not traction or a forecast.

The initial data strategy is to use GDELT and accessible RSS feeds, subject to source terms and availability. Costs to validate include LLM analysis, voice generation, hosting, engineering, and potentially licensed news data. Actual unit costs will depend on article volume, model choice, and briefing frequency.

## Roadmap

| Stage             | Next milestone                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Current prototype | Runnable voice-briefing interface with simulated data and browser narration                                       |
| Hackathon target  | Connect real news, source-linked event detection, and generated voice to demonstrate the full flow                |
| Next 30 days      | Recruit 5–10 procurement teams for a free feedback pilot and validate relevance and time saved                    |
| Months 2–6        | Test paid plans and explore Nordic and US outreach through networks such as Business Sweden and the Swedish House |
| Later             | Custom supplier lists, additional languages, regional risks, and enterprise integrations                          |

The outreach channels above are prospective, not confirmed partnerships. The main product risks are noisy or incorrect alerts and competition from established risk-data providers. We aim to address the first with traceable sources and human review, and compete through speed, simplicity, and voice-first delivery.

## Run locally

Use a recent Node.js version compatible with Vite 8 (Node 24 was used for the initial build verification) and Bun. The repository includes a Bun lockfile.

```sh
git clone https://github.com/feirw/pax.git
cd pax
bun install --frozen-lockfile
bun run dev
```

Open the local address printed by the development server. To run the existing checks and build:

```sh
bun run test
bun run build
```

The current tests cover briefing duration configuration, mock supplier data, a supplier-specific answer, and root-route matching. They do not validate real-world risk accuracy or audible browser playback.

## Built with

- **Prototyping:** Lovable
- **Application:** TanStack Start, TanStack Router, React, and TypeScript
- **Styling and components:** Tailwind CSS, Radix UI, and Lucide icons
- **Current audio:** browser Web Speech API speech synthesis
- **Build and tests:** Vite, Bun, Vitest, and Testing Library
- **Planned intelligence and audio:** GDELT/RSS, an LLM provider to be selected, and ElevenLabs

Briefing content, risk fixtures, and mock answers live in `src/lib/supply-signal.ts`, separate from the presentation in `src/routes/index.tsx`, so a future data integration can replace the mock source. Shared visual tokens and animations live in `src/styles.css`.

### Design direction

A quiet, dark interface keeps the briefing and supplier signals in focus. The base palette is deep navy, slate blue, and off-white: `#0D1B2A`, `#1B263B`, `#415A77`, `#778DA9`, and `#E0E1DD`, with additional status colors for risk levels.

[View the palette on Coolors](https://coolors.co/palette/0d1b2a-1b263b-415a77-778da9-e0e1dd).
