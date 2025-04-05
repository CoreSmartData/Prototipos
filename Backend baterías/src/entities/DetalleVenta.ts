import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Venta } from './Venta';
import { Producto } from './Producto';

@Entity('detalle_ventas')
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id_detalle!: number;

  @Column()
  id_venta!: number;

  @Column()
  id_producto!: number;

  @Column()
  cantidad!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_unitario!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;

  @ManyToOne(() => Venta, venta => venta.detalles)
  @JoinColumn({ name: 'id_venta' })
  venta!: Venta;

  @ManyToOne(() => Producto, producto => producto.detallesVenta)
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;
} 