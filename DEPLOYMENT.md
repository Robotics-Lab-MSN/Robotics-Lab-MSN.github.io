# Deployment

This site is published from TWO GitHub repositories, and every change must
be pushed to BOTH so the two live copies do not go stale:

1. Root site: https://robotics-lab-msn.github.io/
   - Repo: Robotics-Lab-MSN/Robotics-Lab-MSN.github.io
   - Served by GitHub Pages from branch: main (root)

2. Project site (original URL, kept alive for existing links):
     https://robotics-lab-msn.github.io/Robotics-Lab-MSN.io/
   - Repo: Robotics-Lab-MSN/Robotics-Lab-MSN.io
   - Served by GitHub Pages from branch: ras-lab-site-v1 (root)
   - The main branch of this repo is README-only; do not put site files there.

Deploy checklist for any site change:
1. Commit on branch ras-lab-site-v1 in Robotics-Lab-MSN.io and push it.
2. Push the same commit to main in Robotics-Lab-MSN.github.io:
     git push https://github.com/Robotics-Lab-MSN/Robotics-Lab-MSN.github.io.git ras-lab-site-v1:main
3. Wait about a minute for both Pages builds, then check both URLs.
