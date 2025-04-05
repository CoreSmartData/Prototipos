import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Credito } from './Credito';

@Entity('pagos_credito')
export class PagoCredito {
  @PrimaryGeneratedColumn()
  id_pago!: number;

  @Column()
  id_credito!: number;

  @Column({ type: 'date' })
  fecha_pago!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  monto_pagado!: number;

  @Column({ length: 50 })
  metodo_pago!: string;

  @Column('text', { nullable: true })
  observaciones!: string;

  @ManyToOne(() => Credito, credito => credito.pagos)
  @JoinColumn({ name: 'id_credito' })
  credito!: Credito;
} 