package com.progi.AlfaBeta.putninalozi.service.impl;

import com.progi.AlfaBeta.putninalozi.dao.ZahtjevRepository;
import com.progi.AlfaBeta.putninalozi.domain.StatusZahtjev;
import com.progi.AlfaBeta.putninalozi.domain.Zahtjev;
import com.progi.AlfaBeta.putninalozi.service.AdministratorService;
import com.progi.AlfaBeta.putninalozi.service.ZahtjevService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class ZahtjevServiceImpl implements ZahtjevService {


    @Autowired
    private ZahtjevRepository zahtjevRepo;

    @Autowired
    private AdministratorService administratorService;

    @Override
    public List<Zahtjev> listAllZahtjev(String korisnickoIme){
        return zahtjevRepo.findByKorisnickoIme(korisnickoIme);
    }

    @Override
    public Zahtjev findByBrPutnogNaloga(String brPutnogNaloga){
        return zahtjevRepo.findByBrPutnogNaloga(brPutnogNaloga);
    }

    @Override
    public String generateBrPutnogNaloga(int godina){
        List<Zahtjev> zahtjevi = zahtjevRepo.findAll(Sort.by(Sort.Direction.DESC,"id"));
        String brPutnogNaloga = "";
        if(zahtjevi.size()==0) {
            brPutnogNaloga = godina + "-" +"001";
        }
        else {
            brPutnogNaloga = zahtjevi.get(0).getBrPutnogNaloga();
            String[] pomocna = brPutnogNaloga.split("-");
            if(Integer.valueOf(pomocna[0])!=godina)
                brPutnogNaloga = godina + "-001";
            else {
                int broj = (Integer.valueOf(pomocna[1]) + 1);
                if(broj > 999)
                    broj = broj % 999;
                if (broj < 10)
                    brPutnogNaloga = godina + "-00" + broj;
                else if (broj < 100)
                    brPutnogNaloga = godina + "-0" + broj;
                else
                    brPutnogNaloga = godina + "-" + broj;
            }
        }
        return brPutnogNaloga;
    }

    @Override
    public Zahtjev addZahtjev(Zahtjev zahtjev) {
        zahtjev.setStatus(StatusZahtjev.PODNESEN);
        zahtjevRepo.saveAndFlush(zahtjev);
        return zahtjev;
    }

    @Override
    public Zahtjev saveZahtjev(Zahtjev zahtjev) {
        zahtjevRepo.saveAndFlush(zahtjev);
        return zahtjev;
    }

    @Override
    @Transactional
    public void deleteByBrPutnogNaloga(String brPutnogNaloga) {
        zahtjevRepo.deleteByBrPutnogNaloga(brPutnogNaloga);
    }
}
