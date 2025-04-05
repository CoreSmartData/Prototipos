import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Venta } from './Venta';
import { Credito } from './Credito';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente!: number;

  @Column()
  nombre!: string;

  @Column()
  direccion!: string;

  @Column()
  telefono!: string;

  @Column()
  email!: string;

  @Column()
  rfc!: string;

  @Column({
    type: 'enum',
    enum: ['normal', 'credito'],
    default: 'normal'
  })
  tipo_cliente!: 'normal' | 'credito';

  @Column('decimal', { precision: 10, scale: 2 })
  limite_credito!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  saldo_actual!: number;

  @Column({ default: true })
  activo!: boolean;

  @OneToMany(() => Venta, venta => venta.cliente)
  ventas!: Venta[];

  @OneToMany(() => Credito, credito => credito.cliente)
  creditos!: Credito[];
} 