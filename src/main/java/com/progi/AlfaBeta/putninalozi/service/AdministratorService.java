package com.progi.AlfaBeta.putninalozi.service;

import com.progi.AlfaBeta.putninalozi.dao.KorisnikRepository;
import com.progi.AlfaBeta.putninalozi.domain.Korisnik;
import com.progi.AlfaBeta.putninalozi.domain.Zaposlenik;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public interface AdministratorService {

    Zaposlenik addZaposlenik(Zaposlenik zaposlenik);

    Korisnik addKorisnik(Korisnik korisnik);

    void zakljuciPoslovnuGodinu(int godina);

    int getGodina();
}
