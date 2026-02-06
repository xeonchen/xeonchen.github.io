# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A card reader format converter web application (讀卡機格式轉換器). It processes card swipe input — a 32-bit card number — and splits it into two 16-bit integer components (high word and low word) displayed as zero-padded 5-digit values. UI is in Traditional Chinese.

## Architecture

Single-file static HTML application (`index.html`) with no build system, no dependencies, and no backend. All HTML, CSS, and JavaScript are co-located in one file.

**Core conversion logic:**

- `high = Math.floor(num / 65536)` — upper 16 bits
- `low = num % 65536` — lower 16 bits
- Both values are zero-padded to 5 digits via `padStart(5, '0')`

**Input flow:** Card reader device sends keystrokes → input field captures them → Enter key triggers `processCard()` → validates input → display updates → entry added to history → user clicks a number to copy it to clipboard.

**Input validation:** Rejects non-numeric input ("輸入無效") and values outside the 32-bit unsigned range 0–4294967295 ("數值超出範圍"). Errors display in red via `showStatus(msg, 'error')`.

**Clipboard:** Uses `navigator.clipboard.writeText()` with a `document.execCommand('copy')` fallback for older browsers.

**Swipe history:** Stored in `localStorage` (key: `cardReaderHistory`) as a JSON array of `{ cardNumber, high, low, timestamp }` objects. Capped at 100 entries (oldest removed on overflow). Rendered newest-first. Clicking an entry re-displays that result.

## Development

No build tools, package manager, or test framework. To develop:

- Open `index.html` directly in a browser, or serve it with any static HTTP server
- The input field has `autofocus`; focus returns to it after each card swipe (soft refocus, not a permanent trap)

## Key Conventions

- UI text is Traditional Chinese (Taiwan locale)
- `lang="zh-TW"` on `<html>`, viewport meta tag, and a screen-reader-only `<label>` for accessibility
- Monospace font (Consolas) for number display at 48px (32px on mobile via media query)
- `user-select: none` on body to prevent accidental text selection during card swipes
- Status messages auto-hide after 1.5 seconds with opacity transition; `clearTimeout` prevents flickering on rapid actions
- Initial display shows `-----:-----` placeholders; click-to-copy is disabled until a valid swipe occurs
