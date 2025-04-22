import { describe, test, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/dom';
import { createHeader } from './header';

vi.mock('./base.js', () => ({
    render: (selector: string, position: InsertPosition, template: string) => {
        const container = document.querySelector(selector);
        container?.insertAdjacentHTML(position, template);
        return container?.querySelector('header');
    },
}));

describe('createHeader', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('should render the header in the document', () => {
        createHeader();

        const header = screen.getByRole('banner');
        const logo = screen.getByAltText('Logo de la empresa');
        const title = screen.getByText('Productos');
        const button = screen.getByRole('button', { name: /add/i });

        expect(header).not.toBeNull();
        expect(document.body.contains(header)).toBe(true);

        expect(logo).not.toBeNull();
        expect(document.body.contains(logo)).toBe(true);

        expect(title).not.toBeNull();
        expect(document.body.contains(title)).toBe(true);

        expect(button).not.toBeNull();
        expect(document.body.contains(button)).toBe(true);
        expect(button.getAttribute('aria-controls')).toBe('add');
    });

});
