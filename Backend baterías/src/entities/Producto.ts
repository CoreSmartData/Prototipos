import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UnidadMedida } from './UnidadMedida';
import { Categoria } from './Categoria';
import { Inventario } from './Inventario';
import { DetalleVenta } from './DetalleVenta';
import { MovimientoInventario } from './MovimientoInventario';
import { DetalleTraspaso } from './DetalleTraspaso';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id_producto!: number;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_venta!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  costo!: number;

  @Column()
  id_unidad!: number;

  @Column()
  id_categoria!: number;

  @Column({ type: 'tinyint', default: 1 })
  activo!: boolean;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  stock_minimo!: number;

  @ManyToOne(() => UnidadMedida, unidadMedida => unidadMedida.productos)
  @JoinColumn({ name: 'id_unidad' })
  unidadMedida!: UnidadMedida;

  @ManyToOne(() => Categoria, categoria => categoria.productos)
  @JoinColumn({ name: 'id_categoria' })
  categoria!: Categoria;

  @OneToMany(() => Inventario, inventario => inventario.producto)
  inventarios!: Inventario[];

  @OneToMany(() => DetalleVenta, detalleVenta => detalleVenta.producto)
  detallesVenta!: DetalleVenta[];

  @OneToMany(() => MovimientoInventario, movimiento => movimiento.producto)
  movimientos!: MovimientoInventario[];

  @OneToMany(() => DetalleTraspaso, detalleTraspaso => detalleTraspaso.producto)
  detallesTraspaso!: DetalleTraspaso[];
} 