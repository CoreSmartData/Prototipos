import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Sucursal } from './Sucursal';
import { DetalleTraspaso } from './DetalleTraspaso';

@Entity('traspasos')
export class Traspaso {
  @PrimaryGeneratedColumn()
  id_traspaso!: number;

  @Column({ type: 'datetime' })
  fecha!: Date;

  @Column()
  id_sucursal_origen!: number;

  @Column()
  id_sucursal_destino!: number;

  @Column({ nullable: true })
  observaciones!: string;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'completado', 'cancelado'],
    default: 'pendiente'
  })
  estado!: string;

  @ManyToOne(() => Sucursal, sucursal => sucursal.traspasosOrigen)
  @JoinColumn({ name: 'id_sucursal_origen' })
  sucursalOrigen!: Sucursal;

  @ManyToOne(() => Sucursal, sucursal => sucursal.traspasosDestino)
  @JoinColumn({ name: 'id_sucursal_destino' })
  sucursalDestino!: Sucursal;

  @OneToMany(() => DetalleTraspaso, detalle => detalle.traspaso)
  detalles!: DetalleTraspaso[];
} 