import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Venta } from './Venta';

@Entity('tipos_pago')
export class TipoPago {
  @PrimaryGeneratedColumn()
  id_tipo_pago!: number;

  @Column({ name: 'tipo_pago' })
  tipo!: string;

  @OneToMany(() => Venta, venta => venta.tipoPago)
  ventas!: Venta[];
} 