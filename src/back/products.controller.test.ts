import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ProductsController } from './products.controller'; // Ajusta la ruta si es necesario
import { Request, Response, NextFunction } from 'express';


const mockRepo = {
    read: vi.fn(),
    readById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
};

describe('ProductsController', () => {
    let controller: ProductsController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        controller = new ProductsController(mockRepo as unknown);

        req = {};
        res = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis(),
        };
        next = vi.fn();

        vi.clearAllMocks();
    });

    test('getAll should return all products', async () => {
        const mockData: Product[] = [
            { id: '1', name: 'Test', description: '', price: 10 },
        ];
        mockRepo.read.mockResolvedValue(mockData);

        await controller.getAll(req as Request, res as Response, next);

        expect(mockRepo.read).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            results: mockData,
            error: '',
        });
    });

    test('getById should return one product', async () => {
        const product = { id: '1', name: 'One', description: '', price: 15 };
        mockRepo.readById.mockResolvedValue(product);

        req.params = { id: '1' };

        await controller.getById(req as Request, res as Response, next);

        expect(mockRepo.readById).toHaveBeenCalledWith('1');
        expect(res.json).toHaveBeenCalledWith({
            results: [product],
            error: '',
        });
    });

    test('create should add a product and return it', async () => {
        const newProduct = {
            id: '2',
            name: 'Nuevo',
            description: '',
            price: 20,
        };
        req.body = { name: 'Nuevo', description: '', price: 20 };
        mockRepo.create.mockResolvedValue(newProduct);

        await controller.create(req as Request, res as Response, next);

        expect(mockRepo.create).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            results: [newProduct],
            error: '',
        });
    });

    test('update should update and return product', async () => {
        const updated = {
            id: '1',
            name: 'Actualizado',
            description: '',
            price: 25,
        };
        req.params = { id: '1' };
        req.body = { name: 'Actualizado', description: '', price: 25 };
        mockRepo.update.mockResolvedValue(updated);

        await controller.update(req as Request, res as Response, next);

        expect(mockRepo.update).toHaveBeenCalledWith('1', req.body);
        expect(res.json).toHaveBeenCalledWith({
            results: [updated],
            error: '',
        });
    });

    test('delete should delete product', async () => {
        const deleted = {
            id: '1',
            name: 'Eliminado',
            description: '',
            price: 0,
        };
        req.params = { id: '1' };
        mockRepo.delete.mockResolvedValue(deleted);

        await controller.delete(req as Request, res as Response, next);

        expect(mockRepo.delete).toHaveBeenCalledWith('1');
        expect(res.json).toHaveBeenCalledWith({
            results: [deleted],
            error: '',
        });
    });

    test('getAll should call next on error', async () => {
        const error = new Error('DB error');
        mockRepo.read.mockRejectedValue(error);

        await controller.getAll(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
