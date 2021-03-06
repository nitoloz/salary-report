# Salary report vizualization with D3.js
Data for this report was collected from European IT community in December 2017, December 2018 and December 2019.
Special thanks to [Viktor](http://asdcode.de/) for great datasets!

## Demo 
* [Demo available here]( https://nitoloz.github.io/salary-report/).

## Datasets
Data used for plotting is available in spreadsheets:
* [2017](https://docs.google.com/spreadsheets/d/1k3eWzo3hj6mwUr2qQRCnbHR9-MOJWll_xDMoqH-PKIo/edit?usp=sharing)
* [2018](https://docs.google.com/spreadsheets/d/1gZCDpy8HSWFF_RPGhsl0FqUW7XiNQsBVDBaSGicTSII/edit?usp=sharing)
* [2019](https://docs.google.com/spreadsheets/d/13p6Hr9kSZuVKbQgOT_BcgasEvOuqEvt0Y0c78S5rlvw/edit?usp=sharing)

## List of available vizualizations
* Pie Chart 
  * available groupings: sex, city, seniority, language, company type, company size;
  * tooltip displays mean, median, 1st quaetile and 3rd quartile of salaries in group;
* Bar Chart
  * responses grouped by sex and salary range;
  * tooltip displays avg salary, yearly change and number / share of total number of respondents in a group;
* Box Chart
  * available x-axis options: salary, salary raise
  * available y-axis options: sex, city, seniority, language, company type, company size, total experience;
  * tooltip displays mean, median, 5thpercentile, 1st quaetile, 3rd quartile and 95th percentile of salaries in group;
* Scatter Chart
  * responses coloured by sex;
  * zooming and dragging of coordinate plane;
  * tooltip contains full response information.
* Word Cloud

## Features
* Filter data using side-panel filters by city, salary, technology, experience and many more
* Export displayed filtered charts to SVG\PNG
* Compare latests dataset with datasets for previous years

## Development
### Libraries
* D3.js v5.7.0
* D3-tip
* Bootstrap CSS v4.1.0
* Font Awesome v5.8.2
* noUiSlider v13.1.5

To start the application locally simply open the `index.html`.




 
