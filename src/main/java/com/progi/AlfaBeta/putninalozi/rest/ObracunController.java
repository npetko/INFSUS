package com.progi.AlfaBeta.putninalozi.rest;


import com.fasterxml.jackson.datatype.jsr310.ser.DurationSerializer;
import com.progi.AlfaBeta.putninalozi.domain.*;
import com.progi.AlfaBeta.putninalozi.dto.ObracunDto;
import com.progi.AlfaBeta.putninalozi.service.*;
import com.progi.AlfaBeta.putninalozi.service.impl.ObracunServiceImpl;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.text.DecimalFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Controller
@RequestMapping("/obracun")
public class ObracunController {

    @Autowired
    private ObracunService obracunService;

    @Autowired
    private ZahtjevService zahtjevService;

    @Autowired
    private TrosakService trosakService;

    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private BoravakDrzavaService boravakDrzavaService;

    @Autowired
    private KorisnikService korisnikService;

    @Autowired
    private ZaposlenikService zaposlenikService;

    @Autowired
    private DrzavaService drzavaService;

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/novi-obracun", consumes = {"application/json"})
    public ResponseEntity<?> showObracun(@RequestBody String obracunData) {
        JsonParser parser = JsonParserFactory.getJsonParser();

        Map<String, Object> obracunMap = parser.parseMap(obracunData);
        Zahtjev zahtjev = zahtjevService.findByBrPutnogNaloga(obracunMap.get("brPutnogNaloga").toString());

        Obracun obracun = new Obracun();

        obracun.setBrPutnogNaloga(zahtjev.getBrPutnogNaloga());
        //obracun.setBrPutnogNaloga(obracunMap.get("brPutnogNaloga").toString());
        try {
            obracun.setOpis(obracunMap.get("opis").toString());
        } catch (Exception e) {
            return new ResponseEntity<>("Greška pri unosu opisa", HttpStatus.ACCEPTED);
        }
        try {
            if (obracunMap.get("regAuto") != null && !obracunMap.get("regAuto").toString().equals("")) {
                if(!obracunMap.get("km").equals("")) {
                    obracun.setRegAuto(obracunMap.get("regAuto").toString());
                    obracun.setKilometri(obracunMap.get("km").toString());
                } else {
                    return new ResponseEntity<>("Greška pri unosu prijeđenih kilometara.", HttpStatus.ACCEPTED);
                }
            } else if (obracunMap.get("km") != null && !obracunMap.get("km").toString().equals("")) {
                return new ResponseEntity<>("Greška pri unosu registracije1", HttpStatus.ACCEPTED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Greška pri unosu registracije", HttpStatus.ACCEPTED);
        }

        try {
            obracun.setVrijPolazak(LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(obracunMap.get("vrijPolazak").toString())));
        } catch (Exception e) {
            return new ResponseEntity<>("Greška pri unosu vremena polaska", HttpStatus.ACCEPTED);
        }

        try {
            obracun.setVrijDolazak(LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(obracunMap.get("vrijDolazak").toString())));
        } catch (Exception e) {
            return new ResponseEntity<>("Greška pri unosu vremena dolaska", HttpStatus.ACCEPTED);
        }
        List<Trosak> troskovi = trosakService.getTroskovi(obracunMap.get("brPutnogNaloga").toString());
        if(troskovi.size()!=0) {
            for (Trosak t : troskovi) {
                if (fileStorageService.getFile(t.getIdTrosak())== null){
                    return new ResponseEntity<>("Nije unesena slika za trošak #".concat(t.getIdTrosak().toString()).concat("."), HttpStatus.ACCEPTED);
                }
            }
        }
        obracun.setStatusObracuna(StatusObracun.SPREMAN_ZA_OBRACUN);
        //treba dodati spremanje privitaka

        zahtjev.setStatus(StatusZahtjev.POSLAN_NA_OBRACUN);
        zahtjevService.saveZahtjev(zahtjev);
        obracun = obracunService.addObracun(obracun);

        JSONObject obracunObjekt = new JSONObject(obracunData);
        /*JSONArray boravciArray = obracunObjekt.getJSONArray("boravci");
        showBoravak(boravciArray, obracun);

        JSONArray troskoviArray = obracunObjekt.getJSONArray("troskovi");
        showTrosak(troskoviArray, obracun);*/
        System.out.println("kraj");
        return new ResponseEntity("Zahtjev za obračun je predan.", HttpStatus.OK);

    }

    public ResponseEntity<?> showBoravak(@RequestBody JSONArray boravciArray, Obracun obracun) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        try {
            for (int i = 0; i < boravciArray.length(); i++) {
                BoravakDrzava boravakDrzava = new BoravakDrzava();
                boravakDrzava.setObracun(obracun);

                JSONObject jedanBoravak = boravciArray.getJSONObject(i);
                String drzava = jedanBoravak.get("imeDrzave").toString();
                String sifDrzave = drzavaService.getDrzava(drzava).getSifraDrzave();
                boravakDrzava.setSifDrzave(sifDrzave);
                boravakDrzava.setImeDrzave(drzava);
                boravakDrzava.setVrijDolazak(LocalDateTime.parse(jedanBoravak.get("vrijDolazak").toString(), formatter));
                boravakDrzava.setVrijOdlazak(LocalDateTime.parse(jedanBoravak.get("vrijOdlazak").toString(), formatter));

                //System.out.println(Integer.parseInt((jedanBoravak.get("sifDrzave").toString())) + " " + LocalDateTime.parse(jedanBoravak.get("vrijDolazak").toString(), formatter)+ " " + LocalDateTime.parse (jedanBoravak.get("vrijOdlazak").toString(), formatter));

                boravakDrzavaService.addBoravak(boravakDrzava);

            }
            return new ResponseEntity("Dobri boravci", HttpStatus.ACCEPTED);
        } catch (Exception e) {
            return new ResponseEntity("Nisu dobri boravci", HttpStatus.BAD_REQUEST);
        }

    }

    //@PostMapping(value = "troskovi", consumes = {"application/json"})
    public ResponseEntity<?> showTrosak(@RequestBody JSONArray troskoviArray, Obracun obracun) {

        try {
            for (int i = 0; i < troskoviArray.length(); i++) {

                Trosak trosak = new Trosak();
                trosak.setObracun(obracun);

                JSONObject jedanTrosak = troskoviArray.getJSONObject(i);
                trosak.setOpis(jedanTrosak.get("opis").toString());
                trosak.setIznosValuta(Double.parseDouble(jedanTrosak.get("iznosValuta").toString()));
                //trosak.setIznosDomValuta(Double.parseDouble(jedanTrosak.get("iznosDomValuta").toString()));
                trosak.setRefund(Boolean.parseBoolean(jedanTrosak.get("refund").toString()));

                trosakService.addTrosak(trosak);

            }
            return new ResponseEntity("Dobri troškovi", HttpStatus.ACCEPTED);
        } catch (Exception e) {
            return new ResponseEntity("Nisu dobri troškovi", HttpStatus.BAD_REQUEST);
        }

    }


    //moji obracuni
    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "moji-obracuni/{korisnickoIme}", produces = {"application/json"})
    public ResponseEntity<?> mojiObracuni(@PathVariable("korisnickoIme") String korisnickoIme) {
        Korisnik korisnik = korisnikService.findByUserName(korisnickoIme);
        List<Zahtjev> zahtjevi = zahtjevService.listAllZahtjev(korisnik.getKorisnickoIme());
        List<String> obracuni = new ArrayList<String>();
        StringBuilder builder = new StringBuilder();
        builder.append("{\"obracuni\":");
        System.out.println(222);
        for (Zahtjev z : zahtjevi) {
            Obracun o = obracunService.findByBr(z.getBrPutnogNaloga());
            if (o != null) {
                obracuni.add("{\"brPutnogNaloga\":\"" + o.getBrPutnogNaloga() + "\",\"status\":\"" + o.getStatusObracuna() + "\"}");
            }
        }
        if (obracuni.size() == 0) builder.append("[]");
        else builder.append(obracuni);
        builder.append("}");
        String res = builder.toString();
        System.out.println(res);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //obracuni tima
    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/obracuni-tima/{korisnickoIme}", produces = {"application/json"})
    public ResponseEntity<?> listClanove(@PathVariable String korisnickoIme) {
        //JsonParser parser = JsonParserFactory.getJsonParser();
        //Map<String, Object> dataMap = parser.parseMap(data);
        Korisnik voditelj = korisnikService.findByUserName(korisnickoIme);
        Zaposlenik zaposlenik = zaposlenikService.findByOib(voditelj.getOib());
        List<Zaposlenik> clanovi = zaposlenikService.findByTimId(zaposlenik.getTimId());
        List<String> pomocna = new ArrayList<String>();
        List<String> pomocna1 = new ArrayList<String>();

        StringBuilder builder = new StringBuilder();
        for (Zaposlenik clan : clanovi) {
            Korisnik clanK = korisnikService.findByOib(clan.getOib());
            if (clanK != null) {
                pomocna1.add("{\"ime\":\"" + clan.getIme()+"\",\"oib\":\"" +
                        clan.getOib()
                        + "\",\"prezime\":\"" +
                        clan.getPrezime()+ "\",\"uloga\":\"" +
                        clan.getUloga() + "\",\"username\":\"" + clanK.getKorisnickoIme() + "\"}");
                List<Zahtjev> zahtjevi = zahtjevService.listAllZahtjev(clanK.getKorisnickoIme());
                zahtjevi.forEach(z -> {
                            Obracun o = obracunService.findByBr(z.getBrPutnogNaloga());
                            if (o != null) {
                                pomocna.add("{\"brPutnogNaloga\":\"" + o.getBrPutnogNaloga() +
                                        "\",\"opis\":\"" + o.getOpis() +
                                        "\",\"regAuto\":\"" + o.getRegAuto() +
                                        "\",\"razlogStorn\":\"" + o.getRazlogStorn() +
                                        "\",\"izracun\":\"" + o.getIzracun() +
                                        "\",\"statusObracuna\":\"" + o.getStatusObracuna() +
                                        "\",\"vrijDolazak\":\"" + o.getVrijDolazak() +
                                        "\",\"vrijPolazak\":\"" + o.getVrijPolazak() +
                                        "\",\"ime\":\"" + clan.getIme()
                                        + "\",\"prezime\":\"" +
                                        clan.getPrezime() + "\",\"username\":\"" + clanK.getKorisnickoIme() + "\"}");
                            }
                        }
                );
            } else {pomocna1.add("{\"ime\":\"" + clan.getIme()
                    + "\",\"prezime\":\"" +
                    clan.getPrezime()+"\",\"oib\":\"" +
                    clan.getOib()+ "\",\"uloga\":\"" +
                    clan.getUloga() + "\",\"username\":\"" + clanK.getKorisnickoIme() + "\"}");}
        }
        builder.append("{\"clanoviTima\":");
        if(pomocna1.size() == 0) builder.append("[]");
        else builder.append(pomocna1);
        builder.append(",\"obracuniTima\":");
        if (pomocna.size() == 0) builder.append("[]");
        else builder.append(pomocna);
        builder.append("}");
        String res = builder.toString();
        System.out.println(res);
        return new ResponseEntity<>(res, HttpStatus.OK);

    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/obracuni-clana", consumes = {"application/json"})
    public ResponseEntity<?> zahtjeviTima(@RequestBody String data) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> dataMap = parser.parseMap(data);
        //Korisnik voditelj = korisnikService.findByUserName(dataMap.get("usernameVoditelja").toString());
        List<String> pomocna = new ArrayList<String>();
        List<Zahtjev> zahtjevi;
        zahtjevi = zahtjevService.listAllZahtjev(dataMap.get("usernameClana").toString());
        List<String> obracuni = new ArrayList<String>();
        for (Zahtjev z : zahtjevi) {
            Obracun o = obracunService.findByBr(z.getBrPutnogNaloga());
            if (o != null) {
                obracuni.add(o.getBrPutnogNaloga() + " " + o.getStatusObracuna());
            }
        }
        if (obracuni.size() == 0) {
            return new ResponseEntity<>("Nema obračuna za prikaz", HttpStatus.OK);
        } else
            return new ResponseEntity<>(obracuni, HttpStatus.OK);
    }

    //svi obracuni
    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/svi-obracuni", produces = {"application/json"}, consumes = {"application/json"})
    public ResponseEntity<?> sviObracuni(@RequestBody String filters) {
        //Zaposlenik zaposlenik = zaposlenikService.getMaticni(voditelj.getOib());
        //List<Zaposlenik> clanovi = zaposlenikService.listAll();
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> filterMap = parser.parseMap(filters);
        List<String> pomocna = new ArrayList<String>();
        StringBuilder builder = new StringBuilder();
        builder.append("{\"sviObracuni\":");

        List<Obracun> obracuni = new ArrayList<>();

        if (filterMap.containsKey("brPutnogNaloga")) {
            obracuni.add(obracunService.findByBr(filterMap.get("brPutnogNaloga").toString()));
        } else obracuni = obracunService.listAll();
        obracuni.remove(null);
        if (filterMap.containsKey("status")) {
            obracuni.removeIf(o -> !o.getStatusObracuna().toString().equals(filterMap.get("status").toString()));
        }
        obracuni.forEach(o -> {
            Zahtjev zahtjev = zahtjevService.findByBrPutnogNaloga(o.getBrPutnogNaloga());
            pomocna.add("{\"brPutnogNaloga\":\"" + o.getBrPutnogNaloga() +
                    "\",\"opis\":\"" + o.getOpis() +
                    "\",\"regAuto\":\"" + o.getRegAuto() +
                    "\",\"razlogStorn\":\"" + o.getRazlogStorn() +
                    "\",\"izracun\":\"" + o.getIzracun() +
                    "\",\"status\":\"" + o.getStatusObracuna() +
                    "\",\"vrijDolazak\":\"" + o.getVrijDolazak() +
                    "\",\"vrijPolazak\":\"" + o.getVrijPolazak() +
                    "\",\"username\":\"" + zahtjev.getKorisnickoIme() + "\"}");
        });
        if (obracuni.size() == 0) builder.append("[]");
        else builder.append(pomocna);
        builder.append("}");
        String res = builder.toString();
        System.out.println(res);
        return new ResponseEntity<>(res, HttpStatus.OK);

    }

    @GetMapping(value = "/valute")
    public static double valute(String valuta){
        StringBuilder builder = new StringBuilder();
        builder.append("https://api.hnb.hr/tecajn-eur/v3?valuta=");
        builder.append(valuta);
        String url = builder.toString();
        RestTemplate restTemplate = new RestTemplate();

        String staraValuta = restTemplate.getForObject(url, String.class);

        String novaValuta = valuta.substring(1, valuta.length() - 1);
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> mapaValuta = parser.parseMap(novaValuta);

        String tecaj = mapaValuta.get("srednji_tecaj").toString();
        String noviTecaj = tecaj.replace(",", ".");
        //System.out.println(noviTecaj);

        //System.out.println((double)10 / Double.parseDouble(noviTecaj));

        return Double.parseDouble(noviTecaj);
    }


    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/obracunato/{brPutnogNaloga}", produces = "application/json")
    public ResponseEntity<?> obracunato(@PathVariable("brPutnogNaloga") String brPutnogNaloga) {
        JsonParser parser = JsonParserFactory.getJsonParser();

        Obracun obracun = obracunService.findByBr(brPutnogNaloga);
        Zahtjev zahtjev = zahtjevService.findByBrPutnogNaloga(brPutnogNaloga);
        List<Trosak> troskovi = trosakService.getTroskovi(brPutnogNaloga);
        List<BoravakDrzava> boravci = boravakDrzavaService.getBoravci(brPutnogNaloga);

        Map<String, String> mapaBoravaka = new HashMap<>();

        Drzava drzava = drzavaService.getDrzava(zahtjev.getSifDrzava().toUpperCase());
        mapaBoravaka.put(drzava.getImeDrzave(), drzava.getDnevnica());
        for(BoravakDrzava b : boravci){
            drzava = drzavaService.getDrzava(b.getImeDrzave().toUpperCase());
            String dnevnica = drzava.getDnevnica();
            mapaBoravaka.put(drzava.getImeDrzave(), dnevnica);
        }

        ObracunDto obracunDto = obracunService.obracunajNalog(obracun, zahtjev, troskovi, boravci, mapaBoravaka);

        obracun.setIzracun(obracunDto.getIzracun());
        obracunService.saveObracun(obracun);

        StringBuilder isplataTrBr = new StringBuilder();

        DecimalFormat df = new DecimalFormat();
        df.setMaximumFractionDigits(2);

        isplataTrBr.append("{\"brPutnogNaloga\":\"" + obracun.getBrPutnogNaloga() +
                        "\",\"akontacija\":\"" + df.format(zahtjev.getAkontacija()) +
                        "\",\"kilometri\":\"" + obracun.getKilometri() +
                "\",\"troskovi\":\"" + df.format(obracunDto.getTroskovi()) + " EUR" +
                "\",\"dnevnice\":\"" + df.format(obracunDto.getDnevnice()) + " EUR" +
                "\",\"isplata\":\"" + df.format(obracunDto.getIzracun()) + " EUR" + "\"}");

        return new ResponseEntity<>(isplataTrBr.toString(), HttpStatus.OK);
    }


    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/statusObracunato", consumes = "application/json")
    public ResponseEntity<?> statusObracunato(@RequestBody String obracunData) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> obracunMap = parser.parseMap(obracunData);

        Obracun obracun = obracunService.findByBr(obracunMap.get("brPutnogNaloga").toString());

        obracun.setStatusObracuna(StatusObracun.OBRACUNATO);
        obracunService.saveObracun(obracun);

        return new ResponseEntity<>("Obračun je obračunat", HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/storniraj", consumes = "application/json")
    public ResponseEntity<?> storniraj(@RequestBody String obracunData) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> obracunMap = parser.parseMap(obracunData);

        Obracun obracun = obracunService.findByBr(obracunMap.get("brPutnogNaloga").toString());

        if(obracunMap.get("razlogStorn") != null) {
            obracun.setRazlogStorn(obracunMap.get("razlogStorn").toString());
            String razlog = obracun.getRazlogStorn();
            obracun.setStatusObracuna(StatusObracun.STORNIRAN);
            obracunService.saveObracun(obracun);
            return new ResponseEntity<>("Obračun je storniran", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Fali razlog storniranja.", HttpStatus.ACCEPTED);
        }
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/odobri", consumes = "application/json")
    public ResponseEntity<?> odobri(@RequestBody String obracunData) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> obracunMap = parser.parseMap(obracunData);

        Obracun obracun = obracunService.findByBr(obracunMap.get("brPutnogNaloga").toString());

        obracun.setStatusObracuna(StatusObracun.ODOBREN);
        obracunService.saveObracun(obracun);

        return new ResponseEntity<>("Obračun je odobren.", HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/obrisiTroskoveBoravke", consumes = "application/json")
    public ResponseEntity<?> obrisi(@RequestBody String brisanjeData){
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> brisanjeMap = parser.parseMap(brisanjeData);

        if(obracunService.findByBr(brisanjeMap.get("brPutnogNaloga").toString()) != null){
            Obracun obracun = obracunService.findByBr(brisanjeMap.get("brPutnogNaloga").toString());
            obracunService.deleteObracun(obracun);
        }

        List<Trosak> troskovi = trosakService.getTroskovi(brisanjeMap.get("brPutnogNaloga").toString());
        List<BoravakDrzava> boravci = boravakDrzavaService.getBoravci(brisanjeMap.get("brPutnogNaloga").toString());

        if(troskovi.size() != 0){
            for(Trosak t : troskovi){
                trosakService.deleteTrosak(t);
                fileStorageService.deleteFileById(t.getIdTrosak());
            }
        }

        if(boravci.size() != 0){
            for(BoravakDrzava b : boravci){
                boravakDrzavaService.deleteBoravak(b);
            }
        }

        return new ResponseEntity<>("Obračun uspješno obrisan", HttpStatus.ACCEPTED);
    }


}
