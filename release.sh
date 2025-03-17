#!/bin/bash

echo "🚀 Updating app version..."
npm version patch

echo "🧹 Cleaning old builds..."
rm -rf out/

echo "📦 Building new version..."
npm run make

echo "🚀 Pushing new version to GitHub..."
git add package.json package-lock.json
git commit -m "🚀 Bump version and build"
git push origin main

echo "🎯 Done! Now upload the new release to GitHub: https://github.com/Stone-Monkey1/sokal-qa-application/releases"
