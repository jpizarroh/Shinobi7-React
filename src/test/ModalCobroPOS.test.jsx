import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalCobroPOS from '@/components/organisms/ModalCobroPOS';

describe('ModalCobroPOS - Cálculo de vuelto', () => {

    it('debería calcular correctamente el vuelto al pagar en efectivo', () => {
        const totalVenta = 10000;

        render(
            <ModalCobroPOS
                show={true}
                onHide={() => { }}
                totalVenta={totalVenta}
                onFinalizarVenta={() => { }}
            />
        );

        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '15000' } });

        const botonAgregar = screen.getByRole('button', { name: /Añadir/i });
        fireEvent.click(botonAgregar);

        // Vuelto = 15000 - 10000 = 5000
        expect(screen.getByText(/\$5\.000/)).toBeInTheDocument();
    });

    it('debería mostrar el total a cobrar en el resumen', () => {
        render(
            <ModalCobroPOS
                show={true}
                onHide={() => { }}
                totalVenta={29500}
                onFinalizarVenta={() => { }}
            />
        );

        // Localizamos el <div> que contiene el texto "Total a Cobrar:"
        const filaTotal = screen.getByText(/Total a Cobrar:/i).closest('div');

        // Verificamos que dentro de ESA fila aparece el monto esperado
        expect(filaTotal).toHaveTextContent(/\$29\.500/);
    });
});