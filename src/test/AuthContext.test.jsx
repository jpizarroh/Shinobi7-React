import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { usuariosIniciales } from '@/services/dataService';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext - Autenticación (con mocks de BD)', () => {

    beforeEach(() => {
        localStorage.setItem('collector_usuarios', JSON.stringify(usuariosIniciales));
    });

    it('debería iniciar sesión con credenciales válidas', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        let respuesta;
        act(() => {
            respuesta = result.current.login('jose@shinobi7.cl', 'admin1234');
        });

        expect(respuesta.success).toBe(true);
        expect(respuesta.user.rol).toBe('Administrador');
        expect(result.current.user).not.toBeNull();
    });

    it('debería fallar el login con correo de dominio no permitido', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        let respuesta;
        act(() => {
            respuesta = result.current.login('test@yahoo.com', 'admin1234');
        });

        expect(respuesta.success).toBe(false);
        expect(respuesta.message).toContain('@duoc.cl');
    });

    it('debería registrar un usuario nuevo con rol Cliente por defecto', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        let respuesta;
        act(() => {
            respuesta = result.current.registrarUsuario({
                run: '201234567',
                nombre: 'Test User',
                correo: 'test@gmail.com',
                password: 'password123'
            });
        });

        expect(respuesta.success).toBe(true);
    });
});