---
layout: page
permalink: /photography/
title: photography
description: A collection of my photography work
nav: false
---

<div class="photography-page">
  <div class="intro">
    <p>I enjoy capturing moments through my lens. You can find my photography work on VSCO.</p>
  </div>
  
  <div class="vsco-gallery-link">
    <a href="https://vsco.co/muditb07/gallery" target="_blank" rel="noopener noreferrer" class="vsco-btn">
      <i class="fa-solid fa-camera"></i>
      View My VSCO Gallery
      <i class="fa-solid fa-arrow-up-right-from-square"></i>
    </a>
  </div>
  
  <div class="photography-embed">
    <p class="note">My VSCO gallery is regularly updated with new photos. Click above to explore!</p>
  </div>
</div>

<style>
.photography-page {
  text-align: center;
  padding: 2rem 0;
}

.photography-page .intro {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  color: var(--global-text-color);
}

.vsco-gallery-link {
  margin: 2rem 0;
}

.vsco-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.vsco-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  color: #fff;
  text-decoration: none;
}

.vsco-btn i {
  font-size: 1.2rem;
}

.photography-embed .note {
  margin-top: 2rem;
  color: var(--global-text-color-light);
  font-size: 0.9rem;
}
</style>
