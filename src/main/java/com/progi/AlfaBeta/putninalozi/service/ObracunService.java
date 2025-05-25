package com.progi.AlfaBeta.putninalozi.service;

import com.progi.AlfaBeta.putninalozi.domain.BoravakDrzava;
import com.progi.AlfaBeta.putninalozi.domain.Obracun;
import com.progi.AlfaBeta.putninalozi.domain.Trosak;
import com.progi.AlfaBeta.putninalozi.domain.Zahtjev;
import com.progi.AlfaBeta.putninalozi.dto.ObracunDto;

import java.util.List;
import java.util.Map;

public interface ObracunService {

    public Obracun addObracun(Obracun obracun);

    public Obracun findByBr(String brnalog);

    public Obracun saveObracun(Obracun obracun);
    List<Obracun> listAll();

    public Obracun deleteObracun(Obracun obracun);

    public ObracunDto obracunajNalog(Obracun obracun, Zahtjev zahtjev, List<Trosak> troskovi, List<BoravakDrzava> boravci, Map<String, String> mapaBoravaka);
}
