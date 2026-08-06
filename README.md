# Async Race

**Score: 400 / 400 pts**  
**Deploy link:** https://async-race-gold.vercel.app

## Author
Developed by: Ismail M.

---

## Checklist

**🚀 UI Deployment**
- [x] Deployment Platform: Successfully deploy the UI (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).

**✅ Requirements to Commits and Repository**
- [x] Commit guidelines compliance: Follow Conventional Commits format, present tense, imperative mood.
- [x] Checklist included in README.md.
- [x] Score calculation: Calculate score and put it at the top of README.md.
- [x] UI Deployment link in README.md.

**🏗 Basic Structure (80 points)**
- [x] Two Views (10 points): "Garage" and "Winners".
- [x] Garage View Content (30 points): Name, Car creation/editing panel, Race control panel, Garage section.
- [x] Winners View Content (10 points): Name, Winners table, Pagination.
- [x] Persistent State (30 points): View state remains consistent when navigating between views (pagination, inputs).

**🚗 Garage View (90 points)**
- [x] Car Creation And Editing Panel. CRUD (20 points): Create, update, delete cars. Handle empty/long names. Delete from both garage and winners.
- [x] Color Selection (10 points): RGB palette, display selected color on the car image.
- [x] Random Car Creation (20 points): Button to create 100 random cars (assembled from 2 parts, random color).
- [x] Car Management Buttons (10 points): Select/Edit and Delete buttons near each car.
- [x] Pagination (10 points): 7 cars per page.
- [x] EXTRA POINTS (10 points): Handle empty garage with user-friendly message.
- [x] EXTRA POINTS (10 points): Empty Garage Page handling (redirect to previous page if last car on page is deleted).

**🏆 Winners View (50 points)**
- [x] Display Winners (15 points): Winning car is added/updated in the Winners table.
- [x] Pagination for Winners (10 points): 10 winners per page.
- [x] Winners Table (15 points): Columns for №, image, name, wins (incremented), best time (updated if better).
- [x] Sorting Functionality (10 points): Sort by wins and best time (ASC/DESC).

**🏁 Race (170 points)**
- [x] Start Engine Animation (20 points): Fetch velocity, animate, fetch drive. Stop animation on 500 error.
- [x] Stop Engine Animation (20 points): Fetch stop, return car to initial place.
- [x] Responsive Animation (30 points): Fluid and responsive on screens as small as 500px.
- [x] Start Race Button (10 points): Start race for all cars on current page.
- [x] Reset Race Button (15 points): Return all cars to starting positions.
- [x] Winner Announcement (5 points): Show message with winner's name after first car finishes.
- [x] Button States (20 points): Disable start if driving, disable stop if on initial place.
- [x] Actions during the race (50 points): Handle edits, deletes, pagination, view switching safely during a race.

**🎨 Prettier and ESLint Configuration (10 points)**
- [x] Prettier Setup (5 points): Scripts `format` and `ci:format` in package.json.
- [x] ESLint Configuration (5 points): Airbnb style guide, `lint` script, strict TypeScript settings.