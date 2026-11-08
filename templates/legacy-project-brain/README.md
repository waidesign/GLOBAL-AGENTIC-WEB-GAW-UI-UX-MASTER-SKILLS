# Legacy project brain templates

Older GAW versions copied these Global Brain files into every project's `ai-brain/`. These copies then took precedence over the user's live Global Brain (`~/.gaw/brain`), even after the user changed a preference.

GAW no longer creates them. They are kept here only so `gaw update` can recognize **untouched** old copies in existing projects and remove them safely. Copies someone edited are kept as deliberate project choices. Do not edit these files.
