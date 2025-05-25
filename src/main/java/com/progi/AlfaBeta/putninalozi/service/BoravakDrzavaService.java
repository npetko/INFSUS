package com.progi.AlfaBeta.putninalozi.service;


import com.progi.AlfaBeta.putninalozi.domain.BoravakDrzava;
import com.progi.AlfaBeta.putninalozi.domain.Obracun;

import java.util.List;

public interface BoravakDrzavaService {

    BoravakDrzava addBoravak(BoravakDrzava boravak);

    List<BoravakDrzava> getBoravci(String brPutnogNaloga);

    BoravakDrzava deleteBoravak(BoravakDrzava boravakDrzava);
}
