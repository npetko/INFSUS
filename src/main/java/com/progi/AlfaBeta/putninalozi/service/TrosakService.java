package com.progi.AlfaBeta.putninalozi.service;

import com.progi.AlfaBeta.putninalozi.domain.Obracun;
import com.progi.AlfaBeta.putninalozi.domain.Trosak;

import java.util.List;

public interface TrosakService {

    Trosak addTrosak(Trosak trosak);

    List<Trosak> getTroskovi(String brPutnogNaloga);

    public Trosak deleteTrosak(Trosak trosak);
}
