# Bug Fixes & Issues

## January 4, 2026

### Issue #1: Password Error Message Bug
**What happened:** When you entered the wrong password, an error message appeared but it had weird text.  
**Why:** There was a typo in the code - a missing `+` sign.  
**Fixed:** Corrected the typo so error messages show properly.  
**Result:** ✅ Working now!

---

### Issue #2: Calendar Days Not Showing
**What happened:** After adding the "My Calendar / Partner's Calendar" buttons, all the calendar days disappeared. The page loaded but the calendar was completely blank.

**Why:** When adding the new buttons, some code accidentally got moved to the wrong place. It's like putting a paragraph from page 5 into the middle of page 2 - everything after that point got messed up.

**What broke:**
- The calendar styling stopped working
- The buttons appeared in a weird spot
- The code that draws the calendar days couldn't run

**Fixed:** 
- Moved the toggle buttons back to the right spot
- Fixed the calendar drawing code
- Restored the month names and date calculations

**Result:** ✅ Calendar days now display correctly! You can see all the days of the month with proper colors (red for not logged, green for gym days).

---

### Issue #3: Page Shows Raw Code Instead of Working
**What happened:** The entire page crashed and instead of showing the calendar, it displayed a bunch of computer code as text on the screen. You could see things like "import { db, collection..." and JavaScript code just sitting there.

**Why:** The "script tag" (which tells the browser "this is code, run it!") was missing. Without it, the browser thought the code was just regular text to display on the page. Also, the check-in button disappeared.

**What broke:**
- No script tag = browser shows code instead of running it
- Missing check-in button
- Duplicate pieces of code that shouldn't be there

**Fixed:**
- Added the proper script tag back so browser knows to run the code
- Restored the check-in button
- Cleaned up duplicate/broken code

**Result:** ✅ Page loads correctly now! Calendar displays, buttons work, code runs in the background instead of showing on screen.

---

### Issue #4: Page Still Broken After Multiple Fixes
**What happened:** Even after several fix attempts, the dashboard page was still displaying incorrectly. Parts of code were showing on the page, layout was broken, and the calendar wasn't working.

**Why:** The file had gotten so messed up from multiple repair attempts that it was like trying to fix a document where sentences from different pages got randomly shuffled together. Each time we tried to fix one thing, we accidentally broke something else.

**What was broken:**
- HTML tags were incomplete (like `<div class="` just hanging there)
- The same variables were declared multiple times
- Pieces of code got merged together into nonsense
- Functions were cut off in the middle

**What we did:**
- Deleted the entire broken file
- Created a completely fresh, clean version from scratch
- Made sure everything was properly organized and tested

**Result:** ✅ Dashboard now works perfectly! Calendar displays, toggle buttons work, everything is in the right place.

**Lesson:** Sometimes when a file gets too messed up, it's faster to start fresh than to keep trying to patch things.

---

## Tips for You
- If the page suddenly looks completely broken after a change, it's usually because something got moved to the wrong place
- The calendar needs three things to work: the styling (colors/layout), the structure (HTML), and the logic (JavaScript that draws it)
- Always refresh the page after we make changes to see the updates

---

## New Feature: Photo Check-In (January 4, 2026)

### What was added:
When you click "📸 Check In Today", a popup appears where you can:
1. Take a photo or choose one from your gallery
2. See a preview of your photo
3. Submit it as proof you went to the gym

### How it works:
- Your photo gets automatically shrunk down (so it doesn't use too much storage)
- The photo is saved to Firebase Storage (Google's cloud)
- A record is created saying "this person went to the gym on this date"
- The calendar immediately updates to show the green checkmark

### What you need to do first:
**Before this will work, you need to enable Storage in Firebase:**
1. Go to Firebase Console (console.firebase.google.com)
2. Select your project (gym-tracker-bogi)
3. Click "Build" in the left menu
4. Click "Storage"
5. Click "Get Started"
6. Choose "Start in test mode" for now
7. Pick a location (us-central is fine)
8. Click "Done"

### Once that's done:
- Refresh the dashboard page
- Click "Check In Today"
- Take/select a photo
- Click "Submit Check-In"
- Watch it upload and your calendar update!
---

## January 6, 2026

### Issue #5: Login Redirects with user=null
**What happened:** When logging in as X or Y, the dashboard URL showed `?user=null` instead of `?user=X`. The calendar displayed "null's Calendar" and no check-ins loaded.

**Why:** In the login page's `handleSubmit()` function, the code called `closeSheet()` which sets `currentUser = null` BEFORE the redirect timeout fired. So when the `setTimeout` finally ran, `currentUser` was already null.

**What broke:**
- URL showed `dashboard.html?user=null`
- Badge showed "null" 
- Calendar title showed "null's Calendar"
- No check-ins loaded (querying for userId === 'null')

**Fixed:**
1. **index.html:** Save `currentUser` to a local variable `userToLogin` BEFORE calling `closeSheet()` or any async operations
2. **index.html:** Moved `updateUI()` and `closeSheet()` BEFORE the toast/redirect
3. **dashboard.html:** Added validation - if user param is not 'X' or 'Y', redirect back to login page

**Result:** ✅ Login now correctly passes user=X or user=Y to dashboard

---
## January 6, 2026 (Update 2)

### Feature: Dark Mode Theme
**What was added:** Complete dark mode theme for both login and dashboard pages.

**Design Changes:**
- Background: Dark gradient (#1a1a2e to #16213e)
- Cards: Dark elevated surfaces (#1f2940, #273552)
- Text: Light text (#e8e8e8 primary, #a0a0a0 secondary)
- Accent: Same teal (#81b29a) works great on dark
- Shadows: Darker, more pronounced shadows

**Why:** Better for nighttime use, easier on the eyes, modern look.

---

### Feature: Name Change Option
**What was added:** Users can now change their display name by tapping on their name badge in the dashboard header.

**How it works:**
1. Tap the name badge (top right corner, next to avatar)
2. Modal opens with text input
3. Enter new name (max 20 characters)
4. Tap Save - name is stored in Firebase under `gym-config/names`
5. All UI elements update: header badge, calendar toggle buttons, calendar title

**Technical Details:**
- Names stored in Firebase: `gym-config/names` document
- Default names: `{ user1: 'Deniz', user2: 'Bogi' }`
- Names persist across sessions and sync between devices

---

### Refactor: User ID System
**What changed:** Switched from using display names (Deniz, Bogi) as user IDs to fixed internal IDs (user1, user2).

**Why:** 
- Display names can now be changed without breaking data
- Check-ins, passwords, avatars all tied to stable user1/user2 IDs
- Display names are purely cosmetic, stored separately

**Database Structure:**
- `gym-config/passwords` - `{ user1: '...', user2: '...' }`
- `gym-config/avatars` - `{ user1: 'url...', user2: 'url...' }`
- `gym-config/names` - `{ user1: 'Deniz', user2: 'Bogi' }`
- `check-ins` collection - documents with `userId: 'user1'` or `userId: 'user2'`

---

### UI Cleanup: Emoji Removal
**What was removed:** All emojis throughout the app.

**Changes:**
- Header: "Gym Duel" (removed trophy)
- Check-in button: "Check In Today" (removed camera)
- Day indicators: "*" instead of checkmark
- Modal text: Simplified, no emojis
- Alerts: Plain text messages

---