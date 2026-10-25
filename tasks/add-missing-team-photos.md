# Add missing team photos

## Goal

Every current member without a photo in `src/lib/data.ts` gets one: their LinkedIn profile photo, cut out onto a white background to match the existing portraits.

Missing at start (14): Ryan Ginsburg, Chris Jia, Oduna Akonzee, Hendry Xu, Avinash Senthil, Idhant Gode, Caden Ruan, Andy Do, Winston Wang, Kona Sullivan, Alexei Manuel (Members); Mohammad Mustafa Shoukat, Kaelin Braverman, Breanna Eng (Business).

## Approach

- Find each person on LinkedIn through the logged-in Chrome session (search name + Cornell), confirm it is a Cornell student, grab the full-size profile photo.
- Background removal: macOS Vision foreground-instance mask (`VNGenerateForegroundInstanceMaskRequest`) via a small Swift script, composited onto white. No new dependencies.
- Output: square-ish webp in `public/team/<firstname>.webp`, same as the others (TeamGrid uses `object-cover`, so aspect ratio is not critical).
- Add the `linkedIn` URL alongside the image where the profile match is confident.

## Decisions

- Skip anyone whose LinkedIn has no photo, or where the match is ambiguous. Leave them on the placeholder and list them here.

## Progress log

- 2026-10-25: started. Existing portraits checked: cut-out subjects on pure white.
- 2026-10-25: All 14 found on LinkedIn (name + Cornell, mutuals with club members). Hendry Xu's profile is "Qianheng (Hendry) Xu", URL /in/hendryxu.
- 2026-10-25: Dead end: fetching the photo blob in-page and saving it as a download worked once, then Chrome silently blocked repeat automatic downloads. Switched to opening the 800px photo URL in the tab and saving a full-resolution zoom screenshot (~1093px). Also: the first pass reported "no photo" for several people because the profile hadn't finished loading in 2.5s; polling fixed it.
- 2026-10-25: Cutout: Vision foreground mask (keeps the instance nearest the centre), written as transparent PNG, then a small PIL pass for per-person fixes and compositing onto white, 720px max, `cwebp -q 82`. Fixes: Andy (blurred leaves kept in the hair mask, keyed out by hue; AI-generator sparkle in the corner cropped off), Hendry (photo has LinkedIn's #OPENTOWORK frame baked in; cropped to head and torso inside the frame), Mohammad (crop stops above flowers and a bystander; his source is only 229px so it's soft), Winston (cropped tighter to match head size), Avinash (podium cropped off).
- 2026-10-25: Added 12 photos + `linkedIn` for all 14 in `src/lib/data.ts`. Verified on `/team` in Chrome: 43 team images, none broken.

## Result

- Photos added (12): Ryan Ginsburg, Oduna Akonzee, Hendry Xu, Avinash Senthil, Caden Ruan, Andy Do, Winston Wang, Kona Sullivan, Alexei Manuel, Mohammad Mustafa Shoukat, Kaelin Braverman, Breanna Eng.
- No LinkedIn photo (still placeholder): Chris Jia, Idhant Gode.

## Open questions

- Avinash's LinkedIn photo is a graduation-speech shot (cap, sunglasses), and Mohammad's is low-res. Both would look better with a real headshot from them.

## Out of scope

- Alumni (all already have photos).
