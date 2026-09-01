# College Hoops Lab — Division I Simulator

A phone-friendly simulator for every NCAA Division I men's basketball team. It combines editable power ratings with measured shooting, efficiency, rebounding, turnovers, pace, home court, rest, travel and player availability, then runs possession-based Monte Carlo simulations.

## GitHub setup

1. Create a new GitHub repository and upload every file in this project. The simulator files are intentionally flat so GitHub's upload page preserves the correct paths.
2. Open **Settings → Secrets and variables → Actions → Variables**.
3. Add a repository variable named `CBB_SEASON`. Use the ending year of the season: the 2026–27 season uses `2027`.
4. No API secret is required. The updater uses ESPN's public Division I schedule and box-score feeds.
5. Open **Actions → Update Division I basketball data → Run workflow**.
6. Confirm the workflow has a green checkmark and that `live-data.json` contains the full team list.
7. Open **Settings → Pages**, choose **Deploy from a branch**, then select `main` and `/ (root)`.

## Model modes

- **Balanced:** 50% ratings and 50% measured matchup statistics.
- **Stats-heavy:** 20% ratings and 80% measured matchup statistics.
- **Ratings-only:** 100% ratings, plus situational adjustments.

Early-season measurements are shrunk toward rating priors using `games / (games + 5)`. Missing fields use transparent priors and can also be entered manually or imported through CSV.

If GitHub does not detect the hidden `.github` workflow folder, choose **Actions → set up a workflow yourself**, name it `update-data.yml`, and paste the contents of the included root-level `update-data.yml` file.

## Local commands

```bash
npm run update
npm test
npm run serve
```
