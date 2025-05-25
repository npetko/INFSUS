package com.progi.AlfaBeta.putninalozi.service;

import com.progi.AlfaBeta.putninalozi.domain.Firma;

import java.util.List;

public interface FirmaService {

    Firma update(Firma firma);

    Firma findByOib(String oib);

    List<Firma> listAll();

}
