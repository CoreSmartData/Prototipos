import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Inventario } from './Inventario';
import { Venta } from './Venta';
import { Traspaso } from './Traspaso';
import { MovimientoInventario } from './MovimientoInventario';

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

  @Column({ default: true })
  activo!: boolean;

  @OneToMany(() => Inventario, inventario => inventario.sucursal)
  inventarios!: Inventario[];

  @OneToMany(() => Venta, venta => venta.sucursal)
  ventas!: Venta[];

  @OneToMany(() => Traspaso, traspaso => traspaso.sucursalOrigen)
  traspasosOrigen!: Traspaso[];

  @OneToMany(() => Traspaso, traspaso => traspaso.sucursalDestino)
  traspasosDestino!: Traspaso[];

  @OneToMany(() => MovimientoInventario, movimiento => movimiento.sucursal)
  movimientos!: MovimientoInventario[];
} 