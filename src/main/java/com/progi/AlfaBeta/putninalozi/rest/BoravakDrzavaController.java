package com.progi.AlfaBeta.putninalozi.rest;

import com.progi.AlfaBeta.putninalozi.domain.BoravakDrzava;
import com.progi.AlfaBeta.putninalozi.domain.Obracun;
import com.progi.AlfaBeta.putninalozi.domain.Trosak;
import com.progi.AlfaBeta.putninalozi.service.BoravakDrzavaService;
import com.progi.AlfaBeta.putninalozi.service.DrzavaService;
import com.progi.AlfaBeta.putninalozi.service.ObracunService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/boravak")
public class BoravakDrzavaController {

    @Autowired
    private BoravakDrzavaService boravakDrzavaService;

    @Autowired
    private ObracunService obracunService;

    @Autowired
    private DrzavaService drzavaService;

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/boravci-Zahtjeva/{brPutnogNaloga}", produces = "application/json")
    public ResponseEntity<?> boravciZahtjevi(@PathVariable("brPutnogNaloga") String brPutnogNaloga) {


        List<BoravakDrzava> boravci = boravakDrzavaService.getBoravci(brPutnogNaloga);

        if (boravci.size() == 0) {
            return new ResponseEntity<>("Nema boravaka za prikaz", HttpStatus.ACCEPTED);
        } else {
            List<String> boravciZaVratit = new ArrayList<>();

            for (BoravakDrzava b : boravci) {
                Duration dur = Duration.between(b.getVrijDolazak(), b.getVrijOdlazak());
                String duration = dur.toString().substring(2);
                boravciZaVratit.add("{\"brPutnogNaloga\":\"" + brPutnogNaloga +
                        "\",\"drzava\":\"" + b.getImeDrzave() +"\",\"idBoravak\":\"" + b.getIdBoravak() +
                        "\",\"boravak\":\"" + duration + "\"}");
            }

            StringBuilder builder = new StringBuilder();
            builder.append("{\"sviBoravci\":");
            builder.append(boravciZaVratit);
            builder.append("}");

            return new ResponseEntity<>(builder.toString(), HttpStatus.OK);

        }
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/noviBoravak", consumes = "application/json")
    public ResponseEntity<?> noviBoravak(@RequestBody String boravakData){
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> boravakMap = parser.parseMap(boravakData);

        BoravakDrzava boravak = new BoravakDrzava();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        try{
            boravak.setBrPutnogNaloga(boravakMap.get("brPutnogNaloga").toString());
        } catch (Exception e){
            return new ResponseEntity("Greška u unosu broja putnog naloga.", HttpStatus.ACCEPTED);
        }

        try{
            String drzava = (boravakMap.get("imeDrzave").toString()).toUpperCase();
            boravak.setImeDrzave(drzava);
            String sifDrzave = (drzavaService.getDrzava(drzava)).getSifraDrzave();
            boravak.setSifDrzave(sifDrzave);
        } catch (Exception e){
            return new ResponseEntity("Greška u države.", HttpStatus.ACCEPTED);
        }


        try{
            boravak.setVrijDolazak(LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(boravakMap.get("vrijDolazak").toString())));
        } catch (Exception e){
            return new ResponseEntity("Greška u unosu vremena dolaska.", HttpStatus.ACCEPTED);
        }

        try{
            boravak.setVrijOdlazak(LocalDateTime.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(boravakMap.get("vrijOdlazak").toString())));
        } catch (Exception e){
            return new ResponseEntity("Greška u unosu vremena odlaska.", HttpStatus.ACCEPTED);
        }

        LocalDate dP = LocalDate.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(boravakMap.get("vrijDolazak").toString()));
        LocalDate dK = LocalDate.from(DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(boravakMap.get("vrijOdlazak").toString()));
        if(dK.isBefore(dP)){
            //System.out.println("Datum kraja putovanja ne može biti prije datuma početka putovanja.");
            return new ResponseEntity<>("Datum odlaska ne može biti prije datuma dolaska.", HttpStatus.OK);
        }

        boravakDrzavaService.addBoravak(boravak);

        return new ResponseEntity("Uspješno unesen boravak.", HttpStatus.OK);

    }


}
