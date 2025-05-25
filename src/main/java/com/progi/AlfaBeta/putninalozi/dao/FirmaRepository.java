package com.progi.AlfaBeta.putninalozi.dao;

import com.progi.AlfaBeta.putninalozi.domain.Firma;
import com.progi.AlfaBeta.putninalozi.domain.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FirmaRepository extends JpaRepository<Firma, String> {

    Firma findByOib(String oib);

}
