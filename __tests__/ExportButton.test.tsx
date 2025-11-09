import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExportButton } from '../src/components/ExportButton';

// Mock window.print
vi.stubGlobal('print', vi.fn());

describe('ExportButton', () => {
  const mockProps = {
    content: '# Test Content\n\nThis is test markdown content.',
    title: 'Test Section',
    filename: 'test-section',
  };

  it('renders export button', () => {
    render(<ExportButton {...mockProps} />);
    
    const exportButton = screen.getByRole('button');
    expect(exportButton).toBeTruthy();
    expect(screen.getByText('Export')).toBeTruthy();
  });

  it('opens popover menu when clicked', () => {
    render(<ExportButton {...mockProps} />);
    
    const exportButton = screen.getByRole('button');
    fireEvent.click(exportButton);
    
    expect(screen.getByText('Export as PDF')).toBeTruthy();
    expect(screen.getByText('Export as Markdown')).toBeTruthy();
  });

  it('calls window.print when PDF export is clicked', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    
    render(<ExportButton {...mockProps} />);
    
    // Open popover
    const exportButton = screen.getByRole('button');
    fireEvent.click(exportButton);
    
    // Click PDF export
    const pdfButton = screen.getByText('Export as PDF');
    fireEvent.click(pdfButton);
    
    // Should call window.print
    expect(printSpy).toHaveBeenCalledOnce();
    
    printSpy.mockRestore();
  });
});
