---
layout: page
permalink: /books/
title: bookshelf
description: Books I'm reading and recommend
nav: true
nav_order: 6
---

<div class="books-page">
  <p class="intro">
    A curated collection of books that have influenced my thinking in technology, engineering, and beyond.
    I believe in continuous learning and these are some of my favorites.
  </p>
  
  <h2>📚 Currently Reading</h2>
  <div class="book-list">
    <div class="book-card">
      <div class="book-info">
        <h3>The Pragmatic Programmer</h3>
        <p class="author">by David Thomas & Andrew Hunt</p>
        <p class="description">A classic on software craftsmanship and practical wisdom for developers.</p>
      </div>
    </div>
  </div>
  
  <h2>💡 Tech & Engineering</h2>
  <div class="book-list">
    <div class="book-card">
      <div class="book-info">
        <h3>Clean Code</h3>
        <p class="author">by Robert C. Martin</p>
        <p class="description">A handbook of agile software craftsmanship that has influenced how I write code.</p>
      </div>
    </div>
    <div class="book-card">
      <div class="book-info">
        <h3>Designing Data-Intensive Applications</h3>
        <p class="author">by Martin Kleppmann</p>
        <p class="description">The bible of distributed systems and data engineering.</p>
      </div>
    </div>
    <div class="book-card">
      <div class="book-info">
        <h3>Computer Architecture: A Quantitative Approach</h3>
        <p class="author">by Hennessy & Patterson</p>
        <p class="description">The definitive guide to computer architecture principles.</p>
      </div>
    </div>
  </div>
  
  <h2>🧠 Science & Research</h2>
  <div class="book-list">
    <div class="book-card">
      <div class="book-info">
        <h3>Deep Learning</h3>
        <p class="author">by Goodfellow, Bengio & Courville</p>
        <p class="description">The comprehensive textbook on deep learning fundamentals.</p>
      </div>
    </div>
  </div>
</div>

<style>
.books-page .intro {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: var(--global-text-color);
  line-height: 1.6;
}

.books-page h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--global-theme-color);
  font-size: 1.3rem;
}

.book-list {
  display: grid;
  gap: 1rem;
}

.book-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background-color: var(--global-card-bg-color);
  border: 1px solid var(--global-divider-color);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.book-card:hover {
  border-color: var(--global-theme-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.book-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: var(--global-text-color);
}

.book-info .author {
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  color: var(--global-theme-color);
  font-style: italic;
}

.book-info .description {
  margin: 0;
  font-size: 0.9rem;
  color: var(--global-text-color-light);
  line-height: 1.4;
}
</style>
