# Nest JS Rest API çalışması

## Kaynak oluşturma

Öncelikle API için bir endpoint dalı oluşturmak için şu komutu yürütüyoruz.

`nest g resource user`

Bize varlık (`entities`), veri transfer objesi (`dto` - `DataTransferObject`), controller, service ve module dosya ve klasörlerini oluşturur.

Şimdi işlemlerimize başlayalım.

## Veri tabanı ve veri işlemleri için gereklilikleri ekleme

Veri tabanı için gereken paketleri şu komutla yükleelim.

`npm install --save @nestjs/typeorm typeorm pg`

TypeOrm hakkında bilgi almak için: [TypeORM](https://typeorm.io/#/)

### Veri tabanı için bağlatıları sağlama

Bunun için `app.module.ts` dosyasına gidelim ve şu kaynağı `@Module` dekoratörü altınada import edelim.

```typescript
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    /**
     * forRoot() yöntemi, TypeORM paketinden createConnection() işlevi
     * tarafından sunulan tüm yapılandırma özelliklerini destekler.
     * 
     * "ormconfig.json" ile de kullanılabilir. Bu fonksiyonu boş çağırmanız
     * yeterli olur o zaman.
     */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '******',
      // Bu veritabanı oluşturulmauş olmalı.
      database: 'firstBase',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
  ],
})
```

## API oluşturma

### `USER` varlığını oluşturma

`User` varlığı dediğimiz biraz daha açmak istersek bir sınıf oluşturmaktır. Bu sınıf varlığın bilgilerini depolama işini yaptığı için bir sınıftan ziyade varlığa ait bir tanım olarak gördüğüm için varlık olarak söz etmekteyim aslı sınıf olarak geçebilir.

Bunu `src\user\entities\user.entity.ts` dosyamızda oluşturalım.

```typescript
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
```

Bu varlığı ise TypeORM'e eklememiz gerek. Eğer direk elle girecekseniz. Veritabanının bağlantı kısmında bulunan dizi içerisinde bu varlığı eklemeniz yeterliydi ama bu `User` için oluşturulmuş bir varlık. Bu yüzden biz bunu aşağıdaki şekilde `src\user\user.module.ts` içinde çağırıyoruz.

```typescript
import { User } from './entities/user.entity';

@Module({
  /**
   * Bu modül, geçerli kapsamda hangi havuzların kaydedildiğini tanımlamak için
   * forFeature() yöntemini kullanır.
   */
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
```

### API için endpoint yazımı

Şimdi Veri tabanımızı ve varlığımızı tanımladık. Şimdi endpoint oluşturmak ve kullanmak için şuraya `src\user\user.controller.ts` bir gidelim.

```typescript
/**
 * Bir sınıfı, gelen istekleri alabilen ve yanıtlar üretebilen bir Nest denetleyicisi olarak işaretleyen dekoratör.
 * @param string Endpoint noktası.
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  //* /user POST endpoint işareti.
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  //* /user GET endpoint işareti.
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  //* /user/:id GET endpoint işareti. "id" parametre olarak gelir.
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  //* /user/:id PATCH endpoint işareti. "id" parametre olarak gelir.
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  //* /user/:id DELETE endpoint işareti. "id" parametre olarak gelir.
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
```

### Endpoint için bir servis

Sıra geldi servise. Bizim konrol kısmı kendine gelen her istekte çalışması gereken fonksiyonlardır kabaca.

```typescript
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    /**
     * Bizim bir varlığımız vardı ve bu bir depoydu aynı zamanda. İşte şimdi o
     * depoyu servise aktaralım ve üzerinde tanımlı olan işlemleri kullanalım.
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  create(user: CreateUserDto) {
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }
}
```

> İşlemlerimiz şimdilik bu kadardır. `test\http-req\user.http` dosyasında bir kaç istek örneğim mevcut. Eğer bir hata olursa lütfen bana bildiriniz.
