package com.progi.AlfaBeta.putninalozi.rest;

import com.progi.AlfaBeta.putninalozi.dao.KorisnikRepository;
import com.progi.AlfaBeta.putninalozi.domain.*;
import com.progi.AlfaBeta.putninalozi.service.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
    @RequestMapping("/")
    @CrossOrigin(value = "http://localhost:3000", allowedHeaders = "*")
    public class AdministratorController {

        @Autowired
        private AdministratorService administratorService;

        @Autowired
        private KorisnikService korisnikService;

        @Autowired
        private KorisnikRepository korisnikRepository;

        @Autowired
        private ZaposlenikService zaposlenikService;

        @Autowired
        private PromjenaLozinkeService promjenaLozinkeService;

        @Autowired
        private FirmaService firmaService;

        @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
        @PostMapping(value = "/novi-korisnik",  consumes = {"application/json"})
        public ResponseEntity<?> addKorisnik(@RequestBody String zahtjevData) {
            JsonParser parser = JsonParserFactory.getJsonParser();
            System.out.println(zahtjevData);
            Map<String, Object> korisnikMap = parser.parseMap(zahtjevData);
            Korisnik korisnik = korisnikService.findByUserName(korisnikMap.get("username").toString());
            Zaposlenik zaposlenik = zaposlenikService.findByOib(korisnikMap.get("oib").toString());
            if (zaposlenik != null) {
                return new ResponseEntity<>("Zaposlenik s tim OIB-om već postoji.", HttpStatus.OK);
            } else if (korisnik != null) {
                return new ResponseEntity<>("Korisnik s tim korisničkim imenom već postoji.", HttpStatus.OK);
            } else {
                Korisnik korisnik1 = new Korisnik();
                Zaposlenik zaposlenik1 = new Zaposlenik();
                try {
                    korisnik1.setKorisnickoIme(korisnikMap.get("username").toString());
                    korisnik1.setZaporka(DigestUtils
                            .md5Hex(korisnikMap.get("password").toString()));
                    korisnik1.setOib(korisnikMap.get("oib").toString());
                    korisnik1.setEmail(korisnikMap.get("email").toString());
                    zaposlenik1.setIme(korisnikMap.get("ime").toString());
                    zaposlenik1.setPrezime(korisnikMap.get("prezime").toString());
                    int uloga = 1;
                    switch (korisnikMap.get("uloga").toString()) {
                        case "Zaposlenik":
                            uloga = 1;
                            break;
                        case "Voditelj":
                            uloga = 2;
                            break;
                        case "Zamjenik":
                            uloga = 3;
                            break;
                        case "Računovođa":
                            uloga = 4;
                            break;
                        case "Admin":
                            uloga = 5;
                            break;
                    }
                    zaposlenik1.setUloga(Uloga.valueOf(uloga));
                    zaposlenik1.setTimId(Integer.parseInt(korisnikMap.get("tim_id").toString()));
                    zaposlenik1.setOib(korisnikMap.get("oib").toString());
                    administratorService.addZaposlenik(zaposlenik1);
                    administratorService.addKorisnik(korisnik1);

                    return new ResponseEntity("Korisnik/zaposlenik uspješno unesen u bazu podataka.", HttpStatus.ACCEPTED);
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                    return new ResponseEntity<>("Greška u ulaznim podacima.", HttpStatus.OK);
                }
            }
        }

        @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
        @PostMapping(value = "/izbrisi-korisnika", consumes = {"application/json"})
        public ResponseEntity<?> deleteKorisnik(@RequestBody String korisnikData) {
            JsonParser parser = JsonParserFactory.getJsonParser();
//        System.out.println(korisnikData);
            Map<String, Object> korisnikMap = parser.parseMap(korisnikData);
            Korisnik korisnik = korisnikService.findByUserName(korisnikMap.get("username").toString());
            if (korisnik != null) {
//            System.out.println(korisnik);
                korisnikService.deleteKorisnikByKorisnickoIme(korisnik.getKorisnickoIme());
                zaposlenikService.deleteByOib(korisnik.getOib());
                PromjenaLozinke zahtjev =promjenaLozinkeService.findByUsername(korisnik.getKorisnickoIme());
                if(zahtjev != null) {
                promjenaLozinkeService.deletePromjenaLozinke(zahtjev);}
                return new ResponseEntity<>("Korisnik s korisničkim imenom ".concat(korisnikMap.get("username").toString()).concat(" je obrisan."), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Korisnik s korisničkim imenom ".concat(korisnikMap.get("username").toString()).concat(" ne postoji."), HttpStatus.ACCEPTED);
            }
        }

        @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
        @PostMapping(value = "/zakljuci-godinu",  consumes = {"application/json"})
        public ResponseEntity<?> zakljuciGodinu(@RequestBody String godinaData) {
            JsonParser parser = JsonParserFactory.getJsonParser();
            Map<String, Object> godinaMap = parser.parseMap(godinaData);
            try{
                int godina = Integer.parseInt(godinaMap.get("godina").toString());
                administratorService.zakljuciPoslovnuGodinu(godina);
                return new ResponseEntity<>("Uspješno zaključena godina", HttpStatus.OK);
            }
            catch (NumberFormatException e){
                return new ResponseEntity<>("Greška u ulaznim podacima", HttpStatus.ACCEPTED);
            }
        }

        @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
        @GetMapping(value = "/prikazi-zaposlenike", produces = {"application/json", "text/plain"})
        public ResponseEntity<?> getAllZaposlenici() {
//        System.out.println(zaposlenikService.listAll());
            try {
                List<Zaposlenik> zaposlenici = zaposlenikService.listAll();
                List<String> pomocna;
                pomocna = new ArrayList<>();

                StringBuilder builder = new StringBuilder();
                builder.append("{\"korisnici\":");
                for(Zaposlenik z : zaposlenici){
                    Korisnik korisnik = korisnikService.findByOib(z.getOib());
                    pomocna.add("{\"oib\":\"" + z.getOib() +
                            "\",\"ime\":\"" + z.getIme() +
                            "\",\"prezime\":\"" + z.getPrezime() +
                            "\",\"uloga\":\"" + z.getUloga() +
                            "\",\"timId\":\"" + z.getTimId() +
                            "\",\"korisnickoIme\":\"" + korisnik.getKorisnickoIme() +
                            "\",\"email\":\"" + korisnik.getEmail() + "\"}");
                }
                builder.append(pomocna);
                builder.append("}");
                String res = builder.toString();
                return new ResponseEntity<>(res, HttpStatus.OK);
            }
            catch (Exception e) {
                return new ResponseEntity<>("Greška pri dohvaćanju podataka", HttpStatus.ACCEPTED);
            }
        }

        @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
        @GetMapping("/firma-podatci")
        public ResponseEntity<?> getFirmInfo() {
//        System.out.println(firmaService.listAll());
            Firma firma = firmaService.listAll().get(0);
            List<String> pomocna = new ArrayList<String>();
            StringBuilder builder = new StringBuilder();
            pomocna.add("{\"oib\":\"" + firma.getOib() +
                    "\",\"adresa\":\"" + firma.getAdresa() +
                    "\",\"ime\":\"" + firma.getIme() +
                    "\",\"email\":\"" + firma.getEmail()  + "\"}");

            if (pomocna.size() == 0) builder.append("[]");
            else builder.append(pomocna);
            String res = builder.toString();
            System.out.println(res);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
        @PostMapping(value = "/firma-podatci", consumes = "application/json")
        public ResponseEntity<?> updateFirmInfo(@RequestBody String data) {
            JsonParser parser = JsonParserFactory.getJsonParser();
            Map<String, Object> dataMap = parser.parseMap(data);
            Firma firma = new Firma();
            try {
                firma.setAdresa(dataMap.get("adresa").toString());
            }
            catch(Exception e){
                System.out.println(e.toString());
                return new ResponseEntity<>("Neispravna adresa", HttpStatus.OK);
            }
            try {
                firma.setOib(dataMap.get("oib").toString());
            }
            catch(Exception e){
                System.out.println(e.toString());
                return new ResponseEntity<>("Neispravan oib", HttpStatus.OK);
            }
            try {
                firma.setEmail(dataMap.get("email").toString());
            }
            catch(Exception e){
                System.out.println(e.toString());
                return new ResponseEntity<>("Neispravan email", HttpStatus.OK);
            }
            try {
                firma.setIme(dataMap.get("ime").toString());
            }
            catch(Exception e){
                System.out.println(e.toString());
                return new ResponseEntity<>("Neispravno ime", HttpStatus.OK);
            }
            try{
                firmaService.update(firma);
            }
            catch(Exception e){
                return new ResponseEntity<>("Greška u sustavu. Kontaktirajte administratora.", HttpStatus.OK);
            }
            return new ResponseEntity<>("Pohranjene promjene", HttpStatus.OK);
        }

        @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
        @GetMapping("/zahtjevi-za-lozinke")
        public ResponseEntity<?> getPasswordRequests() {
            try {
                return new ResponseEntity<>(promjenaLozinkeService.listAll(), HttpStatus.OK);
            }
            catch (Exception e) {
                return new ResponseEntity<>("Greška pri dohvaćanju podataka", HttpStatus.ACCEPTED);
            }
        }

        @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
        @PostMapping(value = "/promjena-lozinke", consumes = {"application/json"})
        public ResponseEntity<?> changePassword (@RequestBody String userData) {
            JsonParser parser = JsonParserFactory.getJsonParser();
            Map<String, Object> data = parser.parseMap(userData);
            String username = data.get("username").toString();
            String password= DigestUtils
                    .md5Hex(data.get("password").toString());
            String err = "";
            try {
                Optional<Korisnik> korisnik = Optional.ofNullable(korisnikService.findByUserName(username));
                if (korisnik != null) {
                    Korisnik user = korisnik.get();
                    user.setZaporka(password);
                    Korisnik updateResponse = korisnikService.update(user);
                    PromjenaLozinke promjenaLozinke = new PromjenaLozinke();
                    promjenaLozinke = promjenaLozinkeService.findByUsername(username);
                    if (promjenaLozinke == null)
                        return new ResponseEntity<>("Zaposlenik " + username + " nije zatražio promjenu lozinke.", HttpStatus.ACCEPTED);
                    promjenaLozinkeService.deletePromjenaLozinke(promjenaLozinke);
//                System.out.println(updateResponse);
                    return new ResponseEntity<>("Zaporka je promijenjena.", HttpStatus.ACCEPTED);
                }
                else {
                    return new ResponseEntity<>("Ne postoji korsnik s korisničkim imenom: ." + username, HttpStatus.ACCEPTED);
                }
            } catch (Exception e) {
                err = e.getMessage();
                System.out.println(e.getMessage());
            }
            return new ResponseEntity<>(err, HttpStatus.OK);
        }

        @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
        @PostMapping(value = "/updateKorisnik", consumes = "application/json")
        public ResponseEntity<?> updateKorisnik(@RequestBody String korisnikData){
            JsonParser parser = JsonParserFactory.getJsonParser();
            Map<String, Object> korisnikMap = parser.parseMap(korisnikData);

            Korisnik korisnik = korisnikService.findByOib(korisnikMap.get("oib").toString());
            Zaposlenik zaposlenik = zaposlenikService.findByOib(korisnikMap.get("oib").toString());

            try{
                korisnik.setKorisnickoIme(korisnikMap.get("username").toString());
            } catch (Exception e){
                return new ResponseEntity<>("Greška u unosu korisničkog imena", HttpStatus.ACCEPTED);
            }

            try{
                korisnik.setEmail(korisnikMap.get("email").toString());
            } catch (Exception e){
                return new ResponseEntity<>("Greška u unosu emaila", HttpStatus.ACCEPTED);
            }

            try{
                zaposlenik.setIme(korisnikMap.get("ime").toString());
            } catch (Exception e){
                return new ResponseEntity<>("Greška u unosu imena", HttpStatus.ACCEPTED);
            }

            try{
                zaposlenik.setPrezime(korisnikMap.get("prezime").toString());
            } catch (Exception e){
                return new ResponseEntity<>("Greška u unosu prezimena", HttpStatus.ACCEPTED);
            }

            try{

                zaposlenik.setUloga(Uloga.valueOf(korisnikMap.get("uloga").toString()));
            } catch (Exception e){
                return new ResponseEntity<>("Greška u unosu uloge", HttpStatus.ACCEPTED);
            }

            try{
                zaposlenik.setTimId(Integer.parseInt(korisnikMap.get("tim").toString()));
            } catch (Exception e){
                return new ResponseEntity<>("Greška u unosu tima", HttpStatus.ACCEPTED);
            }
            administratorService.addKorisnik(korisnik);
            administratorService.addZaposlenik(zaposlenik);

            return new ResponseEntity<>("Uspješno promijenjeni podaci", HttpStatus.OK);
        }
    }

