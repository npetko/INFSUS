package com.progi.AlfaBeta.putninalozi.service.impl;

import com.progi.AlfaBeta.putninalozi.dao.FirmaRepository;
import com.progi.AlfaBeta.putninalozi.dao.KorisnikRepository;
import com.progi.AlfaBeta.putninalozi.dao.ZaposlenikRepository;
import com.progi.AlfaBeta.putninalozi.domain.Korisnik;
import com.progi.AlfaBeta.putninalozi.domain.Zaposlenik;
import com.progi.AlfaBeta.putninalozi.service.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;

import static java.sql.Types.NULL;

@Service
public class AdministratorServiceImpl implements AdministratorService {
    @Autowired
    private KorisnikRepository korisnikRepo;

    @Autowired
    private ZaposlenikRepository zaposlenikRepo;


    private int godina;

    @Override
    public void zakljuciPoslovnuGodinu(int godina){
        this.godina = godina + 1;

    }

    @Override
    public Korisnik addKorisnik(Korisnik korisnik) {
        korisnikRepo.saveAndFlush(korisnik);
        return korisnik;
    }

    @Override
    public int getGodina(){
        if(this.godina == 0){
            return LocalDate.now().getYear();
        }
        else
            return this.godina;
    }

    @Override
    public Zaposlenik addZaposlenik(Zaposlenik zaposlenik) {
        zaposlenikRepo.saveAndFlush(zaposlenik);
        return zaposlenik;
    }
}
