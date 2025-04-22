import { describe, test, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/dom';
import { createFormAdd } from './form.add';

// Declaración local del tipo Product
type Product = {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    hasPromo: boolean;
};

// Simulamos `render` para que inserte el HTML directamente
vi.mock('./base.js', () => ({
    render: (selector: string, position: InsertPosition, template: string) => {
        const container = document.querySelector(selector);
        container?.insertAdjacentHTML(position, template);
        return container?.querySelector('form');
    },
}));

describe('createFormAdd', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('should handle form submission and log correct product object', () => {
        const products: Product[] = [
            {
                id: 1,
                name: '',
                description: '',
                category: '',
                price: 0,
                hasPromo: false,
            },
            {
                id: 2,
                name: '',
                description: '',
                category: '',
                price: 0,
                hasPromo: false,
            },
        ];

        createFormAdd(products);

        const form = screen.getByRole('form', { name: 'add_form' });

        const nameInput = screen.getByRole('textbox', { name: /name/i });
        const descriptionInput = screen.getByRole('textbox', {
            name: /description/i,
        });

        const priceInput = document.createElement('input');
        priceInput.name = 'price';
        priceInput.value = '42';

        const categoryInput = document.createElement('input');
        categoryInput.name = 'category';
        categoryInput.value = 'general';

        const hasPromoInput = document.createElement('input');
        hasPromoInput.name = 'hasPromo';
        hasPromoInput.type = 'checkbox';
        hasPromoInput.checked = true;

        form.appendChild(priceInput);
        form.appendChild(categoryInput);
        form.appendChild(hasPromoInput);

        nameInput.value = 'Test Product';
        descriptionInput.value = 'Descripción de prueba';

        const logSpy = vi.spyOn(console, 'log');

        fireEvent.submit(form);

        expect(logSpy).toHaveBeenCalledWith('Form submitted:', {
            id: 3,
            name: 'Test Product',
            description: 'Descripción de prueba',
            category: 'general',
            price: 42,
            hasPromo: true,
        });

        logSpy.mockRestore();
    });
});
