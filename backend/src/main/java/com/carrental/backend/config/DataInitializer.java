package com.carrental.backend.config;

import com.carrental.backend.model.*;
import com.carrental.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Configuration
public class DataInitializer {

        @Bean
        public CommandLineRunner initData(
                        ProductRepository productRepository,
                        CategoryRepository categoryRepository) {
                return args -> {
                        if (categoryRepository.count() > 0 && productRepository.count() > 9) {
                                return;
                        }

                        System.out.println("Initializing car rental data for Sprint 1...");

                        // 1. Categories
                        Category suv = categoryRepository.save(new Category(null, "SUV", "Sport Utility Vehicles",
                                        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80"));
                        Category electric = categoryRepository.save(new Category(null, "Electric",
                                        "Sustainable driving",
                                        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=500&q=80"));
                        Category luxury = categoryRepository.save(new Category(null, "Luxury", "Elegance and comfort",
                                        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80"));
                        Category economy = categoryRepository.save(new Category(null, "Economy",
                                        "Fuel efficient and affordable",
                                        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=80"));
                        Category convertible = categoryRepository.save(new Category(null, "Convertible",
                                        "Feel the wind",
                                        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=500&q=80"));
                        Category sedan = categoryRepository.save(new Category(null, "Sedan",
                                        "Practical and comfortable",
                                        "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=500&q=80"));

                        // 2. Products
                        // 1. Tesla Model 3 (Electric)
                        Product tesla = new Product();
                        tesla.setName("Tesla Model 3");
                        tesla.setDescription(
                                        "Fully electric, with impressive acceleration and state-of-the-art technology.");
                        tesla.setCity("Buenos Aires");
                        tesla.setCategory(electric);
                        tesla.setPrice(95.0);
                        tesla.setRating(4.9);
                        tesla.setTrips(124);
                        tesla.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Tesla Main",
                                                        "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1000&q=80"),
                                        new Image(null, "Tesla Interior",
                                                        "https://octane.rent/wp-content/uploads/2024/12/Tesla-Model-3-black-4-600x400.webp"),
                                        new Image(null, "Tesla Wheel",
                                                        "https://external-preview.redd.it/eTkpoukeZA9AFGNZRJ1Bj2Sllak_2zE3MmPFaVcH34o.jpg?width=640&crop=smart&auto=webp&s=155c7add1409320254b14ce857cf3c5126596e00"),
                                        new Image(null, "Tesla Dashboard",
                                                        "https://tesfavs.com/wp-content/uploads/2024/01/2024-Tesla-Model-3-Highland-Ambient-Lighting-Kit-00001.jpg"),
                                        new Image(null, "Tesla Screen",
                                                        "https://www.seuwagen.com/images/r000789_83420281.jpeg"))));

                        // 2. Jeep Wrangler (SUV)
                        Product jeep = new Product();
                        jeep.setName("Jeep Wrangler");
                        jeep.setDescription(
                                        "Perfect for tough terrains and off-road adventures. Experience the freedom.");
                        jeep.setCity("Mendoza");
                        jeep.setCategory(suv);
                        jeep.setPrice(120.0);
                        jeep.setRating(4.8);
                        jeep.setTrips(86);
                        jeep.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Jeep Main",
                                                        "https://www.autolist.mx/mxupload/2024/05/04/BtoRinbl-jd.webp"),
                                        new Image(null, "Jeep Side",
                                                        "https://i.pinimg.com/originals/6f/0c/ce/6f0ccecc7efe479d918cdc32f9237c01.jpg"),
                                        new Image(null, "Jeep Interior",
                                                        "https://i.pinimg.com/736x/5a/ed/cd/5aedcd69a99c87f5d5e803f64d05d8c1.jpg"),
                                        new Image(null, "Jeep Wheel",
                                                        "https://www.jeep.com.ar/content/dam/cross-regional/latam/jeep/es_ar/bhp/hero/2025/galeria/galeria-02-desk.jpg.img.1440.jpg"),
                                        new Image(null, "Jeep Mud",
                                                        "https://autoblog.com.ar/wp-content/uploads/2025/10/20251001_081108-scaled.jpg"))));

                        // 3. Chevrolet Onix (Economy)
                        Product onix = new Product();
                        onix.setName("Chevrolet Onix");
                        onix.setDescription(
                                        "Economic and reliable for city driving. Modern interior and great fuel efficiency.");
                        onix.setCity("Córdoba");
                        onix.setCategory(economy);
                        onix.setPrice(45.0);
                        onix.setRating(4.5);
                        onix.setTrips(210);
                        onix.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Onix Main",
                                                        "https://fotos.perfil.com/2019/11/20/trim/876/492/nuevo-chevrolet-onix-joy-y-onix-joy-plus-807196.jpg"),
                                        new Image(null, "Onix Interior",
                                                        "https://www.chevrolet.com.ar/content/dam/chevrolet/sa/argentina/espanol/index/cars/2020-onix-plus-premier/myr-2026/rendimiento/onix-plus-lateral.jpg?imwidth=1200"),
                                        new Image(null, "Onix Dashboard",
                                                        "https://www.kovacschevrolet.cl/content/dam/chevrolet/sa/cl/es/master/index/models/onix-sedan/1-masthead/mh-mob.jpg?imwidth=1920"),
                                        new Image(null, "Onix Wheel",
                                                        "https://media.a24.com/adjuntos/296/migration/images/2020/9/24/m2snxbi91-768x000.jpeg."),
                                        new Image(null, "Onix Back",
                                                        "https://autotest.com.ar/wp-content/uploads/2020/05/super-test-chevrolet-onix-4.jpg"))));

                        // 4. Ford Mustang (Convertible)
                        Product mustang = new Product();
                        mustang.setName("Ford Mustang");
                        mustang.setDescription("Iconic muscle car with a powerful engine. Feel the wind in your hair.");
                        mustang.setCity("Miami");
                        mustang.setCategory(convertible);
                        mustang.setPrice(150.0);
                        mustang.setRating(5.0);
                        mustang.setTrips(45);
                        mustang.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Mustang Main",
                                                        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=80"),
                                        new Image(null, "Mustang Wheel",
                                                        "https://st4.depositphotos.com/27201292/30156/i/450/depositphotos_301569168-stock-photo-gray-ford-mustang.jpg"),
                                        new Image(null, "Mustang Front",
                                                        "https://lignonautomobiles.com/wp-content/uploads/2023/11/20231106_162757-scaled.jpg"),
                                        new Image(null, "Mustang Detail",
                                                        "https://tn.com.ar/resizer/v2/interior-del-nuevo-ford-mustang-TFQ5WU6N4BCEDKNTVIP4CGB7SE.jpg?auth=09cff40361fcb602f5d2cbbf464d63d6bf112a969df4ee3d1a20b63d1073ce1e&width=767"),
                                        new Image(null, "Mustang Engine",
                                                        "https://cdn.motor1.com/images/mgl/bgzLZk/s3/2024-ford-mustang-v8-engine.jpg"))));

                        // 5. Audi R8 (Luxury)
                        Product audi = new Product();
                        audi.setName("Audi R8");
                        audi.setDescription(
                                        "Supercar performance with luxury finishes. For those who demand the best.");
                        audi.setCity("Los Angeles");
                        audi.setCategory(luxury);
                        audi.setPrice(350.0);
                        audi.setRating(4.9);
                        audi.setTrips(12);
                        audi.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Audi Main",
                                                        "https://cdn.motor1.com/images/mgl/JOBB2g/s3/audi-r8-v-10-vegas-yellow.jpg"),
                                        new Image(null, "Audi Detail",
                                                        "https://i.blogs.es/9eac71/man_160426_4042/1366_2000.jpg"),
                                        new Image(null, "Audi Interior",
                                                        "https://www.lavanguardia.com/files/og_thumbnail/files/fp/uploads/2024/03/01/65e1df7beef07.r_d.706-481-9909.png"),
                                        new Image(null, "Audi Wheel",
                                                        "https://http2.mlstatic.com/D_NQ_NP_985351-MLM99522721955_112025-O-audi-r8-53-v10-coupe-plus-s-tronic-dsg.webp"),
                                        new Image(null, "Audi Dynamic",
                                                        "https://motorba.com.ar/wp-content/uploads/que-motor-tiene-el-audi-r8-v10.webp"))));

                        // 6. BMW 3 Series (Sedan)
                        Product bmw = new Product();
                        bmw.setName("BMW 3 Series");
                        bmw.setDescription("The ultimate driving machine for everyday use. Sporty and elegant.");
                        bmw.setCity("Bariloche");
                        bmw.setCategory(sedan);
                        bmw.setPrice(85.0);
                        bmw.setRating(4.7);
                        bmw.setTrips(98);
                        bmw.setImages(new ArrayList<>(List.of(
                                        new Image(null, "BMW Main",
                                                        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80"),
                                        new Image(null, "BMW Interior",
                                                        "https://mediapool.bmwgroup.com/cache/P9/202205/P90462486/P90462486-the-new-bmw-3-series-sedan-m-brooklyn-grey-metallic-rim-19-styling-791m-bicolor-05-2022-2250px.jpg"),
                                        new Image(null, "BMW Front",
                                                        "https://www.lloydmotorgroup.com/VehicleLibrary/541589-Tu2A6RzL40yEcbUv9yxE2g.jpg?height=648.75&heightratio=0.75&mode=crop&upscale=true&width=865"),
                                        new Image(null, "BMW Logo",
                                                        "https://acnews.blob.core.windows.net/imgnews/paragraph/NPAZ_1836fe1a34614cb0bc5362a6de3da47c.webp"),
                                        new Image(null, "BMW Side",
                                                        "https://st2.depositphotos.com/1705215/10024/i/950/depositphotos_100244784-stock-photo-engine-m-power-of-bmw.jpg"))));

                        // 7. Porsche 911 (Luxury)
                        Product porsche = new Product();
                        porsche.setName("Porsche 911");
                        porsche.setDescription("Precision engineering and timeless design. An automotive masterpiece.");
                        porsche.setCity("Miami");
                        porsche.setCategory(luxury);
                        porsche.setPrice(450.0);
                        porsche.setRating(5.0);
                        porsche.setTrips(5);
                        porsche.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Porsche Main",
                                                        "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80"),
                                        new Image(null, "Porsche Rear",
                                                        "https://octane.rent/wp-content/uploads/2022/11/porsche-911-turbo-3-600x400.webp"),
                                        new Image(null, "Porsche Side",
                                                        "https://octane.rent/wp-content/uploads/2022/11/porsche-911-turbo-8-600x400.webp"),
                                        new Image(null, "Porsche Detail",
                                                        "https://espirituracer.com/archivos/2020/03/porsche-911-turbo-s-992-13.jpg"),
                                        new Image(null, "Porsche Interior",
                                                        "https://bringatrailer.com/wp-content/uploads/2024/11/2015_porsche_911-turbo-coupe_2015-porsche-911-turbo-114dsc07598-64048.jpg?w=620&resize=620%2C413"))));

                        // 8. Toyota Corolla (Sedan)
                        Product corolla = new Product();
                        corolla.setName("Toyota Corolla");
                        corolla.setDescription(
                                        "Reliable, fuel-efficient, and comfortable. The world's favorite sedan.");
                        corolla.setCity("Buenos Aires");
                        corolla.setCategory(sedan);
                        corolla.setPrice(55.0);
                        corolla.setRating(4.6);
                        corolla.setTrips(150);
                        corolla.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Corolla Main",
                                                        "https://media.toyota.com.ar/e31717ae-34d8-4174-ba33-7522701c463c.jpeg"),
                                        new Image(null, "Corolla Side",
                                                        "https://cdncla.lavoz.com.ar/files/avisos/aviso_auto/aviso-auto-toyota-corolla-14678884.webp"),
                                        new Image(null, "Corolla Interior",
                                                        "https://img.hasznaltautocdn.com/2048x1536/22634761/20711621.jpg"),
                                        new Image(null, "Corolla Wheel",
                                                        "https://media.toyota.com.ar/19ccbeb2-6243-4fd6-b475-c7139cafb888.jpeg"),
                                        new Image(null, "Corolla Logo",
                                                        "https://www.deruedas.com.ar/images/autos/Toyota-Corolla-2026/553/553962_8_im.jpg?edit=13"))));

                        // 9. Fiat 500 (Economy)
                        Product fiat = new Product();
                        fiat.setName("Fiat 500");
                        fiat.setDescription(
                                        "Compact and stylish, perfect for narrow city streets. Italian design at its best.");
                        fiat.setCity("Rome");
                        fiat.setCategory(economy);
                        fiat.setPrice(40.0);
                        fiat.setRating(4.4);
                        fiat.setTrips(42);
                        fiat.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Fiat Main",
                                                        "https://gsegno2.wordpress.com/wp-content/uploads/2014/05/fiat-500-abarth-595-3_thumb.jpg?w=716&h=477"),
                                        new Image(null, "Fiat Side",
                                                        "https://hips.hearstapps.com/autoweek/assets/s3fs-public/ft017_001fhu5q7kutmn82hlv5ss10oehs6ua.jpg?resize=640:*"),
                                        new Image(null, "Fiat Interior",
                                                        "https://http2.mlstatic.com/D_Q_NP_2X_760467-MLA104373155268_012026-T.webp"),
                                        new Image(null, "Fiat Wheel",
                                                        "https://http2.mlstatic.com/D_NQ_NP_799701-MLA98298439944_112025-O.webp"),
                                        new Image(null, "Fiat Dash",
                                                        "https://i.pinimg.com/736x/82/27/77/8227772a5fc03107c904d50fa5ab254a.jpg"))));
                        productRepository.saveAll(
                                        List.of(tesla, jeep, onix, mustang, audi, bmw, porsche, corolla, fiat));

                        System.out.println("Sprint 1 Data initialized successfully!");
                };
        }
}
