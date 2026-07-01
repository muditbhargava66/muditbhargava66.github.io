#!/bin/bash

# Script to update dependencies and fix security vulnerabilities

echo "🔒 Updating dependencies to fix security vulnerabilities..."

# Remove the old Gemfile.lock if it exists
if [ -f "Gemfile.lock" ]; then
    echo "Removing old Gemfile.lock..."
    rm Gemfile.lock
fi

# Update bundler
echo "📦 Updating bundler..."
gem install bundler

# Install dependencies with the updated versions
echo "📦 Installing dependencies with security fixes..."
bundle install

# Update the system gems to ensure we have the latest versions
echo "💎 Updating system gems..."
bundle update rexml google-protobuf webrick nokogiri concurrent-ruby crass css_parser

echo "✅ Dependencies updated successfully!"
echo "🔍 You can verify the versions with: bundle show"
echo "📋 To see the dependency tree: bundle viz"
echo ""
echo "⚠️  Important: Make sure to commit the updated Gemfile.lock to your repository!"
