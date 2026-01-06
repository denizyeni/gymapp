# Technical Debug Log

## 2026-01-04

### Bug #1: Syntax Error in Toast Message
**File:** `index.html` (line 369)  
**Error Type:** String concatenation syntax error  
**Issue:** `currentUser +.'` instead of `currentUser + '.'`  
**Root Cause:** Missing concatenation operator between variable and string literal  
**Fix:** Replaced with correct concatenation: `currentUser + '.'`  
**Status:** ✅ RESOLVED

### Bug #2: HTML Structure Corruption in Dashboard
**File:** `dashboard.html` (lines ~201-280)  
**Error Type:** Malformed HTML/CSS boundary  
**Issue:** During `replace_string_in_file` operation, the view-toggle `<div>` block was incorrectly merged into the CSS `.check-in-btn` rule. This caused:
- Premature CSS block termination
- Orphaned HTML elements in stylesheet
- JavaScript initialization failure (missing variable declarations)
- Calendar rendering completely broken (days grid empty)

**Root Cause:** Insufficient context lines in oldString parameter led to ambiguous match point. The replacement operation matched and spliced at wrong boundary.

**Cascading Effects:**
1. CSS parser encountered HTML tags, terminated style block early
2. Subsequent HTML malformed (missing proper parent container)
3. Script block missing proper imports and variable initialization
4. `renderCalendar()` never called due to init failure

**Fix Applied:**
1. Restored `.check-in-btn` CSS rule to proper syntax
2. Re-inserted `<div class="view-toggle">` in correct DOM position (after `<header>`, before `.month-nav`)
3. Fixed JavaScript initialization: added missing `const params`, `currentUser`, `partnerUser` declarations
4. Added missing `import` statement for Firebase config
5. Restored `monthNames` array and utility functions

**Prevention:** Always use 5+ lines of unique context when using replace_string_in_file. Verify HTML/CSS boundaries carefully.  
**Status:** ✅ RESOLVED

### Bug #3: Missing Script Tag and Corrupted HTML
**File:** `dashboard.html` (line ~275)  
**Error Type:** Missing HTML elements, JavaScript rendered as text  
**Issue:** 
- Missing `<button class="check-in-btn">` button element
- Missing closing `</div>` for container
- Missing `<script type="module">` opening tag
- JavaScript code appearing as raw text in HTML body
- Duplicate/corrupted variable declarations

**Visible Symptom:** Page displayed raw JavaScript code as text: "Not logged Gym day ✓ import { db, collection..."

**Root Cause:** Previous fix in Bug #2 didn't fully restore HTML structure. Script tag was lost during repair.

**Fix Applied:**
1. Added missing check-in button: `<button class="check-in-btn" id="check-in-btn">📸 Check In Today</button>`
2. Added missing container closing tag: `</div>`
3. Added proper script module opening tag: `<script type="module">`
4. Removed duplicate variable declarations
5. Fixed corrupted `updateMonthTitle()` function (had malformed syntax: "const state: 'my' or 'partner'")

**Status:** ✅ RESOLVED

### Bug #4: Severe File Corruption - Complete Rewrite Required
**File:** `dashboard.html`  
**Error Type:** Multiple overlapping corruptions, duplicate code blocks, malformed HTML structure  
**Issue:** The file had accumulated multiple layers of corruption from previous partial fixes:

1. **Line ~230:** HTML structure `view-toggle">` instead of `<div class="view-toggle">`
2. **Line ~250:** Random `<div class="` fragment orphaned in HTML
3. **Line ~320-340:** Duplicate variable declarations: `let checkIns` declared 3 times
4. **Line ~330:** Truncated function body inside `switchView()` - code ends with `renderCalendar()` followed by unrelated variable declarations
5. **Line ~380-400:** Complete code block from old version merged into middle of new version (duplicate `renderCalendar`, `isToday`, `isLogged` functions)
6. **Line ~395:** Code fragment `checkIns = myCheckIns; // Start with user's own datacell.innerHTML` - two statements merged without newline
7. Missing proper script closing tag structure

**Root Cause:** Multiple `replace_string_in_file` operations with overlapping match regions caused code fragments to merge incorrectly. Each "fix" introduced new corruption by matching on already-corrupted context.

**Analysis:** File was beyond incremental repair - corruption had propagated to multiple non-contiguous regions with cross-contaminated code.

**Fix Applied:** 
1. Deleted corrupted file completely (`rm dashboard.html`)
2. Created fresh file with clean, tested code
3. All HTML structure properly nested
4. All JavaScript functions complete with proper syntax
5. No duplicate declarations
6. Proper `<script type="module">` wrapper

**Prevention:** 
- When multiple fixes fail, always read entire file to assess damage extent
- Use full file replacement for severely corrupted files rather than incremental patches
- After any failed edit, re-read the affected region before attempting another fix

**Status:** ✅ RESOLVED

---

## Pattern Analysis
- **Common Error:** Insufficient context in string replacement operations
- **Risk Area:** HTML/CSS boundary edits prone to malformation
- **Risk Area #2:** Incremental fixes on already-corrupted files compound damage
- **Best Practice:** Always read full context before replace operations
- **Best Practice #2:** For multi-region corruption, delete and recreate file

---

## 2026-01-06 Update

### Architecture Change: User ID System Refactor

**Problem:** Using display names (Deniz, Bogi) as user identifiers meant changing names would break data associations.

**Solution:** Implemented stable internal user IDs (`user1`, `user2`) with separate display names.

**Data Migration:**
```
OLD:
- check-ins: { userId: 'Deniz' | 'Bogi' }
- passwords: { Deniz: '...', Bogi: '...' }
- avatars: { Deniz: 'url', Bogi: 'url' }

NEW:
- check-ins: { userId: 'user1' | 'user2' }
- passwords: { user1: '...', user2: '...' }
- avatars: { user1: 'url', user2: 'url' }
- names: { user1: 'Deniz', user2: 'Bogi' }  <-- NEW
```

**Note:** Existing check-ins with old userId format (Deniz/Bogi) will not appear. Fresh start required or manual DB migration.

### Feature: Name Change System

**Implementation:**
```javascript
// Firebase document: gym-config/names
{ user1: 'Deniz', user2: 'Bogi' }

// Load names on init
const namesSnap = await getDoc(doc(db, 'gym-config', 'names'));
if (namesSnap.exists()) names = { ...DEFAULT_NAMES, ...namesSnap.data() };

// Save name change
await setDoc(doc(db, 'gym-config', 'names'), names, { merge: true });
```

**UI Integration:**
- Click user badge in header opens name modal
- Text input with 20 char max
- Updates: badge, toggle buttons, calendar title
- Persists to Firebase immediately

### Dark Mode Implementation

**CSS Variables (Dark Theme):**
```css
:root {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-card: #1f2940;
  --bg-elevated: #273552;
  --text-primary: #e8e8e8;
  --text-secondary: #a0a0a0;
  --accent: #81b29a;
  --accent-hover: #6fa088;
  --danger: #e07a5f;
  --warning: #f2cc8f;
}
```

**Key Design Decisions:**
- Kept accent colors (teal, coral) - work well on dark
- Increased shadow opacity for depth
- Added subtle borders (rgba(255,255,255,0.05)) for definition
- Modal backdrop darker (rgba(0,0,0,0.7)) for contrast

---

## Feature: Photo Check-In System (2026-01-04)

### Implementation Details
**Files Modified:** `dashboard.html`

**Components Added:**
1. **Photo Modal UI** - Overlay modal with photo preview, select button, submit button
2. **Image Compression** - Canvas-based compression to reduce file size before upload
3. **Firebase Storage Upload** - Stores photos at path `check-ins/{userId}/{YYYY-MM-DD}.jpg`
4. **Firestore Document Creation** - Saves check-in record with `userId`, `date`, `photoUrl`, `timestamp`
5. **Real-time Calendar Update** - Refreshes calendar after successful check-in

**Data Schema:**
```
Collection: check-ins
Document: {
  userId: "left" | "right",
  date: "YYYY-MM-DD",
  photoUrl: "https://firebasestorage.googleapis.com/...",
  timestamp: serverTimestamp()
}
```

**Image Processing:**
- Max width: 800px (maintains aspect ratio)
- Quality: 70% JPEG
- Uses Canvas API for client-side compression

**Firebase Setup Required:**
1. Enable Firebase Storage in Console
2. Set Storage security rules to allow authenticated writes
3. Enable Firestore if not already enabled

**Functions Added:**
- `openPhotoModal()` - Opens modal, checks for duplicate check-in
- `closePhotoModal()` / `resetPhotoModal()` - Modal state management
- `compressImage(file, maxWidth, quality)` - Returns compressed Blob
- `submitCheckIn()` - Handles upload + Firestore write
- `loadCheckInsFromFirebase()` - Fetches both users' check-ins on init
- `loadDemoData()` - Fallback if Firebase fails
