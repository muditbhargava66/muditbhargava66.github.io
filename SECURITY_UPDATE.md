# Security Update Instructions

## Overview

This document provides instructions for fixing the security vulnerabilities detected in the project dependencies.

## Vulnerabilities Fixed

### 1. **rexml** (CVE-2024-43398, CVE-2024-39908, CVE-2024-41123, CVE-2024-41946, CVE-2024-49761)

- **Previous version**: < 3.3.2
- **Updated to**: ~> 3.3.2
- **Severity**: High to Moderate

### 2. **google-protobuf** (CVE-2024-7254)

- **Previous version**: >= 4.0.0.rc.1 < 4.27.5
- **Updated to**: ~> 4.27.5
- **Severity**: High

### 3. **webrick** (CVE-2024-47220)

- **Previous version**: <= 1.8.1
- **Updated to**: ~> 1.8.2
- **Severity**: High

### 4. **nokogiri** (GHSA-mrxw-mxhj-p664, GHSA-vvfq-8hwr-qm4m, GHSA-5w6v-399v-w3cc)

- **Previous version**: < 1.18.3
- **Updated to**: ~> 1.18.3
- **Severity**: High to Low

## Steps to Apply the Security Fixes

### 1. Make the update script executable

```bash
chmod +x update_dependencies.sh
```

### 2. Run the update script

```bash
./update_dependencies.sh
```

### 3. Alternative: Manual update

If you prefer to update manually:

```bash
# Remove old Gemfile.lock
rm -f Gemfile.lock

# Update bundler
gem install bundler

# Install dependencies
bundle install

# Update specific vulnerable gems
bundle update rexml google-protobuf webrick nokogiri
```

### 4. Verify the updates

```bash
# Check installed versions
bundle show rexml
bundle show google-protobuf
bundle show webrick
bundle show nokogiri

# Run a security audit
gem install bundler-audit
bundle audit check --update
```

### 5. Commit the changes

```bash
git add Gemfile Gemfile.lock
git commit -m "Fix security vulnerabilities in dependencies

- Update rexml to 3.3.2 (CVE-2024-43398, CVE-2024-39908, CVE-2024-41123, CVE-2024-41946, CVE-2024-49761)
- Update google-protobuf to 4.27.5 (CVE-2024-7254)
- Update webrick to 1.8.2 (CVE-2024-47220)
- Update nokogiri to 1.18.3 (GHSA-mrxw-mxhj-p664, GHSA-vvfq-8hwr-qm4m, GHSA-5w6v-399v-w3cc)"
```

## Important Notes

1. **Gemfile.lock**: We've removed `Gemfile.lock` from `.gitignore`. This file should be committed to ensure consistent dependencies across all environments.

2. **Continuous Security**: A GitHub Actions workflow has been added (`.github/workflows/security-check.yml`) that will:
   - Run weekly security checks
   - Alert you to new vulnerabilities
   - Help maintain up-to-date dependencies

3. **Testing**: After updating, make sure to test your site locally:
   ```bash
   bundle exec jekyll serve
   ```

## Preventing Future Vulnerabilities

1. **Regular Updates**: Run `bundle update` regularly to keep dependencies current
2. **Security Monitoring**: Use `bundle audit` to check for vulnerabilities
3. **Automated Checks**: The GitHub Actions workflow will run weekly security scans
4. **Dependabot**: Consider enabling GitHub's Dependabot for automatic security updates

## Resources

- [Ruby Advisory Database](https://github.com/rubysec/ruby-advisory-db)
- [Bundler Audit](https://github.com/rubysec/bundler-audit)
- [GitHub Security Advisories](https://github.com/advisories)
