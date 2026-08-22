# Plan - Update visually hidden text to "que horas ?"

The user wants to update the visually hidden text (sr-only) in the index route to "que horas ?". This text is currently set to "oi" in `src/routes/index.tsx`.

## Proposed Changes

### Frontend

#### [src/routes/index.tsx](src/routes/index.tsx)
- Update the `div` with `sr-only` class at line 99 to contain "que horas ?" instead of "oi".

## Verification Plan

### Manual Verification
- View `src/routes/index.tsx` to confirm the text at line 99 is exactly "que horas ?".
- Check the preview to ensure the text remains visually hidden and does not disrupt the layout.
