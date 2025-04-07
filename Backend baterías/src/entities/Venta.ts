import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cliente } from './Cliente';
import { Sucursal } from './Sucursal';
import { TipoPago } from './TipoPago';
import { DetalleVenta } from './DetalleVenta';
import { Credito } from './Credito';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id_venta!: number;

  @Column()
  id_cliente!: number;

  @Column()
  id_sucursal!: number;

  @Column({ type: 'datetime' })
  fecha!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @Column()
  id_tipo_pago!: number;

  @Column({ nullable: true })
  observaciones!: string;

  @ManyToOne(() => Cliente, cliente => cliente.ventas)
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente;

  @ManyToOne(() => Sucursal, sucursal => sucursal.ventas)
  @JoinColumn({ name: 'id_sucursal' })
  sucursal!: Sucursal;

  @ManyToOne(() => TipoPago, tipoPago => tipoPago.ventas)
  @JoinColumn({ name: 'id_tipo_pago' })
  tipoPago!: TipoPago;

  @OneToMany(() => DetalleVenta, detalle => detalle.venta)
  detalles!: DetalleVenta[];

  @OneToMany(() => Credito, credito => credito.venta)
  creditos!: Credito[];
} 