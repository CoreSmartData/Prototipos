import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cliente } from './Cliente';
import { Venta } from './Venta';
import { PagoCredito } from './PagoCredito';

@Entity('creditos')
export class Credito {
  @PrimaryGeneratedColumn()
  id_credito!: number;

  @Column()
  id_cliente!: number;

  @Column()
  id_venta!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monto_total!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  saldo_pendiente!: number;

  @Column()
  fecha_inicio!: Date;

  @Column()
  fecha_vencimiento!: Date;

  @ManyToOne(() => Cliente, cliente => cliente.creditos)
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente;

  @ManyToOne(() => Venta, venta => venta.creditos)
  @JoinColumn({ name: 'id_venta' })
  venta!: Venta;

  @OneToMany(() => PagoCredito, pago => pago.credito)
  pagos!: PagoCredito[];
} 