# Colombian congress voting patterns: Storytelling

## To deploy:

This folder is running on Github Pages duplicated on the `gh-pages` branch. To deploy, run:

```
git push origin `git subtree split --prefix scrollytelling master`:gh-pages --force
```

From the root folder.

Then, don't forget to verify the CNAME is working on the branch by going to [congreso.castrovaron.com](https://congreso.castrovaron.com).

## Abstract

Politics has an intrinsic accountability problem: officials are elected to represent the interest of their constituents, but the latter can’t be aware with the particulars of the day to day actions of the former, particularly when it involves thousands of votes. This creates a knowledge imbalance that makes political accountability and transparency harder. Congreso Visible (CV) is an organization dedicated to make the day-to-day actions of Congress more visible and accountable. Together we’ve worked to identify, highlight and visualize insights by turning CV’s vast data silos containing years of voting data into a web-based storytelling experience using data visualization.

## About

This project (and subfolder) illustrates pro and antigovernment voting patterns across the Colombian congress using graph-scroll.js and d3 interactive charts as a storytelling device. The live website can be seen at [congreso.castrovaron.com](https://congreso.castrovaron.com).