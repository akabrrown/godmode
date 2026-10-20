---
name: data-analysis-workflow
description: Analyze, clean, and visualize data - Excel/CSV work, SQL, pandas, descriptive statistics, hypothesis tests, charts, dashboards (Power BI/Tableau), and basic ML. Use for any dataset question, report or dashboard design, KPI definition, spreadsheet cleanup, or when building data-processing features like Roll Desk style Excel/CSV tools.
---
# Data analysis workflow

## Process
1. **Question first**: define the decision the analysis supports, the metric, and the audience. Pick the analytics type: descriptive (what happened), diagnostic (why), predictive (what next), prescriptive (what to do).
2. **Collect**: files (CSV/Excel/JSON), databases (SQL), APIs, scraping (respect terms/robots). Record source, date, and refresh method.
3. **Clean** (log every change): remove duplicates; handle missing values deliberately (drop, impute, flag) and say which; fix types, dates, encodings; trim/normalize text (TRIM, UPPER/LOWER/PROPER, REPLACE/SUBSTITUTE); standardize categories; detect outliers (IQR / z-score) and decide keep/cap/remove with a reason; never silently alter raw data.
4. **Explore**: counts, min/max, mean/median/mode, range, variance, standard deviation, skewness, kurtosis, distributions (histograms), correlations (not causation), segment breakdowns.
5. **Analyze**: hypothesis tests when comparing groups (state H0, alpha, test, p-value, effect size); regression for relationships; clustering (k-means) for segments; classification (logistic regression, trees, kNN, naive Bayes) only when a prediction is needed; evaluate with train/test split, cross-validation, appropriate metrics (precision/recall/F1/ROC-AUC for classes, RMSE/MAE for regression).
6. **Visualize**: choose by purpose - trend: line; comparison: bar; composition: stacked bar (pie only for 2-4 slices); distribution: histogram/box; relationship: scatter; correlation matrix: heatmap; funnel: funnel chart. Label axes and units, start bars at zero, limit color, annotate the takeaway.
7. **Communicate**: lead with the answer, then evidence, caveats, and recommended action.

## Tool picks
Excel/Sheets: pivot tables, VLOOKUP/XLOOKUP, IF, SUM/COUNT/AVERAGE, text functions, DATEDIF. SQL: joins, GROUP BY, window functions, CTEs. Python: pandas, NumPy, Matplotlib/Seaborn, scikit-learn. R: dplyr, ggplot2. BI: Power BI/Tableau for shared dashboards. Big data (Spark/Hadoop) only when data truly exceeds one machine.

## Software-building notes (spreadsheet tools)
Stream/parse large files in chunks; validate headers and types with Zod; preserve original column order and encoding; make transformations configurable and previewable; never lose rows silently - show counts in/out; test with messy files (merged cells, blank rows, mixed types, dates as text).

## Output
Question, data used, cleaning log, method, findings with numbers, chart(s), limitations, recommendation.
