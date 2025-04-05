import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from './Producto';

@Entity('unidades_medida')
export class UnidadMedida {
  @PrimaryGeneratedColumn()
  id_unidad!: number;

  @Column()
  unidad!: string;

  @OneToMany(() => Producto, producto => producto.unidadMedida)
  productos!: Producto[];
} 