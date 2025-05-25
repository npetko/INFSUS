package com.progi.AlfaBeta.putninalozi.service;

import com.progi.AlfaBeta.putninalozi.domain.Zahtjev;
import com.progi.AlfaBeta.putninalozi.domain.Zaposlenik;
import com.progi.AlfaBeta.putninalozi.dto.ZahtjevDto;

import java.util.List;

public interface ZahtjevService {

    List<Zahtjev> listAllZahtjev(String korisnickoIme);

    Zahtjev findByBrPutnogNaloga(String brPutnogNaloga);

    String generateBrPutnogNaloga(int godina);

    Zahtjev addZahtjev(Zahtjev zahtjev);

    Zahtjev saveZahtjev(Zahtjev zahtjev);
    public void deleteByBrPutnogNaloga(String brPutnogNaloga);

}
