import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context/CartContext';
import { ProductProvider } from '@/context/ProductContext';
import { productosIniciales } from '@/services/dataService';

const wrapper = ({ children }) => (
    <ProductProvider>
        <CartProvider>{children}</CartProvider>
    </ProductProvider>
);

describe('CartContext - Lógica del carrito', () => {

    beforeEach(() => {
        localStorage.setItem('collector_productos', JSON.stringify(productosIniciales));
        localStorage.removeItem('collector_carrito');
    });

    it('debería agregar un producto al carrito y aumentar el total', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.agregarAlCarrito('FIG-002', 1);
        });

        expect(result.current.cart.length).toBe(1);
        expect(result.current.cart[0].id).toBe('FIG-002');
        expect(result.current.totalItems).toBe(1);
    });

    it('NO debería permitir agregar más unidades que el stock disponible', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        let res;
        act(() => {
            res = result.current.agregarAlCarrito('FIG-005', 5); // stock = 1
        });

        expect(res.success).toBe(false);
        expect(res.message).toContain('stock');
    });

    it('debería calcular el total aplicando un cupón de descuento', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.agregarAlCarrito('FIG-002', 1); // 45.990
        });

        act(() => {
            result.current.aplicarCupon('DUOC10'); // 10% dcto
        });

        expect(result.current.subtotal).toBe(45990);
        expect(result.current.montoDescuento).toBe(4599);
        expect(result.current.total).toBe(41391);
    });
});