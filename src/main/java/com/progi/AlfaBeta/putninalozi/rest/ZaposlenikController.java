package com.progi.AlfaBeta.putninalozi.rest;

import com.progi.AlfaBeta.putninalozi.domain.*;
import com.progi.AlfaBeta.putninalozi.service.KorisnikService;
import com.progi.AlfaBeta.putninalozi.service.ZaposlenikService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/zaposlenici")
public class ZaposlenikController{

    @Autowired
    private ZaposlenikService zaposlenikService;

    @Autowired
    private KorisnikService korisnikService;

    @GetMapping()
    public List<String> listZaposlenici(){
        List<Zaposlenik> zaposlenici = zaposlenikService.listAll();
        List<String> pomocna = new ArrayList<>();
        for (int i = 0; i<zaposlenici.size();i++){
            pomocna.add(zaposlenici.get(i).toString());
        }
        return pomocna;
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/{korisnickoIme}")
    public ResponseEntity<?> getMaticni(@PathVariable("korisnickoIme") String korisnickoIme){
        Korisnik korisnik = korisnikService.findByUserName(korisnickoIme);
        if(korisnik==null){
            return new ResponseEntity("Korisnik ne postoji",HttpStatus.OK);
        }
        Zaposlenik zaposlenik = zaposlenikService.findByOib(korisnik.getOib());
        if(zaposlenik==null){
            return new ResponseEntity<>("Zaposlenik ne postoji",HttpStatus.OK);
        }
        List<String> pomocna = new ArrayList<>();

        StringBuilder builder = new StringBuilder();
        pomocna.add("{\"oib\":\"" + zaposlenik.getOib() +
                "\",\"ime\":\"" + zaposlenik.getIme() +
                "\",\"prezime\":\"" + zaposlenik.getPrezime() +
                "\",\"uloga\":\"" + zaposlenik.getUloga() +
                "\",\"timId\":\"" + zaposlenik.getTimId() +
                "\",\"korisnickoIme\":\"" + korisnik.getKorisnickoIme() +
                "\",\"email\":\"" + korisnik.getEmail() + "\"}");
        builder.append(pomocna);
        String res = builder.toString();
        return new ResponseEntity<>(res,HttpStatus.OK);
    }

}
