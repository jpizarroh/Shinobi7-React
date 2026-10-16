import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    validarCorreo,
    validarPassword,
    validarRun,
    CUPONES_VALIDOS,
    getProductosBD,
    saveProductosBD,
    validarClaveSupervisorBD,
    registrarLogAuditoriaBD,
    productosIniciales,
    usuariosIniciales
} from '@/services/dataService';

describe('dataService - Validaciones', () => {

    it('debería validar un correo con dominio permitido', () => {
        const res = validarCorreo('test@gmail.com');
        expect(res.valido).toBe(true);
        expect(res.msj).toBeUndefined();
    });

    it('debería rechazar un correo con dominio no permitido', () => {
        const res = validarCorreo('test@hotmail.com');
        expect(res.valido).toBe(false);
        expect(res.msj).toContain('@duoc.cl');
    });

    it('debería validar contraseña con longitud entre 8 y 32 caracteres', () => {
        expect(validarPassword('admin1234').valido).toBe(true);
        expect(validarPassword('corta').valido).toBe(false);
        expect(validarPassword('a'.repeat(33)).valido).toBe(false);
    });

    it('debería rechazar RUN con puntos o guion', () => {
        expect(validarRun('19.011.022-K').valido).toBe(false);
        expect(validarRun('19011022K').valido).toBe(true);
    });

    it('debería tener cupones válidos definidos', () => {
        expect(CUPONES_VALIDOS).toHaveProperty('DUOC10');
        expect(CUPONES_VALIDOS.DUOC10).toBe(0.10);
    });
});

describe('dataService - Persistencia (productos)', () => {

    it('debería devolver los productos iniciales si no hay nada guardado', () => {
        // localStorage ya está limpio por el beforeEach global
        const productos = getProductosBD();
        expect(productos.length).toBeGreaterThan(0);
        expect(productos[0]).toHaveProperty('id');
        expect(productos[0]).toHaveProperty('precio');
    });

    it('debería persistir productos correctamente en localStorage', () => {
        const listaPrueba = [
            { id: 'TEST-001', nombre: 'Test', precio: 1000, stock: 5 }
        ];
        saveProductosBD(listaPrueba);

        const guardado = JSON.parse(localStorage.getItem('collector_productos'));
        expect(guardado.length).toBe(1);
        expect(guardado[0].id).toBe('TEST-001');
    });
});

describe('dataService - Autorización de supervisor', () => {

    beforeEach(() => {
        localStorage.setItem('collector_usuarios', JSON.stringify(usuariosIniciales));
    });

    it('debería autorizar con la contraseña correcta de un administrador', () => {
        const res = validarClaveSupervisorBD('admin1234');
        expect(res.valido).toBe(true);
        expect(res.admin).toBeDefined();
        expect(res.admin.rol).toBe('Administrador');
    });

    it('debería rechazar una contraseña de supervisor incorrecta', () => {
        const res = validarClaveSupervisorBD('clave-mala-123');
        expect(res.valido).toBe(false);
        expect(res.msj).toContain('incorrecta');
    });
});

describe('dataService - Auditoría (logs)', () => {

    it('debería registrar un log de auditoría correctamente', () => {
        registrarLogAuditoriaBD('APERTURA_TURNO', 'Turno #123 con $50000', 'jose@shinobi7.cl');

        const logs = JSON.parse(localStorage.getItem('collector_audit_logs'));
        expect(logs.length).toBe(1);
        expect(logs[0].accion).toBe('APERTURA_TURNO');
        expect(logs[0].usuarioCorreo).toBe('jose@shinobi7.cl');
        expect(logs[0].id).toMatch(/^LOG-/);
    });
});