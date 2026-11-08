<!-- Part of the design-lab skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Part 2

\*\*Variant C: Density Variation\*\*  
\- If brief says "comfortable", try a more compact version  
\- If brief says "compact", try a more spacious version  
\- Use the project's existing spacing tokens—just apply them differently  
\- Show the tradeoffs: more visible data vs easier scanning

\*\*Variant D: Interaction Model\*\*  
\- Different interaction pattern (modal vs inline vs panel vs drawer)  
\- Apply feedback patterns: immediate → progress → completion  
\- Implement all required states (loading, error, empty, disabled)  
\- Consider optimistic updates for non-destructive actions

\*\*Variant E: Expressive Direction\*\*  
\- Push the brand direction the user described in the interview  
\- Explore different uses of the project's existing design tokens  
\- More or less use of shadows, borders, background colors  
\- Apply motion where it adds meaning (hover, focus, transitions)

\#\#\# Lab Page Requirements

The Design Lab page must include:

1\. \*\*Header\*\* with:  
   \- Design Brief summary (target, scope, key requirements)  
   \- Instructions for reviewing

2\. \*\*Variant Grid\*\* with:  
   \- Clear labels (A, B, C, D, E)  
   \- Brief rationale for each variant ("Why this exists")  
   \- The actual rendered variant  
   \- Notes highlighting key differences  
   \- \*\*IMPORTANT:\*\* Each variant container must have \`data-variant="X"\` attribute (where X is A, B, C, D, E, or F). This is required for the feedback system to identify which variant comments belong to.

3\. \*\*Responsive behavior\*\*:  
   \- Desktop: side-by-side grid (2-3 columns)  
   \- Mobile: horizontal scroll or tabs

4\. \*\*Shared Data\*\*:  
   \- All variants use the same fixture data from \`data/fixtures.ts\`  
   \- Ensures fair comparison

5\. \*\*Feedback Overlay\*\* (CRITICAL \- NEVER OMIT):

   ⚠️ \*\*THIS IS THE MOST IMPORTANT REQUIREMENT\*\* ⚠️

   The FeedbackOverlay enables users to click on elements and leave comments. Without it, the Design Lab is just a static page with no way to collect structured feedback.

   \- Create \`FeedbackOverlay.tsx\` in the SAME directory as \`page.tsx\`  
   \- Import with relative path: \`import { FeedbackOverlay } from './FeedbackOverlay'\`  
   \- Render at the END of the page, after all variants  
   \- Pass \`targetName\` prop with the component/page name

   \*\*Example integration:\*\*

\`\`\`tsx  
import { FeedbackOverlay } from './FeedbackOverlay';  // Relative import \- always works

export default function DesignLabPage() {  
  return (  
    \<div className="min-h-screen bg-background"\>  
      \<header\>...\</header\>

      \<main\>  
        \<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"\>  
          \<div data-variant="A"\>  
            \<VariantA /\>  
          \</div\>  
          \<div data-variant="B"\>  
            \<VariantB /\>  
          \</div\>  
          {/\* ... more variants \*/}  
        \</div\>  
      \</main\>

      {/\* CRITICAL: FeedbackOverlay must be included \*/}  
      \<FeedbackOverlay targetName="ComponentName" /\>  
    \</div\>  
  );  
}  
\`\`\`

   \*\*If you forget the FeedbackOverlay, the user CANNOT provide feedback.\*\* This defeats the entire purpose of the Design Lab.

\#\#\# Code Quality

\*\*Conventions:\*\*  
\- Follow the project's existing code conventions (file naming, imports, etc.)  
\- Use the detected styling system (Tailwind, CSS modules, etc.)  
\- Use existing components from the project where appropriate

\*\*Accessibility (from DESIGN\_PRINCIPLES):\*\*  
\- Semantic HTML: \`\<button\>\` not \`\<div onclick\>\`, \`\<nav\>\`, \`\<main\>\`, \`\<section\>\`  
\- Keyboard navigation: all interactive elements focusable and operable  
\- Focus states: visible \`:focus-visible\` with 2px ring and offset  
\- Color contrast: 4.5:1 for text, 3:1 for UI elements  
\- Touch targets: minimum 44x44px  
\- ARIA only when HTML semantics aren't enough

\*\*States (every component needs):\*\*  
\- Default, Hover, Focus, Active, Disabled, Loading, Error, Empty  
\- See DESIGN\_PRINCIPLES "State Handling" section

\*\*Motion:\*\*  
\- Use appropriate timing: 150-200ms for micro-interactions, 200-300ms for transitions  
\- Use ease-out for entrances, ease-in for exits  
\- Respect \`prefers-reduced-motion\`

\---

\#\# Phase 4: Present Design Lab to User

After generating the lab files, \*\*immediately\*\* present the lab to the user. Do NOT attempt to:  
\- Start the dev server yourself (it runs forever and will block)  
\- Check if ports are open  
\- Open a browser  
\- Wait for any server response

\#\#\# What to Do

1\. \*\*Output the lab location and URL:\*\*  
   \`\`\`  
   ✅ Design Lab created\!

   I've generated 5 design variants in \`.claude-design/lab/\`

   To view them:  
   1\. Make sure your dev server is running (run \`pnpm dev\` if not)  
   2\. Open: http\://localhost:3000/\_\_design\_lab

   Take your time reviewing the variants side-by-side, then come back and tell me:  
   \- Which variant wins (A-E)  
   \- What you like about it  
   \- What should change  
   \`\`\`

2\. \*\*Immediately proceed to Phase 5\*\* \- ask for feedback. Do NOT wait for the user to say they've opened the browser. Just present the feedback questions right away so they're ready when the user returns.

\#\#\# Why Not Start the Server

Running \`pnpm dev\` or \`npm run dev\` starts a long-running process that never exits. If you run it, you'll wait forever. The user likely already has their dev server running, or can start it themselves in another terminal.

\---

\#\# Phase 5: Collect Feedback

After presenting the lab URL, the user can provide feedback in two ways:  
1\. \*\*Interactive Feedback\*\* (recommended): Using the built-in overlay in the browser  
2\. \*\*Manual Feedback\*\*: Via AskUserQuestion in the terminal

\#\#\# Interactive Feedback (Primary Method)

The Design Lab includes a Figma-like feedback overlay. When presenting the lab, include these instructions:

\`\`\`  
✅ Design Lab created\!

I've generated 5 design variants in \`.claude-design/lab/\`

To view and provide feedback:  
1\. Make sure your dev server is running (run \`pnpm dev\` if not)  
2\. Open: http\://localhost:3000/\_\_design\_lab

\*\*To add feedback:\*\*  
1\. Click the "Add Feedback" button (bottom-right corner)  
2\. Click any element you want to comment on  
3\. Type your feedback and click "Save"  
4\. Repeat for all elements you want to comment on  
5\. Fill in the "Overall Direction" field (required)  
6\. Click "Submit All Feedback"  
7\. Paste the copied text here in the terminal

Or just describe your feedback manually below\!  
\`\`\`

\*\*When the user pastes feedback\*\*, it will be in this format:

\`\`\`markdown  
\#\# Design Lab Feedback

\*\*Target:\*\* ComponentName  
\*\*Comments:\*\* 3

\#\#\# Variant A  
1\. \*\*Button\*\* (\`\[data-testid='submit'\]\`, button with "Submit")  
   "Make this more prominent"

\#\#\# Variant B  
1\. \*\*Card\*\* (\`.product-card\`, div with "Product Name")  
   "Love this layout"

\#\#\# Overall Direction  
Go with Variant B's structure. Apply Variant A's button styling.  
\`\`\`

\*\*How to parse and act on this feedback:\*\*

1\. \*\*Read the Overall Direction\*\* first \- this guides your synthesis  
2\. \*\*For each comment\*\*, locate the element using:  
   \- Primary: The CSS selector in backticks (e.g., \`\[data-testid='submit'\]\`)  
   \- Secondary: The element description (e.g., "button with 'Submit'")  
3\. \*\*Apply the feedback\*\* by editing the corresponding variant file

\#\#\# Fallback: Manual Feedback via AskUserQuestion

If the user prefers not to use the interactive overlay (or pastes manual feedback), use the AskUserQuestion flow below:

\#\#\# Stage 1: Check for a Winner

\*\*Question 1: Ready to pick?\*\*  
\- Header: "Decision"  
\- Question: "Is there one variant you like as is?"  
\- Options:  
  \- "Yes \- I found one I like" \- Ready to select a winner and refine  
  \- "No \- I like parts of different ones" \- Need to synthesize a new variant

\#\#\# Stage 2A: If User Found a Winner

If user said "Yes", ask:

\*\*Question 2a: Which one?\*\*  
\- Header: "Winner"  
\- Question: "Which variant do you want to go with?"  
\- Options:  
  \- "Variant A" \- \[brief description of A\]  
  \- "Variant B" \- \[brief description of B\]  
  \- "Variant C" \- \[brief description of C\]  
  \- "Variant D" \- \[brief description of D\]  
  \- "Variant E" \- \[brief description of E\]

\*\*Question 3a: Any tweaks?\*\*  
\- Header: "Tweaks"  
\- Question: "Any small changes needed, or is it good as is?"  
\- Options:  
  \- "Good as is" \- No changes needed, proceed to final preview  
  \- "Minor tweaks needed" \- I'll describe what to adjust

If "Minor tweaks needed", ask user to describe changes via text input.

Then proceed to \*\*Phase 7: Final Preview\*\*.

\#\#\# Stage 2B: If User Wants to Synthesize

If user said "No \- I like parts of different ones", ask:

\*\*Question 2b: What do you like about each?\*\*  
\- Header: "Feedback"  
\- Question: "What do you like about each variant? (mention specific elements from A, B, C, D, E)"  
\- (Let user provide detailed feedback via "Other" text input)

Example response format to guide user:  
\`\`\`  
\- A: Love the card layout and spacing  
\- B: The color scheme feels right  
\- C: The interaction on hover is great  
\- D: Nothing stands out  
\- E: The typography hierarchy is clearest  
\`\`\`

Then proceed to \*\*Phase 6: Synthesize New Variant\*\*.

\---

\#\# Phase 6: Synthesize New Variant

Based on the user's feedback about what they liked from each variant:

1\. \*\*Create a new hybrid variant\*\* (Variant F) that combines:  
   \- The specific elements the user called out from each  
   \- The best structural decisions across all variants  
   \- Any patterns that appeared in multiple variants

2\. \*\*Replace the Design Lab\*\* with a comparison view:  
   \- Show the new synthesized Variant F prominently  
   \- Keep 1-2 of the original variants that were closest for comparison  
   \- Remove variants that had nothing the user liked

3\. \*\*Update the \`/\_\_design\_lab\` route\*\* to show the new arrangement

4\. \*\*Ask for feedback again:\*\*

\*\*Question: How's the new variant?\*\*  
\- Header: "Review"  
\- Question: "How does the synthesized variant (F) look?"  
\- Options:  
  \- "This is it\!" \- Proceed to final preview  
  \- "Getting closer" \- Need another iteration  
  \- "Went the wrong direction" \- Let me clarify what I want

If "Getting closer" or "Went the wrong direction", gather more specific feedback and iterate. Support multiple synthesis passes until user is satisfied.

Then proceed to \*\*Phase 7: Final Preview\*\*.

\---

\#\# Phase 7: Final Preview

Once user is satisfied:

1\. Create \`.claude-design/preview/\` directory:  
   \`\`\`  
   .claude-design/preview/  
   ├── page.tsx                    \# Preview page  
   └── FinalDesign.tsx             \# The winning design  
   \`\`\`

2\. Create route at \`/\_\_design\_preview\`

3\. For redesigns, include before/after comparison:  
   \- Toggle switch or split view  
   \- Show original alongside proposed

4\. Ask for final confirmation:

\*\*Question: Confirm final design?\*\*  
\- Header: "Confirm"  
\- Question: "Ready to finalize this design?"  
\- Options:  
  \- "Yes, finalize it" \- Proceed to cleanup and generate implementation plan  
  \- "No, needs changes" \- Tell me what to adjust  
  \- "Abort \- cancel everything" \- Delete all temp files, no plan generated

If "No, needs changes": gather feedback and iterate.  
If "Abort": proceed to \*\*Abort Handling\*\* below.

\---

\#\# Abort Handling

If the user wants to cancel/abort at ANY point during the process (not just final confirmation), they may say things like:  
\- "cancel"  
\- "abort"  
\- "stop"  
\- "nevermind"  
\- "forget it"  
\- "I changed my mind"

When abort is detected:

1\. \*\*Confirm the abort:\*\*  
   \- "Are you sure you want to cancel? This will delete all the design lab files I created."

2\. \*\*If confirmed, clean up immediately:\*\*  
   \- Delete \`.claude-design/\` directory entirely  
   \- Delete temporary route files (\`app/\_\_design\_lab/\`, etc.)  
   \- Do NOT generate any implementation plan  
   \- Do NOT update Design Memory

3\. \*\*Acknowledge:\*\*  
   \- "Design exploration cancelled. All temporary files have been cleaned up. Let me know if you want to start fresh later."

\---

\#\# Phase 8: Finalize

When user confirms (selected "Yes, finalize it"):

\#\#\# 8.1: Cleanup

Delete all temporary files:  
\- Remove \`.claude-design/\` directory entirely  
\- Remove temporary route files:  
  \- \`app/\_\_design\_lab/\` (Next.js App Router)  
  \- \`pages/\_\_design\_lab.tsx\` (Next.js Pages Router)  
  \- \`app/\_\_design\_preview/\`  
  \- \`pages/\_\_design\_preview.tsx\`  
  \- Revert any \`App.tsx\` modifications (Vite)

\*\*Safety rules:\*\*  
\- ONLY delete files inside \`.claude-design/\`  
\- ONLY delete route files that the plugin created  
\- NEVER delete user-authored files  
\- Verify file paths before deletion

\#\#\# 8.2: Generate Implementation Plan

Create \`DESIGN\_PLAN.md\` in the project root:

\`\`\`markdown  
\# Design Implementation Plan: \[TargetName\]

\#\# Summary  
\- \*\*Scope:\*\* \[component/page\]  
\- \*\*Target:\*\* \[file path\]  
\- \*\*Winner variant:\*\* \[A-E\]  
\- \*\*Key improvements:\*\* \[from feedback\]

\#\# Files to Change  
\- \[ \] \`src/components/Example.tsx\` \- Main component refactor  
\- \[ \] \`src/styles/example.css\` \- Style updates  
\- \[ \] ... (list all affected files)

\#\# Implementation Steps  
1\. \[Specific step with code guidance\]  
2\. \[Next step\]  
3\. ...

\#\# Component API  
\- \*\*Props:\*\*  
  \- \`prop1: type\` \- description  
  \- ...  
\- \*\*State:\*\*  
  \- Internal state requirements  
\- \*\*Events:\*\*  
  \- Callbacks and handlers
