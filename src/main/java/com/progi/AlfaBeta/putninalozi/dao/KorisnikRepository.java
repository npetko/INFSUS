package com.progi.AlfaBeta.putninalozi.dao;

import com.progi.AlfaBeta.putninalozi.domain.Korisnik;
import com.progi.AlfaBeta.putninalozi.domain.Zahtjev;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KorisnikRepository extends JpaRepository<Korisnik, String> {

    Korisnik findByKorisnickoIme(String korisnickoIme);

    Optional<Korisnik> findByKorisnickoImeAndZaporka(String korisnickoIme, String zaporka);

    void deleteByKorisnickoIme(String korisnickoIme);

    Korisnik findByOib(String oib);

}
