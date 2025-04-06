import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Venta } from './Venta';
import { Credito } from './Credito';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  telefono!: string;

  @Column({ nullable: true })
  direccion!: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  fechaCreacion!: Date;

  @UpdateDateColumn()
  fechaActualizacion!: Date;

  @OneToMany(() => Venta, venta => venta.cliente)
  ventas!: Venta[];

  @OneToMany(() => Credito, credito => credito.cliente)
  creditos!: Credito[];
} 