package com.progi.AlfaBeta.putninalozi.service;

import com.progi.AlfaBeta.putninalozi.domain.Drzava;

import java.util.List;

public interface DrzavaService {

    Drzava getDrzava(String imeDrzave);

    List<Drzava> listAll();
}
