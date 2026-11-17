# 🛩️ Something Appeared on Radar! Should We Scramble the Jets?

A **TypeSafe Jev hands-on workshop** for the Air Force AI Center's Agentic AI training.
Send Jev a short control-room report and ask three questions in a single call.
**Code applies the final decision rules.**

> All reports are fictional examples created for the exercise. They have no connection to actual airspace, military units, or operational regulations.
> Jev turns an assessment into numbers; a human still presses the button.

## What You Will Learn

| Question | Type | Returned Value |
|---|---|---|
| What should we do? | `choice` | Scramble / monitor / ignore, with confidence |
| How dangerous is it? | `score` | A level from 0 to 3; the returned decimal is rounded |
| Is the object's identity unknown? | `noul` | Probability of “yes,” from 0 to 1 |

- Bundle all three questions into **one request**. Each is evaluated independently, without seeing the others' answers.
- Jev provides recommendations only. **Code owns the rules**, including when to defer to a human if a scramble recommendation has low confidence.
- This repository uses **only Jev** from the TypeSafe model family: `jev-latest`, or `jev-1.13.0` to pin a specific version.

## Getting Started

```bash
npm install
cp .env.example .env   # Enter your TYPESAFE_API_KEY
export $(cat .env)     # Alternatively, export the variable directly in your shell
npm start
```

## Example Output

The output below is translated into English for reference. The application's existing report text and terminal messages remain in Korean.

```
📻 Report: An unidentified aircraft is approaching us rapidly. It does not respond to radio calls and is not changing course!
   Jev recommendation : scramble (96% confidence)
   Risk level         : 3 — Emergency! Immediate action needed
   Unidentified?      : 30% probability
   Decision           : 🚀 Prepare to scramble! The commander makes the final call.

📻 Report: A small object is flying low and slowly. We cannot tell whether it is a flock of birds, a drone, or a balloon.
   Jev recommendation : watch (98% confidence)
   Risk level         : 1 — Some cause for concern
   Unidentified?      : 61% probability
   Decision           : 🔍 Identify it first: zoom in on radar and retry radio contact.

📻 Report: It is a neighboring unit's training aircraft. It is following the route announced this morning, and radio contact is normal.
   Jev recommendation : ignore (91% confidence)
   Risk level         : 0 — No danger; a quiet day
   Unidentified?      : 10% probability
   Decision           : ☕ Time for a coffee.
```

## Exercise Idea: One Question Can Change the Outcome

The third question initially asked, **“Do we need to investigate further?”** Every short report received a “yes,” so all five cases fell into the “uncertain → human review” path.
Narrowing the question to **“Is the object's identity completely unknown?”** produced more differentiated results.

Try it yourself:

1. Change the wording of the `unknown` question in `index.js`.
2. Change the descriptions of the four `danger` levels.
3. Adjust the `0.6` and `0.5` thresholds in the decision rules.
4. Add another report and observe how Jev responds.

## References

- [TypeSafe Documentation](https://docs.typesafe.ai/)
- [JavaScript SDK](https://docs.typesafe.ai/sdk/javascript)
- [Jev Models](https://docs.typesafe.ai/models)
