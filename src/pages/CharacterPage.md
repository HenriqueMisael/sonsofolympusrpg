# CharacterPage

This document is created to describe everything regarding the character page. How it should behave, or have the fields
disposed. How each field is gonna work and interact.

To create the character page, it will be necessary to create a Character.tsx file in this folder and then build it with
components from the `components/` folder (all the different sizes of components; and even create new ones there).

## Goals

- MVP implementation: simple but functional.
- Players should be able to input character information quickly.
- Automatic distribution of attributes and skills according to Scion 2e rules for a **0-experience (fresh) character**,
  but also allow manual overrides.

## Sections

### 1. Character Info

- **Character Name**: Text field.
- **Pantheon/Divine Parent**: Text field.
- **Concept**: Text field (short description of the character idea).
- **Paths**:
  - Three lines (Origin, Role, Pantheon).
  - Each line has:
    - A text field for the Path name.
    - A selector to pick **3 Skills** from the full Skills list.

### 2. Attributes

- Attributes are divided into 3 arenas:
  - **Physical**: Might, Dexterity, Stamina
  - **Social**: Presence, Manipulation, Composure
  - **Mental**: Intellect, Cunning, Resolve
- Default: 1 dot in each Attribute.
- Distribution: Player chooses Primary (8 points to distribute), Secondary (6), Tertiary (4).
- No Attribute can exceed 5 dots.
- UI: Clickable dots (1–5) per Attribute, autofilled by arena selection but editable manually.

### 3. Skills

- Full Skills list:
  - Academics
  - Athletics
  - Culture
  - Close Combat
  - Command
  - Empathy
  - Firearms
  - Integrity
  - Leadership
  - Medicine
  - Occult
  - Persuasion
  - Pilot
  - Politics
  - Science
  - Subterfuge
  - Survival
  - Technology
  - Investigation
  - Enigmas
  - Craft
  - Stealth
  - Thievery
  - Perform
- Each Path selects 3 Skills → dots added:
  - Primary: 3 dots each
  - Secondary: 2 dots each
  - Tertiary: 1 dot each
- Dots from overlapping skills stack.
- After Path distribution, players may assign 5 bonus dots manually (per rules).
- Skills displayed with clickable dot trackers (1–5).
- Any Skill reaching 3+ dots prompts the player to add a **Specialty** (text field).

### 4. Callings and Knacks

- **Calling**: Text field.
- **Knacks**: Simple list of text fields (add/remove lines).

### 5. Other Information

- **Legend**: Numeric input (default 1).
- **Birthrights / Relics**: Text fields (just name/description).
- **Notes**: Free text area.

## Behavior

- Attributes and Skills auto-fill based on rules but always editable manually.
- Paths automatically assign dots, but manual override is possible.
- Knacks, Relics, Notes: free text only at MVP.
- Data stored in state and exportable as JSON.

## UI/UX

- Clean form layout with grouped sections.
- Dot trackers for Attributes and Skills.
- Inputs for Paths, Character Info, Knacks.
- Manual overrides always possible.
