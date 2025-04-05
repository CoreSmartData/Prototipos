import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './Producto';
import { Sucursal } from './Sucursal';
import { TipoMovimiento } from './TipoMovimiento';

@Entity('movimientos_inventario')
export class MovimientoInventario {
  @PrimaryGeneratedColumn()
  id_movimiento!: number;

  @Column()
  id_producto!: number;

  @Column()
  id_sucursal!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha!: Date;

  @Column()
  id_tipo_movimiento!: number;

  @Column()
  cantidad!: number;

  @Column({ length: 100, nullable: true })
  referencia!: string;

  @Column('text', { nullable: true })
  observaciones!: string;

  @ManyToOne(() => Producto, producto => producto.movimientos)
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;

  @ManyToOne(() => Sucursal, sucursal => sucursal.movimientos)
  @JoinColumn({ name: 'id_sucursal' })
  sucursal!: Sucursal;

  @ManyToOne(() => TipoMovimiento, tipoMovimiento => tipoMovimiento.movimientos)
  @JoinColumn({ name: 'id_tipo_movimiento' })
  tipoMovimiento!: TipoMovimiento;
} 