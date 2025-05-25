package com.progi.AlfaBeta.putninalozi.rest;

import com.progi.AlfaBeta.putninalozi.domain.*;
import com.progi.AlfaBeta.putninalozi.service.KorisnikService;
import com.progi.AlfaBeta.putninalozi.service.PromjenaLozinkeService;
import com.progi.AlfaBeta.putninalozi.service.RequestDeniedException;
import com.progi.AlfaBeta.putninalozi.service.ZaposlenikService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.apache.commons.codec.digest.DigestUtils;

import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/")
@CrossOrigin(value = "http://localhost:3000", allowedHeaders = "*")

public class KorisnikController {

    @Autowired
    private KorisnikService korisnikService;

    @Autowired
    private ZaposlenikService zaposlenikService;

    @Autowired
    private PromjenaLozinkeService promjenaLozinkeService;

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/login", consumes = {"application/json"})
    public ResponseEntity<?> authenticateuser (@RequestBody String loginData) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> login = parser.parseMap(loginData);
        String username = login.get("username").toString();
        String password= DigestUtils
                .md5Hex(login.get("password").toString());
        String err = "";
        try {
            Optional<Korisnik> korisnik = korisnikService.authenticate(username, password);
            if (korisnik != null) {
                Korisnik user = korisnik.get();
                String korisnickoIme = user.getKorisnickoIme();
                String email = user.getEmail();
                String oib = user.getOib();
                Zaposlenik zaposlenik= zaposlenikService.findByOib(oib);
                return new ResponseEntity<>("{"+zaposlenik.toString() + ",\"username\":\"" + korisnickoIme + "\", \"email\":\"" + email+"\"}", HttpStatus.ACCEPTED);
            }
        } catch (Exception e) {
            err = e.getMessage();
            System.out.println(e.getMessage());
        }
        return new ResponseEntity<>(err, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/change-password", consumes = {"application/json"})
    public ResponseEntity<?> changePassword (@RequestBody String passwordData) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> password = parser.parseMap(passwordData);
        String username = password.get("username").toString();
        String oldPassword= DigestUtils
                .md5Hex(password.get("oldPassword").toString());
        String newPassword= DigestUtils
                .md5Hex(password.get("newPassword").toString());
        String err = "";
        try {
            Optional<Korisnik> korisnik = Optional.ofNullable(korisnikService.findByUserName(username));
            if (korisnik != null) {
                Korisnik user = korisnik.get();
//                return new ResponseEntity<>(user.getZaporka() + " " + oldPassword, HttpStatus.ACCEPTED);
                if (!user.getZaporka().equals(oldPassword))
                    throw new RequestDeniedException("Stara zaporka mora biti ista kao i trenutna.");
//                System.out.println(user);
                user.setZaporka(newPassword);
                Korisnik updateResponse = korisnikService.update(user);
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
    @PostMapping(value = "/nova-zaporka-zahtjev", consumes = {"application/json"})
    public ResponseEntity<?> newPassword (@RequestBody String usernameData) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> data = parser.parseMap(usernameData);
        String username = data.get("username").toString();
        String err = "";
        try {
            Optional<Korisnik> korisnik = Optional.ofNullable(korisnikService.findByUserName(username));
            if (!korisnik.isEmpty()) {
                System.out.println(korisnik);
                PromjenaLozinke promjenaLozinke = new PromjenaLozinke();
                promjenaLozinke.setUsername(username);
                promjenaLozinkeService.addPromjenaLozinke(promjenaLozinke);
                return new ResponseEntity<>("Poslan je zahtjev za promjenu lozinke.", HttpStatus.ACCEPTED);
            }
            else {
                return new ResponseEntity<>("Ne postoji korsnik s korisničkim imenom: " + username, HttpStatus.OK);
            }
        } catch (Exception e) {
            err = e.getMessage();
            System.out.println(e.getMessage());
        }
        return new ResponseEntity<>(err, HttpStatus.OK);
    }

}





