import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from './Producto';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id_categoria!: number;

  @Column({ name: 'nombre_categoria' })
  nombre!: string;

  @OneToMany(() => Producto, producto => producto.categoria)
  productos!: Producto[];
} 