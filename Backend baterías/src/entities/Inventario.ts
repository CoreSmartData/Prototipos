import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './Producto';
import { Sucursal } from './Sucursal';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id_inventario!: number;

  @Column()
  id_producto!: number;

  @Column()
  id_sucursal!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  stock!: number;

  @ManyToOne(() => Producto, producto => producto.inventarios)
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;

  @ManyToOne(() => Sucursal, sucursal => sucursal.inventarios)
  @JoinColumn({ name: 'id_sucursal' })
  sucursal!: Sucursal;
} 