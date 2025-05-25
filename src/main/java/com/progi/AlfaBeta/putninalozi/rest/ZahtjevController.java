package com.progi.AlfaBeta.putninalozi.rest;

import com.progi.AlfaBeta.putninalozi.domain.*;
import com.progi.AlfaBeta.putninalozi.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static java.time.temporal.ChronoUnit.DAYS;

@Controller
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequestMapping("/")
public class ZahtjevController {

    @Autowired
    private ZahtjevService zahtjevService;

    @Autowired
    private KorisnikService korisnikService;

    @Autowired
    private ZaposlenikService zaposlenikService;

    @Autowired
    private AdministratorService administratorService;

    @Autowired
    private DrzavaService drzavaService;

    //moji-zahtjevi
    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/moji-zahtjevi/{korisnickoIme}", produces = {"application/json", "text/plain"})
    public ResponseEntity<?> mojiZahtjevi(@PathVariable("korisnickoIme") String korisnickoIme) {
        List<Zahtjev> zahtjevi = zahtjevService.listAllZahtjev(korisnickoIme);
        /*if (zahtjevi.size() == 0)
            return new ResponseEntity<>("Nema zahtjeva za prikaz", HttpStatus.ACCEPTED);*/
        List<String> pomocna = new ArrayList<>();
        StringBuilder builder = new StringBuilder();
        builder.append("{\"zahtjevi\":");
        for (int i = 0; i < zahtjevi.size(); i++) {
            pomocna.add("{\"brPutnogNaloga\":\"" + zahtjevi.get(i).getBrPutnogNaloga() +
                    "\",\"username\":\"" + zahtjevi.get(i).getKorisnickoIme() +
                    "\",\"mjesto\":\"" + zahtjevi.get(i).getMjesto() +
                    "\",\"razlog\":\"" + zahtjevi.get(i).getRazlog() +
                    "\",\"prijevoznoSredstvo\":\"" + zahtjevi.get(i).getPrijevoznoSredstvo() +
                    "\",\"razlogVracanja\":\"" + zahtjevi.get(i).getRazlogVracanja() +
                    "\",\"krajPutovanja\":\"" + zahtjevi.get(i).getKrajPutovanja() +
                    "\",\"pocPutovanja\":\"" + zahtjevi.get(i).getPocPutovanja() +
                    "\",\"mjestoTroska\":\"" + zahtjevi.get(i).getMjestoTroska() +
                    "\",\"akontacija\":\"" + zahtjevi.get(i).getAkontacija() +
                    "\",\"sifDrzava\":\"" + zahtjevi.get(i).getSifDrzava() +
                    "\",\"status\":\"" + zahtjevi.get(i).getStatus() + "\"}");

        }
        if (pomocna.size() == 0) builder.append("[]");
        else builder.append(pomocna);
        builder.append("}");
        String res = builder.toString();
        System.out.println(res);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //zahtjevi-tima
    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/zahtjevi-tima/{korisnickoIme}", produces = {"application/json"})
    public ResponseEntity<?> listClanove(@PathVariable("korisnickoIme") String username) {
        //JsonParser parser = JsonParserFactory.getJsonParser();
        //Map<String, Object> dataMap = parser.parseMap(data);
        Korisnik voditelj = korisnikService.findByUserName(username);
        Zaposlenik zaposlenik = zaposlenikService.findByOib(voditelj.getOib());
        List<Zaposlenik> clanovi = zaposlenikService.findByTimId(zaposlenik.getTimId());
        List<String> pomocna = new ArrayList<String>();
        List<String> pomocna1 = new ArrayList<String>();

        StringBuilder builder = new StringBuilder();
        for (Zaposlenik clan : clanovi) {
            Korisnik clanK = korisnikService.findByOib(clan.getOib());
            if (clanK != null) {
                pomocna1.add("{\"ime\":\"" + clan.getIme()
                        + "\",\"prezime\":\"" +
                        clan.getPrezime() + "\",\"oib\":\"" +
                        clan.getOib() + "\",\"uloga\":\"" +
                        clan.getUloga() + "\",\"username\":\"" + clanK.getKorisnickoIme() + "\"}");
                List<Zahtjev> zahtjev = zahtjevService.listAllZahtjev(clanK.getKorisnickoIme());
                zahtjev.forEach(z -> {
                    pomocna.add("{\"brPutnogNaloga\":\"" + z.getBrPutnogNaloga() +
                            "\",\"mjesto\":\"" + z.getMjesto() +
                            "\",\"razlog\":\"" + z.getRazlog() +
                            "\",\"prijevoznoSredstvo\":\"" + z.getPrijevoznoSredstvo() +
                            "\",\"razlogVracanja\":\"" + z.getRazlogVracanja() +
                            "\",\"krajPutovanja\":\"" + z.getKrajPutovanja() +
                            "\",\"pocPutovanja\":\"" + z.getPocPutovanja() +
                            "\",\"mjestoTroska\":\"" + z.getMjestoTroska() +
                            "\",\"akontacija\":\"" + z.getAkontacija() +
                            "\",\"sifDrzava\":\"" + z.getSifDrzava() +
                            "\",\"status\":\"" + z.getStatus() + "\",\"ime\":\"" + clan.getIme()
                            + "\",\"prezime\":\"" +
                            clan.getPrezime() + "\",\"username\":\"" + clanK.getKorisnickoIme() + "\"}");
                });
            } else {
                pomocna1.add("{\"ime\":\"" + clan.getIme() + "\",\"uloga\":\"" +
                        clan.getUloga()
                        + "\",\"prezime\":\"" +
                        clan.getPrezime() + "\",\"username\":\"" + null + "\"}");
            }
            /*if (clanK != null)
                pomocna.add(clan.getIme() + " " + clan.getPrezime() + " (" + clanK.getKorisnickoIme() + ") ");

                pomocna.add(clan.getIme() + " " + clan.getPrezime());*/
        }
        builder.append("{\"clanoviTima\":");
        if (pomocna1.size() == 0) builder.append("[]");
        else builder.append(pomocna1);
        builder.append(",\"zahtjeviTima\":");
        if (pomocna.size() == 0) builder.append("[]");
        else builder.append(pomocna);
        builder.append("}");
        String res = builder.toString();
        System.out.println(res);
        return new ResponseEntity<>(res, HttpStatus.OK);

    }

    //svi zahtjevi
    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/svi-zahtjevi", consumes = {"application/json", "text/plain"}, produces = {"application/json"})
    public ResponseEntity<?> sviZahtjevi(@RequestBody String filters) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> filterMap = parser.parseMap(filters);
        List<String> pomocna = new ArrayList<String>();
        List<Zahtjev> zahtjevi = new ArrayList<Zahtjev>();
        List<Zahtjev> helper = new ArrayList<Zahtjev>();
        List<Korisnik> korisnici;
        Korisnik korisnik;
        StringBuilder builder = new StringBuilder();
        System.out.println(filters);
        builder.append("{\"sviZahtjevi\":");
        if (filterMap.containsKey("brPutnogNaloga")) {
            zahtjevi.add(zahtjevService.findByBrPutnogNaloga(filterMap.get("brPutnogNaloga").toString().trim()));
            System.out.println(filterMap.get("brPutnogNaloga").toString());
        } else {
            if (!filterMap.containsKey("username")) {
                korisnici = korisnikService.listAll();
                for (Korisnik k : korisnici) {
                    helper = zahtjevService.listAllZahtjev(k.getKorisnickoIme());
                    for (Zahtjev z : helper) {
                        if (z != null)
                            zahtjevi.add(z);
                        System.out.println(z);
                    }
                }
                System.out.println(zahtjevi);
            } else {
                korisnik = korisnikService.findByUserName(filterMap.get("username").toString());
                zahtjevi = zahtjevService.listAllZahtjev(korisnik.getKorisnickoIme());
            }
            if (filterMap.containsKey("status")) {
                String status = filterMap.get("status").toString();
                zahtjevi.removeIf(z -> !z.getStatus().toString().equals(status));
            }
        }
        zahtjevi.remove(null);
        /*if (zahtjevi.size() == 0) {
            return new ResponseEntity<>("Nema zahtjeva za prikaz.", HttpStatus.OK);
        }*/
        for (Zahtjev z : zahtjevi) {
            pomocna.add("{\"brPutnogNaloga\":\"" + z.getBrPutnogNaloga() +
                    "\",\"username\":\"" + z.getKorisnickoIme() +
                    "\",\"mjesto\":\"" + z.getMjesto() +
                    "\",\"razlog\":\"" + z.getRazlog() +
                    "\",\"prijevoznoSredstvo\":\"" + z.getPrijevoznoSredstvo() +
                    "\",\"razlogVracanja\":\"" + z.getRazlogVracanja() +
                    "\",\"krajPutovanja\":\"" + z.getKrajPutovanja() +
                    "\",\"pocPutovanja\":\"" + z.getPocPutovanja() +
                    "\",\"mjestoTroska\":\"" + z.getMjestoTroska() +
                    "\",\"akontacija\":\"" + z.getAkontacija() +
                    "\",\"drzava\":\"" + z.getSifDrzava() +
                    "\",\"status\":\"" + z.getStatus() + "\"}");
        }

        if (pomocna.size() == 0) builder.append("[]");
        else builder.append(pomocna);
        builder.append("}");
        String res = builder.toString();
        System.out.println(res);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/zahtjevi-clana", consumes = {"application/json"})
    public ResponseEntity<?> zahtjeviClana(@RequestBody String data) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> dataMap = parser.parseMap(data);
        //Korisnik voditelj = korisnikService.findByUserName(dataMap.get("usernameVoditelja").toString());
        List<String> pomocna = new ArrayList<String>();
        List<Zahtjev> zahtjevi;
        zahtjevi = zahtjevService.listAllZahtjev(dataMap.get("usernameClana").toString());
        if (zahtjevi.size() == 0)
            return new ResponseEntity<>("Odabrani član nema zahtjeva za prikaz", HttpStatus.OK);
        for (Zahtjev zahtjev : zahtjevi) {
            pomocna.add(zahtjev.getBrPutnogNaloga() + " " + zahtjev.getStatus());
        }
        return new ResponseEntity<>(pomocna, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/novi-zahtjev", consumes = {"application/json"})
    public ResponseEntity<?> showZahtjev(@RequestBody String zahtjevData) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        //System.out.println(zahtjevData);
        Map<String, Object> zahtjevMap = parser.parseMap(zahtjevData);
        Korisnik korisnik = korisnikService.findByUserName(zahtjevMap.get("username").toString());
        Zaposlenik zaposlenik = zaposlenikService.findByOib(korisnik.getOib());
        Zahtjev zahtjev = new Zahtjev();
        try {
            zahtjev.setMjesto(zahtjevMap.get("mjesto").toString());
        } catch (Exception e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Neispravno mjesto putovanja.", HttpStatus.OK);
        }
        try {
            zahtjev.setKorisnickoIme(korisnik.getKorisnickoIme());
        } catch (Exception e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Greška u sustavu. Kontaktirajte administratora.", HttpStatus.OK);
        }
        try {
            zahtjev.setPocPutovanja(LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datPoc").toString())));
            if (LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datPoc").toString())).getYear() < administratorService.getGodina())
                throw new Exception("Trenutna poslovna godina ne odgovara datumu početka putovanja");

        } catch (Exception e) {
            System.out.println(e.getMessage().toString());
            return new ResponseEntity<>(e.getMessage().toString(), HttpStatus.OK);
        }
        try {
            zahtjev.setKrajPutovanja(LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datKraj").toString())));
            if (LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datKraj").toString())).getYear() < administratorService.getGodina())
                throw new Exception("Trenutna poslovna godina ne odgovara datumu kraja putovanja");
        } catch (Exception e) {
            System.out.println(e.toString());
            return new ResponseEntity<>(e.getMessage().toString(), HttpStatus.OK);
        }
        LocalDateTime dP = LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datPoc").toString()));
        LocalDateTime dK = LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datKraj").toString()));
        if (dK.isBefore(dP)) {
            //System.out.println("Datum kraja putovanja ne može biti prije datuma početka putovanja.");
            return new ResponseEntity<>("Datum kraja putovanja ne može biti prije datuma početka putovanja.", HttpStatus.OK);
        }
        try {
            zahtjev.setPrijevoznoSredstvo(zahtjevMap.get("prijSredstvo").toString());
        } catch (Exception e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Neispravan unos za prijevozno sredstvo.", HttpStatus.OK);
        }
        try {
            zahtjev.setRazlog(zahtjevMap.get("razlog").toString());
        } catch (Exception e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Neispravan razlog.", HttpStatus.OK);
        }
        try {
            zahtjev.setAkontacija(Double.valueOf(zahtjevMap.get("akontacija").toString()));
        } catch (Exception e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Neispravna akontacija.", HttpStatus.OK);
        }
        try {
            zahtjev.setSifDrzava(zahtjevMap.get("drz").toString());
        } catch (Exception e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Neispravna šifra države.", HttpStatus.OK);
        }
        try {
            zahtjev.setMjestoTroska(zahtjevMap.get("mjestoTroska").toString());
        } catch (Exception e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Neispravno mjesto troška.", HttpStatus.OK);
        }
        if (zahtjevMap.get("brPutnogNaloga") != null) {
            zahtjevService.deleteByBrPutnogNaloga(zahtjevMap.get("brPutnogNaloga").toString());
            zahtjev.setBrPutnogNaloga(zahtjevMap.get("brPutnogNaloga").toString());
        } else {
            try {
                zahtjev.setBrPutnogNaloga(zahtjevService.generateBrPutnogNaloga(LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datPoc").toString())).getYear()));
                System.out.println();
            } catch (Exception e) {
                System.out.println(e.toString());
                return new ResponseEntity<>("Greška u generiranju broja putnog naloga.", HttpStatus.OK);
            }
        }
        try {
            zahtjev.setStatus(StatusZahtjev.PODNESEN);
            zahtjevService.addZahtjev(zahtjev);
            return new ResponseEntity("Zahtjev je poslan na obradu.", HttpStatus.ACCEPTED);
        } catch (Exception e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Greška u dodavanju zahtjeva u bazu podataka. Kontaktirajte administratora.", HttpStatus.OK);
        }

    }

    @GetMapping("/myzahtjevi")
    public List<Zahtjev> getAllZahtjevi(@PathVariable("korisnickoIme") String korisnickoIme) {
        return zahtjevService.listAllZahtjev(korisnickoIme);
    }


    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/odobriZahtjev", consumes = "application/json")
    public ResponseEntity<?> odobriZahtjev(@RequestBody String zahtjevData) {
        JsonParser parser = JsonParserFactory.getJsonParser();

        Map<String, Object> zahtjevMap = parser.parseMap(zahtjevData);

        Zahtjev zahtjev = zahtjevService.findByBrPutnogNaloga(zahtjevMap.get("brPutnogNaloga").toString());

        zahtjev.setStatus(StatusZahtjev.ODOBREN);
        zahtjevService.saveZahtjev(zahtjev);

        return new ResponseEntity<>("Zahtjev odobren", HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/stornirajZahtjev", consumes = "application/json")
    public ResponseEntity<?> stornirajZahtjev(@RequestBody String zahtjevData) {
        JsonParser parser = JsonParserFactory.getJsonParser();

        Map<String, Object> zahtjevMap = parser.parseMap(zahtjevData);

        if(zahtjevMap.get("razlogStorniranja")==null){
            return new ResponseEntity<>("Nedostaje razlog storniranja!",HttpStatus.OK);
        }

        Zahtjev zahtjev = zahtjevService.findByBrPutnogNaloga(zahtjevMap.get("brPutnogNaloga").toString());
        zahtjev.setStatus(StatusZahtjev.STORNIRAN);
        zahtjev.setRazlogVracanja(zahtjevMap.get("razlogStorniranja").toString());
        zahtjevService.saveZahtjev(zahtjev);


        return new ResponseEntity<>("Zahtjev storniran", HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/odbijZahtjev", consumes = "application/json")
    public ResponseEntity<?> odbijZahtjev(@RequestBody String zahtjevData) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> zahtjevMap = parser.parseMap(zahtjevData);

        Zahtjev zahtjev = zahtjevService.findByBrPutnogNaloga(zahtjevMap.get("brPutnogNaloga").toString());

        zahtjev.setStatus(StatusZahtjev.ODBIJEN);
        zahtjevService.saveZahtjev(zahtjev);

        return new ResponseEntity<>("Zahtjev odbijen", HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/vratiNaDoradu", consumes = "application/json")
    public ResponseEntity<?> vratiNaDoradu(@RequestBody String zahtjevData) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> zahtjevMap = parser.parseMap(zahtjevData);

        Zahtjev zahtjev = zahtjevService.findByBrPutnogNaloga(zahtjevMap.get("brPutnogNaloga").toString());


        if (zahtjevMap.get("razlogVracanja") != null) {
            zahtjev.setRazlogVracanja(zahtjevMap.get("razlogVracanja").toString());
            String razlog = zahtjev.getRazlogVracanja();
            zahtjev.setStatus(StatusZahtjev.VRACEN_NA_DORADU);
            zahtjevService.saveZahtjev(zahtjev);

            return new ResponseEntity<>("Zahtjev je vraćen na doradu.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Fali razlog vraćanja", HttpStatus.ACCEPTED);
        }


    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/prepraviNalog", consumes = "application/json")
    public ResponseEntity<?> prepraviNalog(@RequestBody String zahtjevData) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> zahtjevMap = parser.parseMap(zahtjevData);

        Zahtjev zahtjev = zahtjevService.findByBrPutnogNaloga(zahtjevMap.get("brPutnogNaloga").toString());

        try {
            if (zahtjevMap.get("datPoc") != null) {
                zahtjev.setPocPutovanja(LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datPoc").toString())));
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Neispravno vrijeme početka putovanja", HttpStatus.ACCEPTED);
        }

        try {
            if (zahtjevMap.get("datKraj") != null) {
                zahtjev.setKrajPutovanja(LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datKraj").toString())));
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Neispravno vrijeme kraja putovanja", HttpStatus.ACCEPTED);
        }
        LocalDateTime dP = LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datPoc").toString()));
        LocalDateTime dK = LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datKraj").toString()));
        if (dK.isBefore(dP)) {
            //System.out.println("Datum kraja putovanja ne može biti prije datuma početka putovanja.");
            return new ResponseEntity<>("Datum kraja putovanja ne može biti prije datuma početka putovanja.", HttpStatus.OK);
        }

        try {
            if (zahtjevMap.get("prijSredstvo") != null) {
                zahtjev.setPrijevoznoSredstvo(zahtjevMap.get("prijSredstvo").toString());
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Neispravno prijevozno sredstvo", HttpStatus.ACCEPTED);
        }

        try {
            if (zahtjevMap.get("mjestoTroska") != null) {
                zahtjev.setMjestoTroska(zahtjevMap.get("mjestoTroska").toString());
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Neispravno mjesto troška", HttpStatus.ACCEPTED);
        }

        try {
            if (zahtjevMap.get("mjesto") != null) {
                zahtjev.setMjesto(zahtjevMap.get("mjesto").toString());
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Neispravno mjesto", HttpStatus.ACCEPTED);
        }

        try {
            if (zahtjevMap.get("drz") != null) {
                zahtjev.setSifDrzava(zahtjevMap.get("drz").toString());
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Neispravna država", HttpStatus.ACCEPTED);
        }

        try {
            if (zahtjevMap.get("mjestoTroska") != null) {
                zahtjev.setMjestoTroska(zahtjevMap.get("mjestoTroska").toString());
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Neispravno mjesto troška", HttpStatus.ACCEPTED);
        }

        try {
            if (zahtjevMap.get("razlog") != null) {
                zahtjev.setRazlog(zahtjevMap.get("razlog").toString());
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Neispravan razlog", HttpStatus.ACCEPTED);
        }

        try {
            if (zahtjevMap.get("akontacija") != null) {
                zahtjev.setAkontacija(Double.parseDouble(zahtjevMap.get("akontacija").toString()));
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Neispravna akontacija", HttpStatus.ACCEPTED);
        }
        zahtjev.setStatus(StatusZahtjev.PODNESEN);
        zahtjevService.saveZahtjev(zahtjev);

        return new ResponseEntity<>("Prepravljen zahtjev", HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/obavijesti", consumes = {"application/json"}, produces = {"application/json"})
    public ResponseEntity<?> obavijesti(@RequestBody String data) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> brojeviMap = parser.parseMap(data);
        System.out.println(7);
        Set<String> brojevi = brojeviMap.keySet();
        System.out.println(brojevi);
        System.out.println(brojeviMap);
        LocalDateTime now = LocalDateTime.now();
        StringBuilder builder = new StringBuilder();
        String pomocna = "{";
        for (String broj : brojevi) {
            System.out.println(broj);
            String brPutnogNaloga = brojeviMap.get(broj).toString();
            if (!pomocna.equals("{"))
                pomocna = pomocna + ",";
            pomocna = pomocna + "\"" + brPutnogNaloga + "\":\"";
            Zahtjev zahtjev = zahtjevService.findByBrPutnogNaloga(brPutnogNaloga);
            if (zahtjev != null) {
                if (zahtjev.getKrajPutovanja() != null) {
                    if (DAYS.between(zahtjevService.findByBrPutnogNaloga(brPutnogNaloga).getKrajPutovanja(), now) > 5) {
                        pomocna = pomocna + "Prošlo više od 5 dana!\"";
                    } else
                        pomocna = pomocna + "Nije prošlo 5 dana.\"";
                }
            } else {
                pomocna = pomocna + "Kraj putovanja nije definiran.\"";
            }
        }
        pomocna = pomocna + "}";
        builder.append(pomocna);
        String res = builder.toString();
        System.out.println(res);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/zahtjevUPripremi", consumes = {"application/json"})
    public ResponseEntity<?> zahtjevUPripremi(@RequestBody String zahtjevData) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        //System.out.println(zahtjevData);
        Map<String, Object> zahtjevMap = parser.parseMap(zahtjevData);
        Korisnik korisnik = korisnikService.findByUserName(zahtjevMap.get("username").toString());
        Zaposlenik zaposlenik = zaposlenikService.findByOib(korisnik.getOib());

        Zahtjev zahtjev = new Zahtjev();
        try {
            zahtjev.setBrPutnogNaloga(zahtjevService.generateBrPutnogNaloga(LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datPoc").toString())).getYear()));
        } catch (Exception e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Greška u generiranju broja putnog naloga.", HttpStatus.OK);
        }
        if (!zahtjevMap.get("mjesto").toString().isEmpty()) {
            try {
                zahtjev.setMjesto(zahtjevMap.get("mjesto").toString());
            } catch (Exception e) {
                System.out.println(e.toString());
                return new ResponseEntity<>("Neispravno mjesto putovanja.", HttpStatus.OK);
            }
        }
        try {
            zahtjev.setKorisnickoIme(korisnik.getKorisnickoIme());
        } catch (Exception e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Greška u sustavu. Kontaktirajte administratora.", HttpStatus.OK);
        }
        if (!zahtjevMap.get("datPoc").toString().isEmpty()) {
            try {
                zahtjev.setPocPutovanja(LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datPoc").toString())));
                if (LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datPoc").toString())).getYear() < administratorService.getGodina())
                    throw new Exception("Trenutna poslovna godina ne odgovara datumu početka putovanja");

            } catch (Exception e) {
                System.out.println(e.toString());
                return new ResponseEntity<>(e.getMessage().toString(), HttpStatus.OK);
            }
        }
        if (!zahtjevMap.get("datKraj").toString().isEmpty()) {
            try {
                zahtjev.setKrajPutovanja(LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datKraj").toString())));
                if (LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(zahtjevMap.get("datKraj").toString())).getYear() < administratorService.getGodina())
                    throw new Exception("Trenutna poslovna godina ne odgovara datumu kraja putovanja");
            } catch (Exception e) {
                System.out.println(e.toString());
                return new ResponseEntity<>(e.getMessage().toString(), HttpStatus.OK);
            }
        }
        if (!zahtjevMap.get("prijSredstvo").toString().isEmpty()) {
            try {
                zahtjev.setPrijevoznoSredstvo(zahtjevMap.get("prijSredstvo").toString());
            } catch (Exception e) {
                System.out.println(e.toString());
                return new ResponseEntity<>("Neispravan unos za prijevozno sredstvo.", HttpStatus.OK);
            }
        }
        if (!zahtjevMap.get("razlog").toString().isEmpty()) {
            try {
                zahtjev.setRazlog(zahtjevMap.get("razlog").toString());
            } catch (Exception e) {
                System.out.println(e.toString());
                return new ResponseEntity<>("Neispravan razlog.", HttpStatus.OK);
            }
        }
        if (!zahtjevMap.get("akontacija").toString().isEmpty()) {
            try {
                zahtjev.setAkontacija(Double.valueOf(zahtjevMap.get("akontacija").toString()));
            } catch (Exception e) {
                System.out.println(e.toString());
                return new ResponseEntity<>("Neispravna akontacija.", HttpStatus.OK);
            }
        }
        if (!zahtjevMap.get("drz").toString().isEmpty()) {
            try {
                zahtjev.setSifDrzava(zahtjevMap.get("drz").toString());
            } catch (Exception e) {
                System.out.println(e.toString());
                return new ResponseEntity<>("Neispravna šifra države.", HttpStatus.OK);
            }
        }
        if (!zahtjevMap.get("mjestoTroska").toString().isEmpty()) {
            try {
                zahtjev.setMjestoTroska(zahtjevMap.get("mjestoTroska").toString());
            } catch (Exception e) {
                System.out.println(e.toString());
                return new ResponseEntity<>("Neispravno mjesto troška.", HttpStatus.OK);
            }
        }
        zahtjev.setStatus(StatusZahtjev.U_PRIPREMI);
        //System.out.println(zahtjev.getStatus());
        try {

            zahtjevService.saveZahtjev(zahtjev);
            return new ResponseEntity("Zahtjev je stavljen u pripremu", HttpStatus.ACCEPTED);
        } catch (Exception e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Greška u dodavanju zahtjeva u bazu podataka. Kontaktirajte administratora.", HttpStatus.OK);
        }
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/drzave")
    public ResponseEntity<?> getAllDrzave() {
        try {
            return new ResponseEntity<>(drzavaService.listAll(), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Greška pri dohvaćanju podataka", HttpStatus.ACCEPTED);
        }
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PutMapping("/drzave/{sifDrzava}")
    public ResponseEntity<?> updateDrzava(
            @PathVariable("sifDrzava") String sifraDrzave,
            @RequestBody Drzava payload
    ) {
        if (!sifraDrzave.equals(payload.getSifraDrzave())) {
            System.out.println(payload);
            return ResponseEntity.badRequest().build();
        }
        Drzava updated = drzavaService.save(payload);
        return ResponseEntity.ok(updated);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @DeleteMapping("/drzave/{sifraDrzave}")
    public ResponseEntity<Void> deleteDrzava(@PathVariable String sifraDrzave) {
        try {
            drzavaService.deleteById(sifraDrzave);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}