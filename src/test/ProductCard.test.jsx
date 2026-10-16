import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '@/components/molecules/ProductCard';
import { CartProvider } from '@/context/CartContext';
import { ProductProvider } from '@/context/ProductContext';
import { productosIniciales } from '@/services/dataService';

const productoMock = productosIniciales.find(p => p.id === 'FIG-002');

const renderConProviders = (ui) =>
    render(
        <MemoryRouter>
            <ProductProvider>
                <CartProvider>{ui}</CartProvider>
            </ProductProvider>
        </MemoryRouter>
    );

describe('ProductCard - Renderizado y eventos', () => {

    beforeEach(() => {
        localStorage.setItem('collector_productos', JSON.stringify(productosIniciales));
    });

    it('debería renderizar el nombre y el precio formateado del producto', () => {
        renderConProviders(<ProductCard producto={productoMock} />);

        expect(screen.getByText(productoMock.nombre)).toBeInTheDocument();
        expect(screen.getByText(/\$45\.990/)).toBeInTheDocument();
    });

    it('debería mostrar el botón "Agotado" cuando el stock es 0', () => {
        const productoAgotado = { ...productoMock, stock: 0 };
        renderConProviders(<ProductCard producto={productoAgotado} />);

        const boton = screen.getByRole('button');
        expect(boton.textContent.toUpperCase()).toContain('AGOTADO');
        expect(boton).toBeDisabled();
    });

    it('debería llamar a agregarAlCarrito al hacer clic', () => {
        renderConProviders(<ProductCard producto={productoMock} />);

        const boton = screen.getByRole('button', { name: /AÑADIR AL CARRITO/i });
        fireEvent.click(boton);

        expect(window.alert).toHaveBeenCalled();
        const mensaje = window.alert.mock.calls[0][0];
        expect(mensaje).toContain(productoMock.nombre);
    });
});