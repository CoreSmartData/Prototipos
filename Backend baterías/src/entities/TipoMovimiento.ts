import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MovimientoInventario } from './MovimientoInventario';

@Entity('tipos_movimiento')
export class TipoMovimiento {
  @PrimaryGeneratedColumn()
  id_tipo_movimiento!: number;

  @Column({
    type: 'enum',
    enum: ['entrada', 'salida']
  })
  tipo!: string;

  @OneToMany(() => MovimientoInventario, movimiento => movimiento.tipoMovimiento)
  movimientos!: MovimientoInventario[];
} 