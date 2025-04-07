import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Venta } from './Venta';
import { Inventario } from './Inventario';
import { MovimientoInventario } from './MovimientoInventario';
import { Traspaso } from './Traspaso';

@Entity('sucursales')
export class Sucursal {
  @PrimaryGeneratedColumn()
  id_sucursal!: number;

  @Column()
  nombre!: string;

  @Column()
  direccion!: string;

  @Column()
  telefono!: string;

  @Column()
  responsable!: string;

  @Column({ type: 'tinyint', default: 1 })
  activo!: boolean;

  @OneToMany(() => Venta, venta => venta.sucursal)
  ventas!: Venta[];

  @OneToMany(() => Inventario, inventario => inventario.sucursal)
  inventarios!: Inventario[];

  @OneToMany(() => MovimientoInventario, movimiento => movimiento.sucursal)
  movimientos!: MovimientoInventario[];

  @OneToMany(() => Traspaso, traspaso => traspaso.sucursalOrigen)
  traspasosOrigen!: Traspaso[];

  @OneToMany(() => Traspaso, traspaso => traspaso.sucursalDestino)
  traspasosDestino!: Traspaso[];
} 