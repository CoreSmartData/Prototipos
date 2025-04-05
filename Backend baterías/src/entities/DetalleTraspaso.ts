import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Traspaso } from './Traspaso';
import { Producto } from './Producto';

@Entity('detalle_traspaso')
export class DetalleTraspaso {
  @PrimaryGeneratedColumn()
  id_detalle!: number;

  @Column()
  id_traspaso!: number;

  @Column()
  id_producto!: number;

  @Column()
  cantidad!: number;

  @ManyToOne(() => Traspaso, traspaso => traspaso.detalles)
  @JoinColumn({ name: 'id_traspaso' })
  traspaso!: Traspaso;

  @ManyToOne(() => Producto, producto => producto.detallesTraspaso)
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;
} 