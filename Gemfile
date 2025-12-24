source 'https://rubygems.org'

# Security fixes
gem 'rexml', '>= 3.4.2'
gem 'google-protobuf'
gem 'webrick'
gem 'nokogiri'

group :jekyll_plugins do
    gem 'classifier-reborn'
    gem 'jekyll'
    gem 'jekyll-archives'
    gem 'jekyll-email-protect'
    gem 'jekyll-feed'
    gem 'jekyll-get-json'
    gem 'jekyll-imagemagick'
    gem 'jekyll-jupyter-notebook'
    gem 'jekyll-link-attributes'
    gem 'jekyll-minifier'
    gem 'jekyll-paginate-v2'
    gem 'jekyll-scholar'
    gem 'jekyll-sitemap'
    gem 'jekyll-tabs'
    gem 'jekyll-toc'
    gem 'jekyll-twitter-plugin'
    gem 'jemoji'
    gem 'mini_racer'
    gem 'unicode_utils'
end
group :other_plugins do
    gem 'css_parser'
    gem 'feedjira'
    # httparty 0.23.3 with SSRF fix (CVE-2025-68696) not yet on RubyGems
    # Using GitHub main branch with the fix (commit ddfbc8d from Dec 23, 2025)
    gem 'httparty', github: 'jnunemaker/httparty', branch: 'main'
end
