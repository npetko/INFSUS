package com.progi.AlfaBeta.putninalozi.service;

import com.progi.AlfaBeta.putninalozi.domain.Zaposlenik;

import java.util.List;

public interface ZaposlenikService {
    List<Zaposlenik> listAll();

    Zaposlenik findByOib(String oib);

    List<Zaposlenik> findByTimId(int timId);

    void deleteByOib(String oib);
    //Zaposlenik findByOib(String oib);

}
