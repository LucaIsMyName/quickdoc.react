import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IFrame } from '../src/pages/components/IFrame';

describe('IFrame Component', () => {
  it('renders iframe with correct src', () => {
    render(<IFrame src="https://example.com" />);
    const iframe = screen.getByTitle('Embedded content');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://example.com');
  });

  it('applies default aspect ratio 16/9', () => {
    const { container } = render(<IFrame src="https://example.com" />);
    const aspectContainer = container.querySelector('.pb-\\[56\\.25\\%\\]');
    expect(aspectContainer).toBeInTheDocument();
  });

  it('applies custom aspect ratio 4/3', () => {
    const { container } = render(<IFrame src="https://example.com" aspect="4/3" />);
    const aspectContainer = container.querySelector('.pb-\\[75\\%\\]');
    expect(aspectContainer).toBeInTheDocument();
  });

  it('applies custom aspect ratio 1/1', () => {
    const { container } = render(<IFrame src="https://example.com" aspect="1/1" />);
    const aspectContainer = container.querySelector('.pb-\\[100\\%\\]');
    expect(aspectContainer).toBeInTheDocument();
  });

  it('applies custom aspect ratio 21/9', () => {
    const { container } = render(<IFrame src="https://example.com" aspect="21/9" />);
    const aspectContainer = container.querySelector('.pb-\\[42\\.86\\%\\]');
    expect(aspectContainer).toBeInTheDocument();
  });

  it('uses lazy loading by default', () => {
    render(<IFrame src="https://example.com" />);
    const iframe = screen.getByTitle('Embedded content');
    expect(iframe).toHaveAttribute('loading', 'lazy');
  });

  it('applies eager loading when specified', () => {
    render(<IFrame src="https://example.com" loading="eager" />);
    const iframe = screen.getByTitle('Embedded content');
    expect(iframe).toHaveAttribute('loading', 'eager');
  });

  it('uses custom title when provided', () => {
    render(<IFrame src="https://example.com" title="My Custom Title" />);
    const iframe = screen.getByTitle('My Custom Title');
    expect(iframe).toBeInTheDocument();
  });

  it('applies default allow attribute', () => {
    render(<IFrame src="https://example.com" />);
    const iframe = screen.getByTitle('Embedded content');
    expect(iframe).toHaveAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  });

  it('applies custom allow attribute when provided', () => {
    render(<IFrame src="https://example.com" allow="fullscreen" />);
    const iframe = screen.getByTitle('Embedded content');
    expect(iframe).toHaveAttribute('allow', 'fullscreen');
  });

  it('has allowFullScreen attribute', () => {
    render(<IFrame src="https://example.com" />);
    const iframe = screen.getByTitle('Embedded content');
    expect(iframe).toHaveAttribute('allowFullScreen');
  });

  it('applies responsive styling classes', () => {
    render(<IFrame src="https://example.com" />);
    const iframe = screen.getByTitle('Embedded content');
    expect(iframe).toHaveClass('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'border-0', 'theme-border-radius', 'shadow-lg');
  });
});
