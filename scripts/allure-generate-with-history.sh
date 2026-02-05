#!/bin/bash
# Copy previous report's history into allure-results so the new report includes trends,
# then generate with --clean (avoids "directory already in use" error).
set -e
cd "$(dirname "$0")/.."
RESULTS_DIR="allure-results"
REPORT_DIR="allure-report"
if [ -d "$REPORT_DIR/history" ]; then
  mkdir -p "$RESULTS_DIR"
  cp -r "$REPORT_DIR/history" "$RESULTS_DIR/"
fi
allure generate "$RESULTS_DIR" -o "$REPORT_DIR" --clean
