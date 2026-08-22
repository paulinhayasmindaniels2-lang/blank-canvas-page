# Plan - Confirm visually hidden text

The user wants to set the visually hidden text (sr-only) in the index route to "oi". A previous inspection confirmed the text is already "oi", but I will re-verify and ensure the plan explicitly covers this to satisfy the literal request.

## Proposed Changes

### Frontend

#### [src/routes/index.tsx](src/routes/index.tsx)
- The `div` with `sr-only` class at line 99 currently contains "oi". I will re-assert this state to fulfill the request requirements.

## Verification Plan

### Manual Verification
- View `src/routes/index.tsx` to confirm the text at line 99 is exactly "oi".
- Ensure the text remains visually hidden in the browser preview.
