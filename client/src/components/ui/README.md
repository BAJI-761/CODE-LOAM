# CodeLoom Neumorphic Design System

## Overview

The CodeLoom Design System is built on the principles of **Neumorphism (Soft UI)**, providing a highly tactile, physical, and premium feel suitable for a modern coding platform. 

It completely avoids traditional flat design paradigms, instead utilizing a sophisticated system of lights and shadows to extrude or inset elements from a unified background color.

## Core Principles

1. **Unified Background**: Everything lives on the same base color. Elements are differentiated by light and shadow, not color contrast (except for accents).
2. **Dual Shadows**: Every structural element uses a dual-shadow technique—a light shadow (top-left) to simulate a light source, and a dark shadow (bottom-right) to simulate depth.
3. **Tactility**: Interactive elements (buttons, inputs) visually respond to interaction. Buttons press *into* the background (from extruded to inset) when clicked.
4. **Softness**: Large border radii (`24px`, `32px`, `full`) are used extensively to maintain the "soft" aesthetic.

## Architecture

We use **Tailwind CSS v4** combined with **Radix UI** primitives for accessibility.

- **Tokens**: Defined in `src/app/globals.css` using Tailwind v4 `@theme`.
- **Colors**: 
  - `--color-background` / `--color-foreground`
  - `--color-accent` (Primary blue)
  - `--color-accent-secondary` (Success green)
- **Shadows** (The core of the system):
  - `--shadow-extruded`: Pops elements *out* of the background (Cards, Buttons).
  - `--shadow-inset`: Pushes elements *into* the background (Inputs, Icon Wells, Toggled Buttons).
  - Variations: `-sm`, `-deep`, `-hover`.

## Implementation Details

### Avoid `bg-white`
Never use `bg-white` or `bg-black` for structural containers. Always use `bg-background` so the element matches the surface it sits on, allowing the shadows to create the form.

### Form Elements
Inputs, textareas, and checkboxes should always use `shadow-inset`. They represent carved-out areas for the user to place data.

### Buttons
Buttons should start `extruded` and become `inset` on `:active` to simulate a physical button press.

### Accessibility
Neumorphism often suffers from poor contrast. To combat this:
- We use high-contrast text (`text-foreground`).
- We utilize bold typography (`font-display`).
- Interactive elements receive a high-contrast focus ring (`focus-visible:ring-2 focus-visible:ring-accent`).
- We provide a dark mode via `next-themes` that recalculates shadow alpha values for proper visibility in low-light environments.
