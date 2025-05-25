package com.progi.AlfaBeta.putninalozi.service;

import com.progi.AlfaBeta.putninalozi.domain.Korisnik;

import java.util.List;
import java.util.Optional;

public interface KorisnikService {

    List<Korisnik> listAll();

    Korisnik findByOib(String oib);

    Korisnik findByUserName(String username);

    Optional<Korisnik> authenticate(String username, String password);

    Korisnik save(Korisnik korisnik);

    Korisnik update(Korisnik korisnik);

    void deleteKorisnikByKorisnickoIme(String korisnickoIme);
}
