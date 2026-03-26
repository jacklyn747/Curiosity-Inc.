// src/tests/articles.test.ts
import { describe, it, expect } from 'vitest';
import { articles, getArticleBySlug, getPrevNext } from '../data/articles';

describe('articles data', () => {
  it('has exactly 4 articles', () => {
    expect(articles).toHaveLength(4);
  });

  it('articles have unique slugs', () => {
    const slugs = articles.map(a => a.slug);
    expect(new Set(slugs).size).toBe(4);
  });

  it('articles have sequential order values 1-4', () => {
    const orders = articles.map(a => a.order).sort();
    expect(orders).toEqual([1, 2, 3, 4]);
  });
});

describe('getArticleBySlug', () => {
  it('returns the correct article for a valid slug', () => {
    const article = getArticleBySlug('the-accidental-educator');
    expect(article).toBeDefined();
    expect(article!.title).toBe('The Accidental Educator');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getArticleBySlug('does-not-exist')).toBeUndefined();
  });
});

describe('getPrevNext', () => {
  it('returns null prev for the first article (order 1)', () => {
    const first = articles.find(a => a.order === 1)!;
    const { prev, next } = getPrevNext(first.slug);
    expect(prev).toBeNull();
    expect(next).not.toBeNull();
  });

  it('returns null next for the last article (order 4)', () => {
    const last = articles.find(a => a.order === 4)!;
    const { prev, next } = getPrevNext(last.slug);
    expect(next).toBeNull();
    expect(prev).not.toBeNull();
  });

  it('returns both prev and next for a middle article (order 2)', () => {
    const middle = articles.find(a => a.order === 2)!;
    const { prev, next } = getPrevNext(middle.slug);
    expect(prev).not.toBeNull();
    expect(next).not.toBeNull();
    expect(prev!.order).toBe(1);
    expect(next!.order).toBe(3);
  });

  it('returns null prev and null next for an unknown slug', () => {
    const { prev, next } = getPrevNext('unknown');
    expect(prev).toBeNull();
    expect(next).toBeNull();
  });
});
