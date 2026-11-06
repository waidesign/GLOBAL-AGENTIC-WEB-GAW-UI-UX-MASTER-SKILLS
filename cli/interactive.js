import readline from 'node:readline/promises';
import fs from 'node:fs';
import path from 'node:path';

export async function runInteractiveOnboarding(bootstrapper, projectInfo, skillsRecommended, repoRoot) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    console.log(`\n======================================================`);
    console.log(`✨ INTERACTIVE PROJECT SETUP & SKILL ONBOARDING`);
    console.log(`======================================================\n`);

    // 1. Skill Selection
    const allSkills = await bootstrapper.registry.getAllSkills();
    console.log(`Available Skills in Central Library (${allSkills.length} total):`);
    
    // Group by category
    const byCat = {};
    for (const s of allSkills) {
      if (!byCat[s.category]) byCat[s.category] = [];
      byCat[s.category].push(s.id);
    }
    for (const [cat, ids] of Object.entries(byCat)) {
      console.log(`  • \x1b[36m${cat}\x1b[0m: ${ids.join(', ')}`);
    }

    console.log(`\nDefault recommended for this project: \x1b[32m${skillsRecommended.join(', ')}\x1b[0m`);
    const skillChoice = await rl.question(
      `\n[1/3] Which skills would you like to activate? (Press Enter to accept recommended, or list IDs): `
    );

    let activeSkills = skillsRecommended;
    if (skillChoice && skillChoice.trim()) {
      activeSkills = skillChoice.split(',').map(s => s.trim()).filter(Boolean);
      console.log(`✓ Activated custom skills: ${activeSkills.join(', ')}`);
    } else {
      console.log(`✓ Accepted recommended skills: ${activeSkills.join(', ')}`);
    }

    // Copy selected skills into ai-brain/skills/
    const projectBrainSkillsDir = path.join(process.cwd(), 'ai-brain', 'skills');
    fs.mkdirSync(projectBrainSkillsDir, { recursive: true });
    for (const sId of activeSkills) {
      const skill = await bootstrapper.registry.getSkill(sId);
      if (skill) {
        const dest = path.join(projectBrainSkillsDir, `${sId}.md`);
        if (!fs.existsSync(dest)) {
          fs.writeFileSync(dest, `# Skill: ${skill.name}\n\n${skill.content}`, 'utf8');
        }
      }
    }

    // 2. External Skills
    const extChoice = await rl.question(
      `\n[2/3] Add any external skills? (Enter local path, URL, or press Enter to skip): `
    );

    if (extChoice && extChoice.trim()) {
      const input = extChoice.trim();
      try {
        if (input.startsWith('http://') || input.startsWith('https://')) {
          console.log(`Downloading external skill from ${input}...`);
          const res = await fetch(input);
          const text = await res.text();
          const filename = path.basename(new URL(input).pathname) || 'external-skill.md';
          fs.writeFileSync(path.join(projectBrainSkillsDir, filename), text, 'utf8');
          console.log(`✓ Saved external skill to ai-brain/skills/${filename}`);
        } else if (fs.existsSync(input)) {
          const text = fs.readFileSync(input, 'utf8');
          const filename = path.basename(input);
          fs.writeFileSync(path.join(projectBrainSkillsDir, filename), text, 'utf8');
          console.log(`✓ Imported external skill to ai-brain/skills/${filename}`);
        } else {
          console.log(`ℹ Could not locate path or URL: ${input}. Skipping.`);
        }
      } catch (err) {
        console.warn(`Could not import external skill: ${err.message}`);
      }
    } else {
      console.log(`✓ Skipped external skills.`);
    }

    // 3. User Goal / Prompt
    const goalChoice = await rl.question(
      `\n[3/3] What do you want to build in this project? (Describe your goal/feature, or press Enter to skip): `
    );

    if (goalChoice && goalChoice.trim()) {
      const taskPrompt = goalChoice.trim();
      console.log(`\n🎯 Analyzing and loading tailored skills for: "${taskPrompt}"...`);
      const loaded = await bootstrapper.orchestrator.loadSkillsForTask(taskPrompt, projectInfo);

      // Save to ai-brain/ACTIVE_TASK.md
      const taskFile = path.join(process.cwd(), 'ai-brain', 'ACTIVE_TASK.md');
      const taskContent = `# Current Active Task: ${taskPrompt}\n\nGenerated: ${new Date().toISOString()}\n\n${loaded.formattedInstructions}`;
      fs.writeFileSync(taskFile, taskContent, 'utf8');

      console.log(`\n======================================================`);
      console.log(`🚀 READY TO BUILD! Active task saved to: ai-brain/ACTIVE_TASK.md`);
      console.log(`======================================================\n`);
      console.log(`You can now prompt your AI agent (in Antigravity, Cursor, or Claude Code):`);
      console.log(`  \x1b[32m"${taskPrompt}"\x1b[0m\n`);
      console.log(`The agent will automatically follow the loaded rules, anti-slop principles, and active skills.`);
    } else {
      console.log(`\n✅ Setup complete! When you are ready to build, run: gaw use "<your task>"`);
    }
  } finally {
    rl.close();
  }
}

