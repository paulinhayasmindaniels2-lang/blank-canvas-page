# Plan - Update visually hidden text

The user wants to ensure the visually hidden text (sr-only) in the index route is set to "oi". Although it appears to be "oi" already based on previous logs, I will explicitly update it to ensure it matches the user's literal request.

## Proposed Changes

### Frontend

#### [src/routes/index.tsx](src/routes/index.tsx)
- Ensure the `div` with `sr-only` class at line 99 contains the text "oi".

## Verification Plan

### Manual Verification
- View `src/routes/index.tsx` to confirm the text is "oi".
- Check the preview to ensure the layout remains intact (the text is visually hidden).
