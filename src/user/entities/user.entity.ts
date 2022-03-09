import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Bu dekoratör, bir varlık olacak sınıfları işaretlemek için kullanılır (tablo
 * veya belge, veritabanı türüne bağlıdır). Onunla süslenmiş tüm sınıflar için
 * veritabanı şeması oluşturulacak ve bunun için depo alınabilir ve
 * kullanılabilir.
 */
@Entity()
export class User {
  /**
   * Sütun dekoratörü, belirli bir sınıf özelliğini tablo sütunu olarak
   * işaretlemek için kullanılır. Otomatik artalan
   * "nextval('user_id_seq'::regclass)" sayı sütunudur. Birincildir ama
   * "IDENTITY" özeliiği almaz.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Sütun dekoratörü, belirli bir sınıf özelliğini tablo sütunu olarak
   * işaretlemek için kullanılır. Varlık kaydedildiğinde, yalnızca bu
   * dekoratörle dekore edilmiş özellikler veritabanında kalıcı olacaktır.
   */
  @Column({ nullable: false })
  name: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;
}
